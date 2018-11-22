<template>
  <!-- 地图 -->
  <div>
    <div style=" width:55%; position:absolute;right:0;top:0;bottom:0; z-index:1;" ref="map"></div>
    <!-- 搜索框 -->
    <div class="vehicle_select">
      <el-autocomplete class="inline-input" size="small" style="width:90%" :popper-class="autoplate" v-model="formData.license" :fetch-suggestions="querySearch" placeholder="请输入车牌号/终端ID" :trigger-on-focus="false" @select="selectVehicle">
        <el-button @click="selectVehicle" slot="append" icon="el-icon-search"></el-button>
      </el-autocomplete>
      <el-button v-if="selectType" @click="selectType=false" style="position:absolute;left:451px;top:9px;z-index:99;" size="small" icon="el-icon-arrow-right"></el-button>
      <el-button v-if="!selectType" @click="selectType=true" style="position:absolute;left:451px;top:9px;z-index:99;" size="small" icon="el-icon-arrow-down"></el-button>
    </div>
    <!-- 查询栏 -->
    <div v-if="selectType" class="vehicle_data">
      <div style="margin-top:45px;">
        <el-form :model="trackForm" ref="baseForm" :rules="rules" size="small">
          <el-form-item prop="time">
            <el-date-picker size="small" v-model="trackForm.time" value-format="yyyy-MM-dd HH:mm:ss" type="datetimerange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']">
            </el-date-picker>
          </el-form-item>
          <el-form-item style="margin-bottom:18px;">
            <el-checkbox v-model="trackForm.invalid_type">过滤无效数据</el-checkbox>
            <el-checkbox v-model="trackForm.position_type">过滤无效定位</el-checkbox>
          </el-form-item>
          <el-button :disabled="disabled" type="primary" @click="selectForm" style="position:absolute;right:17px;top:55px;" size="small">查询</el-button>
          <label style="position:absolute;left:230px;top:15px">{{vehicle_license}}</label>
          <i @click="down()" class="el-icon-circle-close-outline" style="font-size:20px;position:absolute;right:15px;top:10px;margin-top:5px;"></i>
        </el-form>
        <!-- 播放器 -->
        <div v-if="player" style="position: relative;">
          <el-button size="small" @click="speed_up" style="position:absolute;top:0;">加速</el-button>
          <el-button size="small" @click="speed_down" style="position:absolute;top:0;left:58px;">减速</el-button>
          <div style="width:36px;margin:0 auto;">
            <el-button size="small" v-if="!playType" @click="play" style="width:36px;height:36px; border-radius: 100%;border: solid 1px; padding:9px 12px;" icon="iconfont icon-bofangqibofang"></el-button>
            <el-button size="small" v-if="playType" @click="suspended" style="width:36px;height:36px;border-radius: 100%;border: solid 1px;padding:9px 12px;" icon="iconfont icon-bofangqi-zanting"></el-button>
          </div>
          <div style="padding:0 5px;">
            <el-slider v-model="currentIndex" :min="0" :max="tableData.total-1"></el-slider>
          </div>
        </div>
      </div>
    </div>
    <!-- 左侧数据展示栏 -->
    <div style=" width:45%; height:90%;background-color:#fff;position:absolute;left:0;top:0;bottom:0;z-index:99;">
      <el-table element-loading-text="拼命加载中" v-loading="tableLoading" @row-click="tableCurrentChange" :row-style="{height:'71px'}" highlight-current-row ref="baseTable" :header-cell-style="{background:'#fafafa'}" :data="list" height="100%" border style="width: 100%">
        <el-table-column width="80px" prop="index" label="序号"></el-table-column>
        <el-table-column width="150px" label="时间" prop="time" :formatter="(row)=>{return this.$utils.formatDate14(JSON.stringify(row.time))}"></el-table-column>
        <el-table-column label="速度" prop="speed"></el-table-column>
        <el-table-column label="当日里程" prop="em_0x01" :formatter="$utils.baseFormatter"></el-table-column>
        <el-table-column label="位置" prop="address" :formatter="$utils.baseFormatter" width="400px"></el-table-column>
      </el-table>
      <div class="admin-table-pager">
        <el-pagination :disabled="paging" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[10, 20, 50, 100]" :page-size="tableQuery.size" :total="tableQuery.total" layout="total, sizes, prev, pager, next, jumper" background>
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
/*eslint-disable*/
import { rules } from "@/utils/rules.js";
import moment from "moment";
import { initMap } from "@/utils/map.js";
import { GetVehicleByLicense, GetVehicleLocation } from "@/api/index.js";
import { location2address, gps2amap } from "@/utils/map-tools.js";
import { GPS } from "@/utils/map-tools.js";
export default {
  created() {},
  computed: {
    list: function() {
      return this.tableQuery.data.slice(
        (this.tableQuery.page - 1) * this.tableQuery.size,
        this.tableQuery.page * this.tableQuery.size
      );
    }
  },
  data() {
    return {
      tableLoading: false,
      disabled: false,
      paging: true,
      scroll_bar: "",
      player: false,
      vehicle_license: "",
      autoplate: "",
      currentIndex: 1, //当前播放的第几条数据
      speed: 1000, //速度(定时器时间)
      timer: null, //定时器
      addkey: 0,
      timer: {},
      playType: false,
      selectType: false,
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
      formData: {
        license: ""
      },
      rules: {
        ...rules,
        time: [
          {
            required: true,
            trigger: "change",
            validator: this.validateTime
          }
        ]
      },
      tableQuery: {
        page: 1,
        size: 20,
        total: 0,
        data: []
      },
      mapData: {
        map: {},
        polyline: {},
        marker: {}
      },
      tableData: {
        total: 0,
        data: []
      },
      addressList: new Map()
    };
  },
  watch: {
    currentIndex: function(newVal) {
      this.currentIndexChange(newVal);
    }
  },
  mounted() {
    var vm = this;
    initMap(() => {
      var map = new AMap.Map(this.$refs.map, {
        zoom: 14
      }); //实例化地图
      vm.$set(vm.mapData, "map", map);
    });
  },
  methods: {
    validateTime(rule, value, callback) {
      var date = moment(value[0]).add(3, "days");
      date = moment(date).format("YYYY-MM-DD HH:mm:ss");
      if (value == "") {
        callback(new Error("请选择时间!"));
        return false;
      } else if (!moment(value[1]).isBefore(date)) {
        callback(new Error("选择时间不能大于3天!"));
        return false;
      } else {
        this.trackForm.start_time = moment(value[0]).format("YYYYMMDDHHmmss");
        this.trackForm.stop_time = moment(value[1]).format("YYYYMMDDHHmmss");
        callback();
      }
    },
    querySearch(queryString, cb) {
      var vehicleList = Array.from(monitor.data.values());
      var arr = [];
      if (queryString.length < 7 && queryString.length > 3) {
        this.autoplate = "";
        arr = this.fuzzyQuery(vehicleList, queryString);
        cb(arr);
      } else {
        this.autoplate = "autoplate";
      }
    },
    fuzzyQuery(list, keyWord) {
      var arr = [];
      list.map(item => {
        if (item.license.split(keyWord).length > 1) {
          item.value = item.license;
          arr.push(item);
        }
      });
      return arr;
    },
    //移动位置(初始化位置)
    nextData() {
      this.tableQuery.page =
        Math.ceil((this.currentIndex + 1) / this.tableQuery.size) || 1;
      var current = this.currentIndex % this.tableQuery.size;
      this.scroll_bar.scrollTop = (current - 5) * 71;
      var currentData = this.tableData.data[this.currentIndex];
      var currentRow = this.list[current];
      this.$refs.baseTable.setCurrentRow(currentRow);
      this.mapData.marker.setPosition(
        new AMap.LngLat(currentData.lng, currentData.lat)
      );
    },
    currentIndexChange(newCurrent) {
      if (this.playType) {
        this.suspended();
        this.tableQuery.currentIndex = newCurrent;
        this.play();
      } else {
        this.tableQuery.currentIndex = newCurrent;
      }
      this.nextData();
    },
    // 查询车辆
    selectVehicle() {
      GetVehicleByLicense(this.formData).then(res => {
        if (res.data.code == 0) {
          this.$set(this.$data, "vehicle_license", res.data.data[0].license);
          this.trackForm.sim_id = res.data.data[0].sim_id;
          this.selectType = true;
        } else {
          return this.$notify({
            message: res.data.msg,
            title: "提示",
            type: "error"
          });
        }
      });
    },
    // 绘制点到地图上
    setMarker() {
      var lineArr = [];
      var hs = this;
      if (this.tableData.data.length > 0) {
        lineArr = [hs.tableData.data[0].lng, hs.tableData.data[0].lat];
        var marker = new AMap.Marker({
          map: hs.mapData.map,
          position: lineArr, //小车起始位置
          icon: "/static/online-small.png",
          offset: new AMap.Pixel(-26, -13),
          autoRotation: true
          // angle: 0
        }); //实例化Marker
        this.$set(this.mapData, "marker", marker);
        marker.setMap(this.mapData.map); //将点标注在地图上
        this.mapData.map.setFitView([marker]);
      }
    },
    // 绘制轨迹到地图上
    setPolyline() {
      var path = [];
      var hm = this;
      this.tableData.data.map(item => {
        var position = GPS.gcj_encrypt(item.lat || 0, item.lng || 0); //GPS转高德
        item.lng = position.lon;
        item.lat = position.lat;
        path.push(new AMap.LngLat(item.lng, item.lat));
      });
      var polyline = new AMap.Polyline({
        map: hm.mapData.map,
        path: path,
        strokeColor: "#00A", //线颜色
        strokeWeight: 3 //线宽
      });
      this.$set(this.mapData, "polyline", polyline);
      polyline.setMap(this.mapData.map); //将轨迹显示在地图上
      this.mapData.map.setFitView([polyline]);
    },
    // 查询轨迹信息
    selectForm() {
      this.tableLoading = true;
      this.disabled = true;
      this.$refs.baseTable.$el.childNodes.forEach(item => {
        if (
          item.className &&
          item.className.indexOf("el-table__body-wrapper") != -1
        ) {
          this.scroll_bar = item;
        }
      });
      this.trackForm.filter_position = this.trackForm.position_type ? 1 : 0;
      this.trackForm.filter_invalid = this.trackForm.invalid_type ? 1 : 0;
      if (this.trackForm.time.length > 0) {
        GetVehicleLocation(this.trackForm).then(res => {
          if (res.data.code == 0) {
            var arr = [];
            res.data.data.map((item, index) => {
              item.index = index;
              arr.push({ lng: item.longitude, lat: item.latitude });
            });
            this.$set(this.tableQuery, "data", res.data.data);
            this.$set(this.tableQuery, "total", res.data.count);
            this.$set(this.tableData, "data", arr);
            this.$set(this.tableData, "total", res.data.count);
            this.mapData.map.clearMap();
            this.setMarker();
            this.setPolyline();
            this.tableLoading = false;
            this.disabled = false;
            if (this.tableQuery.data.length > 0) {
              this.player = true;
              this.paging = false;
            } else {
              this.player = false;
              this.paging = true;
            }
            gps2amap({
              data: this.tableQuery.data,
              longKey: "longitude",
              latKey: "latitude"
            }).then(res => {
              this.tableQuery.data.map((item, index) => {
                item.amap_longitude = res[index].split(",")[0];
                item.amap_latitude = res[index].split(",")[1];
              });

              this.list.map((item, index) => {
                location2address({
                  data: [item],
                  longKey: "amap_longitude",
                  latKey: "amap_latitude"
                }).then(addressArr => {
                  this.$set(item, "address", addressArr[0]);
                });
              });
            });
          }
        });
      } else {
        return this.$notify({
          message: "请选择时间!",
          title: "提示",
          type: "error"
        });
      }
    },
    // 关闭弹出框
    down() {
      this.mapData.map.clearMap();
      this.player = false;
      this.selectType = false;
      this.vehicle_license = "";
      this.tableData.data = [];
      this.tableQuery.data = [];
      this.tableData.total = 0;
      this.tableQuery.total = 0;
      this.currentIndex = 1;
      this.trackForm.sim_id = "";
      this.trackForm.time = [];
      this.trackForm.start_time = "";
      this.trackForm.stop_time = "";
      this.trackForm.invalid_type = false;
      this.trackForm.position_type = false;
      this.trackForm.filter_invalid = ""; //无效数据
      this.trackForm.filter_position = ""; //无效定位
    },
    // 播放
    play() {
      var that = this;
      this.playType = true;
      this.timer = setInterval(function() {
        if (that.currentIndex < that.tableData.total - 1) {
          that.currentIndex++;
        } else {
          that.currentIndex = 0;
          that.playType = false;
          clearInterval(that.timer);
        }
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
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    // 分页
    handleSizeChange(val) {
      this.tableQuery.page = 1;
      this.tableQuery.size = val;
      this.selectForm();
    },
    handleCurrentChange(val) {
      this.tableQuery.page = val;
      this.$nextTick(() => {
        this.list.map(item => {
          if (item.address) {
            return false;
          }
          this.getAddress(item);
        });
      });
      // this.selectForm();
    },
    tableCurrentChange(currentRow) {
      this.currentIndex = currentRow.index;
    },
    getAddress(data) {
      var key = data.Longitude + "," + data.Latitude;
      if (this.addressList.has(key)) {
        this.$set(data, "address", this.addressList.get(key));
      } else {
        location2address({
          data: [data],
          longKey: "amap_longitude",
          latKey: "amap_latitude"
        }).then(res => {
          this.addressList.set(key, res[0]);
          this.$set(data, "address", res[0]);
        });
      }
    }
  }
};
</script>
<style>
.btn-loading {
  top: 90%;
}
.el-table .success-row {
  background: #cbf1b7;
}
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
  left: 45%;
  right: 0;
  top: 5px;
  bottom: 0;
  box-shadow: 2px 2px 5px #ddd;
  border-radius: 5px;
  padding: 10px;
  z-index: 99;
  background-color: #fff;
  margin-left: 10px;
}
.vehicle_data {
  padding: 10px;
  width: 480px;
  height: 211px;
  position: absolute;
  left: 45%;
  right: 0;
  top: 60px;
  margin-left: 10px;
  bottom: 0;
  z-index: 99;
  background-color: #fff;
  box-shadow: 2px 2px 5px #ddd;
  border-radius: 5px;
}
</style>