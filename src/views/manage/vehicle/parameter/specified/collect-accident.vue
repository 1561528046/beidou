<template>
  <!-- 事故疑点记录 -->
  <div>
    <el-table :data="tableData" style="width: 100%">
      {{tableData}}
      <el-table-column prop="EndTime" label="行驶结束时间"></el-table-column>
      <el-table-column prop="LicenseNo" label="机动车驾驶证号码"></el-table-column>
      <el-table-column prop="speed" label="速度"></el-table-column>
      <el-table-column prop="signal" label="状态信号"></el-table-column>
      <el-table-column prop="Longitude" label="经度"></el-table-column>
      <el-table-column prop="Latitude" label="纬度"></el-table-column>
      <el-table-column prop="Altitude" label="海拔高度"></el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  created() {},
  data() {
    return {
      collectData: [],
      tableData: []
    };
  },
  props: ["message"],
  watch: {
    message: {
      handler: function() {
        this.$set(this.$data, "collectData", this.$props.message);
        // if (this.collectData.CommandWord == 16) {
        var AccidentRecords = [
          {
            SpeedAndStateSignals: [
              { Speed: 4, StateSignal: 0 },
              { Speed: 5, StateSignal: 0 },
              { Speed: 5, StateSignal: 0 },
              { Speed: 5, StateSignal: 0 },
              { Speed: 5, StateSignal: 0 },
              { Speed: 4, StateSignal: 0 },
              { Speed: 4, StateSignal: 0 },
              { Speed: 4, StateSignal: 0 },
              { Speed: 4, StateSignal: 0 },
              { Speed: 4, StateSignal: 0 },
              { Speed: 5, StateSignal: 0 },
              { Speed: 5, StateSignal: 0 },
              { Speed: 5, StateSignal: 0 }
            ],
            LicenseNo: "440000000000000000",
            LocationItems: [
              { Altitude: 0, Latitude: 70.023753, Longitude: 23.716258 }
            ],
            EndTime: "2018/8/21 17:43:32"
          }
        ];
        // this.collectData.AccidentRecords;
        this.$set(this.$data, "tableData", AccidentRecords);
        var Speed = 0;
        var State = 0;
        this.tableData.map((item, index) => {
          item.SpeedAndStateSignals.map(itca => {
            Speed = Speed + itca.Speed;
            State = State + itca.StateSignal;
          });
          Speed = (Speed / 100).toFixed(2);
          State = State / 100;
          item.speed = Speed;
          item.signal = State;
          item.Altitude = AccidentRecords.LocationItems[index].Altitude;
          item.Latitude = AccidentRecords.LocationItems[index].Latitude;
          item.Longitude = AccidentRecords.LocationItems[index].Longitude;
        });
        // }
      },
      deep: true
    }
  },
  methods: {}
};
</script>