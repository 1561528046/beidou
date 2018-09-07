<template>
  <el-form status-icon :model="formData" size="small" ref="baseForm" class="msg-form">
    <template>
      <el-table height="250" :data="tableData.data" border style="width: 100%">
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
import { getUserChildrenList, getVehicleByPage } from "@/api/index.js";
export default {
  data() {
    return {
      formData: {
        user_ids: ""
      },
      tableQuery: {
        data: []
      },
      tableData: {
        data: []
      }
    };
  },
  watch: {},
  created() {
    this.getTable();
  },
  methods: {
    formSubmit() {
      for (var i = 0; i < this.tableData.data.length; i++) {
        if (this.tableData.data[i].checked) {
          this.formData.user_ids =
            this.formData.user_ids + this.tableData.data[i].user_id + ",";
        }
      }
      this.formData.user_ids = this.formData.user_ids.substring(
        0,
        this.formData.user_ids.lastIndexOf(",")
      );
      console.log(this.formData);
      if (this.formData.user_ids == "") {
        return this.$notify({
          message: "请选择信息",
          title: "提示",
          type: "error"
        });
      }
      this.formData.user_ids = "1";
      getVehicleByPage(this.formData).then(res => {
        if (res.data.code == 0) {
          this.$set(this.tableQuery, "data", res.data.data);
          this.$emit("button", this.tableQuery.data);
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