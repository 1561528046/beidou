<template>
  <!-- 外部供电记录 -->
  <div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="EventHappenTime" label="事件发生时间">
      </el-table-column>
      <el-table-column prop="EventType" label="事件类型">
        <template slot-scope="scope">
          <label v-if="scope.row.EventType=='1'">通电</label>
          <label v-if="scope.row.EventType=='2'">断电</label>
        </template>

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
        if (this.collectData.CommandWord == 19) {
          var ExternalPowerRecords = JSON.parse(
            this.collectData.ExternalPowerRecords
          );
          this.$set(this.$data, "tableData", ExternalPowerRecords);
        }
      },
      deep: true
    }
  },
  methods: {}
};
</script>