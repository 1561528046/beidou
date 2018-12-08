<template>
  <!-- 事故疑点记录 -->
  <div>
    <el-table height="500" :data="list" style="width: 100%">
      <el-table-column prop="EndTime" label="行驶结束时间"></el-table-column>
      <el-table-column prop="LicenseNo" label="机动车驾驶证号码"></el-table-column>
      <el-table-column prop="speed" label="速度"></el-table-column>
      <el-table-column prop="signal" label="状态信号"></el-table-column>
      <el-table-column prop="Longitude" label="经度"></el-table-column>
      <el-table-column prop="Latitude" label="纬度"></el-table-column>
      <el-table-column prop="Altitude" label="海拔高度"></el-table-column>
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
      collectData: [],
      tableData: [],
      total: 0
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
          this.collectData.CommandWord == 16 &&
          this.collectData.AccidentRecords != undefined
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
      var AccidentRecords = this.collectData.AccidentRecords;
      var Speed = 0;
      var State = 0;
      AccidentRecords.map(item => {
        item.SpeedAndStateSignals.map(itca => {
          Speed = Speed + itca.Speed;
          State = State + itca.StateSignal;
        });
        item.speed = (Speed / 100).toFixed(2);
        item.signal = (State / 100).toFixed(0);
        item.Altitude = item.LocationItems[0].Altitude;
        item.Latitude = item.LocationItems[0].Latitude;
        item.Longitude = item.LocationItems[0].Longitude;
      });
      this.$set(this.$data, "tableData", AccidentRecords);
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