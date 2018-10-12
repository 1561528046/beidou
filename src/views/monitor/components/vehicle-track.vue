<template>
  <!-- 地图 -->
  <div>
    <div style="position:absolute;left:0;right:0;top:0;bottom:0; z-index:1;" ref="map"></div>
    <div class="vehicle_select">
      <el-input size="small" placeholder="请输入车牌号/终端ID">
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
          <div style="width:36px;margin:0 auto;">
            <i v-if="!playType" @click="play" style="display: block;width: 36px;height: 36px;border-radius: 50%;border: solid 1px;line-height: 36px;text-align: center;" class="iconfont icon-bofangqibofang"></i>
            <i v-if="playType" @click="suspended" style="display: block; width: 36px;height: 36px;border-radius: 50%;border: solid 1px;line-height: 36px;text-align: center;" class="iconfont icon-bofangqi-zanting"></i>
          </div>
        </div>
        <el-slider v-model="progress_bar"></el-slider>
      </div>
    </div>
    <el-collapse class="track_menu">
      <el-collapse-item name="1">
        <div style=" width:1000px; height:200px;background-color:#fff;">
          <el-table height="228" border style="width: 100%">
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
      </el-collapse-item>
    </el-collapse>
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
export default {
  data() {
    return {
      speed: 1000,
      mapData: {
        map: {},
        lineArr: [],
        marker: {}
      },
      addkey: 0,
      timer: {},
      progress_bar: 0,
      isCollapse: true,
      dialogVisible: false,
      playType: false,
      vtype: false
    };
  },
  mounted() {
    var vm = this;
    initMap(() => {
      var map = new AMap.Map(this.$refs.map, {
        zoom: 14
      });
      var path = [
        { lng: 117.405289, lat: 32.904987 },
        { lng: 113.964458, lat: 40.54664 },
        { lng: 111.47836, lat: 41.135964 },
        { lng: 108.949297, lat: 41.670904 },
        { lng: 106.380111, lat: 42.149509 },
        { lng: 103.774185, lat: 41.56996 },
        { lng: 101.135432, lat: 42.930601 },
        { lng: 98.46826, lat: 43.229964 },
        { lng: 95.777529, lat: 43.466798 },
        { lng: 93.068486, lat: 43.64009 },
        { lng: 90.34669, lat: 43.749086 },
        { lng: 87.61792, lat: 43.793308 }
      ];

      var marker = new AMap.Marker({
        map: map,
        position: [117.405289, 32.90923], //小车起始位置
        icon: "https://webapi.amap.com/images/car.png",
        offset: new AMap.Pixel(-26, -13),
        autoRotation: true
      });
      var lngX = 117.405289,
        latY = 32.90923; //小车起始位置
      var lineArr = [];
      lineArr.push(new AMap.LngLat(lngX, latY));
      path.map(item => {
        lineArr.push(new AMap.LngLat(item.lng, item.lat));
      });

      // 绘制轨迹
      var polyline = new AMap.Polyline({
        map: map,
        path: lineArr,
        strokeColor: "#00A", //线颜色
        // strokeOpacity: 1,     //线透明度
        strokeWeight: 3 //线宽
        // strokeStyle: "solid"  //线样式
      });

      var passedPolyline = new AMap.Polyline({
        map: map,
        // path: lineArr,
        strokeColor: "#F00", //线颜色
        // strokeOpacity: 1,     //线透明度
        strokeWeight: 3 //线宽
        // strokeStyle: "solid"  //线样式
      });

      marker.on("moving", function(e) {
        passedPolyline.setPath(e.passedPath);
      });

      map.setFitView();
      vm.$set(vm.mapData, "lineArr", lineArr);
      vm.$set(vm.mapData, "marker", marker);
    });
  },
  methods: {
    // 查询轨迹信息
    selectForm() {
      this.dialogVisible = true;
    },
    // 关闭弹出框
    down() {
      this.vtype = false;
    },
    // 查询车辆
    selectVehicle() {
      this.vtype = true;
    },
    // 播放
    play() {
      this.mapData.marker.moveAlong(this.mapData.lineArr, 100000);
      // this.mapData.marker.resumeAnimation();
      this.playType = true;
      // var vs = this;
      // this.timer = setInterval(function() {
      //   vs.addkey++;
      //   vs.$set(vs.$data, "progress_bar", vs.addkey);
      // }, this.speed);
    },
    // 暂停
    suspended() {
      this.mapData.marker.pauseMove();
      this.playType = false;
      // clearInterval(this.timer);
    },
    // 加速
    speed_up() {},
    // 减速
    speed_down() {},
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