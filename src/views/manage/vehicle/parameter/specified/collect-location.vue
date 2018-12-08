<template>
  <!-- 位置信息记录 -->
  <div>
    <el-table height="500" :data="list" style="width: 100%">
      <el-table-column prop="StartTime" label="开始时间"></el-table-column>
      <el-table-column prop="speed" label="平均速度"></el-table-column>
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
          this.collectData.CommandWord == 9 &&
          this.collectData.UnitHoursSpeeds != undefined
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
      var UnitHoursSpeeds = this.collectData.UnitHoursSpeeds;
      UnitHoursSpeeds.map(item => {
        var speed = 0;
        var Altitude = 0;
        var Latitude = 0;
        var Longitude = 0;
        item.LocationItems.map((itca, index) => {
          speed = speed + item.AverageSpeed[index];
          Altitude = Altitude + itca.Altitude;
          Latitude = Latitude + itca.Latitude;
          Longitude = Longitude + itca.Longitude;
        });
        item.speed = (speed / 60).toFixed(2);
        item.Altitude = (Altitude / 60).toFixed(0);
        item.Latitude = (Latitude / 60).toFixed(6);
        item.Longitude = (Longitude / 60).toFixed(6);
      });
      this.$set(this.$data, "tableData", UnitHoursSpeeds);
      this.$set(this.$data, "total", UnitHoursSpeeds.length);
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