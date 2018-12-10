<template>
  <!-- 事故疑点记录 -->
  <div>
    <el-table height="500" :data="list" style="width: 100%">
      <el-table-column prop="EndTime" label="行驶结束时间"></el-table-column>
      <el-table-column prop="LicenseNo" label="机动车驾驶证号码"></el-table-column>
      <el-table-column prop="speed" label="平均速度"></el-table-column>
      <el-table-column prop="Longitude" label="经度"></el-table-column>
      <el-table-column prop="Latitude" label="纬度"></el-table-column>
      <el-table-column prop="Altitude" label="海拔高度"></el-table-column>
      <el-table-column label="速度">
        <template slot-scope="scope">
          <el-popover placement="right" style="height:400px" width="400" trigger="click">
            <el-table height="300px" :data="Speed">
              <el-table-column property="Speed" label="速度"></el-table-column>
              <el-table-column label="制动信号" :formatter="(row)=>{return getState(row,7)}"></el-table-column>
              <el-table-column label="左转向" :formatter="(row)=>{return getState(row,6)}"></el-table-column>
              <el-table-column label="右转向" :formatter="(row)=>{return getState(row,5)}"></el-table-column>
              <el-table-column label="远光" :formatter="(row)=>{ return getState(row,4)}"></el-table-column>
              <el-table-column label="近光" :formatter="(row)=>{return getState(row,3)}"></el-table-column>
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
    getState(row, index) {
      var signal = row.StateSignal.toString("2");
      signal = "0".repeat(8 - signal.length) + signal; //128 - > 10000000    1-> 00000001
      signal = signal
        .split("")
        .reverse()
        .join("");
      if (signal[index] == 1) {
        return "开";
      } else {
        return "关";
      }
    },
    setLocation(data) {
      this.$set(this.$data, "Speed", this.SpeedData[data.index]);
    },
    getTable() {
      var AccidentRecords = this.collectData.AccidentRecords;
      var Data = [];
      AccidentRecords.map((item, index) => {
        var Speed = 0;
        var data = [];
        item.SpeedAndStateSignals.map(itca => {
          data.push({ Speed: itca.Speed, StateSignal: itca.StateSignal });
          Speed = Speed + itca.Speed;
        });
        item.index = index;
        item.speed = (Speed / 100).toFixed(2);
        item.Altitude = item.LocationItems[0].Altitude;
        item.Latitude = item.LocationItems[0].Latitude;
        item.Longitude = item.LocationItems[0].Longitude;
        Data.push(data);
      });
      this.$set(this.$data, "tableData", AccidentRecords);
      this.$set(this.$data, "total", this.tableData.length);
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