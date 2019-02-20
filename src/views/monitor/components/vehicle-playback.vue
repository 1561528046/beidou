<template>
  <div>
    <div style=" width:100%; position:absolute;right:0;top:0;bottom:0; z-index:1;" ref="map"></div>
    <div class="structure_tree">
      <div>
        <el-tree
          :data="groupData"
          show-checkbox
          node-key="id"
          :default-expand-all="true"
          :props="defaultProps"
        ></el-tree>
      </div>
      <div style="margin-top:10px">
        <el-form :model="formData" size="small" label-width="50px">
          <el-row>
            <el-col>
              <el-form-item label="时间">
                <el-date-picker
                  style="width:100%"
                  v-model="formData.time"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label-width="0">
                <el-radio v-model="formData.type" label="1">常规</el-radio>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label-width="0">
                <el-radio v-model="formData.type" label="2">报警</el-radio>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label-width="0">
                <el-radio v-model="formData.type" label="3">所有</el-radio>
              </el-form-item>
            </el-col>
            <el-col v-if="formData.type=='2'">
              <el-form-item label-width="0">
                <el-table
                  border
                  ref="multipleTable"
                  :data="alarmData"
                  style="width: 100%"
                  height="300px"
                >
                  <el-table-column align="center" type="selection" width="50"></el-table-column>
                  <el-table-column align="center" prop="alarmType" label="报警类型"></el-table-column>
                </el-table>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label-width="0">
                <el-button type="primary">查询</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
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
      <div style="margin-top:4px;height:70%">
        <div :is="videoName"></div>
        <div>
          <div class="play_tool">
            <el-tabs type="card">
              <el-tab-pane label="文件">
                <el-table :data="fileData" height="154px" style="width: 100%">
                  <el-table-column prop label="序号" width="55"></el-table-column>
                  <el-table-column prop="license" label="车牌号"></el-table-column>
                  <el-table-column prop label="终端ID"></el-table-column>
                  <el-table-column prop label="报警状态"></el-table-column>
                  <el-table-column prop label="报警信息"></el-table-column>
                  <el-table-column prop label="监控通道"></el-table-column>
                  <el-table-column prop label="报警次数"></el-table-column>
                  <el-table-column prop label="报警时间"></el-table-column>
                  <el-table-column prop label="报警位置"></el-table-column>
                  <el-table-column prop label="操作">
                    <template slot-scope="scope">
                      <i style="font-size:20px" class="iconfont icon-fileplay1"></i>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="关键帧播放"></el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </div>
    </div>
    <el-dialog :visible.sync="fileDialog" :append-to-body="true" width="65%" title="文件">
      <video-file></video-file>
    </el-dialog>
  </div>
</template>
<script>
/*eslint-disable*/
import { initMap } from "@/utils/map.js";
import videoOne from "./video/video-one.vue";
import videoFour from "./video/video-four.vue";
import videoNine from "./video/video-nine.vue";
import videoSixteen from "./video/video-sixteen.vue";
import videoFile from "./video/video-file.vue";
export default {
  components: { videoOne, videoFour, videoNine, videoSixteen, videoFile },
  created() {
    this.videoName = videoOne;
    var alarm = this.$dict.alarm;
    for (var key in alarm) {
      this.alarmData.push({ alarmId: key, alarmType: alarm[key] });
    }
  },
  data() {
    return {
      addKey: 0,
      fileDialog: false,
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
      fileData: [],
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
    // 查看文件列表信息
    lookFile() {
      this.addKey++;
      this.fileDialog = true;
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
.play_tool {
  text-align: center;
}
.play_tool ul {
  list-style: none;
  display: inline-block;
  height: 50px;
  line-height: 50px;
}
.play_tool ul li {
  float: left;
  margin-left: 20px;
}
.play_tool ul li:first-child {
  margin-left: 0px;
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