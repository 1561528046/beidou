<template>
  <div class="admin-table-container">
    <el-card shadow="always" class="admin-table-search">
      <el-form :model="tableQuery" label-width="80px" size="small">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="版本号">
              <el-input v-model="tableQuery.version"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button @click="getTable" type="primary">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card shadow="always" class="admin-table-search">
      <div class="admin-table-actions">
        <el-button size="small" @click="addForm" type="primary">添加</el-button>
      </div>
      <el-table :data="tableData.data" style="width: 100%">
        <el-table-column prop="version" label="版本号"></el-table-column>
        <el-table-column prop="external_type" label="设备类型">
          <template slot-scope="scope">
            <label v-if="scope.row.external_type=='01'">终端</label>
            <label v-if="scope.row.external_type=='02'">保留</label>
            <label v-if="scope.row.external_type=='03'">ADAS</label>
            <label v-if="scope.row.external_type=='04'">DSM</label>
            <label v-if="scope.row.external_type=='05'">BSD</label>
            <label v-if="scope.row.external_type=='06'">TPMS</label>
          </template>
        </el-table-column>
        <el-table-column prop label="操作" width="180">
          <template slot-scope="scope">
            <el-button type="primary" @click="updateForm(scope)" size="small">编辑</el-button>
            <el-button @click="delForm(scope)" type="danger" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
      width="30%"
      title="添加"
      :visible.sync="addDialog "
      :append-to-body="true "
      :close-on-click-modal="false "
      :close-on-press-escape="false "
      :center="true "
      class="admin-dialog"
    >
      <add-upgrade
        :key="addKey"
        @success="()=>{this.getTable(),this.addDialog=false}"
        :companyid="tableQuery.company_id"
      ></add-upgrade>
    </el-dialog>
    <el-dialog
      width="30%"
      title="编辑"
      :visible.sync="updateDialog "
      :append-to-body="true "
      :close-on-click-modal="false "
      :close-on-press-escape="false "
      :center="true "
      class="admin-dialog"
    >
      <update-upgrade
        @success="()=>{this.getTable(),this.updateDialog=false}"
        :key="addKey"
        :rowid="updateID"
      ></update-upgrade>
    </el-dialog>
  </div>
</template>
<script>
import { GetListByCompanyId, DeleteDeviceUpgradePackage } from "@/api/index.js";
import addUpgrade from "./upgrade/add.vue";
import updateUpgrade from "./upgrade/update.vue";
export default {
  components: { addUpgrade, updateUpgrade },
  created() {
    this.getTable();
  },
  data() {
    return {
      addKey: 0,
      addDialog: false,
      updateID: "",
      updateDialog: false,
      tableQuery: {
        company_id: this.$route.params.id,
        version: ""
      },
      tableData: {
        data: []
      }
    };
  },

  methods: {
    //  查询升级包列表
    getTable() {
      GetListByCompanyId(this.tableQuery).then(res => {
        if (res.data.code == 0) {
          this.$set(this.tableData, "data", res.data.data);
        } else {
          return this.$notify({
            message: res.data.msg,
            title: "提示",
            type: "error"
          });
        }
      });
    },
    // 添加升级包
    addForm() {
      this.addKey++;
      this.addDialog = true;
    },
    // 编辑升级包
    updateForm(scope) {
      this.addKey++;
      this.updateDialog = true;
      this.$set(this.$data, "updateID", scope.row.rowid);
    },
    // 删除升级包
    delForm(scope) {
      this.$confirm("确认删除？")
        .then(() => {
          DeleteDeviceUpgradePackage({ rowid: scope.row.rowid }).then(res => {
            if (res.data.code == 0) {
              this.$message.success(res.data.msg);
              this.getTable();
            } else {
              this.$message.error(res.data.msg);
            }
          });
        })
        .catch(() => {});
    }
  }
};
</script>