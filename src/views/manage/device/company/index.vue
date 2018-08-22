<template>
  <div class="admin-table-container">
    <el-card shadow="always" class="admin-table-search">

      <el-form :model="tableQuery" label-width="80px" label-position="left" class="table-search" size="small">
        <el-row :gutter="30">
          <el-col :span="6">
            <el-form-item label="厂商名称">
              <!-- <el-input v-model="tableQuery.company_name"></el-input>
                             -->
              <el-autocomplete style="width: 100%;" class="inline-input" v-model="tableQuery.company_name" :fetch-suggestions="querySearch" placeholder="请输入内容" :trigger-on-focus="false" @select="handleSelect">
              </el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col :offset="isCollapse?0:6" :span="isCollapse?24:6" style="text-align: right;">
            <el-form-item>
              <!-- <el-button type="primary" @click="isCollapse=!isCollapse" v-if="isCollapse">收起</el-button>
                            <el-button type="primary" @click="isCollapse=!isCollapse" v-if="!isCollapse">展开</el-button> -->
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
        <!-- <el-button type="primary" size="small">导出
                    <i class="el-icon-upload el-icon--right"></i>
                </el-button> -->
      </div>
      <el-table :data="tableData.data" v-loading="tableLoading" style="width: 100%" class="admin-table-list">
        <el-table-column prop="company_name" label="终端厂商名称" :formatter="$utils.baseFormatter"> </el-table-column>
        <el-table-column width="300" label="操作">
          <template slot-scope="scope">
            <el-button size="small" @click="updateForm(scope)" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button size="small" icon="el-icon-delete" @click="delRow(scope)">删除</el-button>
          </template>
          <!-- <template slot-scope="scope">
                        <el-button type="primary" size="small" @click="$router.push({name: 'company-update',params:{company_id:scope.row.company_id}})">
                            编辑
                        </el-button>
                    </template> -->
        </el-table-column>
      </el-table>
      <div class="admin-table-pager">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[10, 20, 50, 100]" :page-size="tableQuery.size" :total="tableData.total" layout="total, sizes, prev, pager, next, jumper" background>
        </el-pagination>
      </div>
    </el-card>
    <el-dialog width="29%" title="添加" :visible.sync="addDialog " :append-to-body="true " :close-on-click-modal="false " :close-on-press-escape="false " :center="true " class="admin-dialog ">
      <add-components @success=" ()=> {this.getTable();this.addDialog = false;}" :key="addKey"></add-components>
    </el-dialog>
    <el-dialog width="29%" title="编辑" :visible.sync="updateDialog " :append-to-body="true " :close-on-click-modal="false " :close-on-press-escape="false " :center="true " class="admin-dialog ">
      <update-components :company_id="updateId" @success=" ()=> {this.getTable();this.updateDialog = false;this.updateId=''}" :key="addKey"></update-components>
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
    this.keyupSubmit();
  },
  components: {
    selectCompanytype,
    selectCompany,
    addComponents,
    updateComponents
  },
  data() {
    return {
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
      simss: [],
      simee: {},
      tableData: {
        total: 0,
        data: []
      },
      tableLoading: true,
      addKey: 0,
      userdetailShow: false,
      restaurants: [],
      state1: "",
      state2: ""
    };
  },
  mounted() {
    this.restaurants = this.loadAll();
  },
  methods: {
    // 删除厂商
    delRow(scope) {
      //删除
      this.$confirm("确认删除？")
        .then(() => {
          delCompany(scope.row).then(res => {
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
    // 添加厂商名称
    addFrom() {
      //添加
      this.addKey++;
      this.addDialog = true;
    },
    // 修改厂商名称
    updateForm(scope) {
      //编辑
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
    //回车事件
    keyupSubmit() {
      document.onkeydown = e => {
        let _key = window.event.keyCode;
        if (_key === 13) {
          this.getTable();
        }
      };
    },
    querySearch(queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return restaurant => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    },
    handleSelect(item) {
      this.simee = { value: item.value, address: item.address };
      this.getTable();
    },
    loadAll() {
      getDeviceCompanyAll().then(res => {
        if (res.data.code == 0) {
          for (var i = 0; i < res.data.data.length; i++) {
            if (res.data.data[i].real_name !== "") {
              this.simss.push({
                value: res.data.data[i].company_name,
                address: res.data.data[i].company_id
              });
            }
          }
        }
      });
      return this.simss;
    },
    filterTag(value, row) {
      return row.tag === value;
    },
    filterHandler(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    },
    handleClick() {
      alert("button click");
    }
  }
};
</script>