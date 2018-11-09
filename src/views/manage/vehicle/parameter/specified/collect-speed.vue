<template>
  <!-- 速度状态日志 -->
  <div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="SpeedState" label="记录仪速度状态">
      </el-table-column>
      <el-table-column prop="StartTime" label="速度状态判定的开始时间">
      </el-table-column>
      <el-table-column prop="EndTime" label="速度状态判定的结束时间">
      </el-table-column>
      <el-table-column prop="record" label="记录速度">
      </el-table-column>
      <el-table-column prop="reference" label="参考速度">
      </el-table-column>
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
        if (this.collectData.CommandWord == 21) {
          var SpeedStateLogs = JSON.parse(this.collectData.SpeedStateLogs);
          this.$set(this.$data, "tableData", SpeedStateLogs);
          var speed = 0;
          var state = 0;
          this.tableData.map(item => {
            item.RecordReferenceSpeeds.map(itca => {
              speed = speed + itca.RecordSpeed;
              state = state + itca.ReferenceSpeed;
            });
            speed = speed / 60;
            state = state / 60;
            this.$set(item, "record", speed);
            this.$set(item, "reference", state);
          });
        }
      },
      deep: true
    }
  },
  methods: {}
};
</script>