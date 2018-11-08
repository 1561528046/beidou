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
      <el-table-column prop="RecordSpeed" label="开始时间对应的记录速度">
      </el-table-column>
      <el-table-column prop="ReferenceSpeed" label="开始时间对应的参考速度">
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
        }
      },
      deep: true
    }
  },
  methods: {}
};
</script>