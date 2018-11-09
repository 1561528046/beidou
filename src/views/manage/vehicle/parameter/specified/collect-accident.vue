<template>
  <!-- 事故疑点记录 -->
  <div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="EndTime" label="行驶结束时间">
      </el-table-column>
      <el-table-column prop="LicenseNo" label="机动车驾驶证号码">
      </el-table-column>
      <el-table-column prop="speed" label="速度">
      </el-table-column>
      <el-table-column prop="signal" label="状态信号">
      </el-table-column>
      <el-table-column prop="LocationItems.Longitude" label="经度">
      </el-table-column>
      <el-table-column prop="LocationItems.Latitude" label="纬度">
      </el-table-column>
      <el-table-column prop="LocationItems.Altitude" label="海拔高度">
      </el-table-column>
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
          var AccidentRecords = JSON.parse(this.collectData.AccidentRecords);
          this.$set(this.$data, "tableData", AccidentRecords);
          var Speed = 0;
          var State = 0;
          this.tableData.map(item => {
            item.SpeedAndStateSignals.map(itca => {
              Speed = Speed + itca.Speed;
              State = State + itca.StateSignal;
            });
            Speed = Speed / 100;
            State = State / 100;
            this.$set(item, "speed", Speed);
            this.$set(item, "signal", State);
          });
        }
      },
      deep: true
    }
  },
  methods: {}
};
</script>