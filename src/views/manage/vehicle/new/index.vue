<template>
  <div class="admin-table-container">
    <div class="admin-table-search">
      <el-form :model="tableQuery" label-width="80px" label-position="left" class="table-search" size="mini">
        <el-row :gutter="30">
          <el-col :span="5">
            <el-form-item label="审批人">
              <el-input v-model="tableQuery.user" placeholder="审批人"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="活动区域">
              <el-select v-model="tableQuery.region" placeholder="活动区域" style="display:block;">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="审批人">
              <el-input v-model="tableQuery.user" placeholder="审批人"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-button type="primary" @click="getTable">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="admin-table-actions">
      <router-link :to="{name:'new-add'}">
        <el-button type="primary" size="small" icon="el-icon-search">
          添加
        </el-button>
      </router-link>
      <el-button type="primary" size="small">导出
        <i class="el-icon-upload el-icon--right"></i>
      </el-button>
    </div>
    <el-table :data="tableData.data" v-loading="tableLoading" style="width: 100%" class="admin-table-list">
      <el-table-column prop="contract_date" label="到期日期" sortable width="180" :filters="[{text: '2016-05-01', value: '2016-05-01'}, {text: '2016-05-02', value: '2016-05-02'}, {text: '2016-05-03', value: '2016-05-03'}, {text: '2016-05-04', value: '2016-05-04'}]" :filter-method="filterHandler">
      </el-table-column>
      <el-table-column prop="license" label="车牌号">
      </el-table-column>
      <el-table-column prop="vin" label="vin">
      </el-table-column>
      <el-table-column prop="terminal_no" label="terminal_no"></el-table-column>
      <el-table-column prop="simid" label="simid"></el-table-column>
      <el-table-column prop="owner" label="车主"></el-table-column>
      <el-table-column prop="linkman" label="联系人"></el-table-column>
      <el-table-column prop="tel" label="联系电话"></el-table-column>
    </el-table>
    <div class="admin-table-pager">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[20, 40, 80, 100]" :page-size="tableQuery.size" :total="tableData.total" layout="total, sizes, prev, pager, next, jumper" background>
      </el-pagination>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
import { getVehicleList } from "@/api/index.js";
export default {
  created() {
    this.getTable();
  },
  data() {
    return {
      tableQuery: {
        user: "",
        region: "",
        size: 10,
        page: 1
      },
      tableData: {
        total: 0,
        data: []
      },
      tableLoading: true
    };
  },
  methods: {
    formatter(row, column) {
      return row.address;
    },
    filterTag(value, row) {
      return row.tag === value;
    },
    filterHandler(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    },
    handleSizeChange(val) {
      this.tableQuery.page = 1;
      this.tableQuery.limit = val;
      this.getTable();
    },
    handleCurrentChange(val) {
      this.tableQuery.page = val;
      this.getTable();
    },
    getTable() {
      this.tableLoading = true;
      getVehicleList(this.tableQuery)
        .then(res => {
          this.$set(this.$data, "tableData", res.data);
          this.tableLoading = false;
        })
        .catch(() => {});
    }
  }
};
</script>
