<template>
  <!-- 外部供电记录 -->
  <div>
    <el-table :data="list" style="width: 100%">
      <el-table-column prop="EventHappenTime" label="事件发生时间"></el-table-column>
      <el-table-column prop="EventType" label="事件类型">
        <template slot-scope="scope">
          <label v-if="scope.row.EventType=='1'">通电</label>
          <label v-if="scope.row.EventType=='2'">断电</label>
        </template>
      </el-table-column>
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
  computed: {
    list: function() {
      return this.tableData.slice(
        (this.tableQuery.page - 1) * this.tableQuery.size,
        this.tableQuery.page * this.tableQuery.size
      );
    }
  },
  watch: {
    message: {
      handler: function() {
        this.$set(this.$data, "collectData", this.$props.message);
        if (this.collectData.CommandWord == 19) {
          this.getTable();
          this.paging = false;
        }
      },
      deep: true
    }
  },
  methods: {
    getTable() {
      this.$set(this.$data, "tableData", this.collectData.ExternalPowerRecords);
      this.$set(this.$data, "tableData", this.tableData.length);
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