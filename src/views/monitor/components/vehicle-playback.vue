<template>
  <div>
    <div style=" width:100%; position:absolute;right:0;top:0;bottom:0; z-index:1;" ref="map"></div>
    <div class="structure_tree"></div>
    <div class="video_area">
      <div class="header">
        <ul style="list-style:none;">
          <li>
            <i @click="Uniform(1)" style="font-size:25px" class="iconfont icon-fangkuai2"></i>
          </li>
          <li>
            <i @click="Uniform(4)" style="font-size:25px" class="iconfont icon-fangkuai"></i>
          </li>
          <li>
            <i @click="Uniform(9)" style="font-size:25px" class="iconfont icon-fangkuai3"></i>
          </li>
          <li>
            <i @click="Uniform(16)" style="font-size:23px" class="iconfont icon-icon-test"></i>
          </li>
        </ul>
      </div>
      <div style="margin-top:3px">
        <div :is="videoName"></div>
      </div>
    </div>
  </div>
</template>
<script>
/*eslint-disable*/
import { initMap } from "@/utils/map.js";
import videoOne from "./video/video-one.vue";
import videoFour from "./video/video-four.vue";
import videoNine from "./video/video-nine.vue";
import videoSixteen from "./video/video-sixteen.vue";
export default {
  components: { videoOne, videoFour, videoNine, videoSixteen },
  data() {
    return {
      videoName: "",
      mapData: {
        map: {}
      }
    };
  },
  created() {
    this.videoName = videoOne;
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
    Uniform(code) {
      switch (code) {
        case 1:
          this.videoName = videoOne;
          break;
        case 4:
          this.videoName = videoFour;
          break;
        case 9:
          this.videoName = videoNine;
          break;
        case 16:
          this.videoName = videoSixteen;
          break;
      }
    }
  }
};
</script>
<style>
.structure_tree {
  background-color: #fff;
  position: absolute;
  width: 18%;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 100;
}
.video_area {
  background-color: #fff;
  position: absolute;
  width: 60%;
  left: 346px;
  top: 0;
  bottom: 0;
  z-index: 100;
}
.video_area .header {
  height: 55px;
  line-height: 55px;
}
.video_area .header ul li {
  float: left;
  margin-left: 5px;
}
.video_area .footer {
  height: 80%;
}
</style>