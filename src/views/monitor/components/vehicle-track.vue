<template>
    <!-- 地图 -->
    <div style="position:absolute;left:0;right:0;top:0;bottom:0; z-index:1;" ref="map"></div>
</template>
<script>
/*eslint-disable*/
import { initMap } from "@/utils/map.js";
export default {
  mounted() {
    var vm = this;
    initMap(() => {
      var map = new AMap.Map(this.$refs.map, {
        zoom: 14
      });
      //   vm.$set()
    });
    var path = [
      [116.405289, 39.904987],
      [113.964458, 40.54664],
      [111.47836, 41.135964],
      [108.949297, 41.670904],
      [106.380111, 42.149509],
      [103.774185, 42.56996],
      [101.135432, 42.930601],
      [98.46826, 43.229964],
      [95.777529, 43.466798],
      [93.068486, 43.64009],
      [90.34669, 43.749086],
      [87.61792, 43.793308]
    ];
  }
};
</script>