<template>
  <!-- 行驶速度记录 -->
  <div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="StartTime" label="开始时间"></el-table-column>
      <el-table-column prop="average" label="平局速度"></el-table-column>
      <el-table-column prop="signal" label="状态信号"></el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  created() {},
  data() {
    return {
      tableData: [],
      collectData: {}
    };
  },
  props: ["message"],
  watch: {
    message: {
      handler: function() {
        this.$set(this.$data, "collectData", this.$props.message);
        if (this.collectData.CommandWord == 8) {
          var UnitMinutesSpeeds = this.collectData.UnitMinutesSpeeds;
          this.$set(this.$data, "tableData", UnitMinutesSpeeds);
          var speed = 0;
          var state = 0;
          this.tableData.map(item => {
            item.SpeedAndStateSignals.map(itca => {
              speed = speed + itca.AverageSpeed;
              state = state + itca.StateSignal;
            });
            speed = speed / 60;
            state = state / 60;
            this.$set(item, "average", speed);
            this.$set(item, "signal", state);
          });
        }
      },
      deep: true
    }
  },
  methods: {}
};
</script>