<template>
    <div class="admin-table-container">
        <el-card shadow="always" class="admin-table-search">

            <el-form :model="tableQuery" label-width="80px" label-position="left" class="table-search" size="small">
                <el-row :gutter="30">
                    <el-col :span="6">
                        <el-form-item label="名称">
                            <el-input v-model="tableQuery.user" placeholder="审批人"></el-input>
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :span="6">
                        <el-form-item label="审批人">
                            <el-input v-model="tableQuery.user" placeholder="审批人"></el-input>
                        </el-form-item>
                    </el-col> -->
                    <el-col :span="isCollapse?24:6" style="text-align: right;">
                        <el-form-item>
                            <el-button type="primary" @click="isCollapse=!isCollapse">展开</el-button>
                            <el-button type="primary" @click="getTable">查询</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-card>
        <el-card shadow="always">
            <div class="admin-table-actions">
                <el-button type="primary" size="small" @click="addFrom">
                    <i class="el-icon-upload el-icon--right"></i> 添加
                </el-button>
                <!-- 
                <el-button type="primary" size="small">导出
                    <i class="el-icon-upload el-icon--right"></i>
                </el-button> -->
            </div>
            <el-table :data="tableData.data" v-loading="tableLoading" style="width: 100%" class="admin-table-list">
                <el-table-column prop="role_id" label="角色id">
                </el-table-column>
                <el-table-column prop="role_name" label="角色名称">
                </el-table-column>
                <el-table-column label="操作" width="300">
                    <template slot-scope="scope" style="width: 100px;">
                        <el-button size="small" type="primary" icon="el-icon-edit">编辑</el-button>
                        <el-button size="small" icon="el-icon-delete">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="admin-table-pager">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[10, 20, 50, 100]" :page-size="tableQuery.size" :total="tableData.total" layout="total, sizes, prev, pager, next, jumper" background>
                </el-pagination>
            </div>
        </el-card>
    </div>
</template>
<script>
/* eslint-disable */
import { getRoleAll } from "@/api/index.js";
import role_add from "./add.vue";
export default {
  created() {
    this.getTable();
  },
  data() {
    return {
      isCollapse: false,
      tableQuery: {
        role_id: "",
        role_name: "",
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
  methods: {
    formatter(row, column) {
      return row.address;
    },
    filterTag(value, row) {
      return row.tag === value;
    },
    filterHandler(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    },
    handleSizeChange(val) {
      this.tableQuery.page = 1;
      this.tableQuery.limit = val;
      this.getTable();
    },
    handleCurrentChange(val) {
      this.tableQuery.page = val;
      this.getTable();
    },
    //角色列表
    getTable() {
      this.tableLoading = true;
      getRoleAll(this.tableQuery)
        .then(res => {
          this.$set(this.$data, "tableData", res.data);
          this.tableLoading = false;
        })
        .catch(() => {});
    },
    //添加角色
    addFrom() {
      var vNode = this.$createElement(role_add, {
        key: this.addKey++,
        on: {
          success: () => {
            this.getTable();
            this.$msgbox.close();
          },
          error: function() {}
        }
      });
      this.$msgbox({
        showConfirmButton: false, //是否显示确定按钮
        customClass: "admin-message-form",
        title: "添加设备",
        closeOnClickModal: false, //是否可通过点击遮罩关闭 MessageBox
        closeOnPressEscape: false, //是否可通过按下 ESC 键关闭 MessageBox
        message: vNode
      });
    }
  }
};
</script>