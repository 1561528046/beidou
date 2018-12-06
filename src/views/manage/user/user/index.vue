<template>
  <div class="admin-table-container">
    <el-card shadow="always" class="admin-table-search">
      <el-form
        :model="tableQuery"
        label-width="82px"
        label-position="left"
        class="table-search"
        size="small"
        @submit.native.prevent
      >
        <el-row :gutter="30">
          <el-col :span="6">
            <el-form-item label="登录账号">
              <el-input v-model="tableQuery.user_name " placeholder="登录账号"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label-width="110px" label="企业名称">
              <el-input v-model=" tableQuery.real_name " placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="所属地区">
              <select-city-input
                :area.sync="tableQuery.area"
                :select-all="true"
                style="width:100%;"
                clearable
              ></select-city-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-if="isCollapse">
            <el-form-item label="所属行业">
              <select-industry v-model="tableQuery.industry" style="width:100%;"></select-industry>
            </el-form-item>
          </el-col>
          <el-col :span="isCollapse?24:6" style="text-align: right;">
            <el-form-item>
              <el-button type="primary" @click="isCollapse=!isCollapse" v-if="isCollapse">收起</el-button>
              <el-button type="primary" @click="isCollapse=!isCollapse" v-if="!isCollapse">展开</el-button>
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
        <el-button type="primary" size="small" @click="addFrom" v-rights="4-1-1">
          <i class="el-icon-upload el-icon--right"></i> 添加
        </el-button>
      </div>
      <el-table
        :data="tableData.data"
        v-loading="tableLoading "
        style="width: 100% "
        class="admin-table-list"
      >
        <el-table-column prop="user_name" label="登陆帐号 " :formatter="$utils.baseFormatter"></el-table-column>
        <el-table-column prop="province_name" label="所属地区 " :formatter="$utils.areaFormatter"></el-table-column>
        <el-table-column prop="real_name" label="企业名称" :formatter="$utils.baseFormatter"></el-table-column>
        <el-table-column prop="tel" label="联系电话 " :formatter="$utils.baseFormatter"></el-table-column>
        <el-table-column prop="device_total" label="授权终端数量" :formatter="$utils.baseFormatter"></el-table-column>
        <el-table-column prop="role_name" label="所属角色" :formatter="$utils.baseFormatter"></el-table-column>
        <el-table-column
          prop="user_transport_license"
          label="道路运输许可证"
          :formatter="$utils.baseFormatter"
        ></el-table-column>
        <el-table-column prop="user_issue_office" label="核发机关" :formatter="$utils.baseFormatter"></el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              @click="updateForm(scope)"
              icon="el-icon-edit"
              v-rights="4-1-3"
            >编辑</el-button>
            <el-button size="mini" icon="el-icon-delete" @click="delRow(scope)" v-rights="4-1-2">删除</el-button>
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
      title="添加"
      :visible.sync="addDialog"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :center="true"
      class="admin-dialog"
    >
      <add-components
        v-if="this.addDialog"
        :parent_id="parent_id"
        @success=" () => {this.getTable();this.addDialog = false;}"
        :key="addKey"
      ></add-components>
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
        v-if="this.updateDialog"
        :user_id="updateId"
        @success=" () => {this.getTable();this.updateDialog = false;this.updateId = '';}"
        :key="addKey"
      ></update-components>
    </el-dialog>
  </div>
</template>
<style lang="less">
.user-table-children {
  margin: -20px -50px;
  .has-gutter {
    display: none;
  }
}
</style>
<script>
import { getUserList, delUser } from "@/api/index.js";
import selectCityInput from "@/components/select-city-input.vue";
import addComponents from "./add.vue";
import updateComponents from "./update.vue";
import selectIndustry from "@/components/select-industry.vue";
export default {
  components: {
    selectCityInput,
    selectIndustry,
    addComponents,
    updateComponents
  },
  created() {
    this.getTable();
  },
  data() {
    return {
      addDialog: false,
      parent_id: "",
      updateDialog: false,
      updateId: "",
      isCollapse: false,
      tableQuery: {
        area: {},
        user_name: "",
        linkman: "",
        real_name: "",
        industry: "",
        size: 10,
        page: 1,
        user_id: this.$store.state.user.user_id
      },
      tableData: {
        total: 0,
        data: []
      },
      childrenList: {
        // "63":[]
      },
      tableLoading: true,
      addKey: 0,
      childLoading: false, //是否正在加载子用户
      loadCurrent: "" //正在加载的子用户的id
    };
  },
  computed: {},
  methods: {
    //导出excel
    exportExcel() {
      var wsCol = [
        {
          A: "登陆帐号",
          B: "所属地区",
          C: "企业名称",
          D: "联系电话",
          E: "授权终端数量",
          F: "所属角色",
          G: "道路运输许可证",
          H: "核发机关"
        }
      ];
      this.tableData.data.map(data => {
        wsCol.push({
          A: data.user_name,
          B: data.province_name,
          C: data.real_name,
          D: data.tel,
          E: data.device_total,
          F: data.role_name,
          G: data.user_transport_license,
          H: data.user_issue_office
        });
      });
      this.$utils.exportExcel({
        data: wsCol,
        sheetName: "企业管理",
        fileName: "企业管理.xlsx"
      });
    },
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
    addFrom(scope) {
      //添加
      this.addKey++;
      this.addDialog = true;
      this.parent_id = scope.row
        ? scope.row.user_id
        : this.$store.state.user.user_id;
    },
    updateForm(scope) {
      //编辑
      this.addKey++;
      this.updateDialog = true;
      this.updateId = scope.row.user_id;
    },
    handleSizeChange(val) {
      this.tableQuery.page = 1;
      this.tableQuery.size = val;
      this.getTable();
    },
    handleCurrentChange(val) {
      this.tableQuery.page = val;
      this.getTable();
    },
    getTable() {
      this.childrenList = [];
      this.tableLoading = true;
      var query = Object.assign({}, this.tableQuery, this.tableQuery.area);
      delete query.area;
      getUserList(query)
        .then(res => {
          if (res.data.code == 0) {
            for (var i = 0; i < res.data.data.length; i++) {
              if (res.data.data[i].device_total == 0) {
                res.data.data[i].device_total = "";
              }
            }
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