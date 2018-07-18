<template>
  <div class="home">
    <div id="container" style="width:100%;height:400px;"></div>
    <div id="container1" style="width:100%;height:100px;"></div>
    <div id="container2" style="width:100%;height:200px;"></div>
    <div id="container3" style="width:100%;height:300px;"></div>
  </div>
</template>

<script>
  import initMap from "@/utils/map.js";
  export default {
    created() {
      initMap(function () {
        new window.AMap.Map("container");
        new window.AMap.Map("container1");
        new window.AMap.Map("container2");
        new window.AMap.Map("container3");
      })

    },
  }
</script>