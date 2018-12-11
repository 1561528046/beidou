<template>
  <!-- 参数修改记录 -->
  <div>
    <el-table height="500" :data="list" style="width: 100%">
      <el-table-column prop="EventHappenTime" label="事件发生时间"></el-table-column>
      <el-table-column prop="EventType" label="事件类型">
        <template slot-scope="scope">
          <label v-if="scope.row.EventType==130">设置车辆信息</label>
          <label v-if="scope.row.EventType==131">设置记录仪初次安装日期</label>
          <label v-if="scope.row.EventType==132">设置状态量配置信息</label>
          <label v-if="scope.row.EventType==194">设置记录仪时间</label>
          <label v-if="scope.row.EventType==195">设置记录仪脉冲系数</label>
          <label v-if="scope.row.EventType==196">设置初始里程</label>
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
      tableData: [],
      total: 0,
      collectData: {}
    };
  },
  props: ["message"],
  watch: {
    message: {
      handler: function() {
        this.$set(this.$data, "collectData", this.$props.message);
        if (
          this.collectData.CommandWord == 20 &&
          this.collectData.ParameterUpdateRecords != undefined
        ) {
          this.getTable();
          this.paging = false;
        }
      },
      deep: true
    }
  },
  computed: {
    list: function() {
      return this.tableData.slice(
        (this.tableQuery.page - 1) * this.tableQuery.size,
        this.tableQuery.page * this.tableQuery.size
      );
    }
  },
  methods: {
    getTable() {
      this.$set(
        this.$data,
        "tableData",
        this.collectData.ParameterUpdateRecords
      );
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