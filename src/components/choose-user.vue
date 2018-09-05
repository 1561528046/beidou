<template>
  <el-form status-icon :model="formData" size="small" ref="baseForm" class="msg-form">
    <template>
      <el-table :data="tableData.data" border style="width: 100%">
        <el-table-column prop="real_name" label="用户">
        </el-table-column>
        <el-table-column label="操作" width="50">
          <template slot-scope="scope">
            <el-button style="margin-left:20px;" size="small" @click="formSubmit(scope)">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
  </el-form>
</template>
<script>
/* eslint-disable */
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
    formSubmit(scope) {
      console.log(scope);
      // for (var i = 0; i < this.tableData.data.length; i++) {
      //   if (this.tableData.data[i].checked) {
      //     this.formData.user_ids =
      //       this.formData.user_ids + this.tableData.data[i].user_id + ",";
      //   }
      // }
      // this.formData.user_ids = this.formData.user_ids.substring(
      //   0,
      //   this.formData.user_ids.lastIndexOf(",")
      // );
      // getVehicleByPage(this.formData).then(res => {
      //   if (res.data.code == 0) {
      //     this.$set(this.tableQuery, "data", res.data.data);
      //     this.tableQuery.data = [
      //       { real_name: "个人" },
      //       { real_name: "123xxx" }
      //     ];
      //     this.$emit("button", this.tableQuery.data);
      //   } else {
      //     this.$message.error(res.data.msg);
      //   }
      // });
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


