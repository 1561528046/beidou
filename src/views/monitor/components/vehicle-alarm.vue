<template>
  <div style="height:100%">
    <div style="width:50%;height:100%">
      <el-table style="height:100%">
        <el-table-column prop="" label="车牌号" :formatter="$utils.baseFormatter "> </el-table-column>
        <el-table-column prop="" label="报警类型" :formatter="$utils.baseFormatter "> </el-table-column>
        <el-table-column prop="" label="开始时间" :formatter="$utils.baseFormatter "> </el-table-column>
        <el-table-column prop="" label="结束时间" :formatter="$utils.baseFormatter "> </el-table-column>
        <el-table-column prop="" label="当时位置" :formatter="$utils.baseFormatter "> </el-table-column>
        <el-table-column prop="" label="行驶速度" :formatter="$utils.baseFormatter "> </el-table-column>
        <el-table-column prop="" label="信号质量" :formatter="$utils.baseFormatter "> </el-table-column>
      </el-table>
    </div>
    <div style="width:50%; position:absolute;right:0;top:0;bottom:0; " ref="map"></div>
  </div>
</template>
<script>
/*eslint-disable*/
import { initMap } from "@/utils/map.js";
export default {
  mounted() {
    initMap(() => {
      var map = new AMap.Map(this.$refs.map, {
        zoom: 14
      });
    });
  },
  props: {},
  data() {
    return {};
  },
  methods: {}
};
</script>
<style>
</style>
