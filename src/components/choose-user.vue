<template>
  <el-form status-icon :rules="rules" :model="formData" size="small" ref="baseForm" class="msg-form">
    <template>
      <el-table :data="tableData.data" border style="width: 100%">
        <el-table-column label="状态" width="50">
          <template slot-scope="scope">
            <el-checkbox size="medium" v-model="scope.row.checked" style="margin-left:7px;"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column prop="real_name" label="用户">
        </el-table-column>
      </el-table>
    </template>
    <el-form-item style="text-align:center; margin-top:20px;margin-bottom:-10px;">
      <el-button type="primary" size="small" @click="formSubmit">提交</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { rules } from "@/utils/rules.js";
import { getUserChildrenList, getVehicleByPage } from "@/api/index.js";
export default {
  data() {
    return {
      formData: {
        license: "",
        user_id: "",
        device_id: ""
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
  created() {
    this.getTable();
  },
  methods: {
    formSubmit() {
      var arr = [];
      for (var i = 0; i < this.tableData.data.length; i++) {
        if (this.tableData.data[i].checked) {
          arr.push(this.tableData.data[i]);
        }
      }
      this.$emit("button", arr);
      for (var j = 0; j < arr.length; j++) {
        this.formData.user_id = this.formData.user_id + arr[j].user_id + ",";
      }
      this.formData.user_id = this.formData.user_id.substring(
        0,
        this.formData.user_id.lastIndexOf(",")
      );
      getVehicleByPage({ user_ids: this.formData.user_id }).then(res => {
        if (res.data.code == 0) {
          this.$set(this.tableData, "data", res.data.data);
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    getTable() {
      getUserChildrenList({ user_id: 1 }).then(res => {
        if (res.data.code == 0) {
          this.$set(this.tableData, "data", res.data.data);
        }
      });
    }
  },
  components: {}
};
</script>
<style>
</style>