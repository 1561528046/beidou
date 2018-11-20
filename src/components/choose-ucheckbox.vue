<template>
  <el-form v-loading="loading" status-icon :model="formData" size="small" ref="baseForm" class="msg-form">
    <template>
      <el-table height="400" ref="userTable" @select-all="selectAll" @select="selectHandler" :data="tableData.data" border style="width: 100%">
        <el-table-column type="selection" label="状态" width="50">
        </el-table-column>
        <el-table-column prop="real_name" :formatter="$utils.baseFormatter" label="用户">
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
      selection: [],
      vehicle: [],
      loading: true,
      formData: {
        user: [],
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
    selectAll(allSelected) {
      var state = false;
      // 可以根据allSelected的长度判断是全选还是取消全选
      if (allSelected.length != 0) {
        state = true;
      }
      if (state) {
        allSelected.map(item => {
          if (!this.selection.includes(item.user_id)) {
            this.selection.push(item.user_id);
            this.vehicle.push(item);
          }
        });
      } else {
        this.tableData.data.map(olditem => {
          this.selection.map(item => {
            if (item == olditem.user_id) {
              var index = this.selection.indexOf(item);
              if (index != -1) {
                this.selection.splice(index, 1);
                this.vehicle.splice(index, 1);
                return;
              }
            }
          });
        });
      }
    },
    selectHandler(allSelected, currentRow) {
      var isChecked = false;
      if (allSelected.length != 0) {
        allSelected.map(item => {
          if (item.user_id == currentRow.user_id) {
            isChecked = true;
          }
        });
      }
      if (isChecked) {
        //处理选中
        if (!this.selection.includes(currentRow.user_id)) {
          this.selection.push(currentRow.user_id);
          this.vehicle.push(currentRow);
        }
      } else {
        //处理取消
        var index = this.selection.indexOf(currentRow.user_id);
        if (index != -1) {
          this.selection.splice(index, 1);
          this.vehicle.splice(index, 1);
        }
      }
    },
    formSubmit() {
      this.formData.user_ids = this.selection.toString();
      this.formData.user = [];
      if (this.formData.user_ids == "") {
        return this.$notify({
          message: "请选择信息",
          title: "提示",
          type: "error"
        });
      }
      getVehicleByPage({ user_ids: this.formData.user_ids }).then(res => {
        if (res.data.code == 0) {
          this.$set(this.tableQuery, "data", res.data.data);
          if (this.tableQuery.data.length == 0) {
            return this.$notify({
              message: "当前所选择的用户没有车辆信息",
              title: "提示",
              type: "error"
            });
          }
          var chooseuser = {
            user: this.selection,
            vehicle: this.tableQuery.data,
            real: this.vehicle
          };
          this.$emit("button", chooseuser);
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    getTable() {
      getUserChildrenList().then(res => {
        if (res.data.code == 0) {
          for (var i = 0; i < res.data.data.length; i++) {
            res.data.data[i].checked = false;
          }
          this.$set(this.tableData, "data", res.data.data);
          this.loading = false;
        }
      });
    }
  },
  components: {}
};
</script>
<style>
</style>