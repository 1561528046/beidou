<template>
  <!-- 事故疑点记录 -->
  <div>
    <el-table :data="tableData" style="width: 100%">
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
        if (this.collectData.CommandWord == 16) {
          var AccidentRecords = this.collectData.AccidentRecords;
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
            this.$set(item, "speed", Speed);
            this.$set(item, "signal", State);
            this.$set(
              item,
              "Altitude",
              AccidentRecords.LocationItems[index].Altitude
            );
            this.$set(
              item,
              "Latitude",
              AccidentRecords.LocationItems[index].Latitude
            );
            this.$set(
              item,
              "Longitude",
              AccidentRecords.LocationItems[index].Longitude
            );
          });
        }
      },
      deep: true
    }
  },
  methods: {}
};
</script>