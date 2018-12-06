<template>
  <!-- 参数修改记录 -->
  <div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="EventHappenTime" label="事件发生时间"></el-table-column>
      <el-table-column prop="EventType" label="事件类型"></el-table-column>
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
        if (this.collectData.CommandWord == 20) {
          var ParameterUpdateRecords = this.collectData.ParameterUpdateRecords;

          this.$set(this.$data, "tableData", ParameterUpdateRecords);
        }
      },
      deep: true
    }
  },
  methods: {}
};
</script>