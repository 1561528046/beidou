<template>
  <div>
    <div style=" width:100%; position:absolute;right:0;top:0;bottom:0; z-index:1;" ref="map"></div>
    <div class="structure_tree">
      <div style="margin-top:10px">
        <el-form :model="formData" size="small" label-width="85px" v-loading="searchLoading">
          <el-row>
            <el-col>
              <el-form-item label="终端">
                <el-input v-model="deviceData.device_no" @focus="deviceDialog = true;"></el-input>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="通道号">
                <el-select clearable v-model="formData.channel" style="width:100%">
                  <el-option v-for="item in formData.channelList" :key="item.device_id" :value="item" :label="item"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="时间">
                <el-date-picker
                  style="width:100%"
                  v-model="formData.time"
                  value-format="yyyyMMddHHmmss"
                  :default-time="['00:00:00', '23:59:59']"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="存储位置">
                <el-radio v-model="formData.location" :label="1">服务器</el-radio>
                <el-radio v-model="formData.location" :label="2">终端</el-radio>
              </el-form-item>
            </el-col>
            <el-col v-if="formData.location==2">
              <div>
                <el-form :model="deviceForm" size="small" label-width="85px">
                  <el-row>
                    <el-col>
                      <el-form-item label="报警标志"></el-form-item>
                    </el-col>
                    <el-col>
                      <el-table
                        @select="selectHandler"
                        ref="multipleTable"
                        height="500"
                        :data="alarmData"
                        tooltip-effect="dark"
                        style="width: 100%"
                      >
                        <el-table-column align="center" type="selection" width="55"></el-table-column>
                        <el-table-column align="center" prop="alarm_name" label="报警类型"></el-table-column>
                      </el-table>
                    </el-col>
                    <el-col>
                      <el-form-item label="资源类型">
                        <el-select v-model="deviceForm.type" style="width:100%">
                          <el-option value="0" label="音视频"></el-option>
                          <el-option value="1" label="音频"></el-option>
                          <el-option value="2" label="视频"></el-option>
                          <el-option value="3" label="视频或音视频"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col>
                      <el-form-item label="码流类型">
                        <el-select v-model="deviceForm.stream" style="width:100%">
                          <el-option value="0" label="所有码流"></el-option>
                          <el-option value="1" label="主码流"></el-option>
                          <el-option value="2" label="子码流"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col>
                      <el-form-item label="存储器类型">
                        <el-select v-model="deviceForm.memory" style="width:100%">
                          <el-option value="0" label="所有存储器"></el-option>
                          <el-option value="1" label="主存储器"></el-option>
                          <el-option value="2" label="灾备存储器"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </div>
            </el-col>
            <el-col>
              <el-form-item label-width="0">
                <el-button @click="selectHistory" type="primary">查询</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <div class="video_area">
      <div class="header">
        <ul style="list-style:none;">
          <template v-if="formData.location==1">
            <li v-for="size in [1,4,6,9,10,16]" :key="size">
              <i
                @click="()=>{videoScreenSize = size}"
                style="font-size:33px"
                :style="{color:videoScreenSize==size?'#3697ec':'#000'}"
                :class="'iconfont '+'icon-'+size+'fenge'"
              ></i>
            </li>
          </template>
          <li v-if="formData.location==2">
            <i title="音视频参数设置" @click="setting" style="font-size:30px;cursor:pointer" class="iconfont icon-shezhi2"></i>
          </li>
        </ul>
      </div>
      <div style="margin-top:4px;">
        <video-screen ref="videoScreen" :size="videoScreenSize" :video="video" style="height:580px"></video-screen>
        <!-- 服务器视频列表 -->
        <el-table v-if="formData.location==1" size="mini" :data="fileData" height="178px">
          <el-table-column prop="license" label="车牌号"></el-table-column>
          <el-table-column prop="alarm_type" label="报警状态"></el-table-column>
          <el-table-column prop="video_channel" label="监控通道"></el-table-column>
          <el-table-column prop="begin_time" label="开始时间" :formatter="(row)=>{return this.$utils.formatDate14(row.begin_time)}"></el-table-column>
          <el-table-column prop="end_time" label="结束时间" :formatter="(row)=>{return this.$utils.formatDate14(row.end_time)}"></el-table-column>
          <el-table-column prop="size" label="文件大小/M"></el-table-column>
          <!-- <el-table-column prop="time_length" width="120" label="报警时长/分钟"></el-table-column> -->
          <el-table-column align="center" width="300" label="操作">
            <template slot-scope="scope">
              <el-button @click="addVideo2Screen(1,scope.row)">播放</el-button>
              <el-button @click="addVideo2Screen(1,scope.row,true)">播放关键帧</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 终端视频列表 -->
        <el-table v-if="formData.location==2" size="mini" :data="fileData" height="178px">
          <el-table-column prop="license" label="车牌号"></el-table-column>
          <el-table-column
            prop="WarningMark"
            label="报警状态"
            :formatter="(row)=>{return this.$dict.getAlarm(JSON.stringify(row.WarningMark))}"
          ></el-table-column>
          <el-table-column prop="LogicChannel" label="监控通道"></el-table-column>
          <el-table-column prop="StartTime" label="开始时间" :formatter="(row)=>{return this.$utils.formatDate14(row.StartTime)}"></el-table-column>
          <el-table-column prop="EndTime" label="结束时间" :formatter="(row)=>{return this.$utils.formatDate14(row.EndTime)}"></el-table-column>
          <el-table-column prop="size" label="文件大小/M"></el-table-column>
          <el-table-column prop="device_no" label="终端ID"></el-table-column>
          <el-table-column prop="time_length" width="120" label="报警时长/分钟"></el-table-column>
          <el-table-column prop="address" width="200" label="报警位置"></el-table-column>
          <el-table-column align="center" width="300" prop label="操作">
            <template slot-scope="scope">
              <el-button @click="fileUpload(scope.row)" type="primary" size="small">文件上传</el-button>
              <el-button size="small" :loading="scope.row.state" @click="playback(scope.row)" type="primary">播放</el-button>
              <el-button size="small" :loading="scope.row.state" @click="playback(scope.row,true)" type="primary">播放关键帧</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog :visible.sync="fileDialog" :append-to-body="true" width="65%" title="文件">
      <video-file></video-file>
    </el-dialog>
    <el-dialog :visible.sync="settingDialog" :append-to-body="true" width="40%" title="音视频参数设置">
      <video-setting :type="settingType" :key="addKey"></video-setting>
    </el-dialog>
    <el-dialog :visible.sync="deviceDialog" :append-to-body="true" width="60%" title="选择设备">
      <video-device @choose="callDevice"></video-device>
    </el-dialog>
    <el-dialog :visible.sync="uploadDialog" :append-to-body="true" width="30%" title="文件上传">
      <el-row>
        <el-col v-if="loading">
          <span>任务执行条件</span>
          <el-checkbox-group v-model="taskList">
            <el-checkbox label="2">WIFI</el-checkbox>
            <el-checkbox label="1">LAN</el-checkbox>
            <el-checkbox label="0">3G/4G</el-checkbox>
          </el-checkbox-group>
        </el-col>
        <el-col v-if="loading">
          <el-button size="small" @click="upFile" type="primary">提交</el-button>
        </el-col>
        <el-col v-if="!loading">
          <div style="width:100px;height:100px;margin:0 auto" v-loading="!instructionBtn" element-loading-text="上传中"></div>
        </el-col>
        <el-col v-if="!loading" style="text-align:center">
          <el-button @click="fileControl(0)" v-if="!instructionBtn" size="small" type="primary">暂停</el-button>
          <el-button @click="fileControl(1)" v-if="instructionBtn" size="small" type="primary">继续</el-button>
          <el-button @click="fileControl(2)" size="small" type="danger">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
/*eslint-disable*/
import axios from "axios";
import {
  getChannelByDeviceID,
  getAlarmDetailByPageVedio,
  addVideo,
  getVideoInfo
} from "@/api/index.js";
import { initMap } from "@/utils/map.js";
import moment from "moment";
import videoScreen from "./video/screen/video-screen.vue";
import videoFile from "./video/video-file.vue";
import videoSetting from "./video/video-setting.vue";
import videoDevice from "./video/video-device.vue";
import { location2address, gps2amap } from "@/utils/map-tools.js";
export default {
  components: {
    videoScreen,
    videoFile,
    videoSetting,
    videoDevice
  },
  created() {
    this.$instruction.on("x1205", eve => {
      var data = JSON.parse(eve.data);
      var license = "";
      try {
        license = window.monitor.data.get(data.SimID.substring(1)).license;
      } catch (err) {}
      data.ResourcesLists.map(item => {
        item.StartTime = "20" + item.StartTime;
        item.EndTime = "20" + item.EndTime;
        item.address = "";
        var startTime = moment(item.StartTime, "YYYY-MM-DD HH:mm:ss");
        var endTime = moment(item.EndTime, "YYYY-MM-DD HH:mm:ss");
        item.state = false;
        item.size = (item.FileSize / 1024 / 1024).toFixed(2) || "--";
        item.license = license; //车牌号
        item.time_length = endTime.diff(startTime, "seconds"); //报警时长
        item.device_no = this.deviceData.device_no; //终端id
        // item.FileSize = (item.FileSize / (1024 * 1024)).toFixed(2); //文件大小
        // this.getAlarm(item);
      });
      this.$set(this.$data, "serialNumber", data.SerialNumber); //流水号
      this.$set(this.$data, "fileData", data.ResourcesLists);
    });
    this.$instruction.on("x1206", eve => {
      var data = JSON.parse(eve.data);
      switch (data.Result) {
        case "0":
          this.$notify({
            message: "文件上传成功",
            title: "提示",
            type: "success"
          });
          break;
        case "1":
          this.$notify({
            message: "文件上传失败",
            title: "提示",
            type: "error"
          });
          break;
      }
    });
  },
  data() {
    return {
      searchLoading: false, //查询列表loading
      videoScreenSize: 4, //视频矩阵数量
      videoData: {
        sim_id: "",
        video_channel: "",
        type: "", //音视频类型（1视频，2音频，3照片抓拍）
        from: "", //资源（1自动报警，2手动保存）
        alarm_type: "", //报警类型
        latitude: "", //纬度
        longitude: "", //经度
        size: "", //大小
        time_length: "", //时长
        note: "", //备注
        begin_time: "", //开始时间
        end_time: "", //结束时间
        code_type: "", //码流类型
        storage_type: "" //存储器类型
      },
      formData: {
        time: "",
        type: "1",
        location: 1,
        channelList: [],
        channel: "" //通道信息
      },
      deviceForm: {
        alarmMark: "",
        type: "0",
        stream: "0",
        memory: "0"
      },
      deviceData: {},
      mapData: {
        map: {}
      },
      alarmList: [],
      alarmData: [
        { alarm_id: 63, alarm_name: "紧急报警" },
        { alarm_id: 62, alarm_name: "超速报警" },
        { alarm_id: 61, alarm_name: "疲劳驾驶" },
        { alarm_id: 60, alarm_name: "预警" },
        { alarm_id: 59, alarm_name: "CNSS模块发生故障" },
        { alarm_id: 58, alarm_name: "CNSS天线未接或被剪断" },
        { alarm_id: 57, alarm_name: "CNSS天线短路" },
        { alarm_id: 56, alarm_name: "终端主电源欠压" },
        { alarm_id: 55, alarm_name: "终端主电源掉电" },
        { alarm_id: 54, alarm_name: "终端LCD或显示器故障" },
        { alarm_id: 53, alarm_name: "TTS模块故障" },
        { alarm_id: 52, alarm_name: "摄像头故障" },
        { alarm_id: 45, alarm_name: "当天累计驾驶超时" },
        { alarm_id: 44, alarm_name: "超时停车" },
        { alarm_id: 43, alarm_name: "进出区域" },
        { alarm_id: 42, alarm_name: "进出路线" },
        { alarm_id: 41, alarm_name: "路段行驶时间不足/过长" },
        { alarm_id: 40, alarm_name: "路线偏离报警" },
        { alarm_id: 39, alarm_name: "车辆VSS故障" },
        { alarm_id: 38, alarm_name: "车辆油量异常" },
        { alarm_id: 37, alarm_name: "车辆被盗" },
        { alarm_id: 36, alarm_name: "车辆非法点火" },
        { alarm_id: 35, alarm_name: "车辆非法位移" },
        { alarm_id: 34, alarm_name: "碰撞侧翻报警" },
        { alarm_id: 31, alarm_name: "视频信号丢失报警" },
        { alarm_id: 30, alarm_name: "视频信号遮挡报警" },
        { alarm_id: 29, alarm_name: "存储单元故障报警" },
        { alarm_id: 28, alarm_name: "其他视频设备故障报警" },
        { alarm_id: 27, alarm_name: "客车超员报警" },
        { alarm_id: 26, alarm_name: "异常驾驶行为报警" },
        { alarm_id: 25, alarm_name: "特殊报警录像达到存储阈值报警" }
      ],
      fileData: [],
      alarm_address: [],
      addKey: 0,
      loading: true,
      instructionBtn: false,
      fileDialog: false,
      settingDialog: false,
      deviceDialog: false,
      uploadDialog: false,
      settingType: 0,
      taskList: [], //任务执行条件
      video: {
        src: "",
        type: 2
      },
      videoAll: [],
      fileForm: {},
      serialNumber: "", //流水号
      license: "" //车牌号
    };
  },
  watch: {
    "formData.location": function() {
      this.videoScreenSize = 1;
      this.$set(this.$data, "fileData", []);
      this.clearVideoScreen();
    }
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
    clearVideoScreen() {
      this.$refs.videoScreen.clearScreen();
    },
    addVideo2Screen(location, data, isKeyframe) {
      //视频加入到当前选中的屏幕
      var src = isKeyframe ? data.keyframeSrc : data.src;
      this.$refs.videoScreen.setSources(src, location);
    },
    // 音视频参数设置
    setting() {
      if (!this.deviceData.sim_id) {
        return this.$notify({
          message: "请选择终端",
          title: "提示",
          type: "error"
        });
      } else {
        this.addKey++;
        this.settingDialog = true;
        this.settingType = 1;
        var data = {};
        data = {
          MessageID: "x8106",
          SimID: "0" + this.deviceData.sim_id,
          ParameterId: 117
        };
        this.$instruction.send(JSON.stringify(data));
      }
    },
    // 文件上传
    upFile() {
      this.saveVideo(this.fileForm, 1);
    },
    // 查询报警信息
    getAlarm(row) {
      var alarm_type = row.WarningMark.toString(2);
      var video_alarm_type = "";
      if (alarm_type.length > 31) {
        video_alarm_type = parseInt(
          alarm_type
            .split("")
            .reverse()
            .join("")
            .substr(31)
            .split("")
            .reverse()
            .join(),
          2
        );
        alarm_type = parseInt(alarm_type.substr(32), 2);
      } else {
        alarm_type = parseInt(alarm_type, 2);
        video_alarm_type = 0;
      }
      var data = {};
      data = {
        sim_id: "0" + this.deviceData.sim_id,
        video_channel: row.LogicChannel,
        begin_time: row.StartTime,
        end_time: row.EndTime,
        alarm_type: row.WarningMark,
        video_alarm_type: video_alarm_type
      };
      getAlarmDetailByPageVedio(data).then(res => {
        if (res.data.code == 0) {
          var data = res.data.data;
          if (res.data.data[0]) {
            var loader = this.$loading({
              text: "正在转换坐标"
            });
            //1、gps坐标转高德坐标
            //2、高德坐标转成地址
            gps2amap({
              data: [data[0]],
              longKey: "Longitude",
              latKey: "Latitude"
            })
              .then(res => {
                data.map((item, index) => {
                  item.amap_longitude = res[index].split(",")[0];
                  item.amap_latitude = res[index].split(",")[1];
                });
              })
              .catch(err => {
                loader.close();
                console.error(err);
              })
              .then(() => {
                loader.close();
                loader = this.$loading({
                  text: "正在转换地址"
                });
                location2address({
                  data: data,
                  longKey: "amap_longitude",
                  latKey: "amap_latitude"
                })
                  .then(addressArr => {
                    loader.close();
                    row.address = addressArr[0];
                  })
                  .catch(err => {
                    console.error(err);
                  });
              });
          } else {
            this.alarm_address.push({});
          }
        } else {
          return this.$notify({
            message: res.data.msg,
            title: "提示",
            type: "error"
          });
        }
      });
    },
    // 文件上传
    fileUpload(row) {
      this.uploadDialog = true;
      this.$set(this.$data, "fileForm", row);
    },
    // 文件上传控制
    fileControl(num) {
      switch (num) {
        case 0:
          this.instructionBtn = true;
          break;
        case 1:
          this.instructionBtn = false;
          break;
        case 2:
          this.loading = true;
          this.uploadDialog = false;
          break;
      }
      var data = {};
      data = {
        MessageID: "x9207",
        SimID: "0" + this.deviceData.sim_id,
        SerialNumber: this.serialNumber,
        UploadControl: num
      };
      this.$instruction.send(JSON.stringify(data));
    },
    // 远程录像回放请求
    playback(row, isKeyframe) {
      var src =
        "rtmp://60.10.139.122/live/livestream/" +
        this.deviceData.sim_id +
        "_" +
        row.LogicChannel;
      this.addVideo2Screen(2, { src: src, keyframeSrc: "" }); //视频流加入到当前屏幕中
      this.saveVideo(row, 2, isKeyframe);
    },
    // 远程录像回放控制
    stopback(row) {
      var data = {
        MessageID: "x9202",
        SimID: "0" + this.deviceData.sim_id,
        Channel: row.LogicChannel, //音视频通道号
        PlaybackControl: "2", //回放控制
        Multiple: "0", //快进或快退倍数
        PlaybackPosition: "" //拖动回放位置 时间（YY-MM-DD HH:mm:ss）
      };
      this.$instruction.send(JSON.stringify(data));
    },
    // 保存视频信息
    saveVideo(row, state, isKeyframe) {
      this.videoData.sim_id = "0" + this.deviceData.sim_id;
      this.videoData.video_channel = row.LogicChannel;
      this.videoData.type = row.ResourcesType; //音视频类型（1视频，2音频，3照片抓拍）
      this.videoData.from = "2"; //资源（1自动报警，2手动保存）
      this.videoData.alarm_type = row.WarningMark; //报警类型
      this.videoData.latitude = row.latitude; //纬度
      this.videoData.longitude = row.longitude; //经度
      this.videoData.size = row.FileSize; //大小
      this.videoData.time_length = row.time_length; //时长
      this.videoData.note = ""; //备注
      this.videoData.begin_time = row.StartTime.substr(2); //开始时间
      this.videoData.end_time = row.EndTime.substr(2); //结束时间
      this.videoData.code_type = row.StreamType; //码流类型
      this.videoData.storage_type = row.StorageType; //存储器类型
      addVideo(this.videoData).then(res => {
        if (res.data.code == 0) {
          switch (state) {
            case 1:
              this.loading = false;
              var arr = [0, 0, 0];
              this.taskList.map(item => {
                arr[item] = 1;
              });
              var data = {};
              data = {
                MessageID: "x9206",
                SimID: "0" + this.deviceData.sim_id,
                ServiceIP: "", //服务器地址
                FTPPort: "", //端口
                UserName: "", //用户名
                Password: "", //密码
                UploadPath: "", //文件上传路径
                LogicChannel: this.fileForm.LogicChannel, //逻辑通道号
                StartTime: this.fileForm.StartTime.substr(2), //开始时间
                EndTime: this.fileForm.EndTime.substr(2), //结束时间
                WarningMark: this.fileForm.WarningMark, //报警标志
                ResourcesType: this.fileForm.ResourcesType, //音视频资源类型
                StreamType: this.fileForm.StreamType, //码流类型
                StorageType: this.fileForm.StorageType, //存储位置
                PerformsConditional: parseInt(arr.join(""), 2), //任务执行条件
                FileSize: this.fileForm.FileSize
              };
              this.$instruction.send(JSON.stringify(data));
              break;
            case 2:
              var data = {};
              data = {
                MessageID: "x9201",
                SimID: "0" + this.deviceData.sim_id,
                ServiceIP: "", //服务器IP地址
                TCPPort: "", // 服务器视频通道监听端口（TCP)
                UDPPort: "", // 服务器视频通道监听端口（UDP)
                LogicChannel: row.LogicChannel, // 逻辑通道号
                AudioAndVideoType: row.ResourcesType, // 音视频类型
                CodeStreamType: row.StreamType, // 码流类型
                StorageType: row.StorageType, // 存储器类型
                PlaybackMode: isKeyframe ? "3" : "0", // 回放方式
                Multiple: "0", // 快进或快退倍数
                StartTime: row.StartTime.substr(2), // 开始时间
                EndTime: row.EndTime.substr(2) //结束时间
              };
              this.$instruction.send(JSON.stringify(data));
              break;
          }
        } else {
          return this.$notify({
            message: res.data.msg,
            title: "提示",
            type: "error"
          });
        }
      });
    },
    // 选择报警标志
    selectHandler(selection, row) {
      this.$set(this.$data, "alarmList", selection);
    },
    // 查询录像回放文件列表
    selectHistory() {
      var startTime = "";
      var endTime = "";
      var data = {};
      if (!this.formData.time) {
        this.$message.warning("请选择时间！");
        return false;
      }
      if (!this.deviceData.sim_id || !this.deviceData.device_id) {
        this.$message.warning("请选择设备");
        return false;
      }
      if (!this.formData.channel) {
        this.$message.warning("请选择通道");
        return false;
      }

      startTime = this.formData.time[0].substring(2);
      endTime = this.formData.time[1].substring(2);
      if (this.formData.location == 1) {
        data = {
          sim_id: this.deviceData.sim_id,
          begin_time: moment(this.formData.time[0], "YYYYMMDDHHmmss").format(
            "x"
          ),
          end_time: moment(this.formData.time[1], "YYYYMMDDHHmmss").format("x"),
          video_channel: this.formData.channel
        };
        this.searchLoading = true;
        axios
          .get(this.$dict.VIDEO_REPLAY_URL + "/flvlist", {
            params: data
          })
          .then(res => {
            this.searchLoading = false;
            res.data.map(item => {
              item.video_channel = data.video_channel;
              item.begin_time = item.fileName.replace(".flv", "");
              item.end_time = moment(
                item.lastUpdateTime,
                "YYYYMMDDHHmmss"
              ).format("YYYY-MM-DD HH:mm:ss");
              item.alarm_type = "--";
              item.size = (item.fileSize / 1024 / 1024).toFixed(2);
              item.license = window.monitor.data.get(data.sim_id).license;
              item.keyframeSrc = `${this.$dict.VIDEO_REPLAY_URL}/key/${
                data.sim_id
              }_${data.video_channel}/${item.fileName}`;
              item.src = `${this.$dict.VIDEO_REPLAY_URL}/video/${data.sim_id}_${
                data.video_channel
              }/${item.fileName}`;
            });
            this.$set(this.$data, "fileData", res.data);
          })
          .catch(() => {
            this.searchLoading = false;
          });
      } else if (this.formData.location == 2) {
        var alarm = [];
        for (var i = 0; i < 64; i++) {
          alarm.push(0);
        }
        this.alarmList.map(itam => {
          alarm[itam.alarm_id] = 1;
        });
        alarm = parseInt(alarm.join(""), 2);
        var data = {
          MessageID: "x9205",
          SimID: "0" + this.deviceData.sim_id,
          LogicChannel: this.formData.channel ? this.formData.channel : "0", //逻辑通道号
          StartTime: startTime, //开始时间
          EndTime: endTime, //结束时间
          WarningMark: alarm, //报警标志
          ResourcesType: this.deviceForm.type, //音视频资源类型
          StreamType: this.deviceForm.stream, //码流类型
          StorageType: this.deviceForm.memory //存储器类型
        };
        this.$instruction.send(JSON.stringify(data));
      }
    },
    // 选择设备回调
    callDevice(row) {
      this.deviceDialog = false;
      getChannelByDeviceID({ device_id: row.device_id }).then(res => {
        if (res.data.code == 0) {
          var list = [];
          res.data.data.map(item => {
            list.push(item.logical_channel);
          });
          this.$set(this.formData, "channelList", list);
        } else {
          return this.$notify({
            message: res.data.msg,
            title: "提示",
            type: "error"
          });
        }
      });
      this.$set(this.$data, "deviceData", row);
    },
    // 分屏按钮
    Uniform(code) {
      this.videoScreenSize = code;
    },
    // 查看文件列表信息
    lookFile() {
      this.addKey++;
      this.fileDialog = true;
    },
    // 关闭页面关闭所有视频请求
    beforeDestroy() {
      var data = {};
      this.videoAll.map(item => {
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
.structure_tree {
  padding: 18px;
  padding-top: 0;
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
.video_area .header ul li {
  float: left;
  margin-left: 5px;
}
</style>