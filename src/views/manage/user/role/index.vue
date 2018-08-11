<template>
  <div class="admin-table-container">
    <el-card shadow="always ">
      <div class="admin-table-actions ">
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
export default {
  created() {
    this.getTable();
  },
  data() {
    return {
      isCollapse: false,
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
      console.log(addComponents);
      console.log(vNode);
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
    }
  }
};
</script>