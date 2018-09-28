<template>
  <el-form status-icon :rules="rules" :model="tableQuery" size="small" ref="baseForm" class="msg-form">
    <el-row :gutter="30">
      <el-col :span="7">
        <el-form-item label="车牌号" prop="query_mode">
          <el-input v-model="tableQuery.license"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="7">
        <el-form-item label="业户">
          <el-input v-model="tableQuery.owner"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="7">
        <el-form-item label="终端ID">
          <el-input v-model="tableQuery.device_no"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="3" style="text-align: right;">
        <el-form-item>
          <label style="display:inline-block; width:100%;"></label>
          <el-button size="small" type="primary" @click="selectForm(1)">搜索</el-button>
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
        <el-table-column prop="license" :formatter="$utils.baseFormatter" label="车牌号">
        </el-table-column>
        <el-table-column prop="owner" :formatter="$utils.baseFormatter" label="业户">
        </el-table-column>
        <el-table-column prop="device_no" :formatter="$utils.baseFormatter" label="终端ID">
        </el-table-column>
      </el-table>
      <div class="admin-table-pager">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[10, 20, 50, 100]" :page-size="tableQuery.size" :total="tableData.total" layout="total, sizes, prev, pager, next, jumper" background>
        </el-pagination>
      </div>
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
        device_no: "",
        page: 1,
        size: 10
      },
      tableQuery: {
        license: "",
        owner: "",
        device_no: "",
        page: 1,
        size: 10
      },
      tableData: {
        total: 0,
        data: []
      },
      rules: {
        ...rules
      }
    };
  },
  watch: {},
  created() {
    this.selectForm();
  },
  computed: {
    // list: function() {
    //   return this.tableData.data.slice(
    //     (this.tableQuery.page - 1) * this.tableQuery.size,
    //     this.tableQuery.page * this.tableQuery.size
    //   );
    // }
  },
  methods: {
    selectForm(state) {
      if (state == 1) {
        this.tableQuery.page = 1;
      }
      getVehicleByPage(this.tableQuery).then(res => {
        if (res.data.code == 0) {
          for (var j = 0; j < res.data.data.length; j++) {
            res.data.data[j].checked = false;
          }
          this.$set(this.tableData, "data", res.data.data);
          this.$set(this.tableData, "total", res.data.total);
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
    },
    // 分页
    handleSizeChange(val) {
      this.tableQuery.page = 1;
      this.tableQuery.size = val;
      this.selectForm();
    },
    handleCurrentChange(val) {
      this.tableQuery.page = val;
      this.selectForm();
    }
  },
  components: {}
};
</script>
<style>
</style>
