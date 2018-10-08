<template>
  <div class="vehicle-info-box shadow-box open" ref="box" :style="{left:position.left+'px',top:position.top+'px'}">
    <div class="_header">
      <strong class="_title">{{mapData.vehicle.info.license}}</strong>
      <small class="_text">服务到期日期：{{mapData.vehicle.info.contract_date}} </small>
      <i class="_close el-icon-circle-close-outline" @click="close" v-if="$props.closeable"></i>
    </div>
    <div class="_map">
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
    <div class="_footer">
      <i class="iconfont icon-idcard"></i>
      <i class="iconfont icon-boxplot-fill"></i>
      <i class="iconfont icon-sim"></i>
      <i class="iconfont icon-alert-fill"></i>
      <i class="iconfont icon-wifi"></i>
      <i class="iconfont icon-error-fill _error"></i>
    </div>
    <div class="_other">
      <el-row>
        <el-col :span="12">
          ACC开关 {{mapData.vehicle.info.tel||"--"}}
        </el-col>
        <el-col :span="12">
          是否定位{{mapData.vehicle.time}}
        </el-col>
        <el-col :span="12">
          纬度类型{{mapData.vehicle.info.linkman||"--"}}
        </el-col>

        <el-col :span="12">
          经度类型{{mapData.vehicle.speed1 || mapData.vehicle.speed }} km/h
        </el-col>
        <el-col :span="12">
          运营状态{{mapData.vehicle.mileage||"--"}}
        </el-col>
        <el-col :span="12">
          实载状态：{{mapData.vehicle.address1||"--"}}
        </el-col>
        <el-col :span="12">
          油路状态:{{mapData.vehicle.address1||"--"}}
        </el-col>
        <el-col :span="12">
          电路状态:{{mapData.vehicle.address1||"--"}}
        </el-col>
        <el-col :span="12">
          车门状态:{{mapData.vehicle.address1||"--"}}
        </el-col>
        <el-col :span="12">
          前门状态:{{mapData.vehicle.address1||"--"}}
        </el-col>
        <el-col :span="12">
          中门状态:{{mapData.vehicle.address1||"--"}}
        </el-col>
        <el-col :span="12">
          后门状态:{{mapData.vehicle.address1||"--"}}
        </el-col>
        <el-col :span="12">
          驾驶席门状态:{{mapData.vehicle.address1||"--"}}
        </el-col>
        <el-col :span="12">
          是否使用北斗定位:{{mapData.vehicle.address1||"--"}}
        </el-col>
        <el-col :span="12">
          是否使用GLONASS定位:{{mapData.vehicle.address1||"--"}}
        </el-col>
        <el-col :span="12">
          是否使用Galileo定位:{{mapData.vehicle.address1||"--"}}
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import { getVehicle } from "@/api/index.js";
import { location2address } from "@/utils/map-tools.js";
import { initMap, createMarker, setMarker } from "@/utils/map.js";
export default {
  data() {
    return {
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
  props: ["index", "vehicle", "closeable"],
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
    close() {
      this.$emit("close");
    }
  },
  beforeDestroyed() {
    this.mapData.map.destroy();
  }
};
</script>