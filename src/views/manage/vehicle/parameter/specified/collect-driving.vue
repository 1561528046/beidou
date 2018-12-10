<template>
  <!-- 行驶速度记录 -->
  <div>
    <el-table height="500" :data="list" style="width: 100%">
      <el-table-column prop="StartTime" label="开始时间"></el-table-column>
      <el-table-column prop="average" label="平均速度"></el-table-column>
      <el-table-column prop="signal" label="状态信号"></el-table-column>
      <el-table-column label="速度">
        <template slot-scope="scope">
          <el-popover placement="right" style="height:400px" width="400" trigger="click">
            <el-table height="300px" :data="Speed">
              <el-table-column property="Speed" label="速度"></el-table-column>
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
      paging: true,
      SpeedData: [],
      Speed: [],
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
    setLocation(data) {
      this.$set(this.$data, "Speed", this.SpeedData[data.index]);
    },
    getTable() {
      var UnitMinutesSpeeds = this.collectData.UnitMinutesSpeeds;
      var Data = [];
      UnitMinutesSpeeds.map((item, index) => {
        var speed = 0;
        var state = 0;
        var data = [];
        item.SpeedAndStateSignals.map(itca => {
          data.push({ Speed: itca.AverageSpeed });
          speed = speed + itca.AverageSpeed;
          state = state + itca.StateSignal;
        });
        item.index = index;
        item.average = (speed / 60).toFixed(2);
        item.signal = (state / 60).toFixed(0);
        Data.push(data);
      });
      this.$set(this.$data, "tableData", UnitMinutesSpeeds);
      this.$set(this.$data, "total", UnitMinutesSpeeds.length);
      this.$set(this.$data, "SpeedData", Data);
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