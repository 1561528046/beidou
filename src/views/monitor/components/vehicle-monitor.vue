<template>
  <div class="vehicle-info-container" :class="{'single':$props.single}" :style="{left:position.left+'px',top:position.top+'px'}">
    <div class="_tools shadow-box" v-if="$props.single">
      <el-radio-group v-model="mapTools" @change="changeTools" size="mini">
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
            里程：{{mapData.vehicle.mileage/10||"--"}} km
          </el-col>
          <el-col :span="24">
            地理位置：{{mapData.vehicleAddress||"--"}}
          </el-col>
        </el-row>
      </div>
      <div class="_other" v-if="$props.single">
        <el-row>
          <el-col :span="24">
            当前报警信息 {{$dict.getAlarm(mapData.vehicle.alarm)||"--"}} {{mapData.vehicle.fence_alarm_text}}
          </el-col>
          <el-col :span="12">
            高程 {{mapData.vehicle.altitude||"--"}} （米）
          </el-col>
          <el-col :span="12">
            车头方向 {{mapData.vehicle.angle||"--"}}
          </el-col>
          <el-col :span="12">
            油量 {{mapData.vehicle.oil/10||"--"}} L
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
            <span class="_on" v-if="$utils.getVehicleSignalState(mapData.vehicle.vehicleSignal,4)"></span>
            <span class="_off" v-else></span>
          </el-col>
          <el-col :span="12">
            喇叭信号:
            <span class="_on" v-if="$utils.getVehicleSignalState(mapData.vehicle.vehicleSignal,8)"></span>
            <span class="_off" v-else></span>
          </el-col>

          <el-col :span="12">
            空挡信号:
            <span class="_on" v-if="$utils.getVehicleSignalState(mapData.vehicle.vehicleSignal,10)"></span>
            <span class="_off" v-else></span>
          </el-col>
          <el-col :span="12">
            倒档信号:
            <span class="_on" v-if="$utils.getVehicleSignalState(mapData.vehicle.vehicleSignal,5)"></span>
            <span class="_off" v-else></span>
          </el-col>
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
            空调信号:
            <span class="_on" v-if="$utils.getVehicleSignalState(mapData.vehicle.vehicleSignal,9)"></span>
            <span class="_off" v-else></span>
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
          <el-col :span="12">
            模拟量: {{mapData.vehicle.analog}}
          </el-col>

          <el-col :span="12">
            运营状态
            <span v-if="$utils.getState(mapData.vehicle.state,4)">停运</span>
            <span v-else>运营</span>
          </el-col>
          <el-col :span="12">
            实载状态：{{ $utils.getStateLoad(mapData.vehicle.state) }}
          </el-col>
          <el-col :span="12">
            油路状态:{{$utils.getState(mapData.vehicle.state,10) ? "断开":"正常"}}
          </el-col>
          <el-col :span="12">
            电路状态:{{$utils.getState(mapData.vehicle.state,11) ? "断开":"正常"}}
          </el-col>
        </el-row>
      </div>
      <div class="_footer">
        <!-- <i class="iconfont icon-idcard"></i> -->
        <i class="iconfont icon-boxplot-fill" @click="showCard('deviceCard','设备信息')" title="设备信息"></i>
        <i class="iconfont icon-sim" @click="showCard('simCard','SIM卡信息')" title="sim卡信息"></i>
        <i class="iconfont icon-luyin" @click="showCard('x8804','录音')" title="录音"></i>
        <i class="iconfont icon-error-fill _error" @click="openCard('error')" title="异常信息"></i>
        <el-popover placement="top" width="30" trigger="click" :disabled="[1,2,3].indexOf(snapshotState)!=-1">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-button round @click="snapshot(1)">
                <i class="iconfont icon-camera-fill"></i>1</el-button>
            </el-col>
            <el-col :span="12">
              <el-button round @click="snapshot(2)">
                <i class="iconfont icon-camera-fill"></i>2</el-button>
            </el-col>
          </el-row>
          <i class="iconfont icon-camera" title="抓拍" v-loading="[1,2,3].indexOf(snapshotState)!=-1" slot="reference"></i>
        </el-popover>
        <!-- <el-tooltip effect="dark" :content="snapshotTip" placement="top" :disabled="[1,2,3].indexOf(snapshotState)==-1">
          
        </el-tooltip> -->

        <i class="iconfont icon-video" @click="showCard('x8801','视频录播')" title="视频录播"></i>
        <el-badge :value="parseInt(mapData.vehicle.alarm_count)||''" :max="99" class="alarm-badge" :class="{'no-alarm':!mapData.vehicle.alarm_count}">
          <i class="iconfont icon-alert-fill" @click="openCard('alarm')" title="报警信息"></i>
        </el-badge>
        <!-- <i class="iconfont icon-video" @click="openCard('media')" title="媒体列表"></i> -->
      </div>
      <el-dialog :title="card.title" append-to-body :visible.sync="card.show" width="50%">
        <div :is="card.component" :vehicle="$props.vehicle" v-if="card.show"></div>
      </el-dialog>
      <el-dialog :title="$props.vehicle.license+'抓拍图片'" append-to-body :visible.sync="snapshotDialog" width="50%">
        <div style="text-align:center;">
          <img :src="snapshotUrl" v-if="snapshotUrl" />
        </div>
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
import chooseVehicle from "@/components/choose-vehicle.vue";
import x8804 from "./x8804.vue";
import x8801 from "./x8801.vue";
export default {
  components: { deviceCard, simCard, chooseVehicle, x8804, x8801 },
  data() {
    return {
      x8801Sim: "", //记录发送出去的x8801 来判断是否需要在此组件接受 x0800 x8800
      snapData: {
        MessageID: "x8801",
        SimID: this.$utils.formatSim(this.$props.vehicle.sim_id),
        ChannelId: 1, //通道 ID 1-255
        PhotoCommand: "1", //0 表示停止拍摄；0xFFFF 表示录像；其它表示拍照张数
        PhotoTimeInterval: "0", //秒，0 表示按最小间隔拍照或一直录像
        StoreFlag: "1", //1：保存；0：实时上传
        Resolution: "1", //分辨率 0x01:320*240；0x02:640*480；0x03:800*600；0x04:1024*768;0x05:176*144;[Qcif];0x06:352*288;[Cif];0x07:704*288;[HALF D1];0x08:704*576;[D1];
        Quality: "10", //1-10，1 代表质量损失最小，10 表示压缩比最大
        Brightness: "125", //亮度0-255
        Contrast: "64", //对比度  0-127
        Saturation: "64", //饱和度0-127
        Chroma: "125" //色度 0-255
      },
      snapTimeout: 0,
      snapshotState: 0, //0默认状态 1指令成功 2指令失败 3拍照成功 4拍照完成
      snapshotUrl: "", //照片路径
      snapshotDialog: false,
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
        vehicleAddress: "",
        vehicle: {
          info: {}
        }, //车辆数据
        otherVehicle: {}
        //otherMarker:{}
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
    },
    "mapData.otherVehicle": {
      handler: function() {
        this.updateOtherVehicle();
      },
      deep: true
    }
  },
  computed: {
    snapshotTip: function() {
      return ["", "指令成功", "指令失败", "拍照成功", ""][this.snapshotState];
    },
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
    this.$instruction.on("x8801", this.$props.vehicle.sim_id, this.x8801);
    this.$instruction.on("x0800", this.$props.vehicle.sim_id, this.x0800);
    this.$instruction.on("x8800", this.$props.vehicle.sim_id, this.x8800);

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
        if (!this.$props.single) {
          this.mapData.map.on("zoomchange", () => {
            this.mapData.map.setCenter(this.mapData.marker.getPosition());
          });
        }
      });
    },
    changeTools(name) {
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
          if (!this.$props.single) {
            this.mapData.map.setCenter(this.mapData.marker.getPosition());
          }
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
    snapshot(id) {
      this.x8801Sim = this.$utils.formatSim(this.vehicle.sim_id);
      this.snapData.ChannelId = id;
      this.$instruction.send(JSON.stringify(this.snapData));
    },
    x8800(evt) {
      var data = JSON.parse(evt.data);
      if (this.card.show || this.x8801Sim != data.SimID) {
        return false;
      }
      clearTimeout(this.snapTimeout);
      this.showImg(evt, true);
    },
    x0800(evt) {
      var data = JSON.parse(evt.data);
      if (this.card.show || this.x8801Sim != data.SimID) {
        return false;
      }
      this.snapshotState = 3;
      this.snapTimeout = setTimeout(() => {
        this.showImg(evt, true);
      }, 25000);
    },
    x8801(evt) {
      var data = JSON.parse(evt.data);
      if (this.card.show || this.x8801Sim != data.SimID) {
        return false;
      }
      clearTimeout(this.snapTimeout);
      if (data.code == 0) {
        this.snapshotState = 1;
      } else {
        this.snapshotState = 2;
      }
    },
    showImg(evt, isShow) {
      var data = JSON.parse(evt.data);
      this.snapshotUrl =
        this.$dict.BASE_URL +
        `api/MultiMedia/GetMultiMediaByType?type=0&sim_id=${
          data.SimID
        }&media_id=${data.MultimediaDataID}`;
      this.snapshotState = 4;
      this.snapshotDialog = isShow;
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
    this.$instruction.offAll("x0800", this.$vehicle.sim_id, this.x0800);
    this.$instruction.offAll("x8801", this.$vehicle.sim_id, this.x8801);
    this.$instruction.offAll("x8800", this.$vehicle.sim_id, this.x8800);
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
    height: 120px;
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
      right: 20px;
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