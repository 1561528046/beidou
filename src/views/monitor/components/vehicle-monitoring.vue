<template>
  <div>
    <div style=" width:100%; position:absolute;right:0;top:0;bottom:0; z-index:1;" ref="map"></div>
    <div class="structure_tree">
      <div>
        <el-collapse>
          <el-collapse-item title="组织架构" name="1">
            <div style="height:200px; overflow-y:auto">
              <el-tree
                :data="groupData"
                show-checkbox
                node-key="id"
                :default-expand-all="true"
                :props="defaultProps"
              ></el-tree>
            </div>
          </el-collapse-item>
          <el-collapse-item title="云镜控制" name="2">
            <div class="direction">
              <i style="margin-left:0" class="iconfont icon-youshangjiantou"></i>
              <i class="iconfont icon-arrow-up"></i>
              <i class="iconfont icon-zuoshangjiantou1"></i>
              <br>
              <i style="margin-left:0" class="iconfont icon-iconfontxiangxia1copy19"></i>
              <i style="broder-radius:22px;    background-color: #68aef5;" class="el-icon-refresh"></i>
              <i class="iconfont icon-arrow-left"></i>
              <br>
              <i style="margin-left:0" class="iconfont icon-youxiajiantou"></i>
              <i class="iconfont icon-arrow-down"></i>
              <i class="iconfont icon-zuoshangjiantou"></i>
            </div>
            <div class="control">
              <i class="el-icon-plus"></i>
              <span>倍数</span>
              <i class="el-icon-minus"></i>
              <br>
              <i class="el-icon-plus"></i>
              <span>焦距</span>
              <i class="el-icon-minus"></i>
              <br>
              <i class="el-icon-plus"></i>
              <span>光圈</span>
              <i class="el-icon-minus"></i>
            </div>
            <el-slider style="width: 90%;margin: 0 auto;" v-model="degree"></el-slider>
          </el-collapse-item>
          <el-collapse-item title="预置位设置" name="3">
            <div style="text-align:left">
              <el-button size="mini" @click="addPreset" type="primary">新增</el-button>
            </div>
            <el-table :data="presetData" style="width: 100%">
              <el-table-column align="center" prop="preset_name" label="预置位名称"></el-table-column>
              <el-table-column align="center" label="操作" width="150px">
                <template slot-scope="scope">
                  <el-button
                    type="warning"
                    size="mini"
                    @click="updatePreset(scope)"
                    circle
                    icon="el-icon-edit"
                  ></el-button>
                  <el-button type="danger" size="mini" circle icon="el-icon-delete"></el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-collapse-item>
          <el-collapse-item title="辅助功能" name="4">
            <div class="auxiliary">
              <i style="margin-left:0" class="iconfont icon-dengguang"></i>
              <i class="iconfont icon-yushua"></i>
              <i class="iconfont icon-zidongxunhang"></i>
              <i class="iconfont icon-jujiao1"></i>
              <i class="iconfont icon-jujiao"></i>
              <br>
              <hr
                style="height:1px;border:none;border-top:1px dashed #0066CC;margin-top:5px;margin-bottom:5px"
              >
            </div>
            <div class="auxiliary_vice">
              <i style="margin-left:0" class="iconfont icon-liangdu"></i>
              <i class="iconfont icon-tiaoseban"></i>
              <i class="iconfont icon-baohedu"></i>
              <i class="iconfont icon-tubiao-"></i>
              <i class="iconfont icon-chicun"></i>
              <el-slider style="width: 90%;margin: 0 auto;" v-model="degree"></el-slider>
            </div>
          </el-collapse-item>
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
          <li>
            <i style="font-size:22px" class="iconfont icon-guanbi"></i>
          </li>
          <li>
            <i
              @click="setting"
              style="font-size:27px;position: absolute;top: -2px;"
              class="iconfont icon-shezhi"
            ></i>
          </li>
        </ul>
      </div>
      <div style="margin-top:3px;height:70%">
        <div :is="videoName"></div>
        <div class="list_tool">
          <el-tabs type="card">
            <el-tab-pane label="报警">
              <div style="text-align:left;margin-top:6px;margin-left:5px">
                <el-button size="mini" @click="lookAlarm" type="primary">查看</el-button>
                <el-button size="mini" @click="linkageDialog = true" type="primary">报警联动设置</el-button>
              </div>
              <el-table height="120px" :data="alarmData" style="width: 100%">
                <el-table-column prop label="序号" width="55"></el-table-column>
                <el-table-column prop label="车牌号"></el-table-column>
                <el-table-column prop label="终端ID"></el-table-column>
                <el-table-column prop label="报警状态"></el-table-column>
                <el-table-column prop label="报警信息"></el-table-column>
                <el-table-column prop label="监控通道"></el-table-column>
                <el-table-column prop label="报警次数"></el-table-column>
                <el-table-column prop label="报警时间"></el-table-column>
                <el-table-column prop label="报警位置"></el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="音视频流量统计">
              <div style="text-align:left;margin-top:6px;margin-left:5px">
                <el-button @click="lookTraffic" size="mini" type="primary">查看</el-button>
              </div>
              <el-table height="120px" :data="trafficData" style="width: 100%">
                <el-table-column prop label="序号" width="55"></el-table-column>
                <el-table-column prop label="流量"></el-table-column>
                <el-table-column prop label="车牌号"></el-table-column>
                <el-table-column prop label="终端ID"></el-table-column>
                <el-table-column prop label="时间"></el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="视频抓拍">
              <div style="text-align:left;margin-top:6px;margin-left:5px">
                <el-button size="mini" @click="lookSnap" type="primary">查看</el-button>
              </div>
              <el-table height="120px" :data="snapData" style="width: 100%">
                <el-table-column prop label="序号" width="55"></el-table-column>
                <el-table-column prop label="抓拍名称"></el-table-column>
                <el-table-column prop label="车牌号"></el-table-column>
                <el-table-column prop label="终端ID"></el-table-column>
                <el-table-column prop label="时间"></el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
    <el-dialog
      @close="presetForm.name=''"
      width="30%"
      title="添加预置位"
      :visible.sync="addDialog"
      :append-to-body="true"
    >
      <el-form :model="presetForm" size="small" label-width="100px">
        <el-form-item label="预置位名称">
          <el-input v-model="presetForm.name" placeholder="请输入预置位名称"></el-input>
        </el-form-item>
        <el-form-item label-width="0">
          <el-button style="display:block; margin:0 auto;" @click="addForm" type="primary">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      @close="presetForm.name=''"
      width="30%"
      title="编辑预置位"
      :visible.sync="updateDialog"
      :append-to-body="true"
    >
      <el-form :model="presetForm" size="small" label-width="100px">
        <el-form-item label="预置位名称">
          <el-input v-model="presetForm.name" placeholder="请输入预置位名称"></el-input>
        </el-form-item>
        <el-form-item label-width="0">
          <el-button style="display:block; margin:0 auto;" @click="updateForm" type="primary">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog :visible.sync="settingDialog" :append-to-body="true" width="40%" title="设置">
      <video-setting></video-setting>
    </el-dialog>
    <el-dialog :visible.sync="alarmDialog" :append-to-body="true" width="65%" title="报警">
      <video-alarm></video-alarm>
    </el-dialog>
    <el-dialog :visible.sync="trafficDialog" :append-to-body="true" width="65%" title="音视频流量统计">
      <video-traffic></video-traffic>
    </el-dialog>
    <el-dialog :visible.sync="snapDialog" :append-to-body="true" width="65%" title="视频抓拍">
      <video-snap></video-snap>
    </el-dialog>
    <el-dialog :visible.sync="linkageDialog" :append-to-body="true" width="65%" title="报警联动设置">
      <video-linkage></video-linkage>
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
import videoSetting from "./video/video-setting.vue";
import videoAlarm from "./video/video-alarm.vue";
import videoTraffic from "./video/video-traffic.vue";
import videoSnap from "./video/video-snap.vue";
import videoLinkage from "./video/video-linkage";
export default {
  components: {
    videoOne,
    videoFour,
    videoNine,
    videoSixteen,
    videoSetting,
    videoAlarm,
    videoTraffic,
    videoSnap,
    videoLinkage
  },
  created() {
    this.videoName = videoOne;
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
                  label: "老4G",
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
      presetForm: {
        name: ""
      },
      snapData: [],
      presetData: [],
      alarmData: [],
      trafficData: [],
      oneType: true,
      fourType: true,
      nineType: true,
      sixteenType: true,
      addDialog: false,
      updateDialog: false,
      settingDialog: false,
      alarmDialog: false,
      trafficDialog: false,
      snapDialog: false,
      linkageDialog: false,
      videoName: "",
      degree: 0,
      auxiliary: 0
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
    // 报警联动设置
    setLinkage() {},
    // 设置
    setting() {
      this.addKey++;
      this.settingDialog = true;
    },
    // 添加预置位
    addPreset() {
      this.addDialog = true;
    },
    addForm() {
      if (this.presetForm.name == "") {
        return this.$notify({
          message: "请输入预置位名称",
          title: "提示",
          type: "error"
        });
      }
      this.addDialog = false;
    },
    // 编辑预置位
    updatePreset(scope) {
      console.log(scope);
    },
    updateForm() {},
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
    // 查看报警信息
    lookAlarm() {
      this.addKey++;
      this.alarmDialog = true;
    },
    // 查看音视频流量统计信息
    lookTraffic() {
      this.addKey++;
      this.trafficDialog = true;
    },
    // 查看视频抓拍信息
    lookSnap() {
      this.addKey++;
      this.snapDialog = true;
    }
  }
};
</script>
<style>
.monitor-tabs .el-tabs__header {
  padding-left: 0 !important;
}
.monitoring_list {
}

.auxiliary_vice i {
  text-align: center;
  display: inline-block;
  width: 38px;
  height: 38px;
  line-height: 38px;
  font-size: 22px;
  margin-left: 25px;
}
.auxiliary {
  padding: 15px;
}
.auxiliary i {
  text-align: center;
  display: inline-block;
  width: 38px;
  height: 38px;
  line-height: 38px;
  font-size: 22px;
  border-radius: 4px;
  border: solid 1px #4d4848;
  margin-left: 25px;
}
.control {
  display: inline-block;
  text-align: right;
  width: 40%;
}
.control span {
  margin-left: 10px;
  margin-right: 10px;
}
.control i {
  font-weight: 700;
  text-align: center;
  display: inline-block;
  width: 38px;
  height: 38px;
  line-height: 38px;
  font-size: 22px;
  border-radius: 4px;
  border: solid 1px #4d4848;
  margin-bottom: 21px;
}
.direction {
  display: inline-block;
  text-align: left;
  width: 52%;
}
.direction i {
  text-align: center;
  display: inline-block;
  width: 38px;
  height: 38px;
  line-height: 38px;
  font-size: 22px;
  border-radius: 4px;
  border: solid 1px #4d4848;
  margin-bottom: 21px;
  margin-left: 17px;
}
.list_tool {
  width: 100%;
  height: 10%;
  background-color: #fff;
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
  overflow-y: auto;
  padding: 18px;
  text-align: center;
  background-color: #fff;
  position: absolute;
  width: 20%;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 100;
  padding-top: 0;
}
.video_area {
  background-color: #fff;
  position: absolute;
  width: 60%;
  left: 417px;
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