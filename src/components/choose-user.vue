<template>
  <el-form status-icon :rules="rules" :model="formData" size="small" ref="baseForm" class="msg-form">
    <template>
      <el-table :data="tableData.data" border style="width: 100%">
        <el-table-column label="状态" width="50">
          <template slot-scope="scope">
            <el-checkbox size="medium" v-model="scope.row.checked" style="margin-left:7px;"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column prop="user_id" label="用户">
        </el-table-column>
      </el-table>
    </template>
    <el-form-item style="text-align:center; margin-top:20px;margin-bottom:-10px;">
      <el-button type="primary" size="small">提交</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { rules } from "@/utils/rules.js";
export default {
  data() {
    return {
      formData: {
        license: "",
        user_id: "",
        device_id: "",
        page: 1,
        size: 10
      },
      tableData: {
        data: [{ license: "064620623980", user_id: "abc", device_id: "0000" }]
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
      console.log(this.formData);
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