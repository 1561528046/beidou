<template>
  <div class="admin-table-container">
    <el-card shadow="always" class="admin-table-search">
      <el-form
        :model="tableQuery"
        label-width="80px"
        label-position="left"
        class="table-search"
        @submit.native.prevent
        size="small"
      >
        <el-row :gutter="30">
          <el-col :span="6">
            <el-form-item label="厂商名称">
              <el-input v-model="tableQuery.company_name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :offset="isCollapse?0:6" :span="isCollapse?24:6" style="text-align: right;">
            <el-form-item>
              <el-button type="primary" native-type="submit" @click="getTable">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card shadow="always">
      <div class="admin-table-actions">
        <el-button type="primary" @click="exportExcel" size="small">
          <i class="el-icon-download"></i> 导出
        </el-button>
        <el-button type="primary" size="small" @click="addFrom" v-rights="2-4-1">
          <i class="el-icon-upload el-icon--right"></i> 添加
        </el-button>
        <router-link style="margin-left:10px" :to="{name:'user-group'}">
          <el-button type="primary" size="small">升级包管理</el-button>
        </router-link>
      </div>
      <el-table
        :data="tableData.data"
        v-loading="tableLoading"
        style="width: 100%"
        class="admin-table-list"
      >
        <el-table-column prop="company_name" label="终端厂商名称" :formatter="$utils.baseFormatter"></el-table-column>
        <el-table-column width="300" label="操作">
          <template slot-scope="scope">
            <el-button
              size="small"
              @click="updateForm(scope)"
              type="primary"
              icon="el-icon-edit"
              v-rights="2-4-3"
            >编辑</el-button>
            <el-button size="small" icon="el-icon-delete" @click="delRow(scope)" v-rights="2-4-2">删除</el-button>
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
    <el-dialog
      width="29%"
      title="添加"
      :visible.sync="addDialog "
      :append-to-body="true "
      :close-on-click-modal="false "
      :close-on-press-escape="false "
      :center="true "
      class="admin-dialog"
    >
      <add-components
        @success=" ()=> {this.getTable();this.company=[];this.loadAll();this.addDialog = false;}"
        :key="addKey"
      ></add-components>
    </el-dialog>
    <el-dialog
      width="29%"
      title="编辑"
      :visible.sync="updateDialog "
      :append-to-body="true "
      :close-on-click-modal="false "
      :close-on-press-escape="false "
      :center="true "
      class="admin-dialog"
    >
      <update-components
        :company_id="updateId"
        @success=" ()=> {this.getTable();this.company=[];this.loadAll();this.updateDialog = false;this.updateId=''}"
        :key="addKey"
      ></update-components>
    </el-dialog>
  </div>
</template>
<script>
/* eslint-disable */
import {
  getDeviceCompanyList,
  delCompany,
  getDeviceCompanyAll
} from "@/api/index.js";
import selectCompanytype from "@/components/select-companytype.vue";
import selectCompany from "@/components/select-company.vue";
import addComponents from "./add.vue";
import updateComponents from "./update.vue";
export default {
  created() {
    this.getTable();
  },
  components: {
    selectCompanytype,
    selectCompany,
    addComponents,
    updateComponents
  },
  data() {
    return {
      pro: 0,
      addKey: 0,
      addDialog: false,
      updateDialog: false,
      updateId: "",
      isCollapse: false,
      tableQuery: {
        company_name: "",
        company_type: "",
        size: 10,
        page: 1
      },
      company: [],
      simee: {},
      tableData: {
        total: 0,
        data: []
      },
      tableLoading: true,
      addKey: 0,
      restaurants: []
    };
  },
  mounted() {
    this.restaurants = this.loadAll();
  },
  methods: {
    //导出excel
    exportExcel() {
      var wsCol = [
        {
          A: "终端厂商名称"
        }
      ];
      this.tableData.data.map(data => {
        wsCol.push({
          A: data.company_name
        });
      });
      this.$utils.exportExcel({
        data: wsCol,
        sheetName: "终端厂商管理",
        fileName: "终端厂商管理.xlsx"
      });
    },
    // 删除厂商
    delRow(scope) {
      this.$confirm("确认删除？")
        .then(() => {
          delCompany(scope.row).then(res => {
            if (res.data.code == 0) {
              this.$message.success(res.data.msg);
              this.getTable();
              this.company = [];
              this.loadAll();
            } else {
              this.$message.error(res.data.msg);
            }
          });
        })
        .catch(() => {});
    },
    // 添加厂商
    addFrom() {
      this.addKey++;
      this.addDialog = true;
    },
    // 修改厂商
    updateForm(scope) {
      this.addKey++;
      this.updateDialog = true;
      this.updateId = scope.row.company_id;
    },
    // 查询厂商列表
    getTable() {
      this.tableLoading = true;
      if (this.simee.address) {
        this.tableQuery.company_id = this.simee.address;
      }
      if (this.tableQuery.company_nameta == "") {
        this.tableQuery.company_id = "";
      }
      var query = Object.assign({}, this.tableQuery);
      getDeviceCompanyList(query)
        .then(res => {
          if (res.data.code == 0) {
            this.$set(this.$data, "tableData", res.data);
          } else {
            this.$set(this.$data, "tableData", []);
            this.$message.error(res.data.msg);
          }
          this.tableLoading = false;
        })
        .catch(() => {});
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
    loadAll() {
      getDeviceCompanyAll().then(res => {
        if (res.data.code == 0) {
          for (var i = 0; i < res.data.data.length; i++) {
            if (res.data.data[i].real_name != "") {
              this.company.push({
                value: res.data.data[i].company_name,
                address: res.data.data[i].company_id
              });
            }
          }
        }
      });
      return this.company;
    }
  }
};
</script>