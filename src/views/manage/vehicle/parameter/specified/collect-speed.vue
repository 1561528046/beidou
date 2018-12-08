<template>
  <!-- 速度状态日志 -->
  <div>
    <el-table height="500" :data="list" style="width: 100%">
      <el-table-column prop="SpeedState" label="记录仪速度状态"></el-table-column>
      <el-table-column prop="StartTime" label="速度状态判定的开始时间"></el-table-column>
      <el-table-column prop="EndTime" label="速度状态判定的结束时间"></el-table-column>
      <el-table-column prop="record" label="记录速度"></el-table-column>
      <el-table-column prop="reference" label="参考速度"></el-table-column>
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
        if (
          this.collectData.CommandWord == 21 &&
          this.collectData.SpeedStateLogs != undefined
        ) {
          this.getTable();
          this.paging = false;
        }
      },
      deep: true
    }
  },
  methods: {
    getTable() {
      var SpeedStateLogs = this.collectData.SpeedStateLogs;
      SpeedStateLogs.map(item => {
        var speed = 0;
        var state = 0;
        item.RecordReferenceSpeeds.map(itca => {
          speed = speed + itca.RecordSpeed;
          state = state + itca.ReferenceSpeed;
        });
        item.record = (speed / 60).toFixed(2);
        item.reference = (state / 60).toFixed(0);
      });
      this.$set(this.$data, "tableData", SpeedStateLogs);
      this.$set(this.$data, "total", SpeedStateLogs.length);
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