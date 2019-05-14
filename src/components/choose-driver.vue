<template>
  <div>
    <el-table :data="tableData.data" style="width: 100%">
      <el-table-column prop="driver_card_id" label="司机卡编号"></el-table-column>
      <el-table-column prop="driver_name" label="姓名"></el-table-column>
      <el-table-column prop="tel" label="联系电话"></el-table-column>
      <el-table-column prop="identity_id" label="身份证 " :formatter="$utils.baseFormatter"></el-table-column>
      <el-table-column
        prop="license_validity"
        :formatter="(row)=>{return $utils.formatDate(row.begin_date)+'--'+$utils.formatDate(row.end_date) } "
        label="驾驶证有效期"
      ></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="chooseDriver(scope)">选择</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="admin-table-pager">
      <el-pagination
        @size-change="handleSizeChange "
        @current-change="handleCurrentChange "
        :current-page="tableQuery.page "
        :page-sizes="[10, 20, 50, 100] "
        :page-size="tableQuery.size "
        :total="tableData.total "
        layout="total, sizes, prev, pager, next, jumper "
        background
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import { getDriverList } from "@/api/index.js";
export default {
  created() {
    this.getTable();
  },
  data() {
    return {
      tableQuery: {
        page: 1,
        size: 10,
        driver_card_id: "",
        driver_name: "",
        identity_id: "",
        order_field: "",
        order: "",
        num_fatigue_driving_begin: "",
        num_fatigue_driving_end: "",
        num_abnormal_driving_begin: "",
        num_abnormal_driving_end: "",
        num_100km_alarm_begin: "",
        num_100km_alarm_end: "",
        num_punctuality_begin: "",
        num_punctuality_end: "",
        num_total_begin: "",
        num_total_end: ""
      },
      tableData: {
        data: [],
        total: 0
      }
    };
  },
  methods: {
    chooseDriver(scope) {
      this.$emit("save", scope.row);
    },
    getTable() {
      getDriverList(this.tableQuery).then(res => {
        if (res.data.code == 0) {
          this.$set(this.tableData, "data", res.data.data);
          this.$set(this.tableData, "total", res.data.total);
        } else {
          return this.$notify({
            message: res.data.msg,
            title: "提示",
            type: "error"
          });
        }
      });
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
