<template>
  <!-- 地图 -->
  <div>
    <div style="position:absolute;left:0;right:0;top:0;bottom:0; z-index:1;" ref="map"></div>
    <div class="vehicle_select">
      <el-autocomplete class="inline-input" size="small" style="width:90%" :popper-class="autoplate" v-model="formData.license" :fetch-suggestions="querySearch" placeholder="请输入车牌号/终端ID" :trigger-on-focus="false" @select="handleSelect">
        <el-button @click="selectVehicle" slot="append" icon="el-icon-search"></el-button>
      </el-autocomplete>
      <el-button v-if="tableType" @click="tableType=false" style="position:absolute;left:451px;top:9px;z-index:99;" size="small" icon="el-icon-arrow-right"></el-button>
      <el-button v-if="!tableType" @click="tableType=true" style="position:absolute;left:451px;top:9px;z-index:99;" size="small" icon="el-icon-arrow-down"></el-button>
    </div>
    <!-- 查询栏 -->
    <div v-if="vtype" class="vehicle_data">
      <div style="margin-top:45px;">
        <el-form :model="trackForm" ref="baseForm" :rules="rules" size="small">
          <el-form-item prop="time">
            <el-date-picker size="small" v-model="trackForm.time" value-format="yyyyMMdd" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="trackForm.invalid_type">过滤无效数据</el-checkbox>
            <el-checkbox v-model="trackForm.position_type">过滤无效定位</el-checkbox>
          </el-form-item>
          <el-button type="primary" @click="selectForm" style="position:absolute;right:17px;top:55px;" size="small">查询</el-button>
          <label style="position:absolute;left:230px;top:15px">{{vehicle_license}}</label>
          <i @click="down()" class="el-icon-circle-close-outline" style="font-size:20px;position:absolute;right:15px;top:10px;margin-top:5px;"></i>
        </el-form>
        <div style="position: relative;">
          <el-button size="small" @click="speed_up" style="position:absolute;top:0;">加速</el-button>
          <el-button size="small" @click="speed_down" style="position:absolute;top:0;left:58px;">减速</el-button>
          <div style="width:36px;margin:0 auto;">
            <el-button size="small" v-if="!playType" @click="play" style="border-radius: 50%;border: solid 1px;" icon="iconfont icon-bofangqibofang"></el-button>
            <el-button size="small" v-if="playType" @click="suspended" style="border-radius: 50%;border: solid 1px;" icon="iconfont icon-bofangqi-zanting"></el-button>
          </div>
        </div>
        <el-slider :min="addkey" :max="tableData.total" v-model="currentIndex"></el-slider>
      </div>
    </div>
    <div v-if="!tableType" style=" width:1000px; height:276px;background-color:#fff;position:absolute;left:520px;top:10px;z-index:99;">
      <el-table height="276" border style="width: 100%">
        <el-table-column label="序号">
        </el-table-column>
        <el-table-column label="时间">
        </el-table-column>
        <el-table-column label="速度">
        </el-table-column>
        <el-table-column label="当日里程">
        </el-table-column>
        <el-table-column label="位置" width="300px">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
/*eslint-disable*/
import { rules } from "@/utils/rules.js";
import { initMap } from "@/utils/map.js";
import { GetVehicleByLicense, GetVehicleLocation } from "@/api/index.js";
export default {
  data() {
    return {
      trackForm: {
        sim_id: "",
        time: [],
        start_time: "",
        stop_time: "",
        invalid_type: false,
        position_type: false,
        filter_invalid: "", //无效数据
        filter_position: "" //无效定位
      },
      rules: {
        time: [
          {
            required: true,
            trigger: "change",
            validator: this.validateTime
          }
        ]
      },
      vehicle_license: "",
      autoplate: "",
      formData: {
        license: ""
      },
      tableType: true,
      currentIndex: 0, //当前播放的第几条数据
      speed: 1000, //速度(定时器时间)
      timer: null, //定时器
      mapData: {
        map: {},
        polyline: {},
        marker: {}
      },
      tableData: {
        total: 0,
        data: []
      },
      addkey: 0,
      timer: {},
      progress_bar: 0,
      isCollapse: true,
      dialogVisible: false,
      playType: false,
      playState: true,
      vtype: false
    };
  },
  watch: {},
  mounted() {
    var vm = this;
    initMap(() => {
      var map = new AMap.Map(this.$refs.map, {
        zoom: 14
      }); //实例化地图
      var lineArr = [];
      if (vm.tableData.data.length > 0) {
        lineArr = [vm.tableData.data[0].lng, vm.tableData.data[0].lat];
        var marker = new AMap.Marker({
          map: map,
          position: lineArr, //小车起始位置
          icon: "https://webapi.amap.com/images/car.png",
          offset: new AMap.Pixel(-26, -13),
          autoRotation: true
        }); //实例化Marker
      }
      var path = [];
      vm.tableData.data.map(item => {
        path.push(new AMap.LngLat(item.lng, item.lat));
      });
      var polyline = new AMap.Polyline({
        map: map,
        path: path,
        strokeColor: "#00A", //线颜色
        // strokeOpacity: 1,     //线透明度
        strokeWeight: 3 //线宽
        // strokeStyle: "solid"  //线样式
      });
      vm.$set(vm.mapData, "map", map);
      vm.$set(vm.mapData, "marker", marker);
      vm.$set(vm.mapData, "polyline", polyline);
    });
  },
  methods: {
    validateTime(rule, value) {
      console.log(rule);
      console.log(value);
    },
    querySearch(queryString, cb) {
      if (queryString.length < 7) {
        this.autoplate = "";
        GetVehicleByLicense({ license: queryString }).then(res => {
          if (res.data.code == 0) {
            res.data.data.map(item => {
              item.value = item.license;
            });
            cb(res.data.data);
          }
        });
      } else {
        this.autoplate = "autoplate";
      }
    },
    handleSelect() {},
    //移动位置(初始化位置)
    nextData() {
      var currentData = this.tableData.data[this.currentIndex];
      this.mapData.marker.setPosition(
        new AMap.LngLat(currentData.lng, currentData.lat)
      );
    },
    // 查询车辆
    selectVehicle() {
      GetVehicleByLicense(this.formData).then(res => {
        if (res.data.code == 0) {
          this.vehicle_license = res.data.data[0].license;
          this.vtype = true;
        } else {
          return this.$notify({
            message: res.data.msg,
            title: "提示",
            type: "error"
          });
        }
      });
    },
    // 查询轨迹信息
    selectForm() {
      if (this.trackForm.position_type) {
        this.trackForm.filter_position = 1;
      } else {
        this.trackForm.filter_position = 0;
      }
      if (this.trackForm.invalid_type) {
        this.trackForm.filter_invalid = 1;
      } else {
        this.trackForm.filter_invalid = 0;
      }
      GetVehicleLocation().then(res => {
        if (res.data.code == 0) {
          console.log(res.data.data);
        }
      });
      this.mapData.marker.setMap(this.mapData.map); //将点标注在地图上
      this.mapData.polyline.setMap(this.mapData.map); //将轨迹显示在地图上
      this.mapData.map.setFitView([this.mapData.marker]);
      this.mapData.map.setFitView([this.mapData.polyline]);
      this.dialogVisible = true;
    },
    // 关闭弹出框
    down() {
      this.vtype = false;
    },
    // 播放
    play() {
      var vs = this;
      this.playType = true;
      this.timer = setInterval(function() {
        if (vs.currentIndex < vs.tableData.data.length - 1) {
          vs.currentIndex++;
        } else {
          vs.currentIndex = 0;
          vs.playType = false;
          clearInterval(vs.timer);
        }
        vs.nextData();
      }, this.speed);
    },
    // 暂停
    suspended() {
      this.playType = false;
      clearInterval(this.timer);
    },
    // 加速
    speed_up() {
      this.speed = this.speed - 100;
      clearInterval(this.timer);
      this.play();
    },
    // 减速
    speed_down() {
      this.speed = this.speed + 100;
      clearInterval(this.timer);
      this.play();
    },
    // 停止行动
    stop_action() {},
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  }
};
</script>
<style>
.autoplate {
  display: none;
}
.el-submenu__title {
  height: 55px;
}
.el-submenu__title:hover {
  opacity: 0;
  background-color: rgba(255, 255, 255, 0);
}
.el-menu-item-group__title {
  padding: 0px;
}
.track_menu {
  margin-top: 10px;
  border-radius: 5px;
  width: 1000px;
  height: 48px;
  position: absolute;
  left: 520px;
  z-index: 99;
  box-shadow: 2px 2px 5px #ddd;
}
.vehicle_select {
  width: 482px;
  height: 30px;
  position: absolute;
  left: 10px;
  right: 0;
  top: 10px;
  bottom: 0;
  box-shadow: 2px 2px 5px #ddd;
  border-radius: 5px;
  padding: 10px;
  z-index: 99;
  background-color: #fff;
}
.vehicle_data {
  padding: 10px;
  width: 480px;
  height: 201px;
  position: absolute;
  left: 10px;
  right: 0;
  top: 65px;
  bottom: 0;
  z-index: 99;
  background-color: #fff;
}
</style>