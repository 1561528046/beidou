<template>
  <div
    class="vehicle-info-container"
    :class="{'single':$props.single}"
    :style="{left:position.left+'px',top:position.top+'px'}"
  >
    <div class="_tools shadow-box" v-if="$props.single">
      <el-radio-group v-model="mapTools" @change="changeTools" size="mini">
        <el-radio-button label="big" title="拉框放大">
          <i class="el-icon-zoom-in"></i>
        </el-radio-button>
        <el-radio-button label="small" title="拉框缩小">
          <i class="el-icon-zoom-out"></i>
        </el-radio-button>
        <el-radio-button label="rule" title="测距工具">
          <i class="iconfont icon-ruler"></i>
        </el-radio-button>
        <el-radio-button label="hand" title="移动工具">
          <i class="iconfont icon-hand"></i>
        </el-radio-button>
      </el-radio-group>
      <label class="el-radio-button el-radio-button--mini" @click="openOtherVehicle">
        <span class="el-radio-button__inner">
          <i class="iconfont icon-column-width" title="多车测距"></i>
        </span>
      </label>
      <label class="el-radio-button el-radio-button--mini" @click="clearOtherVehicle">
        <span class="el-radio-button__inner">
          <i class="el-icon-refresh" title="清除其他车辆" style="height:25px;"></i>
        </span>
      </label>
    </div>
    <el-dialog title="选择车辆" :visible.sync="otherVehicleDialog" append-to-body>
      <choose-vehicle @button="addOtherVehicle"></choose-vehicle>
    </el-dialog>
    <div class="_map" v-if="$props.single">
      <div class="_map-container" ref="vehicle_map"></div>
    </div>
    <div class="vehicle-info-box shadow-box" ref="box">
      <div class="_header">
        <strong class="_title">{{mapData.vehicle.info.license}}</strong>
        <small class="_text">服务到期日期：{{$utils.formatDate(mapData.vehicle.info.contract_date)}}</small>
        <i class="_close el-icon-circle-close-outline" @click="close" v-if="!$props.single"></i>
      </div>
      <div class="_map" v-if="!$props.single">
        <!-- <a class="_map-btn">展开地图</a> -->
        <div class="_map-container" ref="vehicle_map"></div>
      </div>
      <div class="_body">
        <el-row>
          <el-col :span="24">定位时间：{{mapData.vehicle.time}}</el-col>
          <el-col :span="12">
            <div style="height:1.5em;overflow:hidden;">联系人：{{mapData.vehicle.info.linkman||"--"}}</div>
          </el-col>
          <el-col :span="12">联系方式： {{mapData.vehicle.info.tel||"--"}}</el-col>
          <el-col :span="12">时速：{{mapData.vehicle.speed1|| mapData.vehicle.speed ||"--"}} km/h</el-col>
          <el-col :span="12">里程：{{mapData.vehicle.mileage||"--"}} km</el-col>
          <el-col :span="24">地理位置：{{mapData.vehicleAddress||"--"}}</el-col>
          <el-col>超速报警附加信息</el-col>
          <el-col :span="12">
            位置类型：
            <label v-if="mapData.vehicle.overSpeedPositionType===0">无特定位置</label>
            <label v-if="mapData.vehicle.overSpeedPositionType===1">圆形区域</label>
            <label v-if="mapData.vehicle.overSpeedPositionType===2">矩形区域</label>
            <label v-if="mapData.vehicle.overSpeedPositionType===3">多边形区域</label>
            <label v-if="mapData.vehicle.overSpeedPositionType===4">路段</label>
          </el-col>
          <el-col
            v-if="mapData.vehicle.overSpeedPositionType!==0"
            :span="12"
          >区域或路段ID：{{mapData.vehicle.overSpeedAreaId||"--"}}</el-col>
          <template v-if="mapData.vehicle.runTimeAlarm && mapData.vehicle.inoutAlarm ">
            <el-col>进出区域/路线报警附加信息</el-col>
            <el-col :span="12">
              位置类型：
              <label v-if="mapData.vehicle.inoutAlarm.type===1">圆形区域</label>
              <label v-if="mapData.vehicle.inoutAlarm.type===2">矩形区域</label>
              <label v-if="mapData.vehicle.inoutAlarm.type===3">多边形区域</label>
              <label v-if="mapData.vehicle.inoutAlarm.type===4">路线</label>
            </el-col>
            <el-col :span="12">区域或线路ID：{{mapData.vehicle.inoutAlarm.areaId||"--"}}</el-col>
            <el-col :span="12">
              方向：
              <label v-if="mapData.vehicle.inoutAlarm.direction===0">进</label>
              <label v-if="mapData.vehicle.inoutAlarm.direction===1">出</label>
            </el-col>
            <el-col>路段行驶时间不足/过长报警附加信息</el-col>
            <el-col :span="12">路段ID：{{mapData.vehicle.runTimeAlarm.routeID||"--"}}</el-col>
            <el-col :span="12">路段行驶时间(秒)：{{mapData.vehicle.runTimeAlarm.time||"--"}}</el-col>
            <el-col :span="12">
              结果：
              <label v-if=" mapData.vehicle.runTimeAlarm.type===0">不足</label>
              <label v-if=" mapData.vehicle.runTimeAlarm.type===1">过长</label>
            </el-col>
          </template>
        </el-row>
      </div>
      <div class="_other" v-if="$props.single">
        <el-row>
          <el-col :span="24">当前报警信息 {{$dict.getAlarm(mapData.vehicle.alarm)||"--"}}</el-col>
          <el-col
            :span="24"
            v-if="mapData.vehicle.fence_alarm&&mapData.vehicle.fence_alarm.alarmList&&mapData.vehicle.fence_alarm.alarmList.length"
          >
            平台围栏报警
            <span v-for="key in mapData.vehicle.fence_alarm.alarmList" :key="key">
              <span
                v-for="fenceItem in mapData.vehicle.fence_alarm[key]"
                :key="fenceItem.RegionId"
              >&#x3000;{{getFenceAlarmType(fenceItem)}} {{fenceItem.RegionName}}</span>
            </span>
          </el-col>
          <el-col :span="12">高程 {{mapData.vehicle.altitude||"--"}} （米）</el-col>
          <el-col :span="12">车头方向 {{$utils.getAngleText(mapData.vehicle.angle)}}</el-col>
          <el-col :span="12">油量 {{mapData.vehicle.oil/10||"--"}} L</el-col>

          <el-col :span="12">
            ACC 开/关
            <span class="_on" v-if="$utils.getState(mapData.vehicle.state,0)"></span>
            <span class="_off" v-else></span>
          </el-col>
          <el-col :span="12">
            是否定位
            <span class="_on" v-if="$utils.getState(mapData.vehicle.state,1)"></span>
            <span class="_off" v-else></span>
          </el-col>
          <el-col :span="12">
            纬度类型
            <span v-if="$utils.getState(mapData.vehicle.state,2)">南纬</span>
            <span v-else>北纬</span>
          </el-col>
          <el-col :span="12">
            经度类型
            <span v-if="$utils.getState(mapData.vehicle.state,3)">西经</span>
            <span v-else>东经</span>
          </el-col>

          <el-col :span="12">
            是否使用GPS定位:
            <span class="_on" v-if="$utils.getState(mapData.vehicle.state,18)"></span>
            <span class="_off" v-else></span>
          </el-col>
          <el-col :span="12">
            是否使用北斗定位:
            <span class="_on" v-if="$utils.getState(mapData.vehicle.state,19)"></span>
            <span class="_off" v-else></span>
          </el-col>
          <el-col :span="12">
            是否使用GLONASS定位:
            <span class="_on" v-if="$utils.getState(mapData.vehicle.state,20)"></span>
            <span class="_off" v-else></span>
          </el-col>
          <el-col :span="12">
            是否使用Galileo定位:
            <span class="_on" v-if="$utils.getState(mapData.vehicle.state,21)"></span>
            <span class="_off" v-else></span>
          </el-col>

          <!-- 扩展车辆信号状态位 -->
          <el-col :span="12">
            制动信号:
            <span
              class="_on"
              v-if="$utils.getVehicleSignalState(mapData.vehicle.vehicleSignal,4)"
            ></span>
            <span class="_off" v-else></span>
          </el-col>
          <el-col :span="12">
            喇叭信号:
            <span
              class="_on"
              v-if="$utils.getVehicleSignalState(mapData.vehicle.vehicleSignal,8)"
            ></span>
            <span class="_off" v-else></span>
          </el-col>

          <el-col :span="12">
            空挡信号:
            <span
              class="_on"
              v-if="$utils.getVehicleSignalState(mapData.vehicle.vehicleSignal,10)"
            ></span>
            <span class="_off" v-else></span>
          </el-col>
          <el-col :span="12">
            倒档信号:
            <span
              class="_on"
              v-if="$utils.getVehicleSignalState(mapData.vehicle.vehicleSignal,5)"
            ></span>
            <span class="_off" v-else></span>
          </el-col>
          <el-col :span="12">
            近光灯信号:
            <span
              class="_on"
              v-if="$utils.getVehicleSignalState(mapData.vehicle.vehicleSignal,0)"
            ></span>
            <span class="_off" v-else></span>
          </el-col>
          <el-col :span="12">
            远光灯信号:
            <span
              class="_on"
              v-if="$utils.getVehicleSignalState(mapData.vehicle.vehicleSignal,1)"
            ></span>
            <span class="_off" v-else></span>
          </el-col>
          <el-col :span="12">
            右转向灯信号:
            <span
              class="_on"
              v-if="$utils.getVehicleSignalState(mapData.vehicle.vehicleSignal,2)"
            ></span>
            <span class="_off" v-else></span>
          </el-col>
          <el-col :span="12">
            左转向灯信号:
            <span
              class="_on"
              v-if="$utils.getVehicleSignalState(mapData.vehicle.vehicleSignal,3)"
            ></span>
            <span class="_off" v-else></span>
          </el-col>
          <el-col :span="12">
            雾灯信号:
            <span
              class="_on"
              v-if="$utils.getVehicleSignalState(mapData.vehicle.vehicleSignal,6)"
            ></span>
            <span class="_off" v-else></span>
          </el-col>
          <el-col :span="12">
            示廓灯:
            <span
              class="_on"
              v-if="$utils.getVehicleSignalState(mapData.vehicle.vehicleSignal,7)"
            ></span>
            <span class="_off" v-else></span>
          </el-col>

          <el-col :span="12">
            空调信号:
            <span
              class="_on"
              v-if="$utils.getVehicleSignalState(mapData.vehicle.vehicleSignal,9)"
            ></span>
            <span class="_off" v-else></span>
          </el-col>

          <el-col :span="12">车门状态:{{$utils.getState(mapData.vehicle.state,12) ? "加锁":"解锁"}}</el-col>
          <el-col :span="12">
            前门状态:
            <span class="_on" v-if="$utils.getState(mapData.vehicle.state,13)"></span>
            <span class="_off" v-else></span>
          </el-col>
          <el-col :span="12">
            中门状态:
            <span class="_on" v-if="$utils.getState(mapData.vehicle.state,14)"></span>
            <span class="_off" v-else></span>
          </el-col>
          <el-col :span="12">
            后门状态:
            <span class="_on" v-if="$utils.getState(mapData.vehicle.state,15)"></span>
            <span class="_off" v-else></span>
          </el-col>
          <el-col :span="12">
            驾驶席门状态:
            <span class="_on" v-if="$utils.getState(mapData.vehicle.state,16)"></span>
            <span class="_off" v-else></span>
          </el-col>

          <el-col :span="12">
            缓速器工作:
            <span
              class="_on"
              v-if="$utils.getVehicleSignalState(mapData.vehicle.vehicleSignal,11)"
            ></span>
            <span class="_off" v-else></span>
          </el-col>
          <el-col :span="12">
            ABS 工作:
            <span
              class="_on"
              v-if="$utils.getVehicleSignalState(mapData.vehicle.vehicleSignal,12)"
            ></span>
            <span class="_off" v-else></span>
          </el-col>
          <el-col :span="12">
            加热器工作:
            <span
              class="_on"
              v-if="$utils.getVehicleSignalState(mapData.vehicle.vehicleSignal,13)"
            ></span>
            <span class="_off" v-else></span>
          </el-col>
          <el-col :span="12">
            离合器状态:
            <span
              class="_on"
              v-if="$utils.getVehicleSignalState(mapData.vehicle.vehicleSignal,14)"
            ></span>
            <span class="_off" v-else></span>
          </el-col>
          <!-- IO 状态位 -->
          <el-col :span="12">
            深度休眠状态:
            <span class="_on" v-if="$utils.getIOState(mapData.vehicle.IO,0)"></span>
            <span class="_off" v-else></span>
          </el-col>
          <el-col :span="12">
            休眠状态:
            <span class="_on" v-if="$utils.getIOState(mapData.vehicle.IO,1)"></span>
            <span class="_off" v-else></span>
          </el-col>
          <!-- 模拟量 -->
          <el-col :span="12">模拟量: {{mapData.vehicle.analog}}</el-col>

          <el-col :span="12">
            运营状态
            <span v-if="$utils.getState(mapData.vehicle.state,4)">停运</span>
            <span v-else>运营</span>
          </el-col>
          <el-col :span="12">实载状态：{{ $utils.getStateLoad(mapData.vehicle.state) }}</el-col>
          <el-col :span="12">油路状态:{{$utils.getState(mapData.vehicle.state,10) ? "断开":"正常"}}</el-col>
          <el-col :span="12">电路状态:{{$utils.getState(mapData.vehicle.state,11) ? "断开":"正常"}}</el-col>
        </el-row>
      </div>
      <div class="_footer" v-loading="vehicleInfoLoading">
        <i class="iconfont icon-idcard" @click="showCard('x0702','驾驶员信息')" title="驾驶员信息"></i>
        <i class="iconfont icon-boxplot-fill" @click="showCard('deviceCard','设备信息')" title="设备信息"></i>
        <i class="iconfont icon-sim" @click="showCard('simCard','SIM卡信息')" title="sim卡信息"></i>
        <i class="iconfont icon-luyin" @click="showCard('x8804','录音')" title="录音"></i>
        <i class="iconfont icon-video" @click="showCard('x8801','拍摄')" title="拍摄"></i>
        <i class="iconfont icon-zhongduan" @click="getTerminal" title="终端属性"></i>
        <i class="iconfont icon-shipinjiankong" @click="monitorVideo" title="视频监控"></i>
        <el-badge
          :value="parseInt(mapData.vehicle.alarm_count)||''"
          :max="99"
          class="alarm-badge"
          :class="{'no-alarm':!mapData.vehicle.alarm_count}"
        >
          <i class="iconfont icon-alert-fill" @click="openCard('alarm')" title="报警信息"></i>
        </el-badge>
        <i
          class="iconfont icon-error-fill _error"
          @click="showCard('repairCard','故障申报')"
          title="故障申报"
        ></i>
        <!-- <i class="iconfont icon-video" @click="openCard('media')" title="媒体列表"></i> -->
      </div>
      <el-dialog
        :title="card.title"
        append-to-body
        :visible.sync="card.show"
        width="60%"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
      >
        <div :is="card.component" :vehicle="$props.vehicle" v-if="card.show"></div>
      </el-dialog>
      <el-dialog
        title="终端属性"
        :visible.sync="terminalDialog"
        append-to-body
        width="50%"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
      >
        <terminal-card></terminal-card>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { getVehicle } from "@/api/index.js";
import { location2address } from "@/utils/map-tools.js";
import { initMap, createMarker, setMarker } from "@/utils/map.js";
import deviceCard from "./card-device.vue";
import simCard from "./card-sim.vue";
import repairCard from "./card-repair.vue";
import terminalCard from "./card-terminal.vue";
import chooseVehicle from "@/components/choose-vehicle.vue";
import x8804 from "./x8804.vue";
import x8801 from "./x8801.vue";
import x0702 from "./x0702.vue";

export default {
  components: {
    deviceCard,
    simCard,
    terminalCard,
    chooseVehicle,
    x8804,
    x8801,
    x0702,
    repairCard
  },
  data() {
    return {
      vehicleInfoLoading: true,
      otherVehicleDialog: false,
      mapTools: "hand",
      card: {
        show: false,
        component: "",
        title: ""
      },
      mapData: {
        //注释属性为动态添加，为非响应式数据！
        //rule:{},
        // map:{},
        // marker:{},
        mouseTool: {},
        vehicleAddress: "",
        vehicle: {
          info: {}
        }, //车辆数据
        otherVehicle: {}
        //otherMarker:{}
      },
      bodyWidth: "",
      bodyHeight: "",
      terminalDialog: false
    };
  },
  props: ["index", "vehicle", "single"],
  watch: {
    "mapData.vehicle": {
      handler: function() {
        this.updateVehicle();
      },
      deep: true
    },
    "mapData.otherVehicle": {
      handler: function() {
        this.updateOtherVehicle();
      },
      deep: true
    }
  },
  computed: {
    position: function() {
      var maxRow = Math.floor(this.bodyHeight / 360);
      var left = Math.floor(this.index / maxRow) * 350;
      var top = (this.index % maxRow) * 360;
      return {
        left: left + Math.floor(this.index / maxRow) * 10,
        top: top + (this.index % maxRow) * 10
      };
    }
  },
  mounted() {
    this.bodyWidth = this.$el.parentElement.scrollWidth;
    this.bodyHeight = this.$el.parentElement.scrollHeight;
    var monitorData = this.$props.vehicle;

    if (!monitorData.info) {
      //如果没有联系人等信息
      getVehicle({ vehicle_id: monitorData.vehicle_id })
        .then(res => {
          if (res.data.code == 0) {
            var lastData = res.data.data[0];
            monitorData.info = lastData;
            if (
              !monitorData.time ||
              monitorData.time == this.$utils.formatDate14(lastData.Time1)
            ) {
              //如果监控数据中 如果没有定位时间或定位时间和请求到的时间一样，则把请求到的最后一条定为数据赋值到监控数据中
              var newData = {};
              newData.sim_id = monitorData.sim_id;
              newData.time = this.$utils.formatDate14(lastData.Time1);
              newData.state = lastData.State || 0;
              newData.alarm = lastData.AlarmSign;
              newData.lng = lastData.Longitude || 0;
              newData.lat = lastData.Latitude || 0;
              newData.altitude = lastData.Altitude;
              newData.speed = lastData.Speed;
              newData.speed1 = lastData.Speed1;
              newData.angle = lastData.Direction;
              newData.mileage = lastData.Mileage;
              newData.GNSSCount = lastData.GNSSCount;
              newData.alarm_count = lastData.AlarmCount;
              newData.error_count = lastData.ErrorCount;
              window.monitor.setVehicleData(newData);
            }
          } else {
            this.$message.error("获取车辆信息失败！");
          }
          this.$set(this.mapData, "vehicle", monitorData);
          this.initMap();
          this.vehicleInfoLoading = false;
        })
        .catch(err => {
          this.vehicleInfoLoading = false;
          console.warn(err);
          this.$message.error("接口错误，获取车辆信息失败！");
        });
    } else {
      this.$set(this.mapData, "vehicle", monitorData);
      this.initMap();
      this.vehicleInfoLoading = false;
    }
  },
  methods: {
    // 跳转到视频监控
    monitorVideo() {
      this.$store.commit("monitoringVideo", this.$props.vehicle);
    },
    getFenceAlarmType(fence) {
      if (!fence) {
        return "";
      }
      // 区域类型：1自定义圆形，2自定义矩形，3自定义多边形，4行政区域,5分段限速,6关键点 7线路偏移
      if (fence.Type <= 4) {
        return { "3": "禁入区域", "5": "禁出区域" }[fence.AreaProperty];
      }
      if (fence.Type == 6) {
        return { "3": "未离开关键点", "5": "未到达关键点" }[fence.AreaProperty];
      }
      return { "5": "分段限速", "7": "线路偏移" }[fence.Type];
    },
    // 查询终端属性
    getTerminal() {
      var data = {};
      var sim_id = "";
      if (this.mapData.vehicle.sim_id.length == 11) {
        sim_id = "0" + this.mapData.vehicle.sim_id;
      } else {
        sim_id = this.mapData.vehicle.sim_id;
      }
      data = {
        SimID: sim_id,
        MessageID: "x8107"
      };
      data = JSON.stringify(data);
      this.$instruction.send(data);
      this.terminalDialog = true;
    },
    showCard(componentName, title) {
      this.card.show = true;
      this.card.component = componentName;
      this.card.title = title;
    },
    initMap() {
      initMap(() => {
        var thas = this;
        var AMap = window.AMap;
        // eslint-disable-next-line
        var position = new AMap.LngLat(
          this.mapData.vehicle.lng,
          this.mapData.vehicle.lat
        );
        this.mapData.map = new AMap.Map(this.$refs.vehicle_map, {
          // viewMode: "3D",
          // pitch: 55,
          // rotation: -45,
          center: position,
          mapStyle: "amap://styles/eca30d0b0912c5e6154b32dd369f8524",
          // dragEnable: false,
          // keyboardEnable: false,
          zoom: 15
        });
        AMap.plugin(["AMap.OverView"], function() {
          var OverView = new AMap.OverView({ isOpen: true });
          thas.mapData.map.addControl(OverView);
        });
        this.mapData.marker = createMarker(this.mapData.vehicle, AMap);
        this.mapData.marker.setMap(this.mapData.map);
        if (!this.$props.single) {
          this.mapData.map.on("zoomchange", () => {
            this.mapData.map.setCenter(this.mapData.marker.getPosition());
          });
        }
      });
    },
    changeTools(name) {
      var that = this;
      this.mapData.map.plugin(["AMap.MouseTool"], function() {
        that.mapData.mouseTool = new window.AMap.MouseTool(that.mapData.map);
      });
      switch (name) {
        case "rule":
          if (!this.mapData.rule) {
            this.mapData.map.plugin(["AMap.RangingTool"], () => {
              this.mapData.ruler = new window.AMap.RangingTool(
                this.mapData.map
              );
              this.mapData.ruler.turnOn();
            });
          }
          break;
        case "hand":
          this.mapData.ruler.turnOff();
          break;
        case "multi":
          this.openOtherVehicle();
          break;
        case "big":
          this.mapData.mouseTool.rectZoomIn({
            strokeColor: "#80d8ff",
            fillColor: "#80d8ff",
            fillOpacity: 0.3
            //同 Polygon 的 Option 设置
          });
          break;
        case "small":
          this.mapData.mouseTool.rectZoomOut({
            strokeColor: "#80d8ff",
            fillColor: "#80d8ff",
            fillOpacity: 0.3
            //同 Polygon 的 Option 设置
          });
          break;
      }
    },

    openOtherVehicle() {
      this.otherVehicleDialog = true;
    },
    addOtherVehicle({ row }) {
      if (row.sim_id == this.mapData.vehicle.sim_id) {
        //不能选择同一辆车
        this.$message.warning("地图中已经存在选择车辆！");
        return false;
      } else {
        var otherVehicle = window.monitor.data.get(row.sim_id);
        if (otherVehicle) {
          this.mapData.otherVehicle = otherVehicle;
          this.otherVehicleDialog = false;
          if (!this.mapData.otherMarker) {
            //地图中创建marker
            this.mapData.otherMarker = createMarker(
              this.mapData.otherVehicle,
              window.AMap
            );
          }
          this.mapData.otherMarker.setMap(this.mapData.map);
        } else {
          this.$message.warning("监控数据中没有找到对应车辆！");
        }
      }
    },
    updateVehicle() {
      if (this.mapData.marker) {
        var vehicleData = this.mapData.vehicle;
        location2address({
          data: [vehicleData],
          longKey: "lng",
          latKey: "lat"
        }).then(res => {
          this.mapData.vehicleAddress = res[0];
          setMarker(this.mapData.marker, vehicleData, window.AMap);
          // if (!this.$props.single) {
          //   this.mapData.map.setCenter(this.mapData.marker.getPosition());
          // }
          //大地图小地图都跟随车机
          this.mapData.map.setCenter(this.mapData.marker.getPosition());
        });
      }
    },
    updateOtherVehicle() {
      if (this.mapData.otherMarker) {
        var vehicleData = this.mapData.otherVehicle;
        setMarker(this.mapData.otherMarker, vehicleData, window.AMap);
      }
    },
    clearOtherVehicle() {
      if (this.mapData.otherMarker) {
        this.mapData.otherMarker.setMap(null);
        this.mapData.otherVehicle = null;
        delete this.mapData.otherMarker;
      }
    },

    openCard(type) {
      this.$store.commit("openTab", type);
      switch (type) {
        case "error":
          this.$store.commit("setMonitorErrorVehicle", this.$props.vehicle);
          break;
        case "alarm":
          this.$store.commit("setMonitorAlarmVehicle", this.$props.vehicle);
          break;
        // case "media":
        //   this.$store.commit("setMonitorMediaVehicle", this.$props.vehicle);
        //   break;
      }
    },
    close() {
      this.$emit("close");
    }
  },
  beforeDestroyed() {
    this.mapData.map.destroy();
  }
};
</script>
<style lang="less">
@import "../../../style/var.less";
.vehicle-info-box {
  ._other {
    ._on,
    ._off {
      &:before {
        content: "";
        width: 8px;
        height: 8px;
        display: inline-block;
        border-radius: 8px;
      }
    }
    ._on {
      &:before {
        background: @success;
      }
    }
    ._off {
      &:before {
        background: @t3;
      }
    }
  }
}
.vehicle-info-box {
  font-size: 12px;
  position: absolute;
  width: 350px;
  background: #fff;
  z-index: 10;
  &.open {
    height: 360px;
    ._map {
      height: 160px;
      background: #999;
    }
  }
  ._header {
    box-sizing: border-box;
    border-bottom: 1px solid #f0f0f0;
    padding: 0 15px;
    position: relative;
    height: 40px;
    line-height: 40px;
    ._title {
      padding-right: 1em;
      font-size: 16px;
    }
    ._text {
      font-size: 12px;
      color: #999;
    }
    ._close {
      cursor: pointer;
      right: 15px;
      top: 50%;
      transform: translate3d(0, -50%, 0);
      font-size: 20px;
      position: absolute;
    }
  }
  ._map {
    position: relative;
    min-height: 25px;
    height: 150px;
    ._map-btn {
      position: absolute;
      bottom: 0;
      font-size: 12px;
      width: 100px;
      left: 50%;
      margin-left: -50px;
      border: 1px solid #f0f0f0;
      border-top: 0;
      text-align: center;
      height: 25px;
      line-height: 25px;
      background: #fff;
    }
    ._map-container {
      height: 100%;
      width: 100%;
    }
  }
  ._body {
    height: auto;
    box-sizing: border-box;
    padding: 15px;
    line-height: 1.8;
  }
  ._footer {
    height: 40px;
    line-height: 40px;
    border-top: 1px solid #f0f0f0;
    ._error {
      position: absolute;
      right: 15px;
      color: #ff8d00;
    }
    i {
      font-size: 20px;
      display: inline-block;
      width: 35px;
      cursor: pointer;
      text-align: center;
    }
  }
  ._other {
    border-top: 1px solid @b4;
    box-sizing: border-box;
    padding: 15px;
    line-height: 1.8;
  }
}
.vehicle-info-container {
  position: absolute;
  &.single {
    height: 100% !important;
    width: 100%;
    position: static;
    margin: 0;
    ._map {
      position: absolute;
      width: 100%;
      height: 100% !important;
      top: 0;
      bottom: 0;
    }
    ._map-container {
      height: 100%;
    }
    ._tools {
      position: absolute;
      right: 150px;
      bottom: 20px;
      z-index: 10;
      background: #fff;
      i {
        margin: 0 10px;
        font-size: 25px;
        cursor: pointer;
      }
    }
  }
}

.alarm-badge {
  i {
    width: auto;
    line-height: 1;
    vertical-align: 3px;
    color: @danger;
  }
  .el-badge__content.is-fixed {
    right: 20px;
    top: 3px;
  }
  &.no-alarm {
    i {
      color: @t1;
    }
  }
}
</style>