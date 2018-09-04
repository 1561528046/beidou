<template>
  <el-form status-icon :rules="rules" :model="formData" size="small" ref="baseForm" class="msg-form">
    <el-row :gutter="30">
      <el-col :span="7">
        <el-form-item label="车牌号" prop="query_mode">
          <el-input v-model="formData.license"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="7">
        <el-form-item label="业户">
          <el-input v-model="formData.owner"></el-input>
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
          <el-button size="small" type="primary" @click="selectForm">搜索</el-button>
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
        <el-table-column prop="owner" label="业户">
        </el-table-column>
        <el-table-column prop="device_no" label="终端ID">
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
import { getVehicleByPage } from "@/api/index.js";
export default {
  data() {
    return {
      checked: true,
      formData: {
        license: "",
        owner: "",
        device_no: ""
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
    formSubmit() {
      var arr = [];
      for (var i = 0; i < this.tableData.data.length; i++) {
        if (this.tableData.data[i].checked) {
          arr.push(this.tableData.data[i]);
        }
      }
      if (arr[0] == undefined) {
        return this.$notify({
          message: "请选择信息",
          title: "提示",
          type: "error"
        });
      }
      this.$emit("button", arr);
    }
  },
  components: {}
};
</script>
<style>
</style>
