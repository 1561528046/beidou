<template>
  <div class="admin-table-container">
    <div class="admin-table-search">
      <el-form :model="formInline" label-width="80px" label-position="left" class="table-search" size="mini">
        <el-row :gutter="30">
          <el-col :span="5">
            <el-form-item label="审批人">
              <el-input v-model="formInline.user" placeholder="审批人"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="活动区域">
              <el-select v-model="formInline.region" placeholder="活动区域" style="display:block;">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="审批人">
              <el-input v-model="formInline.user" placeholder="审批人"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-button type="primary" @click="onSubmit">查询1</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="admin-table-actions">
      <el-button type="primary" size="small" icon="el-icon-search">添加</el-button>
      <el-button type="primary" size="small">导出1
        <i class="el-icon-upload el-icon--right"></i>
      </el-button>
    </div>
    <el-table :data="tableData" style="width: 100%" class="admin-table-list">
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
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[100, 200, 300, 400]" :page-size="100" layout="total, sizes, prev, pager, next, jumper" :total="400" background>
      </el-pagination>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
import { getVehicleList } from "@/api/index.js";
export default {
  created() {
    getVehicleList()
      .then(response => {
        this.$set(this.$data, "tableData", response.data.data);
      })
      .catch(() => {});
  },
  data() {
    return {
      currentPage: 1,
      formInline: {
        user: "",
        region: ""
      },
      tableData: []
    };
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    onSubmit() {
      console.log("submit!");
    },
    formatter(row, column) {
      return row.address;
    },
    filterTag(value, row) {
      return row.tag === value;
    },
    filterHandler(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    }
  }
};
</script>
