<template>
  <div style="height:100%">
    <div style="width:50%;height:100%" ref="tableParent">
      <el-table style="height:100%" highlight-current-row :data="list" @row-click="showPosition" :max-height="tableHeight" size="small" v-loading="alarmLoading" element-loading-text="载入当天报警记录">
        <el-table-column prop="License" label="车牌号" :formatter="formatLicense"> </el-table-column>
        <el-table-column prop="" label="报警类型" :formatter="formatAlarm"> </el-table-column>
        <el-table-column prop="" label="报警时间" :formatter="formatTime "> </el-table-column>
        <el-table-column prop="address" label="当时位置"> </el-table-column>
        <el-table-column prop="" label="行驶速度" :formatter="formatSpeed"> </el-table-column>
        <el-table-column prop="EM0x30" label="信号质量"> </el-table-column>
      </el-table>
    </div>
    <div style="width:50%; position:absolute;right:0;top:0;bottom:0; " ref="map"></div>
  </div>
</template>
<script>
/*eslint-disable*/
import { initMap } from "@/utils/map.js";
import { location2address } from "@/utils/map-tools.js";
import { createMarker, setMarker } from "@/utils/map.js";
import { getTodayVehicleAlarm } from "@/api/index.js";
export default {
  mounted() {
    initMap(() => {
      this.$map = new AMap.Map(this.$refs.map, {
        zoom: 14
      });
      this.alarmLoading = true;
      getTodayVehicleAlarm({ sim_id: this.$props.vehicle.sim_id })
        .then(res => {
          this.alarmLoading = false;
          if (res.data.code == 0) {
            res.data.data = res.data.data.reverse();
            this.initAddress(res.data.data);
          }
        })
        .catch(() => {
          this.alarmLoading = false;
        });
    });
    this.$nextTick(() => {
      this.getTableHeight();
    });
    window.addEventListener("resize", this.getTableHeight);
  },
  watch: {
    "$props.vehicle.time": function() {
      if (this.vehicle.alarm != "0" || this.vehicle.alarm != "") {
        //监控vehicle的time变化 ，如果alarm不为0 则list增加一条记录
        this.addAlarm();
      }
    },
    "$props.actived": function(newVal, oldVal) {
      if (newVal == true) {
        this.$nextTick(() => {
          this.getTableHeight();
        });
      }
    }
  },
  props: ["vehicle", "actived"],
  data() {
    return {
      tableHeight: 0,
      list: [],
      alarmLoading: false
    };
  },

  methods: {
    showPosition(row) {
      var vehicleData = {
        lng: row.Longitude,
        lat: row.Latitude,
        alarm: row.AlarmSign,
        angle: row.Direction
      };

      if (!this.$marker) {
        this.$marker = createMarker(vehicleData, window.AMap);
        this.$marker.setMap(this.$map);
      } else {
        setMarker(this.$marker, vehicleData, window.AMap);
      }
      this.$map.setCenter(new AMap.LngLat(vehicleData.lng, vehicleData.lat));
    },
    initAddress(list) {
      this.alarmLoading = true;
      location2address({
        data: list,
        longKey: "Longitude",
        latKey: "Latitude"
      })
        .then(res => {
          res.map((item, index) => {
            list[index].address = item;
            this.$set(this.$data, "list", Object.freeze(list));
            this.alarmLoading = false;
          });
        })
        .catch(() => {
          this.$set(this.$data, "list", Object.freeze(list));
          this.alarmLoading = false;
        });
    },
    addAlarm() {
      var vehicle = this.$props.vehicle;
      var newAlarm = {
        AlarmSign: vehicle.alarm,
        Latitude: vehicle.lat,
        Longitude: vehicle.lng,
        Altitude: vehicle.altitude,
        Speed: vehicle.speed,
        Direction: vehicle.direction,
        Time: vehicle.time,
        EM0x01: vehicle.mileage,
        EM0x03: vehicle.speed1,
        EM0x30: vehicle.wifiSignal
      };
      location2address({
        data: [newAlarm],
        longKey: "Longitude",
        latKey: "Latitude"
      }).then(res => {
        newAlarm.address = res[0];
        var list = [newAlarm].concat(this.list);
        this.$set(this.$data, "list", list);
      });
    },
    getTableHeight() {
      if (this.actived) {
        this.tableHeight = this.$refs.tableParent.clientHeight;
      }
    },
    formatLicense() {
      return this.$props.vehicle.license;
    },
    formatSpeed(row) {
      var speed = row.EM0x03 || row.Speed;
      return (speed || 0) + "km/h";
    },
    formatAlarm(row) {
      return this.$dict.getAlarm(row.AlarmSign) || "--";
    },
    formatTime(row) {
      return this.$utils.formatDate14(row.Time) || "--";
    }
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.getTableHeight);
  }
};
</script>
<style>
</style>
