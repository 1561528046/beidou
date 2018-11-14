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
      <div style="text-align:center;padding-top:10px;">
        <el-pagination background @current-change="changePager" @size-change="(size)=>{this.pager.size=size}" small :page-size="pager.size" :pager-count="5" layout="sizes,prev, pager, next,jumper" :total="pager.total">
        </el-pagination>
      </div>
    </div>
    <div style="width:50%; position:absolute;right:0;top:0;bottom:0; " ref="map"></div>
  </div>
</template>
<script>
/*eslint-disable*/
import { initMap } from "@/utils/map.js";
import { location2address, gps2amap } from "@/utils/map-tools.js";
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
    list: function() {
      this.list.map(item => {
        if (!item.address) {
          this.getAddress(item);
        }
      });
    },
    listAll: function() {
      this.pager.total = this.listAll.length;
    },
    "$props.vehicle.time": function() {
      if (
        this.vehicle.alarm != "0" ||
        this.vehicle.alarm != "" ||
        this.vehicle.fence_alarm_text != ""
      ) {
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
  computed: {
    list: function() {
      if (!this.listAll.length) {
        return [];
      }
      var start = (this.pager.current - 1) * this.pager.size;
      var end = this.pager.current * this.pager.size;
      return this.listAll.slice(start, end);
    }
  },
  data() {
    return {
      pager: {
        size: 20,
        total: 0,
        current: 1
      },
      tableHeight: 0,
      listAll: [],
      alarmLoading: false,
      addressList: new Map()
    };
  },

  methods: {
    changePager(current) {
      this.pager.current = current;
    },
    showPosition(row) {
      var vehicleData = {
        lng: row.Longitude,
        lat: row.Latitude,
        alarm: row.AlarmSign,
        angle: row.Direction
      };

      if (!this.$marker) {
        this.$marker = createMarker(vehicleData, window.AMap, "alarm");
        this.$marker.setMap(this.$map);
      } else {
        setMarker(this.$marker, vehicleData, window.AMap, "alarm");
      }
      this.$map.setCenter(new AMap.LngLat(vehicleData.lng, vehicleData.lat));
    },
    initAddress(list) {
      this.alarmLoading = true;
      gps2amap({
        data: list,
        longKey: "Longitude",
        latKey: "Latitude"
      })
        .then(res => {
          list.map((item, index) => {
            item.Longitude = res[index].split(",")[0];
            item.Latitude = res[index].split(",")[1];
          });
        })
        .then(() => {
          this.$set(this.$data, "listAll", list);
          this.alarmLoading = false;
          // location2address({
          //   data: list,
          //   longKey: "Longitude",
          //   latKey: "Latitude"
          // })
          //   .then(res => {
          //     res.map((item, index) => {
          //       list[index].address = item;
          //       this.$set(this.$data, "listAll", Object.freeze(list));
          //     });
          //     this.alarmLoading = false;
          //   })
          //   .catch(() => {
          //     this.$set(this.$data, "listAll", Object.freeze(list));
          //     this.alarmLoading = false;
          //   });
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
        EM0x30: vehicle.wifiSignal,
        fence_alarm_text: vehicle.fence_alarm_text
      };
      location2address({
        data: [newAlarm],
        longKey: "Longitude",
        latKey: "Latitude"
      }).then(res => {
        newAlarm.address = res[0];
        var list = [newAlarm].concat(this.listAll);
        this.$set(this.$data, "listAll", list);
      });
      // gps2amap({
      //   data: [newAlarm],
      //   longKey: "Longitude",
      //   latKey: "Latitude"
      // })
      //   .then(res => {
      //     newAlarm.Longitude = res[0].split(",")[0];
      //     newAlarm.Latitude = res[0].split(",")[1];
      //   })
      //   .then(() => {

      //   });
    },
    getAddress(data) {
      var key = data.Longitude + "," + data.Latitude;
      if (this.addressList.has(key)) {
        this.$set(data, "address", this.addressList.get(key));
      } else {
        location2address({
          data: [data],
          longKey: "Longitude",
          latKey: "Latitude"
        }).then(res => {
          this.addressList.set(key, res[0]);
          this.$set(data, "address", res[0]);
        });
      }
    },
    getTableHeight() {
      if (this.actived) {
        this.tableHeight = this.$refs.tableParent.clientHeight - 50;
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
      //PlatAlarmSign 1禁入 2禁出    RegionName围栏名称
      var fence_alarm_text = "";
      if (row.fence_alarm_text) {
        fence_alarm_text = row.fence_alarm_text;
      } else if (row.IsPlatformAlarm != 0) {
        fence_alarm_text =
          ["", "禁入", "禁出"][row.PlatAlarmSign || 0] + (row.RegionName || "");
      }
      return this.$dict.getAlarm(row.AlarmSign) + fence_alarm_text || "--";
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
