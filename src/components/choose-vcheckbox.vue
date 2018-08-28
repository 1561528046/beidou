<template>
  <el-form status-icon :rules="rules" :model="formData" size="small" ref="baseForm" class="msg-form">
    <el-row :gutter="30">
      <el-col :span="7">
        <el-form-item label="车牌号" prop="query_mode">
          <el-input v-model="formData.cade"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="7">
        <el-form-item label="用户">
          <el-input v-model="formData.cade"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="7">
        <el-form-item label="终端ID">
          <el-input v-model="formData.cade"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="3" style="text-align: right;">
        <el-form-item>
          <label style="display:inline-block; width:100%;"></label>
          <el-button size="small" type="primary">搜索</el-button>
        </el-form-item>
      </el-col>
    </el-row>
    <template>
      <el-table :data="tableData.data" border style="width: 100%">
        <el-table-column label="状态" width="50">
          <template slot-scope="scope">
            <el-checkbox size="medium" v-model="scope.row.checked" style="margin-left:7px;"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column prop="license" label="车牌号">
        </el-table-column>
        <el-table-column prop="user_id" label="用户">
        </el-table-column>
        <el-table-column prop="device_id" label="终端ID">
        </el-table-column>
      </el-table>
    </template>
    <el-form-item style="text-align:center; margin-top:20px;margin-bottom:-10px;">
      <el-button type="primary" size="small" @click="formSubmit">提交</el-button>
    </el-form-item>
    <!-- <button @click="$router.go(-1)">a</button> -->
  </el-form>
</template>
<script>
import { rules } from "@/utils/rules.js";
export default {
  data() {
    return {
      checked: true,
      formData: {
        license: "",
        user_id: "",
        device_id: ""
      },
      tableData: {
        data: [
          { license: "064620623980", user_id: "abc", device_id: "0000" },
          { license: "0123456789", user_id: "abc", device_id: "0000" }
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
    formSubmit() {
      var arr = [];
      for (var i = 0; i < this.tableData.data.length; i++) {
        if (this.tableData.data[i].checked) {
          arr.push(this.tableData.data[i]);
        }
      }
      this.$emit("button", arr);
    }
  },
  components: {}
};
</script>
<style>
</style>
