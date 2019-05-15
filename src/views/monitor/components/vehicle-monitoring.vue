<template>
  <div @click="validation">
    <div style=" width:100%; position:absolute;right:0;top:0;bottom:0; z-index:1;" ref="map"></div>
    <div class="structure_tree">
      <el-collapse v-model="activeNames">
        <el-collapse-item title="组织架构" name="1">
          <div style="height:200px; overflow-y:auto">
            <el-input size="small" placeholder="请输入车牌号" v-model="tableQuery.license"></el-input>
            <el-tree
              ref="tree"
              :accordion="true"
              :data="groupData"
              :default-expanded-keys="[1,10]"
              node-key="id"
              show-checkbox
              :draggable="true"
              :expand-on-click-node="false"
              :props="defaultProps"
              :filter-node-method="filterNode"
              @node-click="obtainVideo"
            >
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <span v-if="data.physical_channel">{{ data.label }}</span>
                <el-button
                  v-if="!data.physical_channel"
                  type="primary"
                  size="mini"
                  @dblclick.native="storageDetail(data)"
                >{{ data.label }}</el-button>
                <span v-if="data.license">
                  <i
                    title="图像分析报警参数设置"
                    @click="analysis(data)"
                    style="font-size:13px;cursor:pointer;margin-left:5px"
                    class="iconfont icon-tongyongtuxiangfenxi"
                  ></i>
                </span>
                <span v-if="data.physical_channel">
                  <i
                    v-if="data.logical_channel"
                    title="单独视频通道参数设置"
                    @click="separateSetting(data)"
                    style="font-size:16px;cursor:pointer;margin-left:5px"
                    class="iconfont icon-shezhi2"
                  ></i>
                  <i
                    v-if="!data.state"
                    @click="channelPlay(data)"
                    style="font-size:16px;margin-left:5px"
                    class="iconfont icon-kaishi"
                  ></i>
                  <i
                    v-if="data.state"
                    @click="channelPlay(data)"
                    style="font-size:16px; margin-left:5px"
                    class="iconfont icon-jieshu"
                  ></i>
                  <i
                    @click="videoSnap(data)"
                    style="font-size:16px; margin-left:7px"
                    class="iconfont icon-ft-photo"
                  ></i>
                </span>
              </span>
            </el-tree>
          </div>
        </el-collapse-item>
        <el-collapse-item v-loading="cameraType" element-loading-text="自动巡航中" title="云镜控制" name="2">
          <div class="direction">
            <i @click="rotatingCamera(1)" style="margin-left:0" class="iconfont icon-arrow-up"></i>
            <br>
            <i
              @click="rotatingCamera(3)"
              style="margin-left:0"
              class="iconfont icon-iconfontxiangxia1copy19"
            ></i>
            <i
              @click="rotatingCamera(0)"
              class="iconfont icon-media-stop-03"
              style="border:0px;#fff;"
            ></i>

            <i @click="rotatingCamera(4)" class="iconfont icon-arrow-left"></i>
            <br>
            <i @click="rotatingCamera(2)" style="margin-left:0" class="iconfont icon-arrow-down"></i>
          </div>
          <div class="control">
            <i @click="adjustMultiple(0)" class="el-icon-plus"></i>
            <span>倍数</span>
            <i @click="adjustMultiple(1)" class="el-icon-minus"></i>
            <br>
            <i @click="adjustFocal(0)" class="el-icon-plus"></i>
            <span>焦距</span>
            <i @click="adjustFocal(1)" class="el-icon-minus"></i>
            <br>
            <i @click="adjustAperture(0)" class="el-icon-plus"></i>
            <span>光圈</span>
            <i @click="adjustAperture(1)" class="el-icon-minus"></i>
          </div>
          <el-slider :max="255" style="width: 90%;margin: 0 auto;" v-model="degree"></el-slider>
        </el-collapse-item>
        <el-collapse-item title="预置位设置" name="3">
          <div style="text-align:left">
            <el-button v-if="!presetBtn" size="mini" @click="addPreset" type="primary">新增</el-button>
            <el-button
              v-if="presetBtn"
              size="mini"
              @click="addPreset"
              type="primary"
              icon="el-icon-loading"
            ></el-button>
            <el-button
              v-if="!automatic"
              @click="autoCruise"
              size="mini"
              type="primary"
              icon="iconfont icon-bofang"
            >自动巡航</el-button>
            <el-button
              @click="autoCruise"
              v-if="automatic"
              size="mini"
              type="primary"
              icon="iconfont icon-media-stop-03"
            >自动巡航</el-button>
          </div>
          <el-table :data="presetData" style="width: 100%">
            <el-table-column align="center" type="selection"></el-table-column>
            <el-table-column align="center" prop="channel_preset_name" label="预置位名称"></el-table-column>
            <el-table-column align="center" label="操作" width="150px">
              <template slot-scope="scope">
                <el-button
                  type="warning"
                  size="mini"
                  @click="updatePreset(scope)"
                  circle
                  icon="el-icon-edit"
                ></el-button>
                <el-popover placement="top" width="160" v-model="presetPopover">
                  <p>确定删除当前预置位？</p>
                  <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="presetPopover=false">取消</el-button>
                    <el-button type="primary" size="mini" @click="deletePreset(scope)">确定</el-button>
                  </div>
                  <el-button
                    style="margin-left:10px"
                    slot="reference"
                    size="mini"
                    type="danger"
                    icon="el-icon-delete"
                    circle
                  ></el-button>
                </el-popover>
              </template>
            </el-table-column>
          </el-table>
        </el-collapse-item>
        <el-collapse-item title="辅助功能" name="4">
          <div class="auxiliary_vice">
            <i
              v-if="!wiper"
              style="margin-left:0"
              @click="adjustVideo(5)"
              title="雨刷器"
              class="iconfont icon-yushua"
            ></i>
            <i
              v-if="wiper"
              style="color: #70b866;margin-left:0"
              @click="adjustVideo(5)"
              title="雨刷器"
              class="iconfont icon-yushua"
            ></i>
            <i
              v-if="!infrared"
              title="红外补光"
              @click="adjustVideo(6)"
              class="iconfont icon-fill-light"
            ></i>
            <i
              v-if="infrared"
              style="color: #70b866;"
              title="红外补光"
              @click="adjustVideo(6)"
              class="iconfont icon-fill-light"
            ></i>
            <i title="灯光" style="margin-left:0" class="iconfont icon-dengguang"></i>
            <i title="自动光圈" class="iconfont icon-guangquan"></i>
            <i title="自动聚焦" class="iconfont icon-jujiao"></i>
            <i title="尺寸" class="iconfont icon-chicun"></i>
            <el-slider style="width: 90%;margin: 0 auto;" :min="0" :max="200" v-model="auxiliary"></el-slider>
          </div>
        </el-collapse-item>
        <el-collapse-item title="色彩" name="5">
          <div class="color_block">
            <span style="font-size:14px;line-height:35px">亮度</span>
            <el-slider
              show-input
              style="float:right;width:80%"
              :min="0"
              :max="200"
              v-model="color.brightness"
            ></el-slider>
          </div>
          <div class="color_block">
            <span style="font-size:14px;line-height:35px">色度</span>
            <el-slider
              show-input
              style="float:right;width:80%"
              :min="0"
              :max="200"
              v-model="color.chroma"
            ></el-slider>
          </div>
          <div class="color_block">
            <span style="font-size:14px;line-height:35px">饱和度</span>
            <el-slider
              show-input
              style="float:right;width:80%"
              :min="0"
              :max="200"
              v-model="color.contrast"
            ></el-slider>
          </div>
          <div class="color_block">
            <span style="font-size:14px;line-height:35px">对比度</span>
            <el-slider
              show-input
              style="float:right;width:80%"
              :min="0"
              :max="200"
              v-model="color.saturate"
            ></el-slider>
          </div>
          <el-button size="mini" @click="initialize" type="primary">默认</el-button>
        </el-collapse-item>
      </el-collapse>
    </div>
    <div class="video_area">
      <div class="header">
        <ul style="list-style:none;">
          <li>
            <i
              v-if="oneType"
              @click="Uniform(1)"
              style="font-size:33px"
              class="iconfont icon-1fenge"
            ></i>
            <i
              v-if="!oneType"
              @click="Uniform(1)"
              style="font-size:33px;color:#3697ec"
              class="iconfont icon-1fenge"
            ></i>
          </li>
          <li>
            <i
              v-if="fourType"
              @click="Uniform(4)"
              style="font-size:33px"
              class="iconfont icon-4fenge"
            ></i>
            <i
              v-if="!fourType"
              @click="Uniform(4)"
              style="font-size:33px;color:#3697ec"
              class="iconfont icon-4fenge"
            ></i>
          </li>
          <li>
            <i
              v-if="sixType"
              @click="Uniform(6)"
              style="font-size:33px"
              class="iconfont icon-6fenge"
            ></i>
            <i
              v-if="!sixType"
              @click="Uniform(6)"
              style="font-size:33px;color:#3697ec"
              class="iconfont icon-6fenge"
            ></i>
          </li>
          <li>
            <i
              v-if="nineType"
              @click="Uniform(9)"
              style="font-size:33px"
              class="iconfont icon-9fenge"
            ></i>
            <i
              v-if="!nineType"
              @click="Uniform(9)"
              style="font-size:33px;color:#3697ec"
              class="iconfont icon-9fenge"
            ></i>
          </li>
          <li>
            <i
              v-if="tenType"
              @click="Uniform(10)"
              style="font-size:22px"
              class="iconfont icon-fenping"
            ></i>
            <i
              v-if="!tenType"
              @click="Uniform(10)"
              style="font-size:22px;color:#3697ec"
              class="iconfont icon-fenping"
            ></i>
          </li>
          <li>
            <i
              v-if="sixteenType"
              @click="Uniform(16)"
              style="font-size:33px"
              class="iconfont icon-16fenge"
            ></i>
            <i
              v-if="!sixteenType"
              @click="Uniform(16)"
              style="font-size:33px;color:#3697ec"
              class="iconfont icon-16fenge"
            ></i>
          </li>
          <li>
            <i
              @click="notDialog=true"
              style="font-size:22px;margin-left:5px;cursor:pointer"
              class="iconfont icon-guanbi"
            ></i>
          </li>
          <li>
            <i
              title="音视频参数设置"
              @click="setting"
              style="font-size:30px;cursor:pointer"
              class="iconfont icon-shezhi2"
            ></i>
          </li>
          <li>
            <i
              title="终端休眠唤醒设置"
              @click="arouse"
              style="font-size:28px;cursor:pointer"
              class="iconfont icon-huanxing"
            ></i>
          </li>
          <li>
            <i
              title="特殊报警录像设置"
              @click="sendSpecial"
              style="font-size:28px;cursor:pointer"
              class="iconfont icon-shipinbaojing1"
            ></i>
          </li>
          <li>
            <i
              title="视频相关报警屏蔽字设置"
              @click="shielding"
              style="font-size:24px;cursor:pointer"
              class="iconfont icon-pingbizi"
            ></i>
          </li>
          <!-- <li>
            <i
              title="报警联动设置"
              @click="setLinkage"
              style="font-size:24px;cursor:pointer"
              class="iconfont icon-nav-strategy"
            ></i>
          </li>-->
        </ul>
      </div>
      <div style="margin-top:10px">
        <div :is="videoName" :video="video" :videos="videos" :style="{'filter':event}"></div>
        <el-tabs type="border-card">
          <el-tab-pane label="音视频流量统计">
            <el-table size="mini" height="135px" :data="trafficData" style="width: 100%">
              <el-table-column prop="flow" label="流量"></el-table-column>
              <el-table-column prop="license" label="车牌号"></el-table-column>
              <el-table-column prop="device_no" label="终端ID"></el-table-column>
              <el-table-column
                prop="begin_time"
                label="时间"
                :formatter="(row)=>{return this.$utils.formatDate14(row.begin_time)}"
              ></el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="视频抓拍">
            <el-table :data="snapData" height="135px" size="mini">
              <el-table-column
                prop="cdate"
                label="时间"
                :formatter="(row)=>{return this.$utils.formatDate14(row.cdate)}"
              ></el-table-column>
              <el-table-column prop="pic_name" label="名称"></el-table-column>
              <el-table-column prop="pic_describe" label="描述"></el-table-column>
              <el-table-column prop="vehicle_no" label="车牌号"></el-table-column>
              <el-table-column prop="channel_no" label="通道"></el-table-column>
              <el-table-column label="媒体">
                <template slot-scope="scope">
                  <el-popover placement="right" style="height:400px" width="400" trigger="click">
                    <img :src="scope.row.img_path" style="width:100%;">
                    <el-button size="small" type="primary" slot="reference">查看照片</el-button>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column prop label="操作">
                <template slot-scope="scope">
                  <el-button @click="updateSnap(scope.row)" size="mini" type="warning">编辑</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <el-dialog
      @close="presetForm.channel_preset_name=''"
      width="30%"
      title="添加预置位"
      :visible.sync="addDialog"
      :append-to-body="true"
    >
      <el-form :model="presetForm" size="small" label-width="100px">
        <el-form-item label="预置位名称">
          <el-input v-model="presetForm.channel_preset_name" placeholder="请输入预置位名称"></el-input>
        </el-form-item>
        <el-form-item label-width="0">
          <el-button style="display:block; margin:0 auto;" @click="addForm" type="primary">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      @close="presetForm.channel_preset_name=''"
      width="30%"
      title="编辑预置位"
      :visible.sync="updateDialog"
      :append-to-body="true"
    >
      <el-form :model="presetForm" size="small" label-width="100px">
        <el-form-item label="预置位名称">
          <el-input v-model="presetForm.channel_preset_name" placeholder="请输入预置位名称"></el-input>
        </el-form-item>
        <el-form-item label-width="0">
          <el-button style="display:block; margin:0 auto;" @click="updateForm" type="primary">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 音视频参数设置 -->
    <el-dialog :visible.sync="settingDialog" :append-to-body="true" width="40%" title="设置">
      <video-setting :simid="vhSimid" :type="parameterType" :id="channelID" :key="addKey"></video-setting>
    </el-dialog>
    <!-- 报警信息列表 -->
    <el-dialog :visible.sync="alarmDialog" :append-to-body="true" width="65%" title="报警">
      <video-alarm></video-alarm>
    </el-dialog>
    <!-- 报警联动设置 -->
    <el-dialog :visible.sync="linkageDialog" :append-to-body="true" width="65%" title="报警联动设置">
      <video-linkage :simid="vhSimid" :id="device_id" :key="addKey"></video-linkage>
    </el-dialog>
    <!-- 终端休眠唤醒模式设置 -->
    <el-dialog :visible.sync="dormancyDialog" :append-to-body="true" width="40%" title="终端休眠唤醒模式设置">
      <device-dormancy :simid="vhSimid" :key="addKey"></device-dormancy>
    </el-dialog>
    <!-- 图像分析报警参数设置 -->
    <el-dialog :visible.sync="analysisDialog" :append-to-body="true" width="40%" title="图像分析报警参数设置">
      <video-analysis :simid="vhSimid" :key="addKey"></video-analysis>
    </el-dialog>
    <!-- 特殊报警录像参数设置 -->
    <el-dialog :visible.sync="specialDialog" :append-to-body="true" width="40%" title="特殊报警录像参数设置">
      <video-special :simid="vhSimid" :key="addKey"></video-special>
    </el-dialog>
    <!-- 视频抓拍-编辑 -->
    <el-dialog :visible.sync="snapDialog" :append-to-body="true" width="40%" title="编辑">
      <video-snap
        :rowid="updateid"
        :key="addKey"
        @success="()=>{this.getScreenshotsList(); this.snapDialog=false}"
      ></video-snap>
    </el-dialog>
    <!-- 视频报警屏蔽字设置 -->
    <el-dialog :visible.sync="shieldingDialog" :append-to-body="true" width="40%" title="视频报警屏蔽字设置">
      <el-form size="small">
        <el-row :gutter="20">
          <el-col>
            <el-form-item>
              <el-checkbox-group v-model="shieldingList">
                <el-checkbox label="6">视频信号丢失报警</el-checkbox>
                <el-checkbox label="5">视频信号遮挡报警</el-checkbox>
                <el-checkbox label="4">存储单元故障报警</el-checkbox>
                <el-checkbox label="3">其他视频设备故障报警</el-checkbox>
                <el-checkbox style="margin-left: 0;" label="2">客车超员报警</el-checkbox>
                <el-checkbox style="margin-left: 58px;" label="1">异常驾驶行为报警</el-checkbox>
                <el-checkbox label="0">特殊报警录像达到存储阈值报警</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col style="text-align:center">
            <el-form-item>
              <el-button @click="submitForm" type="primary">提交</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
    <!-- 长时间未操作关闭视频浏览设置 -->
    <el-dialog
      @close="timeOut=''"
      :visible.sync="notDialog"
      :append-to-body="true"
      width="20%"
      title="长时间未操作关闭视频浏览"
    >
      <el-input size="small" v-model="timeOut" placeholder="请输入（分钟/0为不关闭实时视频浏览）"></el-input>
      <el-button
        style="display:block; margin:0 auto;margin-top:10px;"
        size="small"
        type="primary"
        @click="submitTime"
      >提交</el-button>
    </el-dialog>
  </div>
</template>
<script>
/*eslint-disable*/
import moment from "moment";
import {
  getVehiclelList,
  getChannelByDeviceID,
  getPresetByChannel,
  addChannelPreset,
  updateChannelPreset,
  deleteChannelPreset,
  GetVehicleByLicense,
  getTrafficList,
  getVehicle,
  videoPrintscreen,
  getVideoPrintscreenList
} from "@/api/index.js";
import { initMap } from "@/utils/map.js";
import videoOne from "./video/screen/video-one.vue";
import videoFour from "./video/screen/video-four.vue";
import videoSix from "./video/screen/video-six.vue";
import videoNine from "./video/screen/video-nine.vue";
import videoTen from "./video/screen/video-ten.vue";
import videoSixteen from "./video/screen/video-sixteen.vue";
import videoSetting from "./video/video-setting.vue";
import videoAlarm from "./video/video-alarm.vue";
import videoTraffic from "./video/video-traffic.vue";
import videoSnap from "./video/video-snap.vue";
import videoLinkage from "./video/video-linkage";
import videoAnalysis from "./video/video-analysis.vue";
import videoSpecial from "./video/video-special.vue";
import deviceDormancy from "./video/device-dormancy.vue";
export default {
  components: {
    videoOne,
    videoFour,
    videoSix,
    videoNine,
    videoTen,
    videoSixteen,
    videoSetting,
    videoAlarm,
    videoTraffic,
    videoSnap,
    videoLinkage,
    videoAnalysis,
    videoSpecial,
    deviceDormancy
  },
  created() {
    var arr = [];
    var data = {};
    if (this.$store.state.monitor.videoVehicle.sim_id) {
      var data = this.$store.state.monitor.videoVehicle;
      getVehicle({ vehicle_id: data.vehicle_id }).then(res => {
        if (res.data.code == 0) {
          res.data.data.map((item, index) => {
            item.device_id = data.device_id;
            item.label = item.license;
            item.id = 10 + index;
            item.children = [];
          });
          this.$set(this.groupData[0].children[0], "children", res.data.data);
        }
      });
    } else {
      getVehiclelList().then(res => {
        if (res.data.code == 0) {
          res.data.data.map((item, index) => {
            item.label = item.license;
            item.id = 10 + index;
            item.children = [];
          });
          this.$set(this.groupData[0].children[0], "children", res.data.data);
        }
      });
    }
    this.$instruction.on("x8103", eve => {
      data = JSON.parse(eve.data);
      if (data.code == 0) {
        this.$notify({
          message: "指令发送成功",
          title: "提示",
          type: "success"
        });
        switch (data.ParameterId) {
          case 117:
            this.settingDialog = false;
            break;
          case 119:
            this.settingDialog = false;
            break;
          case 121:
            this.specialDialog = false;
            break;
          case 122:
            this.shieldingDialog = false;
            break;
          case 123:
            this.analysisDialog = false;
            break;
          case 124:
            this.dormancyDialog = false;
            break;
        }
      } else {
        return this.$notify({
          message: "指令发送失败",
          title: "提示",
          type: "error"
        });
      }
    });
  },
  data() {
    return {
      updateid: "", //视频截图编辑所需id
      videoSimIds: [],
      timeOut: "",
      tableQuery: {
        license: ""
      },
      activeNames: ["1"],
      groupData: [
        {
          id: 1,
          label: "监控中心",
          children: [
            {
              id: 10,
              label: "中交天枢",
              children: []
            }
          ]
        }
      ],
      defaultProps: {
        children: "children",
        label: "label"
      },
      mapData: {
        map: {}
      },
      presetForm: {
        channel_preset_name: "", //预置点名称
        logical_channel: "", //逻辑通道号
        physical_channel: "", //物理通道号
        direction: "", //方向
        speed: ""
      },
      shieldingList: [],
      snapData: [],
      presetData: [],
      trafficData: [],
      channelData: {}, //单个通道信息
      vehicleData: {}, //当前车辆数据
      cameraType: false, //云台控制状态
      oneType: true,
      fourType: true,
      sixType: true,
      nineType: true,
      tenType: true,
      sixteenType: true,
      addDialog: false,
      shieldingDialog: false,
      updateDialog: false,
      settingDialog: false,
      alarmDialog: false,
      snapDialog: false,
      linkageDialog: false,
      dormancyDialog: false,
      notDialog: false,
      analysisDialog: false,
      specialDialog: false,
      contextmenuChannel: null, //右键选中的通道
      automatic: false,
      presetPopover: false, //是否删除预置位
      vhSimid: "", //当前车辆的simid
      videoName: videoFour,
      degree: 0, //云镜速度
      auxiliary: 100, //辅助功能进度条
      addKey: 0,
      device_id: "",
      channelID: "", //通道ID
      parameterType: "", //(音视频参数设置,单独音视频通道参数设置,实时流:存储流 1,2,3,4）
      menuVisible: false,
      infrared: false, //红外补光
      wiper: false, //雨刷器
      color: {
        brightness: 100, //亮度
        chroma: 0, //色度
        contrast: 100, //对比度
        saturate: 100 //饱和度
      },
      numerical: 0,
      event: "brightness(100%) saturate(100%) contrast(100%) hue-rotate(0deg)", //色彩程度
      presetBtn: false, //添加预置位按钮状态
      channelBtn: false, //通道播放按钮
      traffTimer: null,
      snapForm: {
        id: "",
        name: "",
        remark: ""
      },
      video: {
        src: "",
        type: 1
      }, //全局查询视频播放地址条件
      videos: [],
      videoData: []
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
  props: ["vehicle"],
  watch: {
    "tableQuery.license": function(val) {
      this.$refs.tree.filter(val);
    },
    // (色度1 对比度2 饱和度3 亮度4)
    //  hue-rotate contrast saturate brightness
    color: {
      handler: function() {
        var str = "";
        str =
          "brightness(" +
          this.color.brightness +
          "%) " +
          "saturate(" +
          this.color.saturate +
          "%) " +
          "contrast(" +
          this.color.contrast +
          "%) " +
          "hue-rotate(" +
          this.color.chroma +
          "deg)";
        this.$set(this.$data, "event", str);
      },
      deep: true
    }
  },
  destroyed() {
    clearInterval(this.traffTimer);
  },
  methods: {
    // 双击事件
    storageDetail(row) {
      if (row.license) {
        var data = {};
        // var storage={}
        var src = "";
        var videoArr = [];
        row.children.map(item => {
          src =
            "rtmp://60.10.139.122/live/livestream/" +
            row.sim_id +
            "_" +
            item.logical_channel;

          data = {
            MessageID: "x9101",
            SimID: "0" + row.sim_id,
            LogicChannel: item.logical_channel,
            DataType: "0",
            CodeStreamType: "0"
          };
          // storage = {
          //   sim_id: row.sim_id,
          //   MessageID: "start",
          //   channel: row.logical_channel,
          //   rtmp: src
          // };
          item.state = true;
          videoArr.push("0" + row.sim_id + item.logical_channel);
          window.monitor.video.set(
            "0" + row.sim_id + item.logical_channel,
            src
          );
          this.videoData.push({
            sim_id: "0" + row.sim_id,
            logical_channel: item.logical_channel
          });
          // this.$instructionStorage.send(JSON.stringify(storage));
          this.$instruction.send(JSON.stringify(data));
        });
        this.$set(this.$data, "videos", videoArr);
      }
    },
    // 初始化色彩程度
    initialize() {
      this.$set(
        this.$data,
        "event",
        "brightness(100%) saturate(100%) contrast(100%) hue-rotate(0deg)"
      );
      this.$set(this.color, "brightness", 100);
      this.$set(this.color, "chroma", 0);
      this.$set(this.color, "contrast", 100);
      this.$set(this.color, "saturate", 100);
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 视频抓拍部分
    updateSnap(row) {
      this.addKey++;
      this.snapDialog = true;
      this.updateid = row.rowid;
    },
    getMediaUrl(row) {
      if (row.MultimediaType == 0) {
        var url =
          this.$dict.BASE_URL +
          `api/MultiMedia/GetMultiMediaByType?type=${
            row.MultimediaType
          }&sim_id=${this.$utils.formatSim(this.vehicleData.sim_id)}&media_id=${
            row.MultimediaDataID
          }`;
        this.$set(row, "license", this.vehicleData.license);
        this.$set(row, "device_id", this.vehicleData.device_id);
        this.$set(row, "media_url", url);
        this.$set(row, "name", "");
        this.$set(row, "remark", "");
      }
    },
    //音视频调节(色度1:chroma 对比度2:saturate 饱和度3:contrast 亮度4:brightness)
    adjustVideo(num) {
      var data = {};
      switch (num) {
        case 5:
          if (this.wiper) {
            data = {
              MessageID: "x9304",
              SimID: "0" + this.vehicleData.sim_id,
              LogicChannel: this.channelData.logical_channel,
              Flag: 1
            };
            this.$instruction.send(JSON.stringify(data));
            this.wiper = false;
          } else {
            data = {
              MessageID: "x9304",
              SimID: "0" + this.vehicleData.sim_id,
              LogicChannel: this.channelData.logical_channel,
              Flag: 0
            };
            this.$instruction.send(JSON.stringify(data));
            this.wiper = true;
          }
          break;
        case 6:
          if (this.infrared) {
            data = {
              MessageID: "x9305",
              SimID: "0" + this.vehicleData.sim_id,
              LogicChannel: this.channelData.logical_channel,
              Flag: 1
            };
            this.$instruction.send(JSON.stringify(data));
            this.infrared = false;
          } else {
            data = {
              MessageID: "x9305",
              SimID: "0" + this.vehicleData.sim_id,
              LogicChannel: this.channelData.logical_channel,
              Flag: 0
            };
            this.$instruction.send(JSON.stringify(data));
            this.infrared = true;
          }
          break;
      }
    },
    //组织结构输入建议
    querySearch(queryString, cb) {
      var results = [];
      GetVehicleByLicense({ license: queryString })
        .then(res => {
          if (res.data.code == 0) {
            res.data.data.map(item => {
              item.value = item.license;
            });
            results = res.data.data;
          }
          cb(results);
        })
        .catch(() => {
          cb([]);
        });
      // 调用 callback 返回建议列表的数据
    },
    // 获取视频截图列表
    getScreenshotsList() {
      var sim_id = this.videoSimIds.join();
      sim_id = sim_id.substring(0, sim_id.lastIndexOf(","));
      getVideoPrintscreenList({ simids: sim_id }).then(res => {
        if (res.data.code == 0) {
          this.$set(this.$data, "snapData", res.data.data);
        } else {
          return this.$notify({
            message: res.data.msg,
            title: "提示",
            type: "error"
          });
        }
      });
    },
    // 视频抓拍
    videoSnap(row) {
      if (!this.videoSimIds.includes(row.sim_id)) {
        this.videoSimIds.push(row.sim_id + ",");
      }
      var src =
        "rtmp://60.10.139.122/live/livestream/" +
        row.sim_id +
        "_" +
        row.logical_channel;
      videoPrintscreen({
        sim_id: row.sim_id,
        channel_no: row.physical_channel,
        rtmpUrl: src
      }).then(res => {
        if (res.data.code == 0) {
          this.getScreenshotsList();
        } else {
          return this.$notify({
            message: res.data.msg,
            title: "提示",
            type: "error"
          });
        }
      });
    },
    // 长时间未操作关闭视频浏览
    submitTime() {
      this.notDialog = false;
      this.$emit("time", this.timeOut);
    },
    // 点击事件
    validation() {
      this.$emit("success");
    },
    // 报警联动设置
    setLinkage() {
      if (!this.vehicleData.sim_id) {
        return this.$notify({
          message: "请选择车辆",
          title: "提示",
          type: "error"
        });
      } else {
        this.addKey++;
        this.linkageDialog = true;
        this.device_id = this.vehicleData.device_id;
        this.vhSimid = this.vehicleData.sim_id;
      }
    },
    // 视频报警屏蔽字设置
    shielding() {
      if (!this.vehicleData.sim_id) {
        return this.$notify({
          message: "请选择车辆",
          title: "提示",
          type: "error"
        });
      } else {
        this.shieldingList = [];
        this.shieldingDialog = true;
        var data = {};
        data = {
          MessageID: "x8106",
          SimID: "0" + this.vehicleData.sim_id,
          ParameterId: 122
        };
        this.$instruction.send(JSON.stringify(data));
      }
    },
    submitForm() {
      var arr = [0, 0, 0, 0, 0, 0, 0];
      this.shieldingList.map(item => {
        arr[item] = 1;
      });
      var data = {};
      data = {
        MessageID: "x8103",
        SimID: "0" + this.vehicleData.sim_id,
        ParameterId: 122,
        x007AValue: parseInt(arr.join(""), 2)
      };
      this.$instruction.send(JSON.stringify(data));
    },
    // 自动巡航
    autoCruise() {
      var data = {};
      if (this.automatic) {
        this.automatic = false;
        this.cameraType = false;
      } else {
        this.presetData.map(item => {
          item.direction = item.direction.split(",");
          item.speed = item.speed.split(",");
          item.direction.map((itam, index) => {
            data = {
              MessageID: "x9301",
              SimID: "0" + this.vehicleData.sim_id,
              LogicChannel: item.logical_channel,
              Direction: itam,
              Speed: item.speed[index]
            };
            this.$instruction.send(JSON.stringify(data));
          });
        });
        this.automatic = true;
        this.cameraType = true;
      }
    },
    // 添加预置位
    addPreset() {
      if (this.presetBtn) {
        this.presetBtn = false;
        this.addDialog = true;
      } else {
        this.presetBtn = true;
      }
    },
    addForm() {
      if (this.presetForm.name == "") {
        return this.$notify({
          message: "请输入预置位名称",
          title: "提示",
          type: "error"
        });
      }
      this.$set(
        this.presetForm,
        "logical_channel",
        this.channelData.logical_channel
      );
      this.$set(
        this.presetForm,
        "physical_channel",
        this.channelData.physical_channel
      );
      this.presetForm.direction = this.presetForm.direction.substring(
        0,
        this.presetForm.direction.lastIndexOf(",")
      );
      this.presetForm.speed = this.presetForm.speed.substring(
        0,
        this.presetForm.speed.lastIndexOf(",")
      );
      addChannelPreset(this.presetForm).then(res => {
        if (res.data.code == 0) {
          this.addDialog = false;
          this.getPreset(this.channelData);
          return this.$notify({
            message: "添加成功",
            title: "提示",
            type: "success"
          });
        } else {
          return this.$notify({
            message: res.data.msg,
            title: "提示",
            type: "error"
          });
        }
      });
    },
    // 编辑预置位
    updatePreset(scope) {
      this.updateDialog = true;
      this.$set(
        this.$data,
        "presetForm",
        JSON.parse(JSON.stringify(scope.row))
      );
    },
    updateForm() {
      updateChannelPreset(this.presetForm).then(res => {
        if (res.data.code == 0) {
          this.updateDialog = false;
          this.getPreset(this.channelData);
          return this.$notify({
            message: "修改成功",
            title: "提示",
            type: "success"
          });
        } else {
          return this.$notify({
            message: res.data.msg,
            title: "提示",
            type: "error"
          });
        }
      });
    },
    // 删除预置位
    deletePreset(scope) {
      deleteChannelPreset({
        channel_preset_id: scope.row.channel_preset_id
      }).then(res => {
        if (res.data.code == 0) {
          this.presetPopover = false;
          this.getPreset(this.channelData);
          return this.$notify({
            message: "删除成功",
            title: "提示",
            type: "success"
          });
        } else {
          return this.$notify({
            message: res.data.msg,
            title: "提示",
            type: "error"
          });
        }
      });
    },
    // 查询预置位
    getPreset(row) {
      getPresetByChannel({ physical_channel: row.physical_channel }).then(
        res => {
          if (res.data.code == 0) {
            this.$set(this.$data, "presetData", res.data.data);
          } else {
            return this.$notify({
              message: res.data.msg,
              title: "提示",
              type: "error"
            });
          }
        }
      );
    },
    // 图像分析参数设置
    analysis(data) {
      this.addKey++;
      this.analysisDialog = true;
      this.vhSimid = this.vehicleData.sim_id;
      var data = {};
      data = {
        MessageID: "x8106",
        SimID: "0" + this.vehicleData.sim_id,
        ParameterId: 123
      };
      this.$instruction.send(JSON.stringify(data));
    },
    // 终端休眠唤醒模式设置
    arouse() {
      if (!this.vehicleData.sim_id) {
        return this.$notify({
          message: "请选择车辆",
          title: "提示",
          type: "error"
        });
      } else {
        this.addKey++;
        this.dormancyDialog = true;
        this.vhSimid = this.vehicleData.sim_id;
        var data = {};
        data = {
          MessageID: "x8106",
          SimID: "0" + this.vehicleData.sim_id,
          ParameterId: 124
        };
        this.$instruction.send(JSON.stringify(data));
      }
    },
    // 音视频参数设置
    setting() {
      if (!this.vehicleData.sim_id) {
        return this.$notify({
          message: "请选择车辆",
          title: "提示",
          type: "error"
        });
      } else {
        this.addKey++;
        this.parameterType = 1;
        this.settingDialog = true;
        this.vhSimid = this.vehicleData.sim_id;
        var data = {};
        data = {
          MessageID: "x8106",
          SimID: "0" + this.vehicleData.sim_id,
          ParameterId: 117
        };
        this.$instruction.send(JSON.stringify(data));
      }
    },
    // 单独音视频通道参数设置
    separateSetting(data) {
      this.addKey++;
      this.channelID = data.logical_channel;
      this.parameterType = 2;
      this.settingDialog = true;
      this.vhSimid = this.vehicleData.sim_id;
      var data = {};
      data = {
        MessageID: "x8106",
        SimID: "0" + this.vehicleData.sim_id,
        ParameterId: 119
      };
      this.$instruction.send(JSON.stringify(data));
    },
    // 特殊报警录像参数设置
    sendSpecial() {
      if (!this.vehicleData.sim_id) {
        return this.$notify({
          message: "请选择车辆",
          title: "提示",
          type: "error"
        });
      } else {
        this.addKey++;
        this.specialDialog = true;
        this.vhSimid = this.vehicleData.sim_id;
        var data = {};
        data = {
          MessageID: "x8106",
          SimID: "0" + this.vehicleData.sim_id,
          ParameterId: 121
        };
        this.$instruction.send(JSON.stringify(data));
      }
    },
    // 红外补光
    sendInfrared(num) {
      if (this.infrared) {
        this.infrared = false;
      } else {
        this.infrared = true;
      }
      var data = {};
      data = {
        MessageID: "x9305",
        SimID: "0" + this.vehicleData.sim_id,
        LogicChannel: this.channelData.logical_channel,
        Flag: num
      };
      this.$instruction.send(JSON.stringify(data));
    },
    //云台旋转
    rotatingCamera(num) {
      if (this.presetBtn) {
        this.$set(
          this.presetForm,
          "direction",
          this.presetForm.direction + num + ","
        );
        this.$set(
          this.presetForm,
          "speed",
          this.presetForm.speed + this.degree + ","
        );
      }
      var data = {};
      switch (num) {
        case 0:
          data = {
            MessageID: "x9301",
            SimID: "0" + this.vehicleData.sim_id,
            LogicChannel: this.channelData.logical_channel,
            Direction: "0",
            Speed: this.degree
          };
          break;
        case 1:
          data = {
            MessageID: "x9301",
            SimID: "0" + this.vehicleData.sim_id,
            LogicChannel: this.channelData.logical_channel,
            Direction: "1",
            Speed: this.degree
          };
          break;
        case 2:
          data = {
            MessageID: "x9301",
            SimID: "0" + this.vehicleData.sim_id,
            LogicChannel: this.channelData.logical_channel,
            Direction: "2",
            Speed: this.degree
          };
          break;
        case 3:
          data = {
            MessageID: "x9301",
            SimID: "0" + this.vehicleData.sim_id,
            LogicChannel: this.channelData.logical_channel,
            Direction: "3",
            Speed: this.degree
          };
          break;
        case 4:
          data = {
            MessageID: "x9301",
            SimID: "0" + this.vehicleData.sim_id,
            LogicChannel: this.channelData.logical_channel,
            Direction: "4",
            Speed: this.degree
          };
          break;
      }
      this.$instruction.send(JSON.stringify(data));
    },
    // 云台调整焦距
    adjustFocal(num) {
      var data = {};
      data = {
        MessageID: "x9302",
        SimID: "0" + this.vehicleData.sim_id,
        LogicChannel: this.channelData.logical_channel,
        Direction: num
      };
      this.$instruction.send(JSON.stringify(data));
    },
    // 云台调整光圈
    adjustAperture(num) {
      var data = {};
      var data = {
        MessageID: "x9303",
        SimID: "0" + this.vehicleData.sim_id,
        LogicChannel: this.channelData.logical_channel,
        AdjustMode: num
      };
      this.$instruction.send(JSON.stringify(data));
    },
    // 云台调整倍数
    adjustMultiple(num) {
      var data = {};
      var data = {
        MessageID: "x9306",
        SimID: "0" + this.vehicleData.sim_id,
        LogicChannel: this.channelData.logical_channel,
        ChangingControl: num
      };
      this.$instruction.send(JSON.stringify(data));
    },
    // 获取实时视频指令
    obtainVideo(row) {
      this.validation();
      if (row.license && row.children.length == 0) {
        this.$set(this.$data, "vehicleData", row);
        getChannelByDeviceID({ device_id: row.device_id }).then(res => {
          if (res.data.code == 0) {
            res.data.data.map((item, index) => {
              item.id = row.id + "-" + (index + 1);
              item.label = item.physical_channel;
              item.state = false;
              item.sim_id = "0" + this.vehicleData.sim_id;
            });
            if (this.traffTimer) {
              clearInterval(this.traffTimer);
            }
            this.$set(row, "children", res.data.data);
          } else {
            return this.$notify({
              message: res.data.msg,
              title: "提示",
              type: "error"
            });
          }
        });
        this.getTraffic(row);
      } else if (row.license) {
        this.$set(this.$data, "vehicleData", row);
      }
      if (row.physical_channel) {
        this.presetForm.direction = "";
        this.presetForm.speed = "";
        this.$set(this.$data, "channelData", row);
        this.getPreset(row);
      }
    },
    // 查询音视频流量
    getTraffic(row) {
      var arr = this.trafficData;
      getTrafficList({
        sim_id: row.sim_id.length > 11 ? row.sim_id : "0" + row.sim_id,
        begin_time: moment().format("YYYYMMDDHHmmss")
      }).then(res => {
        if (res.data.code == 0) {
          arr.push(res.data.data[0]);
          this.$set(this.$data, "trafficData", arr);
        } else {
          return this.$notify({
            message: res.data.msg,
            title: "提示",
            type: "error"
          });
        }
      });
    },
    // 发送实时监控视频请求指令
    channelPlay(row) {
      var src =
        "rtmp://60.10.139.122/live/livestream/" +
        this.vehicleData.sim_id +
        "_" +
        row.logical_channel;
      var data = {};
      var storage = {};
      if (row.state) {
        row.state = false;
        data = {
          MessageID: "x9102",
          SimID: row.sim_id,
          LogicChannel: row.logical_channel,
          ControlCommand: "0",
          CloseType: "0",
          SwitchStream: "0"
        };
        storage = {
          sim_id: row.sim_id,
          MessageID: "stop",
          channel: row.logical_channel,
          rtmp: src
        };
        //全局对象中删除播放对象
        window.monitor.video.delete(row.sim_id + row.logical_channel);
        // 删除
        this.videoData = this.videoData.filter(i => {
          return i.sim_id !== row.sim_id;
        });
        // this.$instructionStorage.send(JSON.stringify(storage));
        this.$instruction.send(JSON.stringify(data));
      } else {
        row.state = true;
        data = {
          MessageID: "x9101",
          SimID: row.sim_id,
          LogicChannel: row.logical_channel,
          DataType: "0",
          CodeStreamType: "0"
        };
        storage = {
          sim_id: row.sim_id,
          MessageID: "start",
          channel: row.logical_channel,
          rtmp: src
        };
        this.video.src = row.sim_id + row.logical_channel;
        window.monitor.video.set(row.sim_id + row.logical_channel, src);
        this.videoData.push({
          sim_id: row.sim_id,
          logical_channel: row.logical_channel
        });
        // this.$instructionStorage.send(JSON.stringify(storage));
        this.$instruction.send(JSON.stringify(data));
      }
    },
    // 分屏按钮
    Uniform(code) {
      switch (code) {
        case 1:
          this.oneType = false;
          this.fourType = true;
          this.sixType = true;
          this.nineType = true;
          this.tenType = true;
          this.sixteenType = true;
          this.videoName = videoOne;
          break;
        case 4:
          this.oneType = true;
          this.fourType = false;
          this.sixType = true;
          this.nineType = true;
          this.tenType = true;
          this.sixteenType = true;
          this.videoName = videoFour;
          break;
        case 6:
          this.oneType = true;
          this.fourType = true;
          this.sixType = false;
          this.nineType = true;
          this.tenType = true;
          this.sixteenType = true;
          this.videoName = videoSix;
          break;
        case 9:
          this.oneType = true;
          this.fourType = true;
          this.sixType = true;
          this.nineType = false;
          this.tenType = true;
          this.sixteenType = true;
          this.videoName = videoNine;
          break;
        case 10:
          this.oneType = true;
          this.fourType = true;
          this.sixType = true;
          this.nineType = true;
          this.tenType = false;
          this.sixteenType = true;
          this.videoName = videoTen;
          break;
        case 16:
          this.oneType = true;
          this.fourType = true;
          this.sixType = true;
          this.nineType = true;
          this.tenType = true;
          this.sixteenType = false;
          this.videoName = videoSixteen;
          break;
      }
    },
    // 查看报警信息
    lookAlarm() {
      this.addKey++;
      this.alarmDialog = true;
    }
  },
  // 关闭页面关闭所有视频请求
  beforeDestroy() {
    var data = {};
    this.videoData.map(item => {
      data = {
        MessageID: "x9102",
        SimID: item.sim_id,
        LogicChannel: item.logical_channel,
        ControlCommand: "0",
        CloseType: "0",
        SwitchStream: "0"
      };
      this.$instruction.send(JSON.stringify(data));
    });
  }
};
</script>
<style>
.color_block {
  padding: 10px 10px;
}
.monitor-tabs .el-tabs__header {
  padding-left: 0 !important;
}
.auxiliary_vice i {
  text-align: center;
  display: inline-block;
  width: 38px;
  height: 38px;
  line-height: 38px;
  font-size: 22px;
}
.auxiliary {
  padding: 15px;
  padding-bottom: 0;
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
  text-align: center;
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
  background-color: #fff;
  text-align: center;
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
  height: 20px;
  line-height: 30px;
  padding: 10px;
}
.video_area .header ul {
  overflow: hidden;
}
.video_area .header ul li {
  float: left;
  margin-left: 5px;
}
</style>