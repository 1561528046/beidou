<template>
  <div class="vehicle-info-box shadow-box open" :class="{'single':$props.single}" ref="box" :style="{left:position.left+'px',top:position.top+'px'}">
    <div class="_header">
      <strong class="_title">{{mapData.vehicle.info.license}}</strong>
      <small class="_text">服务到期日期：{{mapData.vehicle.info.contract_date}} </small>
      <i class="_close el-icon-circle-close-outline" @click="close" v-if="!$props.single"></i>
    </div>
    <div class="_map" v-if="!$props.single">
      <!-- <a class="_map-btn">展开地图</a> -->
      <div class="_map-container" ref="vehicle_map"></div>
    </div>
    <div class="_body">
      <el-row>
        <el-col :span="24">
          定位时间：{{mapData.vehicle.time}}
        </el-col>
        <el-col :span="12">
          联系人：{{mapData.vehicle.info.linkman||"--"}}
        </el-col>
        <el-col :span="12">
          联系方式： {{mapData.vehicle.info.tel||"--"}}
        </el-col>
        <el-col :span="12">
          时速：{{mapData.vehicle.speed1 || mapData.vehicle.speed }} km/h
        </el-col>
        <el-col :span="12">
          里程：{{mapData.vehicle.mileage||"--"}}
        </el-col>
        <el-col :span="24">
          地理位置：{{mapData.vehicle.address||"--"}}
        </el-col>
      </el-row>
    </div>
    <div class="_other" v-if="$props.single">
      <el-row>
        <el-col :span="12">
          车头方向 {{mapData.vehicle.angle||"--"}}
        </el-col>
        <el-col :span="12">
          油量 {{mapData.vehicle.oil||"--"}} 1/10L
        </el-col>

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
          <span class="_on" v-if="$utils.getState(mapData.vehicle.state,2)"></span>
          <span class="_off" v-else></span>
        </el-col>
        <el-col :span="12">
          经度类型
          <span class="_on" v-if="$utils.getState(mapData.vehicle.state,3)"></span>
          <span class="_off" v-else></span>
        </el-col>
        <el-col :span="12">
          运营状态
          <span class="_on" v-if="$utils.getState(mapData.vehicle.state,4)"></span>
          <span class="_off" v-else></span>
        </el-col>
        <el-col :span="12">
          实载状态：{{ $utils.getStateLoad(mapData.vehicle.state) }}
        </el-col>
        <el-col :span="12">
          油路状态:{{$utils.getState(mapData.vehicle.state,10) ? "正常":"断开"}}
        </el-col>
        <el-col :span="12">
          电路状态:{{$utils.getState(mapData.vehicle.state,11) ? "正常":"断开"}}
        </el-col>
        <el-col :span="12">
          车门状态:{{$utils.getState(mapData.vehicle.state,12) ? "加锁":"解锁"}}
        </el-col>
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
          近光灯信号:
          <span class="_on" v-if="$utils.getVehicleSignalState(mapData.vehicle.vehicleSignal,0)"></span>
          <span class="_off" v-else></span>
        </el-col>
        <el-col :span="12">
          远光灯信号:
          <span class="_on" v-if="$utils.getVehicleSignalState(mapData.vehicle.vehicleSignal,1)"></span>
          <span class="_off" v-else></span>
        </el-col>
        <el-col :span="12">
          右转向灯信号:
          <span class="_on" v-if="$utils.getVehicleSignalState(mapData.vehicle.vehicleSignal,2)"></span>
          <span class="_off" v-else></span>
        </el-col>
        <el-col :span="12">
          左转向灯信号:
          <span class="_on" v-if="$utils.getVehicleSignalState(mapData.vehicle.vehicleSignal,3)"></span>
          <span class="_off" v-else></span>
        </el-col>
        <el-col :span="12">
          制动信号:
          <span class="_on" v-if="$utils.getVehicleSignalState(mapData.vehicle.vehicleSignal,4)"></span>
          <span class="_off" v-else></span>
        </el-col>
        <el-col :span="12">
          倒档信号:
          <span class="_on" v-if="$utils.getVehicleSignalState(mapData.vehicle.vehicleSignal,5)"></span>
          <span class="_off" v-else></span>
        </el-col>
        <el-col :span="12">
          雾灯信号:
          <span class="_on" v-if="$utils.getVehicleSignalState(mapData.vehicle.vehicleSignal,6)"></span>
          <span class="_off" v-else></span>
        </el-col>
        <el-col :span="12">
          示廓灯:
          <span class="_on" v-if="$utils.getVehicleSignalState(mapData.vehicle.vehicleSignal,7)"></span>
          <span class="_off" v-else></span>
        </el-col>
        <el-col :span="12">
          喇叭信号:
          <span class="_on" v-if="$utils.getVehicleSignalState(mapData.vehicle.vehicleSignal,8)"></span>
          <span class="_off" v-else></span>
        </el-col>
        <el-col :span="12">
          空调状态:
          <span class="_on" v-if="$utils.getVehicleSignalState(mapData.vehicle.vehicleSignal,9)"></span>
          <span class="_off" v-else></span>
        </el-col>
        <el-col :span="12">
          空挡信号:
          <span class="_on" v-if="$utils.getVehicleSignalState(mapData.vehicle.vehicleSignal,10)"></span>
          <span class="_off" v-else></span>
        </el-col>
        <el-col :span="12">
          缓速器工作:
          <span class="_on" v-if="$utils.getVehicleSignalState(mapData.vehicle.vehicleSignal,11)"></span>
          <span class="_off" v-else></span>
        </el-col>
        <el-col :span="12">
          ABS 工作:
          <span class="_on" v-if="$utils.getVehicleSignalState(mapData.vehicle.vehicleSignal,12)"></span>
          <span class="_off" v-else></span>
        </el-col>
        <el-col :span="12">
          加热器工作:
          <span class="_on" v-if="$utils.getVehicleSignalState(mapData.vehicle.vehicleSignal,13)"></span>
          <span class="_off" v-else></span>
        </el-col>
        <el-col :span="12">
          离合器状态:
          <span class="_on" v-if="$utils.getVehicleSignalState(mapData.vehicle.vehicleSignal,14)"></span>
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
      </el-row>
    </div>
    <div class="_footer">
      <!-- <i class="iconfont icon-idcard"></i> -->
      <i class="iconfont icon-boxplot-fill" @click="showCard('deviceCard','设备信息')" title="设备信息"></i>
      <i class="iconfont icon-sim" @click="showCard('simCard','SIM卡信息')" title="sim卡信息"></i>
      <i class="iconfont icon-wifi" @click="showCard('audio')" title="语音对讲"></i>
      <i class="iconfont icon-error-fill _error" @click="openCard('error')" title="异常信息"></i>
      <i class="iconfont icon-camera" title="抓拍"></i>
      <i class="iconfont icon-video" title="视频信息"></i>
      <el-badge :value="200" :max="99" class="alarm-badge">
        <i class="iconfont icon-alert-fill" @click="openCard('alarm')" title="报警信息"></i>
      </el-badge>
    </div>
    <el-dialog :title="card.title" append-to-body :visible.sync="card.show" width="50%">
      <div :is="card.component" :vehicle="$props.vehicle"></div>
    </el-dialog>
  </div>
</template>
<script>
import { getVehicle } from "@/api/index.js";
import { location2address } from "@/utils/map-tools.js";
import { initMap, createMarker, setMarker } from "@/utils/map.js";
import deviceCard from "./card-device.vue";
import simCard from "./card-sim.vue";
export default {
  components: { deviceCard, simCard },
  data() {
    return {
      card: {
        show: false,
        component: "",
        title: ""
      },
      mapData: {
        //注释属性为动态添加，为非响应式数据！
        // map:{},
        // marker:{},
        vehicle: {
          info: {}
        } //车辆数据
      },
      bodyWidth: "",
      bodyHeight: ""
    };
  },
  props: ["index", "vehicle", "single"],
  watch: {
    "mapData.vehicle": {
      handler: function() {
        this.updateVehicle();
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
            var tpl = {
              alarm: "",
              state: "",
              lat: "",
              lng: "",
              altitude: "",
              speed: "",
              angle: "",
              time: "",
              mileage: "",
              oil: "",
              speed1: "",
              alarmId: "",
              overSpeedPositionType: "",
              overSpeedAreaId: "",
              inoutAlarm: [],
              runTimeAlarm: {
                routeID: "",
                time: "",
                type: ""
              },
              vehicleSignal: "",
              IO: "",
              analog: "",
              wifiSignal: "",
              GNSSCount: ""
            };
            Object.assign(monitorData, tpl);

            if (!monitorData.time) {
              //如果监控数据中 没有定为时间，则把请求到的最后一条定为数据赋值到监控数据中
              monitorData.time = lastData.time;
              monitorData.alarm = lastData.AlarmSign;
              monitorData.lng = lastData.Longitude || 0;
              monitorData.lat = lastData.Latitude || 0;
              monitorData.altitude = lastData.Altitude;
              monitorData.speed = lastData.Speed;
              monitorData.speed1 = lastData.Speed1;
              monitorData.angle = lastData.Direction;
              monitorData.mileage = lastData.Mileage;
              monitorData.GNSSCount = lastData.GNSSCount;
              monitorData.alarm_count = lastData.AlarmCount;
              monitorData.error_count = lastData.ErrorCount;
            }
          } else {
            this.$message.error("获取车辆信息失败！");
          }
          this.$set(this.mapData, "vehicle", monitorData);
          this.initMap();
        })
        .catch(err => {
          console.warn(err);
          this.$message.error("接口错误，获取车辆信息失败！");
        });
    } else {
      this.$set(this.mapData, "vehicle", monitorData);
      this.initMap();
    }
  },
  methods: {
    showCard(componentName, title) {
      this.card.show = true;
      this.card.component = componentName;
      this.card.title = title;
    },
    initMap() {
      initMap(() => {
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
          // dragEnable: false,
          // keyboardEnable: false,
          zoom: 15
        });
        this.mapData.marker = createMarker(this.mapData.vehicle, AMap);
        this.mapData.marker.setMap(this.mapData.map);
        this.mapData.map.on("zoomchange", () => {
          this.mapData.map.setCenter(this.mapData.marker.getPosition());
        });
      });
    },
    updateVehicle() {
      if (this.mapData.marker) {
        var vehicleData = this.mapData.vehicle;
        location2address({
          data: [vehicleData],
          longKey: "lng",
          latKey: "lat"
        }).then(res => {
          this.mapData.vehicle.address = res[0];
          setMarker(this.mapData.marker, vehicleData, window.AMap);
          this.mapData.map.setCenter(this.mapData.marker.getPosition());
        });
      }
    },
    openCard(type) {
      this.$store.commit("openTab", type);
      this.$store.commit("setCurrentVehicleForTab", this.$props.vehicle);
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
.single {
  height: auto !important;
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
}
</style>