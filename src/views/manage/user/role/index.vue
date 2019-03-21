<template>
  <div class="admin-table-container">
    <el-card shadow="always">
      <div class="admin-table-actions">
        <el-button type="primary" @click="exportExcel" size="small">
          <i class="el-icon-download"></i> 导出
        </el-button>
        <el-button type="primary" size="small" @click="addFrom" v-rights="4-2-1">
          <i class="el-icon-upload el-icon--right"></i> 添加
        </el-button>
      </div>
      <el-table
        :data="tableData.data"
        v-loading="tableLoading "
        style="width: 100% "
        class="admin-table-list"
      >
        <el-table-column prop="role_name" label="角色名 " :formatter="$utils.baseFormatter"></el-table-column>
        <el-table-column prop="role_type" label="角色类型 " :formatter="$utils.baseFormatter">
          <template slot-scope="scope">
            <label v-if="scope.row.role_type=='1'">企业角色</label>
            <label v-if="scope.row.role_type=='2'">终端角色</label>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- <el-button
              size="small"
              @click="updateForm(scope)"
              type="primary"
              icon="el-icon-edit"
              v-rights="4-2-3"
            >编辑</el-button>-->
            <el-button size="small" icon="el-icon-view" type="primary" @click="setForm(scope)">查看</el-button>
            <el-button size="small" icon="el-icon-delete" @click="delRow(scope)" v-rights="4-2-2">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
      title="添加"
      :visible.sync="addDialog"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :center="true"
      class="admin-dialog"
    >
      <add-components @success=" () => {this.getTable();this.addDialog = false;}" :key="addKey"></add-components>
    </el-dialog>
    <el-dialog
      title="编辑"
      :visible.sync="updateDialog"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :center="true"
      class="admin-dialog"
    >
      <update-components
        :role_id="updateId"
        @success=" () => {this.getTable();this.updateDialog = false;this.updateId = '';}"
        :key="addKey"
      ></update-components>
    </el-dialog>
    <el-dialog
      title="查看"
      :visible.sync="setDialog"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :center="true"
      class="admin-dialog"
    >
      <set-components
        :role_id="setId"
        @success=" () => {this.getTable();this.setDialog = false;this.setId = '';}"
        :key="addKey"
      ></set-components>
    </el-dialog>
  </div>
</template>
<script>
/* eslint-disable */
import { getRoleAll, delRole } from "@/api/index.js";
import addComponents from "./add.vue";
import updateComponents from "./update.vue";
import setComponents from "./set.vue";
export default {
  components: { addComponents, updateComponents, setComponents },
  created() {
    this.getTable();
  },
  data() {
    return {
      addDialog: false,
      updateDialog: false,
      setDialog: false,
      setId: "",
      updateId: "",
      isCollapse: false,
      tableQuery: {
        role_type: ""
      },
      tableData: {
        data: []
      },
      tableLoading: true,
      addKey: 0
    };
  },
  methods: {
    //导出excel
    exportExcel() {
      var wsCol = [
        {
          A: "角色名"
        }
      ];
      this.tableData.data.map(data => {
        wsCol.push({
          A: data.role_name
        });
      });
      this.$utils.exportExcel({
        data: wsCol,
        sheetName: "角色管理",
        fileName: "角色管理.xlsx"
      });
    },
    delRow(scope) {
      //删除
      this.$confirm("确认删除？")
        .then(() => {
          delRole(scope.row).then(res => {
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
    addFrom(scope) {
      //添加
      this.addKey++;
      this.addDialog = true;
    },
    updateForm(scope) {
      //编辑
      this.addKey++;
      this.updateDialog = true;
      this.updateId = scope.row.role_id;
    },
    setForm(scope) {
      this.addKey++;
      this.setDialog = true;
      this.setId = scope.row.role_id;
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