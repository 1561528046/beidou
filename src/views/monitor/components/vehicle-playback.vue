<template>
  <div>
    <div style=" width:100%; position:absolute;right:0;top:0;bottom:0; z-index:1;" ref="map"></div>
    <div class="video_area">
      <i class="iconfont icon-fangkuai2"></i>
      <i class="iconfont icon-fangkuai"></i>
      <i class="iconfont icon-fangkuai1"></i>
      <i class="iconfont icon-icon-test"></i>
    </div>
  </div>
</template>
<script>
/*eslint-disable*/
import { initMap } from "@/utils/map.js";
export default {
  data() {
    return {
      mapData: {
        map: {}
      }
    };
  },
  mounted() {
    var vm = this;
    initMap(() => {
      var map = new AMap.Map(this.$refs.map, {
        zoom: 14
      }); //实例化地图
      vm.$set(vm.mapData, "map", map);
    });
  }
};
</script>
<style>
.video_area {
  background-color: #fff;
  position: absolute;
  width: 60%;
  left: 300px;
  top: 0;
  bottom: 0;
  z-index: 100;
}
</style>