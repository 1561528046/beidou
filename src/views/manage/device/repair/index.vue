<template>
  <div class="admin-table-container">
    <el-card shadow="always" class="admin-table-search">

      <el-form :model="tableQuery" label-width="80px" label-position="left" class="table-search" size="small" @submit.native.prevent>
        <el-row :gutter="30">
          <el-col :span="6">
            <el-form-item label="返厂时间">
              <el-date-picker value-format="yyyyMMdd" v-model="tableQuery.back_time" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions2">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="终端ID">
              <el-input v-model="tableQuery.device_no"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="维修状态">
              <el-select v-model="tableQuery.operate_type" style="width:100%;" :clearable="true">
                <el-option label="维修中" value="3">维修中</el-option>
                <el-option label="已修复" value="4">已修复</el-option>
                <el-option label="报废" value="5">报废</el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-if="isCollapse">
            <el-form-item label="物流信息">
              <el-input v-model="tableQuery.logistics"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-if="isCollapse">
            <el-form-item label="物流单号">
              <el-input v-model="tableQuery.logistics_no"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="isCollapse?24:6" style="text-align: right;">
            <el-form-item>
              <el-button type="primary" @click="isCollapse=!isCollapse" v-if="isCollapse">收起</el-button>
              <el-button type="primary" @click="isCollapse=!isCollapse" v-if="!isCollapse">展开</el-button>
              <el-button type="primary" @click="getListTable" native-type="submit" :loading="tableLoading">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card shadow="always">
      <!-- v-loading="tableLoading" 加载动画 -->
      <el-table :data="tableData.data" style="width: 100%" class="admin-table-list">
        <el-table-column prop="last_backtime" label="返厂时间" :formatter="(row)=>{return this.$utils.formatDate(row.last_backtime)}"> </el-table-column>
        <el-table-column prop="device_no" label="终端ID" :formatter="$utils.baseFormatter"> </el-table-column>
        <el-table-column prop="last_reason" label="维修原因" :formatter="$utils.baseFormatter"> </el-table-column>
        <el-table-column prop="last_logistics" label="物流信息" :formatter="$utils.baseFormatter"> </el-table-column>
        <el-table-column prop="last_logistics_no" label="物流单号" :formatter="$utils.baseFormatter"> </el-table-column>
        <el-table-column prop="state" label="维修状态" :formatter="(row)=>{return this.$dict.get_repair_state(row.state)}">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.state==1">
              未安装
            </el-tag>
            <el-tag type="danger" v-if="scope.row.state==3">
              维修
            </el-tag>
            <el-tag type="info" v-if="scope.row.state==4">
              报废
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button :type="repaired_button_type(scope)" size="small" @click="repaired(scope,4)" :disabled="repaired_buttontype(scope)" v-rights="2-2-2">已修复</el-button>
            <el-button :type="scrap_button_type(scope)" size="small" @click="scrap(scope,5)" :disabled="scrap_buttontype(scope)" v-rights="2-2-2">报废</el-button>
            <el-popover placement="left-end" width="600" trigger="click">
              <el-table height="300" :data="gridData">
                <el-table-column width="150" label="操作时间" property="time" :formatter="formatChildTime"></el-table-column>
                <el-table-column width="150" label="状态" property="state">
                  <template slot-scope="scope">
                    <el-tag type="danger" v-if="scope.row.state==3">
                      维修
                    </el-tag>
                    <el-tag type="success" v-if="scope.row.state==4">
                      已修复
                    </el-tag>
                    <el-tag type="info" v-if="scope.row.state==5">
                      报废
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column width="150" label="返厂时间" property="back_time" :formatter="formatBackTime"></el-table-column>
                <el-table-column width="150" label="备注" property="reason" :formatter="formReason"></el-table-column>
              </el-table>
              <el-button style="margin-left:10px;" size="small" slot="reference" @click="OperateLogList(scope)">维修记录</el-button>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
      <div class="admin-table-pager">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[10, 20, 50, 100]" :page-size="tableQuery.size" :total="tableData.total" layout="total, sizes, prev, pager, next, jumper" background>
        </el-pagination>
      </div>
    </el-card>
    <el-dialog width="30%" title="" :visible.sync="addDialog" :append-to-body="true" :close-on-click-modal="false" :close-on-press-escape="false" :center="true" class="admin-dialog">
      <label>备注：</label>
      <el-input v-model="tablegrid.remark"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="FixedRepair()">确 定</el-button>
        <el-button @click="addDialog = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog width="30%" title="" :visible.sync="delDialog" :append-to-body="true" :close-on-click-modal="false" :close-on-press-escape="false" :center="true" class="admin-dialog">
      <label>备注：</label>
      <el-input v-model="tablegrid.remark"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="FixedScrap()">确 定</el-button>
        <el-button @click="delDialog = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
/* eslint-disable */
import selectRepairstate from "@/components/select-repairstate.vue";
import {
  getDeviceRepairList,
  updateDeviceRepair,
  getOperateLogList
} from "@/api/index.js";
export default {
  created() {
    this.getListTable();
  },
  data() {
    return {
      gridData: [],
      addKey: 0,
      parent_id: "",
      addDialog: false,
      delDialog: false,
      isCollapse: false,
      tableLoading: true,
      tableQuery: {
        operate_type: "",
        start_back_time: "",
        end_back_time: "",
        device_no: "",
        device_id: "",
        remark: "",
        back_time: "",
        logistics: "",
        logistics_no: "",
        size: 10,
        page: 1
      },
      tablegrid: {
        device_id: "",
        operate_type: "",
        remark: "",
        back_time: "",
        logistics: "",
        last_logistics_no: ""
      },
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
      }
    };
  },
  methods: {
    formatChildTime(row) {
      return this.$utils.formatDate(row.time);
    },
    formatBackTime(row) {
      return this.$utils.formatDate(row.back_time);
    },
    formReason(row) {
      return this.$utils.baseForm(row.reason);
    },
    // 维修记录
    OperateLogList(scope) {
      getOperateLogList({ device_id: scope.row.device_id }).then(res => {
        if (res.data.code == 0) {
          this.gridData = res.data.data;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 报废
    scrap(scope, state) {
      this.addKey++;
      this.delDialog = true;
      this.parent_id = scope.row.device_no;
      this.tablegrid.device_id = scope.row.device_id;
      this.tablegrid.operate_type = state;
      this.tablegrid.remark = "";
    },
    // 确认报废
    FixedScrap() {
      updateDeviceRepair(this.tablegrid).then(res => {
        if (res.data.code == 0) {
          this.$message.success(res.data.msg);
          this.delDialog = false;
          this.getListTable();
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },

    // 已修复
    repaired(scope, state) {
      this.addKey++;
      this.addDialog = true;
      this.parent_id = scope.row.device_no;
      this.tablegrid.device_id = scope.row.device_id;
      this.tablegrid.operate_type = state;
    },
    // 已修复确认操作
    FixedRepair() {
      updateDeviceRepair(this.tablegrid).then(res => {
        if (res.data.code == 0) {
          this.$message.success(res.data.msg);
          this.addDialog = false;
          this.getListTable();
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    repaired_button_type(scope) {
      if (scope.row.state == 4 || scope.row.state == 1) {
        return "info";
      }
      return "primary";
    },
    repaired_buttontype(scope) {
      if (scope.row.state == 4 || scope.row.state == 1) {
        return true;
      }
      return false;
    },
    scrap_button_type(scope) {
      if (scope.row.state == 4) {
        return "info";
      }
      return "primary";
    },
    scrap_buttontype(scope) {
      if (scope.row.state == 4) {
        return true;
      }
      return false;
    },
    //列表信息
    getListTable() {
      this.tableLoading = true;
      if (this.tableQuery.back_time) {
        this.tableQuery.start_back_time = this.tableQuery.back_time[0];
        this.tableQuery.end_back_time = this.tableQuery.back_time[1];
      }
      var query = Object.assign({}, this.tableQuery);
      getDeviceRepairList(query)
        .then(res => {
          if (res.data.code == 0) {
            this.$set(this.$data, "tableData", res.data);
          } else {
            this.$set(this.$data, "tableData", []);
            this.$message.error(res.data.msg);
          }
          this.tableLoading = false;
        })
        .catch(() => {
          this.tableLoading = false;
        });
    },
    // 分页
    handleSizeChange(val) {
      this.tableQuery.page = 1;
      this.tableQuery.size = val;
      this.getListTable();
    },
    handleCurrentChange(val) {
      this.tableQuery.page = val;
      this.getListTable();
    }
  },
  components: { selectRepairstate }
};
</script>