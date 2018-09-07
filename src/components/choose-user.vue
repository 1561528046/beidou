<template>
  <el-form status-icon :model="formData" size="small" ref="baseForm" class="msg-form">
    <template>
      <el-table height="250" :data="tableData.data" border style="width: 100%">
        <el-table-column prop="real_name" label="用户">
        </el-table-column>
        <el-table-column label="操作" width="100">
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
      this.$emit("button", scope);
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


