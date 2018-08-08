<template>
<<<<<<< HEAD
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
=======
  <div class="admin-table-container">
    <el-card shadow="always ">
      <div class="admin-table-actions ">
        <!-- <router-link :to="user_type==1?{name: 'user_person_add'}:{name: 'user_company_add'} ">
                    <el-button type="primary " size="small ">
                        <i class="el-icon-upload el-icon--right "></i> 添加
                    </el-button>
                </router-link> -->
        <el-button type="primary" size="small" @click="addFrom">
          <i class="el-icon-upload el-icon--right"></i> 添加
        </el-button>
      </div>
      <el-table :data="tableData.data" v-loading="tableLoading " style="width: 100% " class="admin-table-list ">
        <el-table-column prop="role_name" label="角色名 " :formatter="$utils.baseFormatter"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="small" @click="updateForm(scope)" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button size="small" icon="el-icon-delete" @click="delRow(scope)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
/* eslint-disable */
import { getRoleAll, delRole } from "@/api/index.js";
import addComponents from "./add.vue";
import updateComponents from "./update.vue";
>>>>>>> 20bc04012bcc5b6d0d960b17a69d7a2724ff68ed
export default {
  created() {
    this.getTable();
  },
  data() {
    return {
      isCollapse: false,
<<<<<<< HEAD
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
=======
      tableQuery: {},
      tableData: {
        data: []
      },
      tableLoading: true,
      addKey: 0
    };
  },
  props: ["user_type"], //来自router的user_type 根据user_type 区分公司和个人
  methods: {
    delRow(scope) {
      //删除
      this.$confirm("确认删除？")
        .then(() => {
          delUser(scope.row).then(res => {
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
    addFrom() {
      //添加
      var vNode = this.$createElement(addComponents, {
        key: this.addKey++,
        props: {
          user_type: this.$props.user_type
        },
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
        title: "添加",
        closeOnClickModal: false, //是否可通过点击遮罩关闭 MessageBox
        closeOnPressEscape: false, //是否可通过按下 ESC 键关闭 MessageBox
        message: vNode
      }).catch(() => {});
    },
    updateForm(scope) {
      //编辑
      var vNode = this.$createElement(updateComponents, {
        key: this.addKey++,
        props: {
          user_id: scope.row.user_id,
          user_type: this.user_type
        },
>>>>>>> 20bc04012bcc5b6d0d960b17a69d7a2724ff68ed
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
<<<<<<< HEAD
        title: "添加设备",
        closeOnClickModal: false, //是否可通过点击遮罩关闭 MessageBox
        closeOnPressEscape: false, //是否可通过按下 ESC 键关闭 MessageBox
        message: vNode
      });
=======
        title: "编辑",
        closeOnClickModal: false, //是否可通过点击遮罩关闭 MessageBox
        closeOnPressEscape: false, //是否可通过按下 ESC 键关闭 MessageBox
        message: vNode
      }).catch(() => {});
    },
    getTable() {
      this.tableLoading = true;
      var query = Object.assign({}, this.tableQuery);
      getRoleAll(query)
        .then(res => {
          if (res.data.code == 0) {
            this.$set(this.$data, "tableData", res.data);
          } else {
            this.$set(this.$data, "tableData", []);
          }
          this.tableLoading = false;
        })
        .catch(() => {});
>>>>>>> 20bc04012bcc5b6d0d960b17a69d7a2724ff68ed
    }
  }
};
</script>