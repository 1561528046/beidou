<template>
  <div class="admin-table-container">
    <el-card shadow="always" class="admin-table-search">

      <el-form :model="tableQuery" label-width="80px" label-position="left" class="table-search" size="small">
        <el-row :gutter="30">
          <el-col :span="6">
            <el-form-item label="时间">
              <el-date-picker v-model="tableQuery.Time" value-format="yyyyMMdd" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions2">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="车辆">
              <el-button style=" display:inline-block; width:100%;height:32px;" @click="selectvehicle">
                <el-input type="text" v-model="tableQuery.sim_id" style="position: absolute;left: 0px; top: 0px;"></el-input>
              </el-button>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="用户">
              <el-button style=" display:inline-block; width:100%;height:32px;" @click="selectuser">
                <el-input type="text" v-model="tableQuery.sim_id" style="position: absolute;left: 0px; top: 0px;"></el-input>
              </el-button>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-if="isCollapse">
            <el-form-item label="限速速度(公里小时)">
              <template>
                <el-input></el-input>
              </template>
            </el-form-item>
          </el-col>
          <el-col :span="isCollapse?24:6" style="text-align: right;">
            <el-form-item>
              <el-button type="primary" @click="isCollapse=!isCollapse" v-if="!isCollapse">展开</el-button>
              <el-button type="primary" @click="isCollapse=!isCollapse" v-if="isCollapse">收起</el-button>
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
        <el-table-column prop="time" label="车牌号" :formatter="$utils.baseFormatter"> </el-table-column>
        <el-table-column prop="time" label="车牌颜色" :formatter="$utils.baseFormatter"> </el-table-column>
        <el-table-column prop="time" label="所属组织" :formatter="$utils.baseFormatter"> </el-table-column>
        <el-table-column prop="time" label="开始时间" :formatter="$utils.baseFormatter"> </el-table-column>
        <el-table-column prop="time" label="结束时间" :formatter="$utils.baseFormatter"> </el-table-column>
        <el-table-column prop="time" label="超速次数" :formatter="$utils.baseFormatter"> </el-table-column>
      </el-table>
      <div class="admin-table-pager">
        <el-pagination @size-change="handleSizeChange " @current-change="handleCurrentChange " :current-page="tableQuery.page " :page-sizes="[10, 20, 50, 100] " :page-size="tableQuery.size " :total="tableData.total " layout="total, sizes, prev, pager, next, jumper " background>
        </el-pagination>
      </div>
    </el-card>
    <el-dialog width="50%" title="选择信息" :visible.sync="vehicleDialog" :append-to-body="true" :close-on-click-modal="false" :close-on-press-escape="false" :center="true" class="admin-dialog">
      <choose-vcheckbox @button="xz" @success=" () => {this.getTable();this.vehicleDialog = false;}" :key="addKey"></choose-vcheckbox>
    </el-dialog>
    <el-dialog width="30%" title="选择信息" :visible.sync="userDialog" :append-to-body="true" :close-on-click-modal="false" :close-on-press-escape="false" :center="true" class="admin-dialog">
      <choose-user @button="xz" @success=" () => {this.getTable();this.userDialog = false;}" :key="addKey"></choose-user>
    </el-dialog>
  </div>
</template>
<script>
import {} from "@/api/index.js";
import chooseVcheckbox from "@/components/choose-vcheckbox";
import chooseUser from "@/components/choose-user";
export default {
  components: { chooseVcheckbox, chooseUser },
  created() {
    this.getTable();
    this.keyupSubmit();
  },
  data() {
    return {
      vehicleDialog: false,
      userDialog: false,
      isCollapse: false,
      tableQuery: {
        beginTime: "",
        endTime: "",
        Time: "",
        simId: "",
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
      userdetailShow: false
    };
  },
  mounted() {},
  methods: {
    selectvehicle() {
      this.addKey++;
      this.vehicleDialog = true;
      this.dialog = true;
    },
    selectuser() {
      this.addKey++;
      this.userDialog = true;
    },
    // 回来的数据
    xz(scope) {
      this.dialog = scope.row.dialog;
      this.tableQuery.sim_id = scope.row.license;
    },
    //查询产品列表
    getTable() {
      this.tableLoading = true;
      this.tableLoading = false;
      // if (this.simee.address) {
      //   this.tableQuery.company_id = this.simee.address;
      // }
      // if (this.tableQuery.company_nameta == "") {
      //   this.tableQuery.company_id = "";
      // }
      // var query = Object.assign({}, this.tableQuery);
      // getDeviceCompanyList(query)
      //   .then(res => {
      //     if (res.data.code == 0) {
      //       this.$set(this.$data, "tableData", res.data);
      //     } else {
      //       this.$set(this.$data, "tableData", []);
      //       this.$message.error(res.data.msg);
      //     }
      //     this.tableLoading = false;
      //   })
      //   .catch(() => {});
    },
    //回车事件
    keyupSubmit() {
      document.onkeydown = e => {
        console.log(e);
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