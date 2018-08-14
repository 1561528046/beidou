<template>
  <div class="admin-table-container">
    <el-card shadow="always" class="admin-table-search">
      <el-form :model="tableQuery" label-width="82px" label-position="left" class="table-search" size="small">
        <el-row :gutter="30">
          <el-col :span="6 ">
            <el-form-item label="登录账号 ">
              <el-input v-model="tableQuery.user_name " placeholder="登录账号 "></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label-width="110px" label="个人/公司名称">
              <el-input v-model=" tableQuery.real_name " placeholder="请输入 "></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="所属地区">
              <select-city-input :area.sync="tableQuery.area" :select-all="true" style="width:100%;" clearable></select-city-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-if="isCollapse">
            <el-form-item label="所属行业 ">
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
      <el-table :data="tableData.data" v-loading="tableLoading " style="width: 100% " class="admin-table-list " size="mini" @expand-change="expandChange">
        <el-table-column width="48" type="expand">
          <template slot-scope="props">
            <div class="user-table-children" v-if="childrenList[props.row.user_id] && childrenList[props.row.user_id].length">
              <el-table :data="childrenList[props.row.user_id]" v-loading="tableLoading " style="width: 100% " class="admin-table-list " size="mini">
                <el-table-column width="48">
                </el-table-column>
                <el-table-column prop="user_name" width="600" label="登陆帐号 ">
                  <template slot-scope="scope">
                    <div class="user-name-cell">
                      <span class="level-line" :style="{'left':(scope.row.level-1)*30+'px'}"></span>
                      <span class="level-line-block" :style="{width:scope.row.level*30+'px'}"></span>
                      <!-- {{"&#x3000;&#x3000;".repeat(scope.row.level)}} -->
                      {{scope.row.user_name}}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="province_name" label="所属地区 " :formatter="$utils.areaFormatter"></el-table-column>
                <el-table-column prop="real_name" v-if="user_type==1" label="联系人" :formatter="$utils.baseFormatter"></el-table-column>
                <el-table-column prop="real_name" v-if="user_type==2" label="公司名称" :formatter="$utils.baseFormatter"></el-table-column>
                <el-table-column prop="tel" label="联系电话 " :formatter="$utils.baseFormatter"> </el-table-column>
                <el-table-column prop="device_total" label="授权终端数量" :formatter="$utils.baseFormatter"> </el-table-column>
                <el-table-column prop="role_name" label="所属角色" :formatter="$utils.baseFormatter"> </el-table-column>
                <el-table-column label="操作" width="300">
                  <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="addFrom(scope)" icon="el-icon-circle-plus-outline">增加子用户</el-button>
                    <el-button type="primary" size="mini" @click="updateForm(scope)" icon="el-icon-edit">编辑</el-button>
                    <el-button size="mini" icon="el-icon-delete" @click="delRow(scope)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div v-if="loadCurrent ==props.row.user_id &&childLoading">
              <i class="el-icon-loading"></i> 数据加载中...
            </div>
            <div v-if="(!childrenList[props.row.user_id] || childrenList[props.row.user_id].length==0) && !childLoading">
              数据为空，你可以
              <el-button type="primary" size="mini" @click="addFrom(props)" icon="el-icon-circle-plus-outline">增加子用户</el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="user_name" width="600" label="登陆帐号 " :formatter="$utils.baseFormatter"></el-table-column>
        <el-table-column prop="province_name" label="所属地区 " :formatter="$utils.areaFormatter"></el-table-column>
        <el-table-column prop="real_name" v-if="user_type==1" label="联系人" :formatter="$utils.baseFormatter"></el-table-column>
        <el-table-column prop="real_name" v-if="user_type==2" label="公司名称" :formatter="$utils.baseFormatter"></el-table-column>
        <el-table-column prop="tel" label="联系电话 " :formatter="$utils.baseFormatter"> </el-table-column>
        <el-table-column prop="device_total" label="授权终端数量" :formatter="$utils.baseFormatter"> </el-table-column>
        <el-table-column prop="role_name" label="所属角色" :formatter="$utils.baseFormatter"> </el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="addFrom(scope)" icon="el-icon-circle-plus-outline">增加子用户</el-button>
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
      <add-components :user_type="$props.user_type" :parent_id="parent_id" @success=" () => {this.getTable();this.addDialog = false;}" :key="addKey"></add-components>
    </el-dialog>
    <el-dialog title="编辑" :visible.sync="updateDialog" :append-to-body="true" :close-on-click-modal="false" :close-on-press-escape="false" :center="true" class="admin-dialog">
      <update-components :user_id="updateId" :user_type="$props.user_type" @success=" () => {this.getTable();this.updateDialog = false;this.updateId = '';}" :key="addKey"></update-components>
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
.user-name-cell {
  .level-line-block {
    display: inline-block;
  }
  .level-line-container {
  }
  .level-line {
    top: 50%;
    position: absolute;
    border-bottom: 1px solid red;
    width: 30px;
    &:before {
      content: "";
      position: absolute;
      height: 70px;
      top: -70px;
      border-left: 1px solid red;
    }
  }
}
</style>
<script>
import { getUserList, delUser, getUserChildren } from "@/api/index.js";
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
        user_type: this.$props.user_type,
        user_id: 1
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
    addFrom(scope) {
      //添加
      this.addKey++;
      this.addDialog = true;
      this.parent_id = scope.row ? scope.row.user_id : 1;
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
    },
    formatChildren(childrens) {
      //格式化子用户 树结构转数组
      var arr = [];
      format(childrens, 1);
      function format(users, level) {
        users.map(user => {
          user.level = level;
          arr.push(user);
          if (user.children) {
            format(user.children, level + 1);
          }
        });
      }
      return arr;
    },
    expandChange(row) {
      console.log(arguments);
      this.childLoading = true;
      this.loadCurrent = row.user_id;
      if (!this.$data.childrenList[row.user_id]) {
        this.getChildren(row);
      } else {
        this.childLoading = false;
        this.loadCurrent = "";
      }
    },
    getChildren(row) {
      this.childLoading = true;
      this.loadCurrent = row.user_id;
      getUserChildren({ user_id: row.user_id })
        .then(res => {
          this.childLoading = false;
          this.loadCurrent = "";
          if (res.data.code == 0) {
            var formatChildrens = this.formatChildren(res.data.data);

            this.$set(this.$data.childrenList, row.user_id, formatChildrens);
          } else {
            this.$alert(res.data.msg, {
              type: "error"
            });
          }
        })
        .catch(() => {
          this.childLoading = false;
          this.loadCurrent = "";
          this.$alert("接口错误", {
            type: "error"
          });
        });
    }
  }
};
</script>