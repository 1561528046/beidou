<template>
  <div>
    <div style=" width:100%; position:absolute;right:0;top:0;bottom:0; z-index:1;" ref="map"></div>
    <div class="structure_tree">
      <div>
        <el-collapse>
          <el-collapse-item title="组织架构" name="1">
            <el-tree
              :data="groupData"
              show-checkbox
              node-key="id"
              :default-expand-all="true"
              :props="defaultProps"
            ></el-tree>
          </el-collapse-item>
          <el-collapse-item title="云镜控制" name="2">
            <i></i>
            <i></i>
            <i></i>
            <i></i>
            <i></i>
            <i></i>
            <i></i>
            <i></i>
            <i></i>
          </el-collapse-item>
          <el-collapse-item title="预置位设置" name="3"></el-collapse-item>
          <el-collapse-item title="辅助功能" name="4"></el-collapse-item>
        </el-collapse>
      </div>
    </div>
    <div class="video_area">
      <div class="header">
        <ul style="list-style:none;">
          <li>
            <i
              v-if="oneType"
              @click="Uniform(1)"
              style="font-size:25px"
              class="iconfont icon-fangkuai2"
            ></i>
            <i
              v-if="!oneType"
              @click="Uniform(1)"
              style="font-size:25px;color:#3697ec"
              class="iconfont icon-fangkuai2"
            ></i>
          </li>
          <li>
            <i
              v-if="fourType"
              @click="Uniform(4)"
              style="font-size:26px"
              class="iconfont icon-fangkuai"
            ></i>
            <i
              v-if="!fourType"
              @click="Uniform(4)"
              style="font-size:26px;color:#3697ec"
              class="iconfont icon-fangkuai"
            ></i>
          </li>
          <li>
            <i
              v-if="nineType"
              @click="Uniform(9)"
              style="font-size:25px"
              class="iconfont icon-fangkuai3"
            ></i>
            <i
              v-if="!nineType"
              @click="Uniform(9)"
              style="font-size:25px;color:#3697ec"
              class="iconfont icon-fangkuai3"
            ></i>
          </li>
          <li>
            <i
              v-if="sixteenType"
              @click="Uniform(16)"
              style="font-size:22px"
              class="iconfont icon-icon-test"
            ></i>
            <i
              v-if="!sixteenType"
              @click="Uniform(16)"
              style="font-size:22px;color:#3697ec"
              class="iconfont icon-icon-test"
            ></i>
          </li>
        </ul>
      </div>
      <div style="margin-top:3px;height:88%">
        <div :is="videoName"></div>
        <div class="list_tool">
          <el-row style="padding:10px">
            <el-col :span="8">报警</el-col>
            <el-col :span="8">音视频流量统计</el-col>
            <el-col :span="8">视频抓拍</el-col>
          </el-row>
        </div>
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
  created() {
    this.videoName = videoOne;
    var alarm = this.$dict.alarm;
    for (var key in alarm) {
      this.alarmData.push({ alarmId: key, alarmType: alarm[key] });
    }
  },
  data() {
    return {
      groupData: [
        {
          id: 1,
          label: "监控中心",
          children: [
            {
              id: 4,
              label: "新东方客运公司",
              children: [
                {
                  id: 9,
                  label: "部标4G",
                  children: [
                    {
                      id: 11,
                      label: "冀R12345",
                      children: [
                        {
                          id: 12,
                          label: "GH1"
                        },
                        {
                          id: 13,
                          label: "GH2"
                        },
                        {
                          id: 14,
                          label: "GH3"
                        }
                      ]
                    }
                  ]
                },
                {
                  id: 10,
                  label: "老4G"
                }
              ]
            }
          ]
        }
      ],
      defaultProps: {
        children: "children",
        label: "label"
      },
      formData: {
        time: "",
        type: "1"
      },
      mapData: {
        map: {}
      },
      alarmData: [],
      oneType: true,
      fourType: true,
      nineType: true,
      sixteenType: true,
      videoName: "",
      progress: 0
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
  },
  methods: {
    // 分屏按钮
    Uniform(code) {
      switch (code) {
        case 1:
          this.oneType = false;
          this.fourType = true;
          this.nineType = true;
          this.sixteenType = true;
          this.videoName = videoOne;
          break;
        case 4:
          this.oneType = true;
          this.fourType = false;
          this.nineType = true;
          this.sixteenType = true;
          this.videoName = videoFour;
          break;
        case 9:
          this.oneType = true;
          this.fourType = true;
          this.nineType = false;
          this.sixteenType = true;
          this.videoName = videoNine;
          break;
        case 16:
          this.oneType = true;
          this.fourType = true;
          this.nineType = true;
          this.sixteenType = false;
          this.videoName = videoSixteen;
          break;
      }
    },
    // 播放部分
    // 后退
    retreatVideo() {},
    // 播放
    playVideo() {},
    // 暂停
    pauseVideo() {},
    // 快进
    forwardVideo() {},
    // 停止
    stopVideo() {}
  }
};
</script>
<style>
.list_tool {
  text-align: center;
}
.list_tool ul {
  list-style: none;
  display: inline-block;
  height: 50px;
  line-height: 50px;
}
.list_tool ul li {
  float: left;
}
.structure_tree {
  padding: 18px;
  text-align: center;
  background-color: #fff;
  position: absolute;
  width: 20%;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 100;
}
.video_area {
  background-color: #fff;
  position: absolute;
  width: 60%;
  left: 420px;
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