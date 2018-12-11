<template>
  <!-- 超时驾驶记录 -->
  <div>
    <el-table height="500" :data="list" style="width: 100%">
      <el-table-column prop="LicenseNo" label="机动车驾驶证号码"></el-table-column>
      <el-table-column prop="StartTime" label="连续驾驶开始时间"></el-table-column>
      <el-table-column prop="EndTime" label="连续驾驶结束时间"></el-table-column>
      <el-table-column label="连续驾驶开始时间所在的位置信息">
        <template slot-scope="scope">
          <el-popover placement="right" style="height:400px" width="400" trigger="click">
            <el-table height="300px" :data="scope.row.StartLocationItems">
              <el-table-column prop="Longitude" label="经度"></el-table-column>
              <el-table-column prop="Latitude" label="纬度"></el-table-column>
              <el-table-column prop="Altitude" label="海拔高度"></el-table-column>
            </el-table>
            <el-button size="small" type="primary" slot="reference">查看更多</el-button>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="连续驾驶结束时间所在的位置信息">
        <template slot-scope="scope">
          <el-popover placement="right" style="height:400px" width="400" trigger="click">
            <el-table height="300px" :data="scope.row.EndLocationItems">
              <el-table-column prop="Longitude" label="经度"></el-table-column>
              <el-table-column prop="Latitude" label="纬度"></el-table-column>
              <el-table-column prop="Altitude" label="海拔高度"></el-table-column>
            </el-table>
            <el-button size="small" type="primary" slot="reference">查看更多</el-button>
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
          this.collectData.CommandWord == 17 &&
          this.collectData.OverTimeRecords != undefined
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