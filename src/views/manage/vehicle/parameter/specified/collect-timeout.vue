<template>
  <!-- 超时驾驶记录 -->
  <div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="LicenseNo" label="机动车驾驶证号码"></el-table-column>
      <el-table-column prop="StartTime" label="连续驾驶开始时间"></el-table-column>
      <el-table-column prop="EndTime" label="连续驾驶结束时间"></el-table-column>
      <el-table-column prop="StartLocationItems.Longitude" label="连续驾驶开始时间所在的最近一次有效经度"></el-table-column>
      <el-table-column prop="StartLocationItems.Latitude" label="连续驾驶开始时间所在的最近一次有效纬度"></el-table-column>
      <el-table-column prop="StartLocationItems.Altitude" label="连续驾驶开始时间所在的最近一次有效海拔高度"></el-table-column>
      <el-table-column prop="EndLocationItems.Longitude" label="连续驾驶结束时间所在的最近一次有效经度"></el-table-column>
      <el-table-column prop="EndLocationItems.Latitude" label="连续驾驶结束时间所在的最近一次有效纬度"></el-table-column>
      <el-table-column prop="EndLocationItems.Altitude" label="连续驾驶开始时间所在的最近一次有效海拔高度"></el-table-column>
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
        if (this.collectData.CommandWord == 17) {
          var OverTimeRecords = this.collectData.OverTimeRecords;
          this.$set(this.$data, "tableData", OverTimeRecords);
        }
      },
      deep: true
    }
  },
  methods: {}
};
</script>