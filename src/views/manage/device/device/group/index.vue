<template>
  <div class="admin-table-container">
    <el-card shadow="always" class="admin-table-search">
      <el-form :model="tableQuery" size="small" label-width="80px">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="分组名称">
              <el-autocomplete
                style="width:100%"
                class="inline-input"
                v-model="tableQuery.name"
                :fetch-suggestions="querySearch"
                placeholder="请输入分组名称"
                :trigger-on-focus="false"
                @select="handleSelect"
              ></el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="getTable()">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card shadow="always" class="admin-table-search">
      <div class="admin-table-actions">
        <el-button type="primary" @click="addGroup" size="small">新增</el-button>
      </div>
      <el-table :data="tableData.data" style="width: 100%">
        <el-table-column prop="serial" label="序号" width="100"></el-table-column>
        <el-table-column prop="name" label="分组名称"></el-table-column>
        <el-table-column prop="device_count" label="设备数"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <router-link style="margin-right:10px" :to="{name:'user-grouping'}">
              <el-button size="small" icon="el-icon-upload" type="primary">设备分组</el-button>
            </router-link>
            <el-button
              @click="updateGroup(scope)"
              icon="el-icon-delete"
              size="small"
              type="primary"
            >编辑</el-button>
            <el-button @click="delGroup(scope)" icon="el-icon-delete" size="small" type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="admin-table-pager">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="tableQuery.page"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="tableQuery.size"
          :total="tableData.total"
          layout="total, sizes, prev, pager, next, jumper"
          background
        ></el-pagination>
      </div>
    </el-card>
    <el-dialog title="添加分组" :visible.sync="addDialog" width="20%" :append-to-body="true">
      <template>
        <el-form :model="formData" size="small" label-width="80px">
          <el-row>
            <el-col>
              <el-form-item label="分组名称">
                <el-input v-model="formData.name" placeholder="请输入分组名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label-width="0">
                <el-button type="primary" style="display:block;margin:0 auto" @click="addForm">提交</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>
    </el-dialog>
    <el-dialog title="编辑分组" :visible.sync="updateDialog" width="20%" :append-to-body="true">
      <template>
        <el-form :model="formData" size="small" label-width="80px">
          <el-row>
            <el-col>
              <el-form-item label="分组名称">
                <el-input v-model="formData.name" placeholder="请输入分组名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label-width="0">
                <el-button type="primary" style="display:block;margin:0 auto" @click="updateForm">提交</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import {
  getListByUserId,
  addDeviceGroupUser,
  deleteDeviceGroupUser,
  updateDeviceGroupUser
} from "@/api/index.js";
export default {
  created() {
    this.getTable();
  },
  data() {
    return {
      addKey: 0,
      addDialog: false,
      updateDialog: false,
      formData: {
        name: ""
      },
      tableQuery: {
        name: "",
        page: 1,
        size: 10
      },
      tableData: {
        data: [],
        total: 0
      }
    };
  },
  methods: {
    // 输入建议
    querySearch(queryString, cb) {
      getListByUserId({ name: queryString }).then(res => {
        if (res.data.code == 0) {
          res.data.data.map(item => {
            item.value = item.name;
          });
          cb(res.data.data);
        }
      });
      // 调用 callback 返回建议列表的数据
    },
    handleSelect(data) {
      console.log(data);
    },
    // 查询分组列表
    getTable() {
      getListByUserId({ name: this.tableQuery.name }).then(res => {
        if (res.data.code == 0) {
          res.data.data.map((item, index) => {
            item.serial = index + 1;
          });
          this.$set(this.tableData, "data", res.data.data);
          this.$set(this.tableData, "total", res.data.total);
        } else {
          return this.$notify({
            message: res.data.msg,
            title: "提示",
            type: "error"
          });
        }
      });
    },
    // 添加分组
    addGroup() {
      this.formData.name = "";
      this.addDialog = true;
      this.addKey++;
    },
    addForm() {
      if (this.formData.name == "") {
        return this.$notify({
          message: "请输入分组名称",
          title: "提示",
          type: "error"
        });
      }
      addDeviceGroupUser(this.formData).then(res => {
        if (res.data.code == 0) {
          this.addDialog = false;
          this.getTable();
        } else {
          return this.$notify({
            message: res.data.msg,
            title: "提示",
            type: "error"
          });
        }
      });
    },
    // 删除
    delGroup(scope) {
      this.$confirm("确认删除？")
        .then(() => {
          deleteDeviceGroupUser({ rowid: scope.row.rowid }).then(res => {
            if (res.data.code == 0) {
              this.$message.success(res.data.msg);
              this.getTable();
            } else {
              this.$message.error(res.data.msg);
            }
          });
        })
        .catch(() => {});
    },
    // 编辑
    updateGroup(scope) {
      this.updateDialog = true;
      this.$set(this.$data, "formData", JSON.parse(JSON.stringify(scope.row)));
    },
    updateForm() {
      updateDeviceGroupUser(this.formData).then(res => {
        if (res.data.code == 0) {
          this.getTable();
          this.updateDialog = false;
          return this.$notify({
            message: "修改成功",
            title: "提示",
            type: "success"
          });
        } else {
          return this.$notify({
            message: res.data.msg,
            title: "提示",
            type: "error"
          });
        }
      });
    },
    // 分页
    handleSizeChange(val) {
      this.tableQuery.page = 1;
      this.tableQuery.size = val;
      this.getTable();
    },
    handleCurrentChange(val) {
      this.tableQuery.page = val;
      this.getTable();
    }
  }
};
</script>
