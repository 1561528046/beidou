<template>
  <div class="admin-table-container">
    <el-card shadow="always" class="admin-table-search">
      <el-form :model="tableQuery" label-width="82px" label-position="left" class="table-search" size="small">
        <el-row :gutter="30">
          <el-col :span="6">
            <el-form-item label="登录账号">
              <el-input v-model="tableQuery.user_name " placeholder="登录账号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label-width="110px" label="个人/公司名称">
              <el-select v-model="tableQuery.user_type" placeholder="请选择用户类型" style="width:100%;">
                <el-option label="个人用户" value="1"></el-option>
                <el-option label="公司用户" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label-width="110px" label="个人/公司名称">
              <el-input v-model=" tableQuery.real_name " placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="所属地区" v-if="isCollapse">
              <select-city-input :area.sync="tableQuery.area" :select-all="true" style="width:100%;" clearable></select-city-input>
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
      </div>
      <el-table :data="tableData.data" v-loading="tableLoading " style="width: 100% " class="admin-table-list ">
        <el-table-column prop="user_name" width="600" label="登陆帐号 " :formatter="$utils.baseFormatter"></el-table-column>
        <el-table-column prop="province_name" label="所属地区 " :formatter="$utils.areaFormatter"></el-table-column>
        <el-table-column prop="real_name" label="公司/个人名称" :formatter="$utils.baseFormatter"></el-table-column>
        <el-table-column prop="tel" label="联系电话 " :formatter="$utils.baseFormatter"> </el-table-column>
        <el-table-column prop="device_total" label="授权终端数量" :formatter="$utils.baseFormatter"> </el-table-column>
        <el-table-column prop="role_name" label="所属角色" :formatter="$utils.baseFormatter"> </el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="updateForm(scope)" icon="el-icon-edit">编辑</el-button>
            <el-button size="mini" icon="el-icon-delete" @click="delRow(scope)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="admin-table-pager">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[10, 20, 50, 100]" :page-size="tableQuery.size" :total="tableData.total" layout="total, sizes, prev, pager, next, jumper" background>
        </el-pagination>
      </div>
    </el-card>
    <el-dialog title="添加" :visible.sync="addDialog" :append-to-body="true" :close-on-click-modal="false" :close-on-press-escape="false" :center="true" class="admin-dialog">
      <add-components :parent_id="parent_id" @success=" () => {this.getTable();this.addDialog = false;}" :key="addKey"></add-components>
    </el-dialog>
    <el-dialog title="编辑" :visible.sync="updateDialog" :append-to-body="true" :close-on-click-modal="false" :close-on-press-escape="false" :center="true" class="admin-dialog">
      <update-components :user_id="updateId" @success=" () => {this.getTable();this.updateDialog = false;this.updateId = '';}" :key="addKey"></update-components>
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
        area: [],
        user_name: "",
        linkman: "",
        real_name: "",
        industry: "",
        size: 10,
        page: 1,
        user_type: "",
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
      this.updateDialog = true;
      this.updateId = scope.row.user_id;
      this.addKey++;
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