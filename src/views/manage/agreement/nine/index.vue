<template>
  <div class="admin-table-container">
    <el-card shadow="always" class="admin-table-search">

      <el-form :model="tableQuery" label-width="80px" label-position="left" class="table-search" size="small" @submit.native.prevent>
        <el-row :gutter="30">
          <el-col :span="6">
            <el-form-item label="标注">
              <el-input v-model="tableQuery.title"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="18" style="text-align: right;">
            <el-form-item>
              <el-button type="primary" native-type="submit" @click="getTable" :loading="tableLoading">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card shadow="always">
      <div class="admin-table-actions">
        <el-button type="primary" size="small" style="margin-right:10px;" @click="addForm">
          <i class="el-icon-upload el-icon--right"></i> 添加
        </el-button>
        <router-link :to="{name:'agreement-809vehicle'}">
          <el-button size="small" type="primary" icon="el-icon-edit">分车</el-button>
        </router-link>
      </div>
      <el-table :data="tableData.data" v-loading="tableLoading" style="width: 100%" class="admin-table-list">
        <el-table-column prop="title" label="标注"></el-table-column>
        <el-table-column prop="remote_ip" label="远程IP"></el-table-column>
        <el-table-column prop="remote_port" label="远程端口"></el-table-column>
        <el-table-column prop="user_name" label="用户ID"></el-table-column>
        <el-table-column prop="password" label="密码"></el-table-column>
        <el-table-column prop="local_port" label="本地端口"></el-table-column>
        <el-table-column prop="M1" label="M1"></el-table-column>
        <el-table-column prop="IA1" label="IA1"></el-table-column>
        <el-table-column prop="IC1" label="IC1"></el-table-column>
        <el-table-column prop="access_code" label="接入码"></el-table-column>
        <el-table-column prop="key_value" label="Keys"></el-table-column>
        <el-table-column prop="enable" label="状态">
          <template slot-scope="scope">
            <label v-if="scope.row.enable=='1'">启用</label>
            <label v-if="scope.row.enable=='2'">未启用</label>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="400">
          <template slot-scope="scope">
            <el-button size="small" type="primary" @click="updateForm(scope)" icon="el-icon-edit">编辑</el-button>
            <el-button size="small" @click="delForm(scope)" icon="el-icon-delete">删除</el-button>
            <el-dialog title="编辑" width="50%" :visible.sync="updateDialog" :append-to-body="true" :close-on-click-modal="false" :close-on-press-escape="false" :center="true" class="admin-dialog">
              <update-agreement :server_id="updateId" @success="success" :key="addKey"></update-agreement>
            </el-dialog>
            <el-dialog title="删除" width="20%" :visible.sync="delDialog" :append-to-body="true" :close-on-click-modal="false" :close-on-press-escape="false" :center="true" class="admin-dialog">
              <template>
                <div style="width: 50%; margin: 0 auto;">
                  <el-button @click="delConfirm" type="primary">确定</el-button>
                  <el-button @click="delDialog=false">取消</el-button>
                </div>
              </template>
            </el-dialog>
          </template>
        </el-table-column>
      </el-table>
      <div class="admin-table-pager">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[10, 20, 50, 100]" :page-size="tableQuery.size" :total="tableData.total" layout="total, sizes, prev, pager, next, jumper" background>
        </el-pagination>
      </div>
    </el-card>
    <el-dialog title="添加" width="50%" :visible.sync="addDialog" :append-to-body="true" :close-on-click-modal="false" :close-on-press-escape="false" :center="true" class="admin-dialog">
      <add-agreement @success=" () => {this.getTable();this.addDialog = false;}" :key="addKey"></add-agreement>
    </el-dialog>
  </div>
</template>
<script>
import addAgreement from "./add.vue";
import updateAgreement from "./update.vue";
import { GetServerByPage, DeleteServer809 } from "@/api/index.js";
export default {
  components: { addAgreement, updateAgreement },
  created() {
    this.getTable();
  },
  data() {
    return {
      addAgreement: {},
      addKey: 0,
      addDialog: false,
      updateDialog: false,
      updateId: "",
      delDialog: false,
      isCollapse: false,
      dateRange: "",
      tableQuery: {
        title: "",
        flag: 809,
        size: 10,
        page: 1
      },
      tableData: {
        total: 0,
        data: []
      },
      tableLoading: true
    };
  },
  watch: {
    // 拆分时间段
    dateRange: function(arr) {
      arr = arr || ["", ""];
      this.tableQuery.start_date = arr[0];
      this.tableQuery.end_date = arr[1];
    },
    "tableQuery.real_name": function() {
      this.tableQuery.user_id = "";
    }
  },
  methods: {
    // 编辑成功回调
    success() {
      this.getTable();
      this.updateDialog = false;
    },
    // 添加
    addForm() {
      this.addKey++;
      this.addDialog = true;
    },
    // 编辑
    updateForm(scope) {
      this.addKey++;
      this.updateDialog = true;
      this.updateId = scope.row.server_id;
    },
    // 删除
    delForm(scope) {
      this.addKey++;
      this.delDialog = true;
      this.addAgreement = scope.row;
    },
    delConfirm() {
      DeleteServer809({ server_id: this.addAgreement.server_id }).then(res => {
        if (res.data.code == 0) {
          this.delDialog = false;
          this.getTable();
          return this.$notify({
            message: res.data.msg,
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
    //获取列表
    getTable() {
      this.tableLoading = false;
      GetServerByPage(this.tableQuery).then(res => {
        if (res.data.code == 0) {
          this.$set(this.tableData, "data", res.data.data);
        } else {
          this.$message.error(res.data.msg);
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
    },
    uploadSuccess() {},
    uploadError() {
      alert(1);
    },
    uploadProgress() {}
  }
};
</script>