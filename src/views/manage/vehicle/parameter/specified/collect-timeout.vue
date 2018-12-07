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
    <div class="admin-table-pager">
      <el-pagination
        :disabled="paging"
        @size-change="handleSizeChange "
        @current-change="handleCurrentChange "
        :current-page="tableQuery.page "
        :page-sizes="[10, 20, 50, 100] "
        :page-size="tableQuery.size "
        :total="total "
        layout="total, sizes, prev, pager, next, jumper "
        background
      ></el-pagination>
    </div>
  </div>
</template>
<script>
export default {
  created() {},
  data() {
    return {
      tableQuery: {
        page: 1,
        size: 10
      },
      paging: true,
      total: 0,
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
          this.getTable();
          this.paging = false;
        }
      },
      deep: true
    }
  },
  methods: {
    getTable() {
      this.$set(this.$data, "tableData", this.collectData.OverTimeRecords);
      this.$set(this.$data, "total", this.tableData.length);
    },
    // 分页
    handleSizeChange(val) {
      this.tableQuery.page = 1;
      this.tableQuery.size = val;
      this.getTable();
    },
    handleCurrentChange(val) {
      this.tableQuery.page = val;
      this.getTable();
    }
  }
};
</script>