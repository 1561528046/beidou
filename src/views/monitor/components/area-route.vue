<template>
  <div style="width:760px; height:520px;">
    <div style="position:absolute;left:0;right:0;top:0;bottom:0; z-index:0; width:100%;height:100%;" ref="map"></div>
    <div style="position:absolute;bottom:0; z-index:99;margin-left:-21px;" class="admin-dialog">
      <div style="width:100%;height:100%;background-color:#fff;">
        <el-form label-position="left" v-model="formData" ref="baseForm">
          <el-row :gutter="30 ">
            <el-col :span="8">
              <el-form-item label="开始位置">
                <el-select size="small">
                  <el-option></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="结束位置">
                <el-select size="small">
                  <el-option></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="路段宽度">
                <el-input size="small" style="width:60%;"></el-input>
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
            <el-button type="primary" style="display:block;margin:0 auto;" size="small">设置</el-button>
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
  components: { chooseVehicle },
  data() {
    return {
      machine_type: true,
      route_type: false,
      label: "",
      addKey: 0,
      addDialog: false,
      vehicleData: {},
      mapData: {
        map: {},
        mouseTool: {},
        path: []
      },
      formData: {
        time: "",
        start_time: "",
        end_time: "",
        type: "1",
        license: "",

        travel_time: false,
        speed_limit: false,
        latitude: "1",
        longitude: "1",
        road_width: "",
        long_threshold: "",
        lack_threshold: "",
        MaxSpeed: "", //最高速度
        OverMaxSpeedLastTime: "" //超速持续时间
      }
    };
  },
  watch: {},
  mounted() {
    var that = this;
    initMap(() => {
      var map = new AMap.Map(this.$refs.map, {
        zoom: 14
      });
      that.$set(that.mapData, "map", map);
      map.plugin(["AMap.MouseTool"], function() {
        var mouseTool = new AMap.MouseTool(map);
        that.$set(that.mapData, "mouseTool", mouseTool);
      });
    });
  },
  methods: {}
};
</script>