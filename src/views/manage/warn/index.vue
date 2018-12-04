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
        <el-table-column prop="driver_card_id" label="车牌号" :formatter="$utils.baseFormatter"></el-table-column>
        <el-table-column prop="Alarm_Type_808" label="报警类型" :formatter="$utils.baseFormatter"></el-table-column>
        <el-table-column prop="Create_Time" label="时间" :formatter="$utils.baseFormatter"></el-table-column>
        <el-table-column prop="Id_Info" label="INFO ID" :formatter="$utils.baseFormatter"></el-table-column>
        <el-table-column prop="Create_Time" label="时间" :formatter="$utils.baseFormatter"></el-table-column>
        <el-table-column prop="Create_Time" label="时间" :formatter="$utils.baseFormatter"></el-table-column>
        <el-table-column prop="identity_id" label="身份证 " :formatter="$utils.baseFormatter"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="small"
              @click="updateForm(scope)"
              type="primary"
              icon="el-icon-edit"
              v-rights="6-1-3"
            >编辑</el-button>
            <el-button
              size="small"
              type="primary"
              icon="el-icon-edit"
              @click="openBindingVehicle(scope)"
            >绑定车辆</el-button>
            <el-button size="small" icon="el-icon-delete" @click="delRow(scope)" v-rights="6-1-2">删除</el-button>
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
  </div>
</template>
<script>
import { getWarnList } from "@/api/index.js";
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
      console.log(this.tableQuery);
    }
  },
  data() {
    return {
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
    //导出excel
    exportExcel() {
      var wsCol = [
        {
          A: "司机卡编号",
          B: "姓名",
          C: "联系电话",
          D: "驾驶证有效期",
          E: "身份证"
        }
      ];
      this.tableData.data.map(data => {
        wsCol.push({
          A: data.driver_card_id,
          B: data.driver_name,
          C: data.tel,
          D: this.$utils.formatDate(data.license_validity),
          E: data.identity_id
        });
      });
      this.$utils.exportExcel({
        data: wsCol,
        sheetName: "司机信息管理",
        fileName: "司机信息管理.xlsx"
      });
    },

    getTable() {
      //获取列表
      this.tableLoading = true;
      var query = Object.assign({}, this.tableQuery);
      getWarnList(query)
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