<template>
  <div style="width:760px; height:550px;">
    <div style="position:absolute;left:0;right:0;top:0;bottom:0; z-index:0; width:100%;height:80%;" ref="map"></div>
    <div style="position:absolute;bottom:0; z-index:99;margin-left:-21px;" class="admin-dialog">
      <div style="width:100%;height:100%;background-color:#fff;">
        <el-form label-position="left" :model="formData" ref="baseForm">
          <el-row :gutter="30 ">
            <el-col :span="8">
              <el-form-item label="开始位置">
                <el-select v-model="formData.start" size="small">
                  <el-option v-for="(item,index) in location" :key="item.id" :value="item.id" :label="index+1">{{index +1}},{{item.lng}} {{item.lat}}</el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="结束位置">
                <el-select v-model="formData.end" size="small">
                  <el-option v-for="(item,index) in location" :key="item.id" :value="item.id" :label="index+1">{{index +1}},{{item.lng}} {{item.lat}}</el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="路段宽度">
                <el-input size="small" v-model="formData.road_width" style="width:60%;"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item style="margin:0" label="路段属性">
                <el-checkbox v-model="formData.travel_time">行驶时间</el-checkbox>
                <el-checkbox v-model="formData.speed_limit" style="margin-left:20px;">限速</el-checkbox>
                <el-radio v-model="formData.latitude" label="1" style="margin-left:20px;">北纬</el-radio>
                <el-radio v-model="formData.latitude" label="2">南纬</el-radio>
                <el-radio v-model="formData.longitude" label="1">东经</el-radio>
                <el-radio v-model="formData.longitude" label="2">西经</el-radio>
              </el-form-item>
            </el-col>
            <el-col v-if="formData.travel_time" :span="12">
              <el-form-item style="margin:0" label="路段行驶过长阈值">
                <el-input v-model="formData.long_threshold" style="width:60%" size="small"></el-input>
              </el-form-item>
            </el-col>
            <el-col v-if="formData.travel_time" :span="12">
              <el-form-item style="margin:0" label="路段行驶不足阈值">
                <el-input v-model="formData.lack_threshold" style="width:60%" size="small"></el-input>
              </el-form-item>
            </el-col>
            <el-col v-if="formData.speed_limit" :span="12">
              <el-form-item style="margin:0" label-width="124px" label="路段最高速度">
                <el-input v-model="formData.MaxSpeed" style="width:81.3%" size="small"></el-input>
              </el-form-item>
            </el-col>
            <el-col v-if="formData.speed_limit" :span="12">
              <el-form-item style="margin:0;margin-bottom:10px;" label="路段超速持续时间">
                <el-input v-model="formData.OverMaxSpeedLastTime" style="width:60%" size="small"></el-input>
              </el-form-item>
            </el-col>
            <div style="width:123px;margin:0 auto;">
              <el-button type="primary" @click="setItem" size="small">设置</el-button>
              <el-button type="primary" @click="down" size="small">关闭</el-button>
            </div>
          </el-row>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
/*eslint-disable*/
import moment from "moment";
import { initMap } from "@/utils/map.js";
import chooseVehicle from "@/components/choose-vehicle.vue";
export default {
  created() {
    // this.getTable();
  },
  components: { chooseVehicle },
  data() {
    return {
      copy_road: [],
      machine_type: true,
      route_type: false,
      label: "",
      addKey: 0,
      addDialog: false,
      vehicleData: {},
      roadData: [],
      location: [],
      arrData: [],
      mapData: {
        map: {},
        mouseTool: {},
        path: []
      },
      formData: {
        travel_time: false,
        speed_limit: false,
        latitude: "1",
        longitude: "1",
        start: "",
        end: "",
        start_location: "",
        end_location: "",
        road_width: "",
        road: "",
        long_threshold: "", //路段行驶过长阈值
        lack_threshold: "", //路段行驶不足阈值
        MaxSpeed: "", //最高速度
        OverMaxSpeedLastTime: "" //超速持续时间
      }
    };
  },
  watch: {},
  props: ["road"],
  mounted() {
    var that = this;
    initMap(() => {
      var map = new AMap.Map(this.$refs.map, {
        zoom: 14
      });
      that.$set(that.mapData, "map", map);
    });
    this.getTable();
  },
  methods: {
    down() {
      this.$emit("down", 1);
    },
    getTable() {
      this.$set(this.$data, "roadData", this.$props.road);
      var path = [];
      this.location = [];
      var lat = "";
      var lng = "";
      this.roadData[0].TurnPoints.map((item, index) => {
        lng = parseFloat(item.TurnPointLongitude);
        lat = parseFloat(item.TurnPointLatitude);
        path.push([lng, lat]);
        this.location.push({ id: index, lng: lng, lat: lat });
      });
      this.location.map(icar => {
        icar.id = JSON.stringify(icar.id);
      });
      var polyline = new AMap.Polyline({
        path: path,
        isOutline: true,
        outlineColor: "#ffeeff",
        borderWeight: 3,
        strokeColor: "#3366FF",
        strokeOpacity: 1,
        strokeWeight: 6,
        // 折线样式还支持 'dashed'
        strokeStyle: "solid",
        // strokeStyle是dashed时有效
        strokeDasharray: [10, 5],
        lineJoin: "round",
        lineCap: "round",
        zIndex: 50
      });
      polyline.setMap(this.mapData.map);
      this.mapData.map.setFitView([polyline]);
    },
    setItem() {
      if (this.formData.start == "") {
        return this.$notify({
          message: "请选择开始位置!",
          title: "提示",
          type: "error"
        });
      } else if (this.formData.end == "") {
        return this.$notify({
          message: "请选择结束位置!",
          title: "提示",
          type: "error"
        });
      } else if (this.formData.end <= this.formData.start) {
        return this.$notify({
          message: "结束位置必须大于开始位置!",
          title: "提示",
          type: "error"
        });
      } else if (this.formData.road_width == "") {
        return this.$notify({
          message: "请输入路段宽度!",
          title: "提示",
          type: "error"
        });
      } else if (this.formData.travel_time) {
        if (this.formData.long_threshold == "") {
          return this.$notify({
            message: "请输入路段行驶过长阈值!",
            title: "提示",
            error: "error"
          });
        } else if (this.formData.lack_threshold == "") {
          return this.$notify({
            message: "请输入路段行驶不足阈值!",
            title: "提示",
            error: "error"
          });
        }
      } else if (this.formData.speed_limit) {
        if (this.formData.MaxSpeed == "") {
          return this.$notify({
            message: "请输入路段最高速度!",
            title: "提示",
            error: "error"
          });
        } else if (this.formData.OverMaxSpeedLastTime == "") {
          return this.$notify({
            message: "请输入路段超速持续时间!",
            title: "提示",
            error: "error"
          });
        }
      }
      if (this.roadData[0].copy.includes(this.formData.start)) {
        return this.$notify({
          message: "请检查您当前设置路段是否存在被其他路段占用的情况",
          title: "提示",
          type: "error"
        });
      }
      var num = [0, 0, 0, 0, 0, 0, 0, 0];
      if (this.formData.travel_time) {
        num[7] = 1;
      }
      if (this.formData.speed_limit) {
        num[6] = 1;
      }
      if (this.formData.latitude == "1") {
        num[5] = 0;
      } else {
        num[5] = 1;
      }
      if (this.formData.longitude == "1") {
        num[4] = 0;
      } else {
        num[4] = 1;
      }
      var point = [];
      var data = [];
      var arr = [];
      var reg = new RegExp(",", "g");
      num = parseInt(num.toString().replace(reg, ""), 2);
      this.formData.road = num;
      var start = parseInt(this.formData.start);
      var end = parseInt(this.formData.end);
      this.formData.start_location = this.location[start];
      this.formData.end_location = this.location[end];
      this.location.map(item => {
        if (item.id >= start && item.id <= end) {
          this.copy_road.push(item.id);
        }
        arr.push(item.id);
        if (item.id >= start) {
          if (item.id <= end) {
            point.push(item);
          }
        }
      });
      this.copy_road.map(icc => {
        this.roadData[0].copy.push(icc);
      });
      data = [
        {
          copy: this.roadData.copy,
          start: start,
          end: end,
          point: point,
          RouteSegmentWidth: this.formData.road_width,
          RouteSegmentProperty: this.formData.road,
          MaxDriveTimeLimited: this.formData.long_threshold,
          MinDriveTimeLimited: this.formData.lack_threshold,
          MaxSpeedLimited: this.formData.MaxSpeed,
          OverMaxSpeedLastTime: this.formData.OverMaxSpeedLastTime
        }
      ];
      this.$emit("reply", data);
    }
  }
};
</script>