<template>
  <div class="admin-table-container">
    <el-card shadow="always" class="admin-table-search">

      <el-form :model="tableQuery" label-width="80px" label-position="left" class="table-search" size="small">
        <el-row :gutter="30">
          <el-col :span="6">
            <el-form-item label="订单日期">
              <el-date-picker value-format="yyyyMMdd" v-model="tableQuery.time" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions2">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="订单号">
              <el-input v-model="tableQuery.order_no"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="订单类型">
              <el-input></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-if="isCollapse">
            <el-form-item label="车牌号">
              <el-input v-model="tableQuery.car_no"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-if="isCollapse">
            <el-form-item label="车辆类型">
              <select-industry v-model="tableQuery.car_type" style="width:100%;"></select-industry>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-if="isCollapse">
            <el-form-item label="终端厂商">
              <select-company v-model="tableQuery.company_id" style="width:100%;" :clearable="true"></select-company>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-if="isCollapse">
            <el-form-item label="终端类型">
              <select-devicetype style="width: 100%;"></select-devicetype>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-if="isCollapse">
            <el-form-item label="支付方式">
              <el-select style="width:100%;" :clearable="true">
                <el-option label="计费" value="1">计费</el-option>
                <el-option label="扣费" value="2">扣费</el-option>
              </el-select>
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
      </div>
      <el-table :data="tableData.data" v-loading="tableLoading" style="width: 100%" class="admin-table-list">
        <el-table-column prop="cdate" label="订单日期" :formatter="(row)=>{return this.$utils.formatDate(row.cdate)}"> </el-table-column>
        <el-table-column prop="order_no" label="订单号" :formatter="$utils.baseFormatter"> </el-table-column>
        <el-table-column prop="fees_detail_name" label="订单类型" :formatter="$utils.baseFormatter"> </el-table-column>
        <el-table-column prop="license" label="车牌号" :formatter="$utils.baseFormatter"> </el-table-column>
        <el-table-column prop="car_type" label="车辆类型" :formatter="$utils.baseFormatter"> </el-table-column>
        <el-table-column prop="fees_detail_company_name" label="终端厂商" :formatter="$utils.baseFormatter"> </el-table-column>
        <el-table-column prop="fees_detail_type" label="终端类型" :formatter="$utils.baseFormatter"> </el-table-column>
        <el-table-column prop="order_amount" label="订单金额" :formatter="$utils.baseFormatter"> </el-table-column>
        <el-table-column prop="pay_type" label="支付方式" :formatter="$utils.baseFormatter"> </el-table-column>
        <el-table-column prop="state" label="订单状态" :formatter="$utils.baseFormatter"> </el-table-column>
        <el-table-column width="400" label="操作">
          <template slot-scope="scope">
            <el-button size="small " type="primary " icon="el-icon-success" @click="review">确认订单</el-button>
            <el-button size="small " icon="el-icon-error" @click="cancel">取消订单</el-button>
            <el-button size="small " type="primary" icon=" el-icon-document " @click="enquiry(scope)">查看资料</el-button>
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
  getDeviceCompanyList,
  delCompany,
  getDeviceCompanyAll,
  getOrderList,
  ReviewOrder,
  CancelOrder,
  ReviewCancel
} from "@/api/index.js";
import selectCompanytype from "@/components/select-companytype.vue";
import selectCompany from "@/components/select-company.vue";
import selectDevicetype from "@/components/select-devicetype.vue";
import selectIndustry from "@/components/select-industry.vue";
// import addProduct from "./add.vue";
// import updateComponents from "./update.vue";
export default {
  components: {
    selectCompanytype,
    selectCompany,
    selectDevicetype,
    selectIndustry
  },
  created() {
    this.getTable();
    this.keyupSubmit();
  },
  data() {
    return {
      isCollapse: false,
      tableQuery: {
        order_no: "",
        car_no: "",
        car_type: "",
        company_id: "",
        company_name: "",
        state: "",
        user_id: "",
        time: "",
        start_time: "",
        end_time: "",
        size: 10,
        page: 1
      },
      simss: [],
      simee: {},
      tableData: {
        total: 0,
        data: []
      },
      pickerOptions2: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
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
    // this.restaurants = this.loadAll();
  },
  methods: {
    // 查看资料
    enquiry(scope) {
      console.log(scope.row.order_no);
    },
    // 确认订单
    review() {
      console.log(1);
    },
    // 取消订单
    cancel() {
      console.log(2);
    },
    //查询订单列表
    getTable() {
      var query = Object.assign({}, this.tableQuery);
      getOrderList(query)
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
    //     loadAll() {
    //   getDeviceCompanyAll().then(res => {
    //     if (res.data.code == 0) {
    //       for (var i = 0; i < res.data.data.length; i++) {
    //         if (res.data.data[i].real_name !== "") {
    //           this.simss.push({
    //             value: res.data.data[i].company_name,
    //             address: res.data.data[i].company_id
    //           });
    //         }
    //       }
    //     }
    //   });
    //   return this.simss;
    // },
    // handleSelect(item) {
    //   this.simee = { value: item.value, address: item.address };
    //   this.getTable();
    // },
    // querySearch(queryString, cb) {
    //   var restaurants = this.restaurants;
    //   var results = queryString
    //     ? restaurants.filter(this.createFilter(queryString))
    //     : restaurants;
    //   // 调用 callback 返回建议列表的数据
    //   cb(results);
    // },
    // createFilter(queryString) {
    //   return restaurant => {
    //     return (
    //       restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
    //       0
    //     );
    //   };
    // },
    // handleClick() {
    //   alert("button click");
    // },
    // filterTag(value, row) {
    //   return row.tag === value;
    // },
    // filterHandler(value, row, column) {
    //   const property = column["property"];
    //   return row[property] === value;
    // },
  }
};
</script>