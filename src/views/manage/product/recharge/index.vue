<template>
  <div class="admin-table-container">
    <el-card shadow="always" class="admin-table-search">

      <el-form :model="tableQuery" label-width="80px" label-position="left" class="table-search" size="small">
        <el-row :gutter="30">
          <el-col :span="6">
            <!-- <el-form-item label="用户名">
              <el-input></el-input>
            </el-form-item> -->
          </el-col>
          <el-col :span="18" style="text-align: right;">
            <!-- <el-form-item>
              <el-button type="primary" @click="getTable">查询</el-button>
            </el-form-item> -->
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card shadow="always">
      <div class="admin-table-actions">
      </div>
      <el-table :data="tableData.data" v-loading="tableLoading" style="width: 100%" class="admin-table-list">
        <el-table-column prop="real_name" label="公司名称" :formatter="$utils.baseFormatter"> </el-table-column>
        <el-table-column prop="user_name" label="登录帐号" :formatter="$utils.baseFormatter"> </el-table-column>
        <el-table-column prop="linkman" label="联系人" :formatter="$utils.baseFormatter"> </el-table-column>
        <el-table-column prop="tel" label="联系电话" :formatter="$utils.baseFormatter"> </el-table-column>
        <el-table-column prop="title" label="已绑定产品" :formatter="$utils.baseFormatter"> </el-table-column>
        <el-table-column prop="balance" label="余额" :formatter="$utils.baseFormatter"> </el-table-column>
        <el-table-column width="300" label="操作">
          <template slot-scope="scope">
            <el-button size="small " type="primary " icon="el-icon-edit" @click="topup" style="margin-right:10px;">充值</el-button>
            <!-- <el-button size="small " type="primary " icon="el-icon-menu" >二维码生成</el-button> -->
            <el-popover placement="left-end" width="450" trigger="click">
              <el-table :data="gridData">
                <el-table-column width="150" label="时间" property="cdate" :formatter="formatChildTime"></el-table-column>
                <el-table-column width="150" label="充值金额(元)" property="change_money"></el-table-column>
              </el-table>
              <el-button size="small " type="primary " icon="el-icon-tickets" slot="reference" @click="OperateLogList(scope)">充值明细</el-button>
            </el-popover>
            <el-dialog width="15%" title="" :visible.sync="addDialog" :append-to-body="true" :close-on-click-modal="false" :close-on-press-escape="false" :center="true" class="admin-dialog">
              <el-input size="small" style="width:94%;margin:0 auto;" v-model="amount"></el-input>元
              <span slot="footer" style=" display:inline-block; width: 236px;height: 30px;margin: 0 auto;" class="dialog-footer">
                <el-button style="float:left" size="small" type="primary" @click="confirm(scope)">确 定</el-button>
                <el-button style="float:right" size="small" @click="addDialog = false">取 消</el-button>
              </span>
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
  getCanRechargeUsers,
  Recharge,
  getUserRechargeRecord
} from "@/api/index.js";
export default {
  created() {
    this.getTable();
    this.keyupSubmit();
  },
  data() {
    return {
      addDialog: false,
      amount: "",
      gridData: [],
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
  mounted() {},
  methods: {
    // 时间转换
    formatChildTime(row) {
      return this.$utils.formatDate(row.cdate);
    },
    // 充值
    topup() {
      this.addKey++;
      this.addDialog = true;
    },
    confirm(scope) {
      Recharge({ user_id: scope.row.user_id, amount: this.amount }).then(
        res => {
          if (res.data.code == 0) {
            this.addDialog = false;
            this.amount = "";
            this.getTable();
            this.$message.success(res.data.msg);
          } else {
            this.$message.error(res.data.msg);
          }
        }
      );
    },
    // 充值记录
    OperateLogList(scope) {
      getUserRechargeRecord({ user_id: scope.row.user_id }).then(res => {
        if (res.data.code == 0) {
          this.gridData = res.data.data;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //查询可以充值的用户列表
    getTable() {
      this.tableLoading = true;
      var query = Object.assign({}, this.tableQuery);
      getCanRechargeUsers(query)
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
  components: {}
};
</script>