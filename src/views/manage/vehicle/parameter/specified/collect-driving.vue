<template>
  <!-- 行驶速度记录 -->
  <div>
    <el-table height="500" :data="list" style="width: 100%">
      <el-table-column prop="StartTime" label="开始时间"></el-table-column>
      <el-table-column prop="average" label="平均速度"></el-table-column>
      <el-table-column prop="signal" label="状态信号"></el-table-column>
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
          this.collectData.CommandWord == 8 &&
          this.collectData.UnitMinutesSpeeds != undefined
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
      var UnitMinutesSpeeds = this.collectData.UnitMinutesSpeeds;

      UnitMinutesSpeeds.map(item => {
        var speed = 0;
        var state = 0;
        item.SpeedAndStateSignals.map(itca => {
          speed = speed + itca.AverageSpeed;
          state = state + itca.StateSignal;
        });
        item.average = (speed / 60).toFixed(2);
        item.signal = (state / 60).toFixed(0);
      });
      this.$set(this.$data, "tableData", UnitMinutesSpeeds);
      this.$set(this.$data, "total", UnitMinutesSpeeds.length);
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