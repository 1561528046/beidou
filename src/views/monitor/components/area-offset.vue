<template>
  <!-- 线路偏移 -->
  <el-form
    style="margin-bottom:0"
    label-width="82px"
    label-position="left"
    :model="formData"
    ref="baseform"
  >
    <el-form-item label="规则名称">
      <el-input size="small" v-model="formData.RegionName" style="width:50%"></el-input>
    </el-form-item>
    <el-form-item label="最高速度">
      <el-input size="small" v-model="formData.MaxSpeedLimited" style="width:50%"></el-input>
    </el-form-item>
    <el-form-item label="偏移宽度">
      <el-input size="small" v-model="formData.RouteSegmentWidth" style="width:50%"></el-input>
    </el-form-item>
    <el-form-item label="时间范围">
      <el-time-picker
        v-model="time"
        is-range
        value-format="HHmmss"
        style="width:50%"
        size="small"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        placeholder="选择时间范围"
      ></el-time-picker>
    </el-form-item>
    <el-form-item>
      <el-button size="small" type="primary" @click="formSubmit">提交</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { AddRegion } from "@/api/index.js";
import { GPS } from "@/utils/map-tools.js";
export default {
  components: { AddRegion },
  data() {
    return {
      time: "",
      routeData: [],
      formData: {
        RegionName: "",
        MaxSpeedLimited: "",
        RouteSegmentWidth: "",
        StartTime: "",
        EndTime: "",
        TurnPoints: []
      }
    };
  },
  props: ["line"],
  watch: {},
  methods: {
    formSubmit() {
      if (this.formData.RegionName == "") {
        return this.$notify({
          message: "请输入规则名称",
          title: "提示",
          type: "error"
        });
      }
      if (this.time == "" || this.time == null) {
        return this.$notify({
          message: "请选择时间",
          title: "提示",
          type: "error"
        });
      }
      this.$set(this.$data, "routeData", this.$props.line);
      var turnPoints = [];
      this.formData.StartTime = "000000" + this.time[0];
      this.formData.EndTime = "000000" + this.time[1];
      var location = null;
      this.routeData.map((item, index) => {
        location = GPS.gcj_decrypt(item.lat, item.lng);
        turnPoints.push({
          RoutePointId: index, //拐点id
          RouteSegmentId: "0", //路段id
          TurnPointLatitude: location.lat, //拐点经度
          TurnPointLongitude: location.lon, //拐点纬度
          RouteSegmentWidth: this.formData.RouteSegmentWidth, //路段宽度或偏移宽度
          MaxSpeedLimited: this.formData.MaxSpeedLimited, //路段最高速度
          RouteSegmentProperty: "0", //路段属性
          MaxDriveTimeLimited: "", //路段行驶过长阈值
          MinDriveTimeLimited: "", //路段行驶不足阈值
          OverMaxSpeedLastTime: "" //路段超速持续时间
        });
      });
      var data = {
        RegionName: this.formData.RegionName,
        StartTime: this.formData.StartTime,
        EndTime: this.formData.EndTime,
        Type: 7,
        TurnPoints: turnPoints
      };
      if (data.TurnPoints != "") {
        AddRegion(data).then(res => {
          if (res.data.code == 0) {
            this.$emit("type", res.data.code);
          } else {
            return this.$notify({
              message: res.data.msg,
              title: "提示",
              type: "error"
            });
          }
        });
      }
    }
  }
};
</script>