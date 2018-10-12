<template>
  <div style="height:100%">
    <div style="width:50%;height:100%" ref="tableParent">
      <el-table style="height:100%" :data="list" :max-height="tableHeight" size="small">
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
import { getTodayVehicleAlarm } from "@/api/index.js";
export default {
  mounted() {
    window.vehicle = this.$props.vehicle;
    initMap(() => {
      var map = new AMap.Map(this.$refs.map, {
        zoom: 14
      });
      getTodayVehicleAlarm({ sim_id: this.$props.vehicle.sim_id }).then(res => {
        if (res.data.code == 0) {
          res.data.data = res.data.data.reverse();
          this.$set(this.$data, "list", Object.freeze(res.data.data));
        }
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
    }
  },
  props: ["vehicle"],
  data() {
    return {
      tableHeight: 0,
      list: []
    };
  },
  methods: {
    addAlarm() {
      var vehilce = this.$props.vehicle;
      var newAlarm = {
        AlarmSign: vehilce.alarm,
        Latitude: vehilce.lat,
        Longitude: vehilce.lng,
        Altitude: vehilce.altitude,
        Speed: vehilce.speed,
        Direction: vehilce.direction,
        Time: vehilce.time,
        EM0x01: vehicle.mileage,
        EM0x03: vehicle.speed1,
        EM0x30: vehicle.wifiSignal
      };
      var list = [newAlarm].concat(this.list);
      this.$set(this.$data, "list", list);
    },
    getTableHeight() {
      this.tableHeight = this.$refs.tableParent.clientHeight;
    },
    formatLicense() {
      return this.$props.vehicle.license;
    },
    formatSpeed(row) {
      var speed = row.EM0x03 || row.Speed;
      return speed / 10 || 0 + "km/h";
    },
    formatAlarm(row) {
      return this.$dict.getAlarm(row.AlarmSign) || "--";
    },
    formatTime(row) {
      return this.$utils.formatDate14(row.Time) || "--";
    }
  },
  beforeDestroyed() {
    window.removeEventListener("resize", this.geetTableHeight);
  }
};
</script>
<style>
</style>
