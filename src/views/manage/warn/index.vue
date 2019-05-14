<template>
  <div class="admin-table-container">
    <el-card shadow="always" class="admin-table-search">
      <el-form :model="tableQuery" label-position="left" class="table-search" size="small">
        <el-row :gutter="30">
          <el-col :span="6">
            <el-form-item label-width="100px" label="时间范围">
              <el-date-picker
                v-model="dateRange"
                type="datetimerange"
                :picker-options="pickerOptions2"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                align="right"
                value-format="yyyyMMddHHmmss"
                :default-time="['00:00:00', '23:59:59']"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="18" style="text-align: right;">
            <el-form-item>
              <el-button type="primary" @click="getTable">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card shadow="always">
      <div class="admin-table-actions">
        <el-button type="primary" @click="exportExcel" size="small">
          <i class="el-icon-download"></i> 导出
        </el-button>
      </div>
      <el-table
        :data="tableData.data"
        v-loading="tableLoading"
        style="width: 100%"
        class="admin-table-list"
      >
        <el-table-column prop="Vehicle_No" label="车牌号" :formatter="$utils.baseFormatter"></el-table-column>
        <el-table-column prop="Alarm_Type_809" label="报警类型">
          <template slot-scope="scope">{{$dict.get_vehicle_alarm(scope.row.Alarm_Type_809)}}</template>
        </el-table-column>
        <el-table-column prop="Create_Time" label="时间">
          <template slot-scope="scope">{{$utils.formatDate14(scope.row.Create_Time)}}</template>
        </el-table-column>
        <!-- <el-table-column prop="Id_Info" label="INFO ID" :formatter="$utils.baseFormatter"></el-table-column> -->
        <el-table-column prop="Process_State" label="处理状态" :formatter="format_Process_State"></el-table-column>
        <!-- <el-table-column prop="Process_Desc" label="处理结果 " :formatter="$utils.baseFormatter"></el-table-column> -->
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="small" @click="updateForm(scope)" type="primary" icon="el-icon-edit">处理</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="admin-table-pager">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="tableQuery.page"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="tableQuery.size"
          :total="tableData.total"
          layout="total, sizes, prev, pager, next, jumper"
          background
        ></el-pagination>
      </div>
    </el-card>

    <el-dialog
      width="40%"
      title
      :visible.sync="updateDialog"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :center="true"
      class="admin-dialog"
    >
      <el-select v-model="postData.RESULT" placeholder="选择处理结果" style="width:100%;">
        <el-option label="处理中" value="0"></el-option>
        <el-option label="已处理完毕" value="1"></el-option>
        <el-option label="不作处理" value="2"></el-option>
        <el-option label="将来处理" value="3"></el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="updateDialog = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getWarnList, UpdateAlarmHandler } from "@/api/index.js";
import moment from "moment";
export default {
  created() {
    this.$set(this.$data, "dateRange", [
      moment().format("YYYYMMDD") + "000000",
      moment().format("YYYYMMDD") + "235959"
    ]);
    this.$nextTick(() => {
      this.getTable();
    });
  },
  watch: {
    dateRange: function() {
      this.tableQuery.StartTime = this.dateRange[0];
      this.tableQuery.EndTime = this.dateRange[1];
    }
  },
  data() {
    return {
      currentRow: {},
      postData: {
        MessageID: "x1400",
        MSG_GNSSCENTERID: "",
        VEHICLE_NO: "",
        VEHICLE_COLOR: "",
        DATA_TYPE: 0x1403,
        INFO_ID: "",
        RESULT: ""
      },
      updateDialog: false,
      dateRange: [],
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
      isCollapse: false,
      tableLoading: true,
      tableQuery: {
        StartTime: "",
        EndTime: "",
        size: 10,
        page: 1
      },
      tableData: {
        total: 0,
        data: []
      }
    };
  },
  methods: {
    format_Process_State(row) {
      return (
        ["处理中", "已处理完毕", "不作处理", "将来处理"][row.Process_State] ||
        "--"
      );
    },
    updateForm(scope) {
      this.currentRow = scope.row;
      this.updateDialog = true;
    },
    submitForm() {
      UpdateAlarmHandler({
        id: this.currentRow.Id,
        state: this.postData.RESULT,
        remark: ""
      }).then(res => {
        if (res.data.code == 0) {
          this.$message.success(res.data.msg);
          this.getTable();
          this.currentRow.Gnss_Centerid.split(",").map(item => {
            this.postData.MSG_GNSSCENTERID = item;
            this.postData.VEHICLE_NO = this.currentRow.Vehicle_No;
            this.postData.VEHICLE_COLOR = this.currentRow.Vehicle_Color;
            this.postData.INFO_ID = this.currentRow.Id_Info;
            this.$instruction.send(JSON.stringify(this.postData));
          });
        } else {
          this.$message.warning(res.data.msg);
        }
        this.updateDialog = false;
        this.currentRow = {};
        this.postData = {
          MessageID: "x1400",
          MSG_GNSSCENTERID: "",
          VEHICLE_NO: "",
          VEHICLE_COLOR: "",
          DATA_TYPE: 0x1403,
          INFO_ID: "",
          RESULT: ""
        };
      });
    },
    //导出excel
    exportExcel() {
      var wsCol = [
        {
          A: "车牌号",
          B: "报警类型",
          C: "时间",
          D: "处理状态"
        }
      ];
      this.tableData.data.map(data => {
        wsCol.push({
          A: data.Vehicle_No,
          B: this.$dict.get_vehicle_alarm(data.Alarm_Type_809),
          C: this.$utils.formatDate14(data.Create_Time),
          D: this.format_Process_State(data)
        });
      });
      this.$utils.exportExcel({
        data: wsCol,
        sheetName: "报警信息管理",
        fileName: "报警信息管理.xlsx"
      });
    },

    getTable() {
      //获取列表
      this.tableLoading = true;
      var query = Object.assign({}, this.tableQuery);
      getWarnList(query)
        .then(res => {
          if (res.data.code == 0) {
            this.$set(this.tableData, "data", res.data.data);
            this.tableData.total = res.data.count;
          } else {
            this.$set(this.$data, "tableData", []);
            this.$message.error(res.data.msg);
          }
          this.tableLoading = false;
        })
        .catch(() => {});
    },
    handleSizeChange(val) {
      //每页数量切换
      this.tableQuery.page = 1;
      this.tableQuery.size = val;
      this.getTable();
    },
    handleCurrentChange(val) {
      //翻页
      this.tableQuery.page = val;
      this.getTable();
    }
  }
};
</script>
<style>
.flip-list-move {
  transition: transform 1s;
}
</style>