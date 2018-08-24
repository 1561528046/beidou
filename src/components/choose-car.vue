<template>
  <el-form status-icon :rules="rules" :model="formData" size="small" ref="baseForm" class="msg-form">
    <el-row :gutter="30">
      <el-col :span="10">
        <el-form-item label="查询方式" prop="query_mode">
          <el-select v-model="formData.query_mode" placeholder="选择查询方式" style="width:100%;">
            <el-option label="车牌号" value="1"></el-option>
            <el-option label="用户" value="2"></el-option>
            <el-option label="终端ID" value="3"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="10">
        <el-form-item>
          <label style=" display:block; height:32px;"></label>
          <el-input v-model="formData.cade"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="4">
        <el-form-item>
          <label style=" display:block; height:31px;"></label>
          <el-button size="small" type="primary">搜索</el-button>
        </el-form-item>
      </el-col>
    </el-row>
    <template>
      <el-table :data="tableData.data" border style="width: 100%">
        <el-table-column prop="license" label="车牌号" width="148">
        </el-table-column>
        <el-table-column prop="user_id" label="用户" width="148">
        </el-table-column>
        <el-table-column prop="device_id" label="终端ID" width="148">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="small" @click="formSubmit(scope)">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <!-- <button @click="$router.go(-1)">a</button> -->
  </el-form>
</template>
<script>
import { rules } from "@/utils/rules.js";
export default {
  data() {
    return {
      formData: {
        query_mode: "",
        cade: ""
      },
      tableData: {
        data: [
          { license: "064620623980", user_id: "abc", device_id: "0000" },
          { license: 12345, user_id: "abce", device_id: "0001" }
        ]
      },
      rules: {
        ...rules
      }
    };
  },
  watch: {},
  created() {},
  methods: {
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