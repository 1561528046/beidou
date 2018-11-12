<template>
  <el-form v-loading="loading" status-icon :rules="rules" :model="tableQuery" size="small" ref="baseForm" class="msg-form">
    <el-row :gutter="30">
      <el-col :span="7">
        <el-form-item label="车牌号" prop="query_mode">
          <el-input v-model="tableQuery.license"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="7">
        <el-form-item label="业户">
          <el-input v-model="tableQuery.owner"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="7">
        <el-form-item label="终端ID">
          <el-input v-model="tableQuery.device_no"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="3" style="text-align: right;">
        <el-form-item>
          <label style="display:inline-block; width:100%;"></label>
          <el-button size="small" @click="selectForm(1)" type="primary">搜索</el-button>
        </el-form-item>
      </el-col>
    </el-row>
    <template>
      <el-table :data="tableData.data" border style="width: 100%">
        <el-table-column prop="license" label="车牌号" :formatter="$utils.baseFormatter" width="260">
        </el-table-column>
        <el-table-column prop="owner" label="业户" :formatter="$utils.baseFormatter" width="260">
        </el-table-column>
        <el-table-column prop="device_no" label="终端ID" :formatter="$utils.baseFormatter" width="260">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button style="margin-left:20px;" size="small" @click="formSubmit(scope)">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="admin-table-pager">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[10, 20, 50, 100]" :page-size="tableQuery.size" :total="tableData.total" layout="total, sizes, prev, pager, next, jumper" background>
        </el-pagination>
      </div>
    </template>
    <!-- <button @click="$router.go(-1)">a</button> -->
  </el-form>
</template>
<script>
import { rules } from "@/utils/rules.js";
import { getVehicleByPage } from "@/api/index.js";
export default {
  data() {
    return {
      loading: true,
      formData: {
        license: "",
        owner: "",
        device_no: ""
      },
      tableQuery: {
        license: "",
        owner: "",
        device_no: "",
        page: 1,
        size: 10
      },
      tableData: {
        total: 0,
        data: []
      },
      rules: {
        ...rules
      }
    };
  },
  watch: {},
  created() {
    this.selectForm();
  },
  methods: {
    selectForm(state) {
      if (state == 1) {
        this.tableQuery.page = 1;
      }
      getVehicleByPage(this.tableQuery).then(res => {
        if (res.data.code == 0) {
          this.$set(this.tableData, "data", res.data.data);
          this.$set(this.tableData, "total", res.data.total);
          this.loading = false;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    formSubmit(scope) {
      this.$set(scope.row, "dialog", false);
      this.$emit("button", scope);
    },
    // 分页
    handleSizeChange(val) {
      this.tableQuery.page = 1;
      this.tableQuery.size = val;
      this.selectForm();
    },
    handleCurrentChange(val) {
      this.tableQuery.page = val;
      this.selectForm();
    }
  },
  components: {}
};
</script>
<style>
</style>