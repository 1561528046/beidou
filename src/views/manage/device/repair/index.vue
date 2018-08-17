<template>
  <div class="admin-table-container">
    <el-card shadow="always" class="admin-table-search">

      <el-form :model="tableQuery" label-width="80px" label-position="left" class="table-search" size="small">
        <el-row :gutter="30">
          <el-col :span="6">
            <el-form-item label="返厂时间">
              <!-- <el-date-picker type="date" v-model="tableQuery.back_time" align="center" placeholder="选择日期" style="width:100%;" format="yyyy-MM-dd" value-format="yyyyMMdd">
              </el-date-picker> -->
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
              <select-repairstate v-model="tableQuery.state" style="width: 100%;"></select-repairstate>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-if="isCollapse">
            <el-form-item label="物流信息">
              <el-input v-model="tableQuery.logistics"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="isCollapse?24:6" style="text-align: right;">
            <el-form-item>
              <el-button type="primary" @click="isCollapse=!isCollapse" v-if="isCollapse">收起</el-button>
              <el-button type="primary" @click="isCollapse=!isCollapse" v-if="!isCollapse">展开</el-button>
              <el-button type="primary">查询</el-button>
              <!-- @click="getListTable" -->
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card shadow="always">
      <!-- v-loading="tableLoading" 加载动画 -->
      <el-table :data="tableData.data" style="width: 100%" class="admin-table-list">
        <el-table-column prop="back_time" label="返厂时间" :formatter="$utils.baseFormatter"> </el-table-column>
        <el-table-column prop="device_id" label="终端ID" :formatter="$utils.baseFormatter"> </el-table-column>
        <el-table-column prop="remark" label="维修原因" :formatter="$utils.baseFormatter"> </el-table-column>
        <el-table-column prop="logistics" label="物流信息" :formatter="$utils.baseFormatter"> </el-table-column>
        <el-table-column prop="state" label="维修状态" :formatter="(row)=>{return this.$dict.get_repair_state(row.state)}">
          <!-- <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.state==1">
              维修
            </el-tag>
            <el-tag type="success" v-if="scope.row.state==2">
              已修复
            </el-tag>
            <el-tag type="info" v-if="scope.row.state==3">
              报废
            </el-tag>
          </template> -->
        </el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button :type="button_type(scope)" size="small" :disabled="buttontype(scope)" @click="repaired(scope,2)">已修复</el-button>
            <el-button :type="button_type(scope)" size="small" @click="scrap(scope,3)" :disabled="buttontype(scope)">报废</el-button>
            <el-popover placement="left-end" width="400" trigger="hover">
              <el-table :data="gridData">
                <el-table-column width="100" property="date"></el-table-column>
                <el-table-column width="100" property="name"></el-table-column>
                <el-table-column width="200" property="address"></el-table-column>
              </el-table>
              <el-button style="margin-left:10px;" size="small" slot="reference">维修记录</el-button>
            </el-popover>
            <el-dialog width="30%" title="" :visible.sync="addDialog" :append-to-body="true" :close-on-click-modal="false" :close-on-press-escape="false" :center="true" class="admin-dialog">
              <label>备注：</label>
              <el-input v-model="tableQuery.reason"></el-input>
              <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="FixedRepair(scope,2)">确 定</el-button>
                <el-button @click="addDialog = false">取 消</el-button>
              </span>
            </el-dialog>
          </template>
        </el-table-column>
      </el-table>
      <div class="admin-table-pager">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[10, 20, 50, 100]" :page-size="tableQuery.size" :total="tableData.total" layout="total, sizes, prev, pager, next, jumper" background>
        </el-pagination>
      </div>
    </el-card>

  </div>
</template>
<script>
/* eslint-disable */
import selectRepairstate from "@/components/select-repairstate.vue";
import { getDeviceRepairList, updateDeviceRepair } from "@/api/index.js";
export default {
  created() {
    // this.getListTable();
  },
  data() {
    return {
      gridData: [
        {
          date: "2018-08-17",
          name: "已修复",
          address: "备注备注"
        }
      ],
      addKey: 0,
      parent_id: "",
      addDialog: false,
      isCollapse: false,
      tableLoading: true,
      tableQuery: {
        start_back_time: "",
        end_back_time: "",
        device_no: "",
        back_time: "",
        logistics: "",
        reason: "",
        state: "",
        size: 10,
        page: 1
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
    // 报废
    scrap(scope, state) {
      this.$confirm("确认报废？").then(() => {
        scope.row.state = state;
        updateDeviceRepair(scope.row).then(res => {
          if (res.data.code == 0) {
            this.$message.success(res.data.msg);
            this.buttontype = false;
          } else {
            this.$message.error(res.data.msg);
          }
        });
      });
    },
    // 已修复
    repaired(scope) {
      this.addKey++;
      this.addDialog = true;
      this.parent_id = scope.row.device_no;
    },
    // 已修复确认操作
    FixedRepair(scope, state) {
      scope.row.state = state;
      updateDeviceRepairs(scope.row).then(res => {
        if (res.data.code == 0) {
          this.$message.success(res.data.msg);
          this.addDialog = false;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    button_type(scope) {
      if (scope.row.state == 3) {
        return "info";
      }
      return "primary";
    },
    buttontype(scope) {
      if (scope.row.state == 3) {
        return true;
      }
      return false;
    },
    //列表信息
    // getListTable() {
    //   this.tableLoading = true;
    //   if (this.tableQuery.back_time) {
    //     this.tableQuery.start_back_time = this.value6[0];
    //     this.tableQuery.end_back_time = this.value6[1];
    //   }
    //   var query = Object.assign({}, this.tableQuery);
    //   getDeviceRepairList(query)
    //     .then(res => {
    //       if (res.data.code == 0) {
    //         this.$set(this.$data, "tableData", res.data);
    //       } else {
    //         this.$set(this.$data, "tableData", []);
    //         this.$message.error(res.data.msg);
    //       }
    //       this.tableLoading = false;
    //     })
    //     .catch(() => {});
    // },
    // 分页
    handleSizeChange(val) {
      this.tableQuery.page = 1;
      this.tableQuery.size = val;
      // this.getListTable();
    },
    handleCurrentChange(val) {
      this.tableQuery.page = val;
      // this.getListTable();
    }
  },
  components: { selectRepairstate }
};
</script>