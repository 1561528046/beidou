<template>
  <div class="admin-table-container">
    <el-card shadow="always" class="admin-table-search">

      <el-form :model="tableQuery" label-width="80px" label-position="left" class="table-search" size="small">
        <el-row :gutter="30">
          <el-col :span="6">
            <el-form-item label="订单日期">
              <el-input></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="订单号">
              <el-input></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="订单类型">
              <el-input></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-if="isCollapse">
            <el-form-item label="车牌号">
              <el-input></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-if="isCollapse">
            <el-form-item label="车辆类型">
              <el-input></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-if="isCollapse">
            <el-form-item label="终端厂商">
              <el-input></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-if="isCollapse">
            <el-form-item label="终端类型">
              <el-input></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-if="isCollapse">
            <el-form-item label="支付方式">
              <el-input></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-if="isCollapse">
            <el-form-item label="订单状态">
              <el-input></el-input>
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
        <!-- <el-button type="primary" size="small" @click="addFrom">
          <i class="el-icon-upload el-icon--right"></i> 添加
        </el-button> -->
        <!-- <el-button type="primary" size="small">导出
                    <i class="el-icon-upload el-icon--right"></i>
                </el-button> -->
      </div>
      <el-table :data="tableData.data" v-loading="tableLoading" style="width: 100%" class="admin-table-list">
        <el-table-column prop="cdate" label="订单日期" :formatter="(row)=>{return this.$utils.formatDate(row.cdate)}"> </el-table-column>
        <el-table-column prop="order_no" label="订单号" :formatter="$utils.baseFormatter "> </el-table-column>
        <el-table-column prop="fees_detail_name" label="订单类型" :formatter="$utils.baseFormatter "> </el-table-column>
        <el-table-column prop="license" label="车牌号" :formatter="$utils.baseFormatter "> </el-table-column>
        <el-table-column prop="car_type" label="车辆类型" :formatter="$utils.baseFormatter "> </el-table-column>
        <el-table-column prop="fees_detail_company_name" label="终端厂商" :formatter="$utils.baseFormatter "> </el-table-column>
        <el-table-column prop="fees_detail_type" label="终端类型" :formatter="$utils.baseFormatter "> </el-table-column>
        <el-table-column prop="order_amount" label="订单金额" :formatter="$utils.baseFormatter "> </el-table-column>
        <el-table-column prop="pay_type" label="支付方式" :formatter="$utils.baseFormatter "> </el-table-column>
        <el-table-column prop="state" label="订单状态" :formatter="$utils.baseFormatter "> </el-table-column>
        <el-table-column width="400" label="操作 ">
          <template slot-scope="scope ">
            <el-button size="small " type="primary " icon="el-icon-success ">确认订单</el-button>
            <el-button size="small " icon="el-icon-error">取消订单</el-button>
            <el-button size="small " type="primary" icon=" el-icon-document ">查看资料</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="admin-table-pager ">
        <el-pagination @size-change="handleSizeChange " @current-change="handleCurrentChange " :current-page="tableQuery.page " :page-sizes="[10, 20, 50, 100] " :page-size="tableQuery.size " :total="tableData.total " layout="total, sizes, prev, pager, next, jumper " background>
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>
<script>
/* eslint-disable */
import {
  getDeviceCompanyList,
  delCompany,
  getDeviceCompanyAll,
  getOrderList
} from "@/api/index.js";
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
    //删除
    delRow(scope) {
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
    //添加
    addFrom() {
      var vNode = this.$createElement(addProduct, {
        key: this.addKey++,
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
      });
    },
    //编辑
    updateForm(scope) {
      var vNode = this.$createElement(updateComponents, {
        key: this.addKey++,
        props: {
          company_id: scope.row.company_id
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
      });
    },
    //查询产品列表
    getTable() {
      var query = Object.assign({}, this.tableQuery);
      getOrderList(query)
        .then(res => {
          console.log(res);
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
    handleSelect(item) {
      this.simee = { value: item.value, address: item.address };
      this.getTable();
    },
    handleClick() {
      alert("button click");
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
      this.tableQuery.size = val;
      this.getTable();
    },
    handleCurrentChange(val) {
      this.tableQuery.page = val;
      this.getTable();
    }
  },
  components: { selectCompanytype, selectCompany }
};
</script>