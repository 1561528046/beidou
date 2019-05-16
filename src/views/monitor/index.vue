<template>
  <div style="height:100%;position:relative;">
    <div class="monitor-nav">
      <i class="iconfont icon-unorderedlist _header"></i>
      <div class="_list">
        <a href="javascript:;" @click="openTab('track')">
          <i class="iconfont icon-guiji"></i>
          <span>轨迹回放</span>
        </a>
        <a href="javascript:;" @click="openTab('fence')">
          <i class="iconfont icon-weilan"></i>
          <span>围栏管理</span>
        </a>
        <a href="javascript:;" @click="openTab('monitoring')">
          <i class="iconfont icon-shipinjiankong"></i>
          <span>视频监控</span>
        </a>
        <a href="javascript:;" @click="openTab('playback')">
          <i class="iconfont icon-luxiang"></i>
          <span>录像回放</span>
        </a>
      </div>
    </div>
    <el-tabs
      v-model="$store.state.monitor.currentTab"
      style="height:100%;"
      class="monitor-tabs"
      @tab-remove="tabRemove"
    >
      <el-tab-pane label="监控" :closable="false" name="index">
        <div class="monitor">
          <!-- <qa-list></qa-list> -->
          <monitor-info></monitor-info>
          <!-- <div class="shadow-box monitor-map-tools">
            <el-radio-group v-model="mapTools" @change="changeTools" size="small">
              <el-radio-button style="margin:5px;" label="current" title="查找当前终端">查找当前终端</el-radio-button>
              <el-radio-button label="history" title="查找历史终端">查找历史终端</el-radio-button>
            </el-radio-group>
          </div>-->
          <div id="container" style="width:100%;height:100%;"></div>
          <div class="vehicle-search shadow-box">
            <el-autocomplete
              v-model="searchVehicle"
              clearable
              :fetch-suggestions="vehicleSearch"
              placeholder="搜索车辆车牌号"
              @select="vehicleSelected"
              size="small"
              prefix-icon="el-icon-search"
              style="width:100%;"
            ></el-autocomplete>
          </div>
          <transition-group name="list-complete" tag="div" class="current-vehicle-container">
            <vehicle-monitor
              class="list-complete-item"
              @close="removeCurrentVehicle(vehicle.sim_id)"
              v-for="(vehicle,index) in currentVehicles"
              :vehicle="vehicle"
              :index="index"
              :key="vehicle.vehicle_id"
            ></vehicle-monitor>
          </transition-group>

          <el-card
            :body-style="{padding:0 }"
            class="status-container shadow-box"
            @change="toggleUserList"
          >
            <div class="clearfix _header">
              <span class="_global-status" @click.stop="showVehicleAll('total')">
                车辆总数：
                <strong>{{vehicleCount.online + vehicleCount.offline}}</strong>
              </span>
              <span class="_global-status _online" @click.stop="showVehicleAll('online')">
                在线车辆：
                <strong>{{vehicleCount.online}}</strong>
              </span>
              <span class="_global-status _alarm" @click.stop="showVehicleAll('alarm')">
                报警车辆：
                <strong>{{vehicleCount.alarm}}</strong>
              </span>
              <span class="_global-status _offline" @click.stop="showVehicleAll('offline')">
                离线车辆：
                <strong>{{vehicleCount.offline}}</strong>
              </span>
              <span class="_according-arrow" @click.stop="showVehicleWithGroup">
                <i class="el-icon-arrow-right"></i>
              </span>
            </div>

            <!-- <div class="_body">
                <el-form :inline="true" size="mini" class="_search" @submit.native.prevent>
                  <el-form-item label="企业名称">
                    <el-input placeholder="企业名称" v-model="userListQuery.real_name"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" native-type="submit" @click="searchUserList">查询</el-button>
                  </el-form-item>
                </el-form>
                <div class="_table">
                  <el-table
                    :data="userList"
                    size="small"
                    style="width: 100%"
                    @cell-click="showVehicleWithGroup"
                    key="user-table"
                  >
                    <el-table-column prop="user_name" label="用户名称" width="180"></el-table-column>
                    <el-table-column prop="total" label="车辆总数">
                      <template slot-scope="scope">{{scope.row.online + scope.row.offline}}</template>
                    </el-table-column>
                    <el-table-column prop="online" label="在线车辆 "></el-table-column>
                    <el-table-column prop="alarm" label="报警车辆  "></el-table-column>
                    <el-table-column prop="error" label="异常车辆  ">
                    </el-table-column>
                    <el-table-column prop="offline" label="离线车辆 "></el-table-column>
                  </el-table>
                </div>
                <div class="_pager">
                  <el-pagination
                    background
                    layout="prev, pager, next"
                    :total="userListQuery.total"
                    @current-change="userListCurrentChange"
                    :page-size="userListQuery.size"
                  ></el-pagination>
                </div>
            </div>-->
          </el-card>
          <transition name="fade" enter-active-class="fadeInLeft" leave-active-class="fadeOutLeft">
            <vehicle-details
              @instruction="contextmenuInstruction"
              @close="closeShowVehicle"
              @open-single="addSingleVehicle"
              :vehicle="currentGroup"
              :show-vehicle="showVehicle"
            ></vehicle-details>
          </transition>
        </div>
      </el-tab-pane>
      <el-tab-pane
        label="围栏管理"
        :closable="true"
        name="fence"
        v-if="$store.state.monitor.tabs.indexOf('fence') !=-1"
      >
        <vehicle-area></vehicle-area>
      </el-tab-pane>
      <el-tab-pane
        label="报警车辆"
        :closable="true"
        name="alarm"
        v-if="$store.state.monitor.tabs.indexOf('alarm') !=-1"
      >
        <vehicle-alarm
          :vehicle="$store.state.monitor.monitorAlarmVehicle"
          :actived="$store.state.monitor.currentTab=='alarm'"
          :key="$store.state.monitor.monitorAlarmVehicle.sim_id"
        ></vehicle-alarm>
      </el-tab-pane>
      <el-tab-pane
        label="轨迹回放"
        :closable="true"
        name="track"
        v-if="$store.state.monitor.tabs.indexOf('track') !=-1"
      >
        <vehicle-track :vehicle="$store.state.monitor.monitorTrackVehicle"></vehicle-track>
      </el-tab-pane>
      <!-- <el-tab-pane label="数据异常" :closable="true" name="error" v-if="$store.state.monitor.tabs.indexOf('error') !=-1">
        <vehicle-error :vehicle="$store.state.monitor.monitorErrorVehicle"></vehicle-error>
      </el-tab-pane>-->
      <el-tab-pane
        label="媒体列表"
        :closable="true"
        name="media"
        v-if="$store.state.monitor.tabs.indexOf('media') !=-1"
      >
        <vehicle-media :vehicle="$store.state.monitor.monitorMediaVehicle"></vehicle-media>
      </el-tab-pane>
      <!-- 单车标签 -->
      <el-tab-pane
        :label="vehicle.license"
        :closable="true"
        v-for="vehicle in $store.getters.singleVehicles"
        :name="'single-'+vehicle.sim_id"
        :key="'single-'+vehicle.sim_id"
      >
        <vehicle-single :vehicle="vehicle"></vehicle-single>
      </el-tab-pane>
      <el-tab-pane
        label="视频监控"
        :closable="true"
        name="monitoring"
        v-if="$store.state.monitor.tabs.indexOf('monitoring') !=-1"
      >
        <vehicle-monitoring :vehicle="$store.state.monitor.monitorTrackVehicle"></vehicle-monitoring>
      </el-tab-pane>
      <el-tab-pane
        label="录像回放"
        :closable="true"
        name="playback"
        v-if="$store.state.monitor.tabs.indexOf('playback') !=-1"
      >
        <vehicle-playback :vehicle="$store.state.monitor.monitorTrackVehicle"></vehicle-playback>
      </el-tab-pane>
    </el-tabs>
    <el-dialog
      :title="instructionCard.title"
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="instructionCard.show"
      width="50%"
    >
      <div
        :is="instructionCard.component"
        :key="instructionCard.vehicle.sim_id"
        :vehicle="instructionCard.vehicle"
        v-if="instructionCard.vehicle"
      ></div>
    </el-dialog>
    <el-dialog
      @close="down()"
      title="查找当前终端"
      width="25%"
      :visible.sync="currentDialog"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :center="true"
      class="admin-dialog"
    >
      <template>
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="license" label="车牌号"></el-table-column>
        </el-table>
      </template>
    </el-dialog>
    <el-dialog
      @close="down()"
      title="查找历史终端"
      width="40%"
      :visible.sync="historyDialog"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :center="true"
      class="admin-dialog"
    >
      <template>
        <el-form ref="form">
          <el-row>
            <el-col :span="14">
              <el-form-item label="时间">
                <el-date-picker
                  size="small"
                  style="width:80%"
                  v-model="time"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="车牌号">
                <el-button type="primary" @click="vehicleDialog=true" size="small">选择车辆</el-button>
                {{vehicle.license}}
              </el-form-item>
            </el-col>
            <el-col :span="1">
              <el-form-item>
                <el-button size="small" @click="getHistory" type="primary">查询</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-table v-loading="areaLoading" :data="tableHistory" style="width: 100%">
          <el-table-column
            prop="time"
            label="时间"
            :formatter="(row)=>{return this.$utils.formatDate14(JSON.stringify(row.time))}"
          ></el-table-column>
          <el-table-column prop="license" label="车牌号"></el-table-column>
          <el-table-column
            prop
            :formatter="(row)=>{return (row.longitude+','+row.latitude)}"
            label="位置"
          ></el-table-column>
        </el-table>
      </template>
    </el-dialog>
    <el-dialog
      title="选择车辆"
      width="50%"
      :visible.sync="vehicleDialog"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :center="true"
      class="admin-dialog"
    >
      <choose-vehicle @button="bindingVehicle"></choose-vehicle>
    </el-dialog>
  </div>
</template>

<script>
/*eslint-disable*/
import {
  getInitVehicle,
  getUserList,
  getGroupByUser,
  getUser,
  GetRegionByPage,
  GetServerByPage,
  GetVehicleLocation
} from "@/api/index.js";
import { initMap } from "@/utils/map.js";
import { GPS } from "@/utils/map-tools.js";
import chooseVehicle from "@/components/choose-vehicle.vue";
import vehicleMonitor from "./components/vehicle-monitor.vue";
import vehicleDetails from "./components/vehicle-details.vue";
import vehicleSingle from "./components/vehicle-single.vue";
import vehicleArea from "./components/vehicle-area.vue";
import vehicleTrack from "./components/vehicle-track.vue";
import vehicleAlarm from "./components/vehicle-alarm.vue";
import vehiclePlayback from "./components/vehicle-playback.vue";
import vehicleMonitoring from "./components/vehicle-monitoring.vue";
import vehicleMedia from "./components/vehicle-media.vue";
import x8202 from "./components/x8202.vue"; //临时位置跟踪控制
import x8302 from "./components/x8302.vue"; //提问下发
import monitorInfo from "./components/monitor-info.vue"; //提问列表
import x8400 from "./components/x8400.vue"; //电话回拨
import x8401 from "./components/x8401.vue"; //电话本
import x81051 from "./components/x8105-1.vue"; //无限升级
import x81052 from "./components/x8105-2.vue"; //指定服务器
import moment from "moment";
window.monitor = {};
export default {
  name: "monitor",
  components: {
    chooseVehicle,
    vehicleMonitor,
    vehicleDetails,
    vehicleArea,
    vehicleSingle,
    vehicleAlarm,
    vehicleTrack,
    vehicleMedia,
    vehiclePlayback,
    vehicleMonitoring,
    x8202,
    x8302,
    x8400,
    x8401,
    x81051,
    x81052,
    monitorInfo
  },
  data() {
    return {
      mapData: {
        map: {}
      },
      time: "",
      areaLoading: false,
      tableData: [],
      tableHistory: [],
      vehicle: {},
      vehicleDialog: false,
      historyDialog: false,
      currentDialog: false,
      mapTools: "",
      searchVehicle: "",
      initLoader: {},
      currentGroup: {},
      alarmList: {},
      errorList: {},
      onlineList: {},
      offlineList: {},
      userList: [],
      currentVehiclesSet: new Set(), //小地图查看的车SET
      currentVehiclesLog: 0, //触发computed
      instructionCard: {
        component: null,
        show: false,
        title: "",
        vehicle: null
      },
      showVehicle: {
        group: [],
        group_id: "",
        isShow: false,
        isShowAll: false,
        type: "",
        sub_title: ""
      },
      vehicleCount: {
        alarm: 0,
        online: 0,
        offline: 0,
        error: 0
      },
      userListQuery: {
        real_name: "",
        size: 10,
        page: 1,
        total: 0
      }
    };
  },
  computed: {
    currentVehicles: function() {
      void this.currentVehiclesLog;
      return Array.from(this.currentVehiclesSet);
    },
    singleVehicles: function() {
      void this.singleVehiclesLog;
      return Array.from(this.singleVehiclesSet);
    }
  },
  watch: {
    currentDialog: function() {
      if (this.currentDialog) {
        this.getCurrent();
      }
    },
    userList: function() {}
  },
  created() {
    this.init();
    var vm = this;

    //创建全局监控对象
    window.monitor = {
      socketDataWorker: new Worker("/map/worker-socket.js"),
      ws: {
        position: null, //定位ws
        positionHeartInterval: 0 //定位ws心跳interval
        // instruction: null, //指令ws
        // instructionHeartInterval: 0, //指令ws心跳interval
        // promiseList: new Map() //所有指令回复合集
      },
      data: new Map(), //所有数据
      video: new Map(),
      dict: {
        //字典
        gnssCenter: new Map(), //809上级平台字典
        fence: new Map(),
        alarm: new Set(), //报警
        online: new Set(), //在线
        offline: new Set(), //离线
        error: new Set(), //异常
        groups: new Map() //group_id为key value为一个Map对象，包括alarm online offline error4个Set对象以及一个普通对象data 存放group原有信息
      },
      init(data, groups) {
        vm.initLoader.setText("建立数据字典");
        //创建809上级平台字典
        GetServerByPage({
          title: "",
          flag: 809,
          size: 100,
          page: 1
        }).then(res => {
          if (res.data.code == 0) {
            res.data.data.map(item => {
              this.dict.gnssCenter.set(item.access_code, item.title);
            });
          }
        });
        //建立分组字典
        this.initGroupDict(groups);
        //初始化车辆
        //1、车辆放入对应分组、并区分状态
        //2、区分总的在线、离线、报警、异常
        data.map(vehicle => {
          //根据sim_id 创建所有数据集合的MAP对象
          if (vehicle.lng - 0 < vehicle.lat - 0) {
            [vehicle.lng, vehicle.lat] = [vehicle.lat, vehicle.lng];
          }
          vehicle.fence_alarm = {
            alarmList: [], //是否报警（都哪些围栏触发了报警，存放对应key值） 例如 ["inAlarm","lineOut"];可通过循环此数组直接取到报警对象
            inAlarm: [], //禁入报警  如果为true就不做判断了
            outAlarm: [], //禁出报警(只要在符合规范的地区中的一个，就不做判断了)
            lineOut: [], //线路偏移是否报警
            splitPolylineSpeed: [], //分段限速是否报警
            keyPoint: [] //关键点报警
          };
          // vehicle.lat = 36 + Math.random() * 5;
          // vehicle.lng = 115 + Math.random() * 10;
          this.data.set(vehicle.sim_id, vehicle);

          if (vehicle.alarm_count != "0") {
            this.dict.alarm.add(vehicle.sim_id);
            //车辆所对应的分组 均加入记录
            this.setGroupDict(vehicle.group_path, "alarm", vehicle.sim_id);
          }
          if (vehicle.error_count != "0") {
            this.dict.error.add(vehicle.sim_id);
            //车辆所对应的分组 均加入记录
            this.setGroupDict(vehicle.group_path, "error", vehicle.sim_id);
          }
          if (new Date() - new Date(vehicle.time) < vm.$dict.ONLINE_TIMEOUT) {
            vehicle.online = true;
            this.dict.online.add(vehicle.sim_id);
            this.setGroupDict(vehicle.group_path, "online", vehicle.sim_id);
          } else {
            vehicle.online = false;
            this.dict.offline.add(vehicle.sim_id);
            this.setGroupDict(vehicle.group_path, "offline", vehicle.sim_id);
          }
        });
        vm.initLoader.close();
        initMap(() => {
          vm.$nextTick(() => {
            initAMapUI();
            this.initMap();
            //建立围栏字典
            this.initFence();
          });
        });
        monitor.countInterval = setInterval(() => {
          this.setCount();
          // this.setUserCount();
        }, 20);
        this.initWS();
        this.socketDataWorker.onmessage = evt => {
          evt.data.sim_id = parseInt(evt.data.sim_id).toString();
          var position = GPS.gcj_encrypt(evt.data.lat || 0, evt.data.lng || 0); //GPS转高德
          evt.data.lng = position.lon;
          evt.data.lat = position.lat;
          this.setVehicleData(evt.data);
        };
        this.initInstructionListen(); //初始化电子运单/事件报告全局监听
        if (vm.$route.params && vm.$route.params.sim_id) {
          vm.addSingleVehicle(vm.$route.params.sim_id);
        }
      },
      initInstructionListen() {
        //初始化各种组件的指令监听
        vm.$instruction.on("lev2_01", evy => {
          var data = JSON.parse(evt.data);
          var name = "";
          GetVehicleBySIMIDToPaper({ sim_id: data.SimID }).then(res => {
            if (res.data.code == 0) {
              name =
                res.data.data[0].license +
                ":" +
                "平台二级报警" +
                "备注：" +
                data.Value;
            }
          });
          vm.$notify({
            title: "报警通知",
            message: name,
            type: "error"
          });
        });
        vm.$instruction.on("x1004", evt => {
          //主链路关闭
          var data = JSON.parse(evt.data);
          var name =
            this.dict.gnssCenter.get(JSON.stringify(data.MSG_GNSSCENTERID)) ||
            "";
          vm.$notify({
            title: "链路通知",
            message: name + "主链路关闭",
            type: "warning",
            duration: 0
          });
        });
        vm.$instruction.on("x9007", evt => {
          //主链路关闭
          var data = JSON.parse(evt.data);
          var name =
            this.dict.gnssCenter.get(JSON.stringify(data.MSG_GNSSCENTERID)) ||
            "";
          vm.$notify({
            title: "链路通知",
            message: name + "从链路关闭",
            type: "warning",
            duration: 0
          });
        });
        vm.$instruction.on("x9008", evt => {
          //主链路关闭
          var data = JSON.parse(evt.data);
          var name =
            this.dict.gnssCenter.get(JSON.stringify(data.MSG_GNSSCENTERID)) ||
            "";
          vm.$notify({
            title: "链路通知",
            message: name + "主从连路即将关闭",
            type: "warning",
            duration: 0
          });
        });

        vm.$instruction.on("x9200", evt => {
          //809 9200
          var data = JSON.parse(evt.data);
          vm.$store.commit("x809In/add", data);
        });

        vm.$instruction.on("x9400", evt => {
          //809 9400
          var data = JSON.parse(evt.data);
          vm.$store.commit("x809In/add", data);
        });

        vm.$instruction.on("x9300", evt => {
          //809 x9300
          var data = JSON.parse(evt.data);
          vm.$store.commit("x809In/add", data);
        });

        vm.$instruction.on("x0900", evt => {
          //上行透传
          var data = JSON.parse(evt.data);
          var sim_id = vm.$utils.unFormatSim(data.SimID);
          if (this.data.has(sim_id)) {
            //如果有当前车辆的监控权限,发送数据到$store
            vm.$store.commit("x0900/add", data);
          }
        });

        vm.$instruction.on("x0701", evt => {
          //电子运单数据
          var data = JSON.parse(evt.data);
          var sim_id = vm.$utils.unFormatSim(data.SimID);
          if (this.data.has(sim_id)) {
            //如果有当前车辆的监控权限,发送数据到$store
            vm.$store.commit("x0701/add", data);
          }
        });
        vm.$instruction.on("x0702", evt => {
          //驾驶员信息上报处理（插入司机卡设备会发送该消息）； 存入监控车辆数据中
          var data = JSON.parse(evt.data);
          var sim_id = vm.$utils.unFormatSim(data.SimID);
          if (this.data.has(sim_id)) {
            var vehicle = this.data.get(sim_id);
            vehicle.driver = data;
            vm.$set(vehicle);
          }
        });
        vm.$instruction.on("x0901", evt => {
          //数据压缩上报
          var data = JSON.parse(evt.data);
          var sim_id = vm.$utils.unFormatSim(data.SimID);
          if (this.data.has(sim_id)) {
            //如果有当前车辆的监控权限,发送数据到$store
            vm.$store.commit("x0901/add", data);
          }
        });
        vm.$instruction.on("x0500", evt => {
          //车辆控制应答数据，通过PositionReport（0200）状态位State 判断枷锁解锁是否成功
          var data = JSON.parse(evt.data);
          var sim_id = vm.$utils.unFormatSim(data.SimID);
          if (this.data.has(sim_id)) {
            this.data.get(sim_id).state = JSON.parse(data.PositionReport).State;
          }
        });

        vm.$instruction.on("x0301", evt => {
          //事件上报数据
          var data = JSON.parse(evt.data);
          var sim_id = vm.$utils.unFormatSim(data.SimID);
          if (this.data.has(sim_id)) {
            //如果有当前车辆的监控权限,发送数据到$store
            vm.$store.commit("x0301/add", data);
          }
        });
        vm.$instruction.on("x0303", evt => {
          //信息点播数据
          var data = JSON.parse(evt.data);
          var sim_id = vm.$utils.unFormatSim(data.SimID);
          if (this.data.has(sim_id)) {
            //如果有当前车辆的监控权限,发送数据到$store
            vm.$store.commit("x0303/add", data);
          }
        });
        vm.$instruction.on("x0800", evt => {
          //多媒体数据信息上传
          var data = JSON.parse(evt.data);
          var sim_id = vm.$utils.unFormatSim(data.SimID);
          if (this.data.has(sim_id)) {
            //如果有当前车辆的监控权限,发送数据到$store
            vm.$store.commit("x0800/add", data);
          }
        });
      },
      initWS() {
        var ws = this.ws;
        window.ws = ws;
        clearInterval(ws.positionHeartInterval);
        ws.position = new WebSocket(vm.$dict.MONITOR_URL);
        ws.position.binaryType = "arraybuffer";
        ws.position.onopen = () => {
          var userInfo = JSON.parse(localStorage.getItem("BEIDOU"));
          ws.position.send(
            JSON.stringify({
              MessageID: "login",
              user_name: userInfo.user_name,
              pass_word: userInfo.pass_word
            })
          );
          ws.positionHeartInterval = setInterval(() => {
            if (ws.position.readyState == 1) {
              ws.position.send('{"MessageID":"heart"}');
            }
          }, 20000);
        };
        ws.position.onmessage = evt => {
          this.socketDataWorker.postMessage(new Uint8Array(evt.data));
        };
        ws.position.onclose = () => {
          setTimeout(() => {
            this.initWS();
          }, 10000);
        };
      },
      initFence() {
        //请求围栏数据
        GetRegionByPage({
          page: 1,
          size: 9999
        }).then(res => {
          if (res.data.code == 0) {
            res.data.data.map(fence => {
              switch (fence.Type) {
                case "1": //区域类型：1自定义圆形，2自定义矩形，3自定义多边形，4行政区域
                  fence.polygon = new AMap.Circle({
                    center: new AMap.LngLat(
                      fence.CenterLongitude,
                      fence.CenterLatitude
                    ),
                    radius: fence.Radius
                  });
                  break;
                case "2":
                  fence.ring = [
                    [fence.LeftTopLongitude, fence.LeftTopLatitude],
                    [fence.LeftTopLongitude, fence.RightBottomLatitude],
                    [fence.RightBottomLongitude, fence.LeftTopLatitude],
                    [fence.RightBottomLongitude, fence.RightBottomLatitude]
                  ];
                  break;
                case "3":
                  fence.ring = [];
                  var arrLats = fence.Latitude.split(",");
                  fence.Longitude.split(",").map((item, index) => {
                    fence.ring.push([item, arrLats[index]]);
                  });
                  break;
                case "4":
                  var rings = fence.rings;
                  fence.rings = [];
                  rings.split(";").map((ring, index) => {
                    fence.rings.push(
                      ring.split(",").map(item => {
                        return item.split(" ");
                      })
                    );
                  });
                  break;
                case "6": //关键点
                  fence.polygon = new AMap.Circle({
                    center: new AMap.LngLat(
                      fence.CenterLongitude,
                      fence.CenterLatitude
                    ),
                    radius: fence.Radius
                  });
                  break;
              }

              this.dict.fence.set(fence.RegionId, fence);
            });
          }
        });
      },
      checkFence(vehicleData) {
        //检测围栏 inoutAlarm
        // Region==fence 围栏
        //AreaProperty 3禁入 5禁出
        //StartTime ` EndTime 限制时间
        //Type 区域类型：1自定义圆形，2自定义矩形，3自定义多边形，4行政区域,5分段限速,6关键点 7线路偏移
        var sim_id = vehicleData.sim_id;
        var vehicle = this.data.get(sim_id);
        var isInSafeArea = false; //是否在安全区(因驶出可同时存在多可，所以只做一个判断)
        var isInSafeLine = false; //是否在安全线路内行驶（多条线路偏移围栏时，如果车辆正常行驶在某围栏其中的一个线段内，其他不做判断）
        if (!vehicle.fence_ids) {
          return false;
        }
        var fenceResult = {
          alarmList: [], //是否报警（都哪些围栏触发了报警，存放对应key值） 例如 ["inAlarm","lineOut"];可通过循环此数组直接取到报警对象
          inAlarm: [], //禁入报警  如果为true就不做判断了
          outAlarm: [], //禁出报警(只要在符合规范的地区中的一个，就不做判断了)
          lineOut: [], //线路偏移是否报警
          splitPolylineSpeed: [], //分段限速是否报警
          keyPoint: [] //关键点报警
        };
        vehicle.fence_ids.map(fence_id => {
          if (this.dict.fence.has(fence_id)) {
            var fence = this.dict.fence.get(fence_id);
            // if (
            //   fenceResult.inAlarm.length &&
            //   fence.AreaProperty == "3" &&
            //   fence.Type <= 4
            // ) {
            //   //禁入报警  如果为true就不做判断了
            //   return false;
            // }
            // if (isInSafeArea && fence.AreaProperty == "5" && fence.Type <= 4) {
            //   //禁出报警(只要有符合一个围栏规范，就不做判断了)
            //   return false;
            // }

            // if (fenceResult.splitPolylineSpeed.length && fence.Type == "5") {
            //   //分段线路只做一次判断
            //   return false;
            // }

            // if (
            //   fenceResult.lineOut.length &&
            //   fence.Type == "7" &&
            //   isInSafeLine == false
            // ) {
            //   //线路偏移 只做一次判断
            //   return false;
            // }

            //先判断围栏生效时间
            var startSetting = [],
              endSetting = [];
            if (
              fence.StartTime &&
              fence.EndTime &&
              parseInt(fence.StartTime) > 0 &&
              parseInt(fence.EndTime) > 0
            ) {
              startSetting = vm.$utils
                .formatDateBCD(fence.StartTime)
                .split(" ")[1]
                .split(":"); //000000161211
              endSetting = vm.$utils
                .formatDateBCD(fence.EndTime)
                .split(" ")[1]
                .split(":");
            }
            if (startSetting.length == 3 && endSetting.length == 3) {
              var start = new Date().setHours(
                startSetting[0],
                startSetting[1],
                startSetting[2]
              );
              var end = new Date().setHours(
                endSetting[0],
                endSetting[1],
                endSetting[2]
              );
              var now = new Date(vehicleData.time);
              if ((start < now && end > now) == false) {
                //如果不在范围时间内
                return false;
              }
            }
            var isInArea = false;
            var point = new AMap.LngLat(vehicleData.lng, vehicleData.lat);
            switch (fence.Type) {
              case "1":
                isInArea = fence.polygon.contains(point);
                break;
              case "2":
                isInArea = AMap.GeometryUtil.isPointInRing(point, fence.ring);
                break;
              case "3":
                isInArea = AMap.GeometryUtil.isPointInRing(point, fence.ring);
                break;
              case "4":
                isInArea = AMap.GeometryUtil.isPointInPolygon(
                  point,
                  fence.rings
                );
                break;
              case "5": //分段限速
                if (
                  this.checkFenceSplitPolylineSpeed(fence, point, vehicleData)
                ) {
                  fenceResult.splitPolylineSpeed.push(fence);
                  if (!fenceResult.alarmList.includes("splitPolylineSpeed")) {
                    fenceResult.alarmList.push("splitPolylineSpeed");
                  }
                }
                break;
              case "6": //关键点
                if (fence.polygon.contains(point)) {
                  if (fence.AreaProperty == 3) {
                    //未离开
                    fenceResult.keyPoint.push(fence);
                    if (!fenceResult.alarmList.includes("keyPoint")) {
                      fenceResult.alarmList.push("keyPoint");
                    }
                  }
                } else {
                  if (fence.AreaProperty == 5) {
                    //未到达
                    fenceResult.keyPoint.push(fence);
                    if (!fenceResult.alarmList.includes("keyPoint")) {
                      fenceResult.alarmList.push("keyPoint");
                    }
                  }
                }
                break;
              case "7": //线路偏移
                if (this.checkFenceLineOut(fence, point, vehicleData)) {
                  fenceResult.lineOut.push(fence);
                  if (!fenceResult.alarmList.includes("lineOut")) {
                    fenceResult.alarmList.push("lineOut");
                  }

                  isInSafeLine = true;
                }
                break;
            }
            if (fence.Type <= 4 && fence.AreaProperty == "3") {
              if (isInArea) {
                fenceResult.inAlarm.push(fence);
                if (!fenceResult.alarmList.includes("inAlarm")) {
                  fenceResult.alarmList.push("inAlarm");
                }
              }
            }
            if (fence.Type <= 4 && fence.AreaProperty == "5") {
              if (!isInArea) {
                fenceResult.outAlarm.push(fence);
                // isInSafeArea = isInArea;
                if (!fenceResult.alarmList.includes("outAlarm")) {
                  fenceResult.alarmList.push("outAlarm");
                }
              }
            }
          }
        });
        return fenceResult;
      },
      checkFenceSplitPolylineSpeed(fence, point, vehicleData) {
        //分段限速判断
        var result = false;
        for (var i = 0, len = fence.TurnPoints.length - 1; i < len; i++) {
          var points = fence.TurnPoints;
          var line = [
            [points[i].TurnPointLongitude, points[i].TurnPointLatitude],
            [points[i + 1].TurnPointLongitude, points[i + 1].TurnPointLatitude]
          ];
          if (
            AMap.GeometryUtil.isPointOnLine(
              point,
              line,
              points[i].RouteSegmentWidth
            )
          ) {
            //如果在某个线段上，开始判断速度
            if (points[i].MaxSpeedLimited < vehicleData.speed) {
              // console.log("超速!");
              result = true;
            }
            break;
          }
        }
        return result;
      },
      checkFenceKeyPoint(fence, point) {
        //关键点
      },
      checkFenceLineOut(fence, point) {
        //线路偏移
        var result = true;
        for (var i = 0, len = fence.TurnPoints.length - 1; i < len; i++) {
          var points = fence.TurnPoints;
          var line = [
            [points[i].TurnPointLongitude, points[i].TurnPointLatitude],
            [points[i + 1].TurnPointLongitude, points[i + 1].TurnPointLatitude]
          ];
          if (
            AMap.GeometryUtil.isPointOnLine(
              point,
              line,
              points[i].RouteSegmentWidth
            )
          ) {
            // 如果在其中任意一个线段中，即未偏移，否则就是偏移线路
            result = false;
            break;
          }
        }
        return result;
      },
      initGroupDict(groups) {
        //后台接口、根据当前用户分组 获取所有分组（平铺）
        groups.map(group => {
          var groupVehicleMap = new Map();
          groupVehicleMap.set("alarm", new Set());
          groupVehicleMap.set("online", new Set());
          groupVehicleMap.set("offline", new Set());
          groupVehicleMap.set("error", new Set());
          groupVehicleMap.set("data", group);
          this.dict.groups.set(group.group_id.toString(), groupVehicleMap);

          var otherGroupVehicleMap = new Map();
          otherGroupVehicleMap.set("alarm", new Set());
          otherGroupVehicleMap.set("online", new Set());
          otherGroupVehicleMap.set("offline", new Set());
          otherGroupVehicleMap.set("error", new Set());
          this.dict.groups.set(
            "other" + group.group_id.toString(),
            otherGroupVehicleMap
          ); //未分配车辆分组
        });
      },
      setGroupDict(groups, status, sim_id) {
        //传入groups 可以是String Array （String自动转为Array）
        //status 状态类表 alarm online offline error
        if (typeof groups == "string") {
          groups = [groups];
        }
        if (!groups.length) {
          return false;
        }
        var groupDict = this.dict.groups;
        groups.map(groups_id => {
          if (groups_id) {
            var group = groupDict.get(groups_id.toString());
            if (group) {
              group.get(status).add(sim_id);
            }
          }
        });
        //处理未分配车辆
        var lastGroupId = groups[groups.length - 1];
        var lastGroup = groupDict.get("other" + lastGroupId.toString());
        if (lastGroup) {
          lastGroup.get(status).add(sim_id);
        }
      },
      deleteGroupDict(groups, status, sim_id) {
        //传入groups 可以是String Array （String自动转为Array）
        //status 状态类表 alarm online offline error
        if (typeof groups == "string") {
          groups = [groups];
        }
        if (!groups.length) {
          return false;
        }
        var groupDict = this.dict.groups;
        groups.map(groups_id => {
          if (groups_id) {
            var group = groupDict.get(groups_id.toString());
            if (group) {
              group.get(status).delete(sim_id);
            }
          }
        });
        //处理未分配车辆
        var lastGroupId = groups[groups.length - 1];
        var lastGroup = groupDict.get("other" + lastGroupId.toString());
        if (lastGroup) {
          lastGroup.get(status).delete(sim_id);
        }
      },
      initMap() {
        var map = new AMap.Map("container", {
          mapStyle: "amap://styles/eca30d0b0912c5e6154b32dd369f8524",
          //viewMode: "3D",
          //pitch: 55,
          // rotation: -45,
          // features: ["bg", "road"],
          zoom: 5
        });
        vm.$set(vm.mapData, "map", map);
        map.plugin(["AMap.MouseTool"], function() {
          var mouseTool = new AMap.MouseTool(map);
          vm.$set(vm.mapData, "mouseTool", mouseTool);
          var overlays = [];
          mouseTool.on("draw", function(e) {
            var Rectangle = e.obj.getOptions();
            overlays[0] = Rectangle;
            if (vm.mapTools == "current") {
              vm.currentDialog = true;
            } else if (vm.mapTools == "history") {
              vm.historyDialog = true;
            }
            // e.obj.hide();
          });
          vm.$set(vm.mapData, "overlays", overlays);
        });
        AMapUI.load(
          ["ui/geo/DistrictCluster", "lib/$"],
          (DistrictCluster, $) => {
            var distCluster = new DistrictCluster({
              map: map, //所属的地图实例
              zIndex: 11,
              autoSetFitView: false,
              getPosition: function(item) {
                return [item.lng, item.lat];
              }
            });
            var tmpArr = [];
            for (let key of monitor.dict.online) {
              tmpArr.push(monitor.data.get(key));
            }
            distCluster.setData(tmpArr);
            setInterval(() => {
              this.checkOffline();
              tmpArr = [];
              for (let key of monitor.dict.online) {
                tmpArr.push(monitor.data.get(key));
              }
              distCluster.setData(tmpArr);
            }, 15000);
          }
        );
      },
      checkOffline() {
        //检测离线
        // console.log("检测离线");
        for (let key of this.dict.online) {
          let vehicleData = this.data.get(key);
          if (
            new Date() - new Date(vehicleData.time) >
            vm.$dict.ONLINE_TIMEOUT
          ) {
            this.setOffline(vehicleData);
            // console.log("设置" + key + "离线");
          }
        }
        // console.log("检测离线完成");
      },
      setUserCount() {
        vm.userList.map(user => {
          var groupDict = this.dict.groups.get(user.group_id);
          user.alarm = groupDict.get("alarm").size;
          user.online = groupDict.get("online").size;
          user.offline = groupDict.get("offline").size;
          user.error = groupDict.get("error").size;
        });
      },
      setVehicleData(vehicleData) {
        //设置车辆定位信息
        if (this.data.has(vehicleData.sim_id)) {
          var vehicle = this.data.get(vehicleData.sim_id);
          if (!vehicleData.inoutAlarm) {
            vehicle.inoutAlarm = {};
          }
          if (!vehicleData.overSpeedPositionType) {
            vehicle.overSpeedPositionType = "";
          }
          if (!vehicleData.overSpeedAreaId) {
            vehicle.overSpeedAreaId = "";
          }
          if (!vehicleData.runTimeAlarm) {
            vehicle.runTimeAlarm = {};
          }
          var fence_alarm = this.checkFence(vehicleData);
          if (
            vehicleData.alarm != "0" ||
            vehicleData.alarm != "" ||
            fence_alarm.alarmList.length ||
            vehicleData.alarm != "0" ||
            vehicleData.alarm != "" ||
            vehicleData.additional0X64 ||
            vehicleData.additional0X65
          ) {
            //进出围栏报警、或者车机自身报警加入到监控对象列表中，以及报警的store中
            this.setAlarm(vehicleData);
            vm.$store.commit("alarm/add", vehicleData);
          }
          //设置围栏报警数据
          vm.$set(vehicle, "fence_alarm", fence_alarm);
          vm.$set(vehicle, "additional0X64", vehicleData.additional0X64);
          vm.$set(vehicle, "additional0X65", vehicleData.additional0X65);

          if (
            new Date() - new Date(vehicleData.time) <
            vm.$dict.ONLINE_TIMEOUT
          ) {
            this.setOnline(vehicleData);
          } else {
            this.setOffline(vehicleData);
          }
        }
      },
      setOnline(vehicle) {
        //离线中删除、加入在线字典
        var vehicleData = this.data.get(vehicle.sim_id);
        if (vehicleData) {
          vehicleData.online = true;
        }
        Object.assign(vehicleData, vehicle);
        this.dict.offline.delete(vehicle.sim_id);
        this.dict.online.add(vehicle.sim_id);
        var groups = this.data.get(vehicle.sim_id).group_path;
        this.setGroupDict(groups, "online", vehicle.sim_id);
        this.deleteGroupDict(groups, "offline", vehicle.sim_id);
      },
      setOffline(vehicle) {
        var vehicleData = this.data.get(vehicle.sim_id);
        if (vehicleData) {
          vehicleData.online = false;
        }
        this.dict.online.delete(vehicle.sim_id);
        this.dict.offline.add(vehicle.sim_id);
        var groups = this.data.get(vehicle.sim_id).group_path;
        this.setGroupDict(groups, "offline", vehicle.sim_id);
        this.deleteGroupDict(groups, "online", vehicle.sim_id);
      },
      setCount() {
        vm.vehicleCount.online = this.dict.online.size;
        vm.vehicleCount.offline = this.dict.offline.size;
        vm.vehicleCount.error = this.dict.error.size;
        vm.vehicleCount.alarm = this.dict.alarm.size;
      },
      setAlarm(vehicleData) {
        var vehicle = this.data.get(vehicleData.sim_id);
        vehicle.alarm_count = parseInt(vehicle.alarm_count || 0) + 1;
        this.dict.alarm.add(vehicle.sim_id);
        var groups = vehicle.group_path;
        this.setGroupDict(groups, "alarm", vehicle.sim_id);
      }
    };
  },

  methods: {
    according() {
      this.showVehicle.type = type;
      this.showVehicle.isShowAll = true;
      this.showVehicle.isShow = true;
      this.showVehicle.group_id = "";
    },
    bindingVehicle(scope) {
      this.vehicleDialog = false;
      this.$set(this.$data, "vehicle", scope.row);
    },
    changeTools(name) {
      switch (name) {
        case "current":
          this.mapData.mouseTool.rectangle({
            fillColor: "#00b0ff",
            strokeColor: "#80d8ff"
            //同Polygon的Option设置
          });
          break;
        case "history":
          this.mapData.mouseTool.rectangle({
            fillColor: "#00b0ff",
            strokeColor: "#80d8ff"
            //同Polygon的Option设置
          });
          break;
      }
    },
    // 查找当前终端
    getCurrent() {
      var vehicle = Array.from(monitor.data.values());
      var ring = [];
      var isPointInRing = "";
      this.mapData.overlays[0].path.map(itam => {
        ring.push(new AMap.LngLat(itam.lng, itam.lat));
      });
      vehicle.map(item => {
        var point = [];
        point = new AMap.LngLat(item.lng, item.lat);
        isPointInRing = AMap.GeometryUtil.isPointInRing(point, ring);
        if (isPointInRing) {
          this.tableData.push(item);
        }
      });
    },
    // 查找历史终端
    getHistory() {
      this.$set(this.$data, "areaLoading", true);
      if (this.time == "" || this.time == null) {
        return this.$notify({
          message: "请选择时间",
          title: "提示",
          type: "error"
        });
      }
      if (this.vehicle.license == undefined) {
        return this.$notify({
          message: "请选择车辆",
          title: "提示",
          type: "error"
        });
      }
      var vehicle = Array.from(monitor.data.values());
      var ring = [];
      var isPointInRing = "";
      this.mapData.overlays[0].path.map(itam => {
        ring.push(new AMap.LngLat(itam.lng, itam.lat));
      });
      var data = {};
      data = {
        sim_id: this.vehicle.sim_id,
        start_time: moment(this.time[0]).format("YYYYMMDDHHmmss"),
        stop_time: moment(this.time[1]).format("YYYYMMDDHHmmss"),
        filter_position: 1,
        filter_invalid: 1
      };
      GetVehicleLocation(data).then(res => {
        if (res.data.code == 0) {
          this.$set(this.$data, "areaLoading", false);
          res.data.data.map(itcm => {
            var point = [];
            point = new AMap.LngLat(itcm.longitude, itcm.latitude);
            isPointInRing = AMap.GeometryUtil.isPointInRing(point, ring);
            if (isPointInRing) {
              this.tableHistory.push(itcm);
              return;
            }
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

    // 关闭回调
    down() {
      this.mapData.mouseTool.close(true);
      this.tableData = [];
      this.time = "";
      this.tableData = [];
      this.tableHistory = [];
      this.vehicle = {};
      this.vehicleDialog = false;
      this.historyDialog = false;
      this.currentDialog = false;
      this.mapTools = "";
    },
    init() {
      this.initLoader = this.$loading({ text: "初始化分组数据" });
      getGroupByUser()
        .then(res => {
          this.initVehicle(res.data.data);
        })
        .catch(err => {
          this.initLoader.close();
          this.$alert("初始化分组失败！");
        });
    },
    contextmenuInstruction({ instruction, sim_id }) {
      var instructionArr = instruction.split("|");
      if (instructionArr[0] == "x8A00") {
        //发送公钥
        var obj = {
          SimID: this.$utils.formatSim(sim_id),
          MessageID: "x8A00"
        };
        this.$instruction.send(JSON.stringify(obj));
        this.$instruction.once("x8A00", evt => {
          var data = JSON.parse(evt.data);
          if (data.code == 0) {
            this.$message.success("下发成功");
          } else {
            this.$message.warning("下发失败");
          }
        });
        return false;
      }
      if (instructionArr[0] == "x8500") {
        //无需设置、直接发送的命令车门解锁、上锁
        var obj = {
          SimID: this.$utils.formatSim(sim_id),
          MessageID: "x8500",
          ControlFlag: instructionArr[1]
        };
        this.$instruction.send(JSON.stringify(obj));
        this.$instruction.once("x8500", evt => {
          var data = JSON.parse(evt.data);
          if (data.code == 0) {
            this.$message.success("下发成功");
          } else {
            this.$message.warning("下发失败");
          }
        });
        return false;
      }
      if (instructionArr[0] == "x8105" && instructionArr[1] > 2) {
        //终端控制
        var obj = {
          SimID: this.$utils.formatSim(sim_id),
          MessageID: "x8105",
          CommandWord: instructionArr[1],
          CommandParameters: ""
        };
        this.$instruction.send(JSON.stringify(obj));
        this.$instruction.once("x8105", evt => {
          var data = JSON.parse(evt.data);
          if (data.code == 0) {
            this.$message.success("下发成功");
          } else {
            this.$message.warning("下发失败");
          }
        });
        return false;
      }
      if (instructionArr[0] == "x8201") {
        sim_id = this.$utils.formatSim(sim_id);
        this.$instruction.send(
          JSON.stringify({
            SimID: sim_id,
            MessageID: "x8201"
          })
        );
        return false;
      }
      if (instructionArr[0] == "x8802") {
        this.$store.commit(
          "setMonitorMediaVehicle",
          window.monitor.data.get(sim_id)
        );
        return false;
      }
      switch (instructionArr[0]) {
        case "x8202":
          this.instructionCard.title = "临时位置跟踪";
          this.instructionCard.component = x8202;
          break;
        case "x8302":
          this.instructionCard.title = "提问下发";
          this.instructionCard.component = x8302;
          break;
        case "x8401":
          this.instructionCard.title = "电话本";
          this.instructionCard.component = x8401;
          break;
        case "x8400":
          this.instructionCard.title = "电话回拨";
          this.instructionCard.component = x8400;
          break;
        case "x8105":
          if (instructionArr[1] == 1) {
            this.instructionCard.title = "无线升级";
            this.instructionCard.component = x81051;
          } else {
            this.instructionCard.title = "指定服务器";
            this.instructionCard.component = x81052;
          }
          break;
      }
      this.instructionCard.show = true;
      this.instructionCard.vehicle = monitor.data.get(sim_id);
    },
    initVehicle(groups) {
      this.initLoader.setText("初始化车辆数据");
      getInitVehicle()
        .then(res => {
          var res2 = [];
          res.data.data.map(item => {
            var position = GPS.gcj_encrypt(item[5] || 0, item[4] || 0); //GPS转高德
            res2.push({
              sim_id: item[0],
              license: item[1],
              device_id: item[2],
              time: this.$utils.formatDate14(item[3]), //最后定位时间
              lng: position.lon, //最后一次定位的经度
              lat: position.lat, //最后一次定位的纬度
              alarm_count: parseInt(item[6] || 0), //当天报警次数
              error_count: parseInt(item[7] || 0), //当天异常次数
              vehicle_id: item[8],
              group_path: item[10], //车辆对应分组路径 [path1,path2,path3....]
              fence_ids: item[9] ? item[9].split(",") : [], //围栏ID列表
              fence_alarm: {}, //围栏报警信息
              speed: 0,
              speed1: 0,
              alarm: 0,
              altitude: 0, //高程
              angle: "", //方向
              wifiSignal: "", //信号强度
              GNSSCount: "", //卫星数
              inoutAlarm: [], //进出区域报警
              mileage: "", //总里程
              address: "",
              state: "",
              oil: "",
              alarmId: "",
              overSpeedPositionType: "",
              overSpeedAreaId: "",
              runTimeAlarm: {
                routeID: "",
                time: "",
                type: ""
              },
              vehicleSignal: "",
              IO: "",
              analog: ""
            });
          });
          window.monitor.init(res2, groups);
        })
        .catch(err => {
          this.initLoader.close();
          this.$alert("初始化车辆失败！");
          console.error(err);
        });
    },

    showVehicleWithGroup() {
      //根据分组显示车辆
      this.showVehicle.type = "total";
      this.showVehicle.isShowAll = false;
      this.showVehicle.isShow = true;
      this.showVehicle.group_id = 2;
    },
    showVehicleAll(type) {
      //显示平台总数车辆
      this.showVehicle.type = type;
      this.showVehicle.isShowAll = true;
      this.showVehicle.isShow = true;
      this.showVehicle.group_id = "";
      // this.showVehicle.sub_title = "全平台";
    },
    closeShowVehicle() {
      this.showVehicle.type = "";
      this.showVehicle.isShowAll = false;
      this.showVehicle.isShow = false;
      this.showVehicle.group_id = "";
      this.showVehicle.sub_title = "";
    },
    toggleUserList(current) {
      if (current != "") {
        this.getUserList();
      } else {
        this.$set(this.$data, "userList", []);
      }
    },
    searchUserList() {
      this.userListQuery.page = 1;
      this.getUserList();
    },
    getUserList() {
      var query = Object.assign({}, this.userListQuery);
      if (query.page == 1) {
        getUser({ user_id: this.$store.state.user.user_id })
          .then(res => {
            if (res.data.code == 0) {
              this.getUserChildrenList(query, res.data.data[0]);
            }
          })
          .catch(err => {
            this.$message.error("获取当前登录用户信息出错！");
            console.warn(err);
          });
      } else {
        this.getUserChildrenList(query);
      }
    },
    getUserChildrenList(query, currentUser) {
      getUserList(query)
        .then(res => {
          if (res.data.code == 0) {
            if (query.page == 1) {
              res.data.data.splice(0, 0, currentUser);
            }

            res.data.data.map(user => {
              user.total = 0;
              user.alarm = 0;
              user.online = 0;
              user.offline = 0;
              user.error = 0;
            });

            this.$set(this.$data, "userList", res.data.data);
            this.userListQuery.total = res.data.total || 0;
          } else {
            this.$set(this.$data, "userList", []);
            this.userListQuery.total = 0;
            this.userListQuery.page = 1;
          }
        })
        .catch(() => {});
    },
    userListCurrentChange(val) {
      this.userListQuery.page = val;
      this.getUserList();
    },
    vehicleSearch(queryString, cb) {
      var result = [
        // { value: "冀R12345", sim_id: 111 }
      ];
      for (let [sim_id, vehicle] of monitor.data) {
        if (result.length > 20) {
          break;
        }
        if (vehicle.license.indexOf(queryString) != -1) {
          result.push({
            value: vehicle.license,
            sim_id: vehicle.sim_id
          });
        }
      }
      cb(result);
    },
    vehicleSelected(selected) {
      var vehicle = monitor.data.get(selected.sim_id);
      if (!this.currentVehiclesSet.has(vehicle)) {
        this.currentVehiclesLog++;
        this.currentVehiclesSet.add(vehicle);
      }
    },
    removeCurrentVehicle(sim_id) {
      var vehicle = monitor.data.get(sim_id);
      this.currentVehiclesSet.delete(vehicle);
      this.currentVehiclesLog++;
    },
    addSingleVehicle(sim_id) {
      var vehicle = monitor.data.get(sim_id);
      this.$store.commit("openSingleVehicle", vehicle);
    },
    removeSingleVehicle(sim_id) {
      var vehicle = monitor.data.get(sim_id);
      this.$store.commit("closeSingleVehicle", vehicle);
    },
    openTab(tabName) {
      this.$store.commit("openTab", tabName);
    },
    closeTab(tabName) {
      this.$store.commit("closeTab", tabName);
    },
    tabRemove(tabName) {
      //tabName必须遵循 类型-sim_id
      var tab = tabName.split("-");
      switch (tab[0]) {
        case "single": //单车监控
          this.removeSingleVehicle(tab[1]);
          break;
        default:
          this.closeTab(tabName);
      }
    }
  },
  activated() {
    if (
      this.$route.params &&
      window.monitor.data.has(this.$route.params.sim_id)
    ) {
      this.addSingleVehicle(this.$route.params.sim_id);
    }
  },
  destroyed() {
    clearInterval(monitor.wsHeartInterval);
    clearInterval(monitor.instructionWSInterval);
    clearInterval(monitor.countInterval);
  }
};
</script>
<style lang="less">
@import "../../style/var.less";
._according-arrow {
  float: right;
}
.monitor-map-tools {
  position: absolute;
  width: 17%;
  right: 20px;
  bottom: 0;
  background-color: #f5f7fa;
  border: 1px solid #e4e7ed;
  height: 41px;
  z-index: 99;
}
.monitor-nav {
  position: absolute;
  width: 50px;
  height: 40px;
  z-index: 99;
  right: 20px;
  top: 50px;
  ._header {
    font-size: 40px;
    cursor: pointer;
    position: relative;
    z-index: 2;
  }
  &:hover {
    ._list {
      transition: all 0.5s;
      transform: translate(0, 0);
      visibility: visible;
    }
  }
  ._list {
    transform: translate(0, -30%);
    visibility: hidden;
    a {
      cursor: pointer;
      padding-left: 5px;
      display: block;
      position: relative;
      height: 40px;
      font-size: 25px;
      line-height: 40px;
      span {
        transition: all 0.2s;
        position: absolute;
        font-size: 16px;
        left: 0;
        transform: translate(-130%, 0);
        opacity: 0;
        white-space: nowrap;
        padding-right: 10px;
      }
    }
    a:hover {
      color: @pirmary;
      span {
        transform: translate(-100%, 0);
        opacity: 1;
      }
    }
  }
}
.list-complete-item {
  transition: all 1s;
  display: inline-block;
  margin-right: 10px;
}
.list-complete-enter, .list-complete-leave-to
/* .list-complete-leave-active for below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(-30px);
}
.list-complete-leave-active {
  position: absolute;
}
.current-vehicle-container {
  position: absolute;
  top: 80px;
  left: 20px;
  right: 380px;
  width: 0;
  bottom: 0;
}
.monitor-tabs {
  height: 100%;
  .el-tabs__header {
    margin: 0;
    padding-left: 15px;
  }
  .el-tabs__content {
    background: none;
    overflow: auto;
    height: calc(100% - 40px);
    padding: 0;
  }
  .el-tab-pane {
    height: 100%;
  }
}

.status-container {
  width: 46%;
  position: absolute;
  z-index: 11;
  left: 390px;
  top: 20px;
  background: #fff;
  ._header {
    position: relative;
    height: 50px;
    box-sizing: border-box;
    padding: 0 15px;
    line-height: 50px;
    font-size: 14px;
    ._open {
      position: absolute;
      right: 15px;
      top: 50%;
      transform: translate(0, -50%);
    }
    ._global-status {
      color: #303133;
      padding-right: 2em;
      strong {
        text-decoration: underline;
      }
    }
    ._online strong {
      color: @success;
    }
    ._alarm strong {
      color: @danger;
    }
    ._error strong {
      color: @warning;
    }
    ._offline strong {
      color: @t3;
    }
  }
  ._body {
    ._search {
      padding: 15px 0 15px 15px;
      border-bottom: 1px solid @b3;
      .el-form-item {
        margin-bottom: 0;
      }
    }
    ._pager {
      padding: 10px;
      text-align: center;
    }
  }
}
.monitor {
  height: 100%;
  position: relative;
  color: @t1;
}

.vehicle-search {
  position: absolute;
  width: 350px;
  background: #fff;
  z-index: 10;
  left: 20px;
  top: 20px;
  padding: 10px;
  box-sizing: border-box;
  height: 50px;
  ._right {
    text-align: center;
    i {
      font-size: 30px;
      cursor: pointer;
    }
  }
}
</style>