<template>
  <el-form status-icon :rules="rules" :model="formData" size="small" ref="baseForm" class="msg-form">
    <el-row :gutter="30">
      <el-col :span="7">
        <el-form-item label="车牌号" prop="query_mode">
          <el-input v-model="formData.license"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="7">
        <el-form-item label="用户">
          <el-input v-model="formData.user_name"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="7">
        <el-form-item label="终端ID">
          <el-input v-model="formData.device_no"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="3" style="text-align: right;">
        <el-form-item>
          <label style="display:inline-block; width:100%;"></label>
          <el-button size="small" @click="selectForm" type="primary">搜索</el-button>
        </el-form-item>
      </el-col>
    </el-row>
    <template>
      <el-table :data="tableData.data" border style="width: 100%">
        <el-table-column prop="license" label="车牌号" width="260">
        </el-table-column>
        <el-table-column prop="" label="用户" width="260">
        </el-table-column>
        <el-table-column prop="device_no" label="终端ID" width="260">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button style="margin-left:20px;" size="small" @click="formSubmit(scope)">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
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
      formData: {
        license: "",
        user_name: "",
        device_no: "",
        page: 1,
        size: 10
      },
      tableData: {
        data: []
      },
      rules: {
        ...rules
      }
    };
  },
  watch: {},
  created() {},
  methods: {
    selectForm() {
      getVehicleByPage(this.formData).then(res => {
        if (res.data.code == 0) {
          this.$set(this.tableData, "data", res.data.data);
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    formSubmit(scope) {
      this.$set(scope.row, "dialog", false);
      this.$emit("button", scope);
    }
  },
  components: {}
};
</script>
<style>
</style>