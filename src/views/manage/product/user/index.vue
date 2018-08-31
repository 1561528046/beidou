<template>
  <div class="admin-table-container">
    <el-card shadow="always" class="admin-table-search">

      <el-form :model="tableQuery" label-width="80px" label-position="left" class="table-search" size="small">
        <el-row :gutter="30">
          <el-col :span="6">
            <el-form-item label="用户名称">
              <el-input></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="所属地区">
              <select-city-input :area.sync="tableQuery.area" :select-all="true" style="width:100%;" clearable></select-city-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="产品名称">
              <el-input></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="isCollapse?24:6" style="text-align: right;">
            <el-form-item>
              <el-button type="primary" @click="getTable">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card shadow="always">
      <el-table :data="tableData.data" v-loading="tableLoading" style="width: 100%" class="admin-table-list">
        <el-table-column prop="real_name" label="用户名称" :formatter="$utils.baseFormatter"> </el-table-column>
        <el-table-column prop="order_no" label="所属地区" :formatter="$utils.baseFormatter"> </el-table-column>
        <el-table-column prop="linkman" label="联系人" :formatter="$utils.baseFormatter"> </el-table-column>
        <el-table-column prop="tel" label="联系电话" :formatter="$utils.baseFormatter"> </el-table-column>
        <el-table-column prop="title" label="产品名称" :formatter="$utils.baseFormatter"> </el-table-column>
        <el-table-column width="400" label="操作">
          <template slot-scope="scope">
            <router-link :to="{name:'order-order',params:{id:scope.row.user_id}}">
              <el-button size="small " type="primary" icon=" el-icon-document">查看订单明细</el-button>
            </router-link>
          </template>
        </el-table-column>
      </el-table>
      <div class="admin-table-pager">
        <el-pagination @size-change="handleSizeChange " @current-change="handleCurrentChange " :current-page="tableQuery.page " :page-sizes="[10, 20, 50, 100] " :page-size="tableQuery.size " :total="tableData.total " layout="total, sizes, prev, pager, next, jumper " background>
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>
<script>
/* eslint-disable */
import {
  getBindFeesPackageUsers,
  getReviewOrderListByPage,
  gettReviewOrderListByPage
} from "@/api/index.js";
import selectCityInput from "@/components/select-city-input.vue";
import selectCompanytype from "@/components/select-companytype.vue";
import selectCompany from "@/components/select-company.vue";
// import addProduct from "./add.vue";
// import updateComponents from "./update.vue";
export default {
  created() {
    this.getTable();
    this.keyupSubmit();
  },
  data() {
    return {
      isCollapse: false,
      tableQuery: {
        area: [],
        size: 10,
        page: 1
      },
      simss: [],
      simee: {},
      tableData: {
        total: 0,
        data: []
      },
      tableLoading: false,
      addKey: 0,
      userdetailShow: false,
      restaurants: [],
      state1: "",
      state2: ""
    };
  },
  mounted() {},
  methods: {
    //查询用户列表
    getTable() {
      var query = Object.assign({}, this.tableQuery);
      getBindFeesPackageUsers(query)
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
    //回车事件
    keyupSubmit() {
      document.onkeydown = e => {
        let _key = window.event.keyCode;
        if (_key === 13) {
          this.getTable();
        }
      };
    },
    handleSizeChange(val) {
      this.tableQuery.page = 1;
      this.tableQuery.size = val;
      this.getTable();
    },
    handleCurrentChange(val) {
      this.tableQuery.page = val;
      this.getTable();
    }
  },
  components: { selectCompanytype, selectCompany, selectCityInput }
};
</script>