<template>
    <el-form status-icon :model="formData" size="small" ref="baseForm" class="msg-form">
        <template>
            <el-table height="250" :data="tableData.data" border style="width: 100%">
                <el-table-column label="状态" width="50">
                    <template slot-scope="scope">
                        <el-checkbox size="medium" v-model="scope.row.checked" style="margin-left:7px;"></el-checkbox>
                    </template>
                </el-table-column>
                <el-table-column prop="device_no" label="设备ID">
                </el-table-column>
            </el-table>
        </template>
        <el-form-item style="text-align:center; margin-top:20px;margin-bottom:-10px;">
            <el-button type="primary" size="small" @click="formSubmit">提交</el-button>
        </el-form-item>
    </el-form>
</template>
<script>
import { getDeviceAll } from "@/api/index.js";
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
      this.tableQuery.data = [];
      for (var i = 0; i < this.tableData.data.length; i++) {
        if (this.tableData.data[i].checked) {
          this.tableQuery.data.push(this.tableData.data[i]);
        }
      }
      this.$emit("choosedevice", this.tableQuery.data);
    },
    getTable() {
      getDeviceAll().then(res => {
        if (res.data.code == 0) {
          for (var i = 0; i < res.data.data.length; i++) {
            res.data.data[i].checked = false;
          }
          this.$set(this.tableData, "data", res.data.data);
        }
      });
    }
  },
  components: {}
};
</script>
