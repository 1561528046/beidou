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
              <el-select v-model="tableQuery.order_type" :clearable="true" style="width:100%;">
                <el-option label="授权车辆" value="1">授权车辆</el-option>
                <el-option label="授权厂商" value="2">授权厂商</el-option>
                <el-option label="短信" value="3">短信</el-option>
                <el-option label="SIM卡" value="4">SIM卡</el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-if="isCollapse">
            <el-form-item label="车牌号">
              <el-input v-model="tableQuery.car_no"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-if="isCollapse">
            <el-form-item label="车辆类型">
              <select-industry :clearable="true" v-model="tableQuery.car_type" style="width:100%;"></select-industry>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-if="isCollapse">
            <el-form-item label="终端厂商">
              <select-company v-model="tableQuery.company_id" :company_name.sync="tableQuery.company_name" style="width:100%;" :clearable="true"></select-company>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-if="isCollapse">
            <el-form-item label="终端类型">
              <select-devicetype v-model="tableQuery.device_type" style="width: 100%;" :clearable="true"></select-devicetype>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-if="isCollapse">
            <el-form-item label="支付方式">
              <el-select v-model="tableQuery.pay_type" style="width:100%;" :clearable="true">
                <el-option label="计费" value="1">计费</el-option>
                <el-option label="扣费" value="2">扣费</el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-if="isCollapse">
            <el-form-item label="订单状态">
              <el-select v-model="tableQuery.state" style="width:100%;" :clearable="true">
                <el-option label="正常" value="1">正常</el-option>
                <el-option label="审核中" value="2">审核中</el-option>
                <el-option label="取消" value="3">取消</el-option>
              </el-select>
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
        <el-table-column prop="fees_detail_type" label="订单类型" :formatter="(row)=>{return this.$dict.get_order_detailtype(row.fees_detail_type)}"> </el-table-column>
        <el-table-column prop="license" label="车牌号" :formatter="$utils.baseFormatter"> </el-table-column>
        <el-table-column prop="car_type" label="车辆类型" :formatter="(row)=>{return this.$dict.get_vehicle_type(row.car_type)}"> </el-table-column>
        <el-table-column prop="fees_detail_company_name" label="终端厂商" :formatter="$utils.baseFormatter"> </el-table-column>
        <el-table-column prop="fees_detail_device_type" label="终端类型" :formatter="(row)=>{return this.$dict.get_device_type(row.fees_detail_device_type)}"> </el-table-column>
        <el-table-column prop="order_amount" label="订单金额" :formatter="$utils.baseFormatter"> </el-table-column>
        <el-table-column prop="pay_type" label="支付方式" :formatter="(row)=>{return this.$dict.get_order_paytype(row.pay_type)}"> </el-table-column>
        <el-table-column prop="state" label="订单状态" :formatter="(row)=>{return this.$dict.get_order_state(row.state)}"> </el-table-column>
        <el-table-column width="400" label="操作">
          <template slot-scope="scope">
            <el-button size="small " icon="el-icon-error" @click="cancel(scope)" v-if="scope.row.has_cancel=='2'" v-rights="3-2-1">取消订单</el-button>
            <el-dialog width="20%" title="" :visible.sync="cancelDialog" :append-to-body="true" :close-on-click-modal="false" :close-on-press-escape="false" :center="true" class="admin-dialog">
              <div style="width:154px;margin:0 auto;">
                <el-button type="primary" @click="submit">确定</el-button>
                <el-button @click="cancelDialog = false">取 消</el-button>
              </div>
            </el-dialog>
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
  getUserOrderListByPage,
  ReviewOrder,
  CancelOrder,
  ReviewCancel
} from "@/api/index.js";
import selectCompanytype from "@/components/select-companytype.vue";
import selectCompany from "@/components/select-company.vue";
import selectDevicetype from "@/components/select-devicetype.vue";
import selectIndustry from "@/components/select-industry.vue";
import selectOrderstate from "@/components/select-orderstate.vue";
// import orderData from "./data.vue";
// import addProduct from "./add.vue";
// import updateComponents from "./update.vue";
export default {
  components: {
    selectCompanytype,
    selectCompany,
    selectDevicetype,
    selectIndustry,
    selectOrderstate
    // orderData
  },
  created() {
    this.tableQuery.user_id = this.$route.params.id;
    this.getTable();
    this.keyupSubmit();
  },
  data() {
    return {
      cancelDialog: false,
      addKey: 0,
      order_no: "",
      isCollapse: false,
      tableQuery: {
        order_no: "",
        car_no: "",
        car_type: "",
        company_id: "",
        company_name: "",
        state: "",
        pay_type: "",
        user_id: "",
        time: "",
        start_time: "",
        end_time: "",
        size: 10,
        page: 1
      },
      tableConfirm: {
        order_no: "",
        orderno: "",
        reason: "",
        is_review: ""
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
    // 取消订单
    cancel(scope) {
      this.addKey++;
      this.cancelDialog = true;
      this.order_no = scope.row.order_no;
    },
    submit() {
      CancelOrder({ order_no: this.order_no }).then(res => {
        if (res.data.code == 0) {
          this.cancelDialog = false;
          this.getTable();
          this.$message.success(res.data.msg);
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //查询订单列表
    getTable() {
      if (this.tableQuery.time) {
        this.tableQuery.start_time = this.tableQuery.time[0];
        this.tableQuery.end_time = this.tableQuery.time[1];
      }
      var query = Object.assign({}, this.tableQuery);
      getUserOrderListByPage(query)
        .then(res => {
          if (res.data.code == 0) {
            this.$set(this.$data, "tableData", res.data);
            this.tableQuery.start_time = "";
            this.tableQuery.end_time = "";
          } else {
            this.$set(this.$data, "tableData", []);
            this.$message.error(res.data.msg);
            this.tableQuery.start_time = "";
            this.tableQuery.end_time = "";
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
    // 分页
    handleSizeChange(val) {
      this.tableQuery.page = 1;
      this.tableQuery.size = val;
      this.getTable();
    },
    handleCurrentChange(val) {
      this.tableQuery.page = val;
      this.getTable();
    }
  }
};
</script>