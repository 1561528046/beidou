<template>
  <!-- 位置信息记录 -->
  <div>
    <el-table height="500" :data="list" style="width: 100%">
      <el-table-column prop="StartTime" label="开始时间"></el-table-column>
      <el-table-column prop="speed" label="平均速度"></el-table-column>
      <el-table-column label="位置信息">
        <template slot-scope="scope">
          <el-popover placement="right" style="height:400px" width="400" trigger="click">
            <el-table height="300px" :data="location">
              <el-table-column property="Speed" label="速度"></el-table-column>
              <el-table-column property="Longitude" label="经度"></el-table-column>
              <el-table-column property="Latitude" label="纬度"></el-table-column>
              <el-table-column property="Altitude" label="海拔高度"></el-table-column>
            </el-table>
            <el-button
              size="small"
              type="primary"
              slot="reference"
              @click="setLocation(scope.row)"
            >查看更多</el-button>
          </el-popover>
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
      locationData: [],
      location: [],
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
    setLocation(data) {
      this.$set(this.$data, "location", this.locationData[data.index]);
    },
    getTable() {
      var UnitHoursSpeeds = this.collectData.UnitHoursSpeeds;
      var location = [];
      UnitHoursSpeeds.map((item, index) => {
        var speed = 0;
        var loca = [];
        item.LocationItems.map((itca, index) => {
          speed = speed + item.AverageSpeed[index];
          loca.push({
            Altitude: itca.Altitude,
            Latitude: itca.Latitude,
            Longitude: itca.Longitude,
            Speed: item.AverageSpeed[index]
          });
        });
        item.index = index;
        item.speed = (speed / 60).toFixed(2);
        location.push(loca);
      });
      this.$set(this.$data, "tableData", UnitHoursSpeeds);
      this.$set(this.$data, "total", UnitHoursSpeeds.length);
      this.$set(this.$data, "locationData", location);
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