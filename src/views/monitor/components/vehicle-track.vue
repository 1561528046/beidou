<template>
  <!-- 地图 -->
  <div>
    <div style="position:absolute;left:0;right:0;top:0;bottom:0; z-index:1;" ref="map"></div>
    <div class="vehicle_select">
      <el-input size="small" v-model="formData.license" placeholder="请输入车牌号/终端ID">
        <el-button @click="selectVehicle" slot="append" icon="el-icon-search"></el-button>
      </el-input>
    </div>
    <div v-if="vtype" class="vehicle_data">
      <div style="margin-top:45px;">
        <el-date-picker size="small" value-format="yyyyMMdd" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker>
        <el-button type="primary" @click="selectForm" style="margin-left:68px;" size="small">查询</el-button>
        <label style="position:absolute;left:230px;top:15px">车牌号</label>
        <i @click="down()" class="el-icon-circle-close-outline" style="font-size:20px;position:absolute;right:15px;top:10px;margin-top:5px;"></i>
        <div style="margin-top:10px;">
          <el-checkbox>过滤无效数据</el-checkbox>
          <el-checkbox>过滤无效定位</el-checkbox>
        </div>
        <div style="position: relative;padding-top:26px;">
          <el-button size="small" @click="speed_up" style="position:absolute;top:30px;">加速</el-button>
          <el-button size="small" @click="speed_down" style="position:absolute;top:30px;left:58px;">减速</el-button>
          <!-- <el-button size="small" @click="stop_action" style="position:absolute;right:20px;">停止</el-button> -->
          <div style="width:36px;margin:0 auto;">
            <i v-if="!playType" @click="play" style="display: block;width: 36px;height: 36px;border-radius: 50%;border: solid 1px;line-height: 36px;text-align: center;" class="iconfont icon-bofangqibofang"></i>
            <i v-if="playType" @click="suspended" style="display: block; width: 36px;height: 36px;border-radius: 50%;border: solid 1px;line-height: 36px;text-align: center;" class="iconfont icon-bofangqi-zanting"></i>
          </div>
        </div>
        <el-slider :min="addkey" :max="tableData.total" v-model="currentIndex"></el-slider>
      </div>
    </div>
    <el-button v-if="tableType" @click="tableType=false" style="position:absolute;left:520px;top:20px;z-index:99;" size="small" icon="el-icon-arrow-right"></el-button>
    <el-button v-if="!tableType" @click="tableType=true" style="position:absolute;left:520px;top:20px;z-index:99;" size="small" icon="el-icon-arrow-down"></el-button>
    <div v-if="!tableType" style=" width:1000px; height:195px;background-color:#fff;position:absolute;left:520px;top:64px;z-index:99;">
      <el-table height="222" border style="width: 100%">
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
    <!-- <el-menu default-active="2" class=" track_menu" @open="handleOpen" @close="handleClose">
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>导航一</span>
        </template>
        <el-menu-item-group>
   
        </el-menu-item-group>
      </el-submenu>
    </el-menu> -->
  </div>

</template>
<script>
/*eslint-disable*/
import { initMap } from "@/utils/map.js";
import { GetVehicleByLicense } from "@/api/index.js";
export default {
  data() {
    return {
      formData: {
        license: "",
        device_no: ""
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
        total: 11,
        data: [
          { lng: 116.405289, lat: 39.904987 },
          { lng: 113.964458, lat: 40.54664 },
          { lng: 111.47836, lat: 41.135964 },
          { lng: 108.949297, lat: 41.670904 },
          { lng: 106.380111, lat: 42.149509 },
          { lng: 103.774185, lat: 42.56996 },
          { lng: 101.135432, lat: 38.930601 },
          { lng: 98.46826, lat: 43.229964 },
          { lng: 95.777529, lat: 43.466798 },
          { lng: 93.068486, lat: 43.64009 },
          { lng: 90.34669, lat: 43.749086 },
          { lng: 87.61792, lat: 43.793308 }
        ]
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
  mounted() {
    var vm = this;
    initMap(() => {
      var map = new AMap.Map(this.$refs.map, {
        zoom: 14
      }); //实例化地图
      var lineArr = [vm.tableData.data[0].lng, vm.tableData.data[0].lat];
      var marker = new AMap.Marker({
        map: map,
        position: lineArr, //小车起始位置
        icon: "https://webapi.amap.com/images/car.png",
        offset: new AMap.Pixel(-26, -13),
        autoRotation: true
      }); //实例化Marker

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
      // vm.$set(vm.$data, "nexData", nextData);
    });
  },
  methods: {
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
          console.log(res.data.data);
        }
      });
      this.vtype = true;
    },
    // 查询轨迹信息
    selectForm() {
      this.mapData.marker.setMap(this.mapData.map);
      this.mapData.polyline.setMap(this.mapData.map);
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