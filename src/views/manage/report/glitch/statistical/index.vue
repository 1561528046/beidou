<template>
  <div class="admin-table-container">
    <el-card shadow="always" class="admin-table-search">
      <el-form
        :model="tableQuery"
        ref="baseForm"
        :rules="rules"
        label-width="80px"
        label-position="left"
        class="table-search"
        size="small"
      >
        <el-row :gutter="30">
          <el-col :span="6">
            <el-form-item prop="time" label="时间">
              <el-date-picker
                style="width:347px;"
                v-model="tableQuery.time"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                align="right"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="license" label="车辆">
              <el-input
                :disabled="vehicleAlert"
                @focus="selectvehicle"
                type="text"
                v-model="tableQuery.license"
                style="position: absolute;left: 0px; top: 0px;"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="real_name" label="用户">
              <el-input
                :disabled="userAlert"
                @focus="selectuser"
                type="text"
                v-model="tableQuery.real_name"
                style="position: absolute;left: 0px; top: 0px;"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4" style="text-align: right;">
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
      <el-table :data="list" v-loading="tableLoading" style="width: 100%" class="admin-table-list">
        <el-table-column prop="license" label="车牌号" :formatter="$utils.baseFormatter">
          <template slot-scope="scope">
            <span
              class="license-card"
              :style="$dict.get_license_color(scope.row.license_color).style"
              @click="showDetails(scope)"
            >{{scope.row.license}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="start_time"
          label="开始时间"
          :formatter="(row)=>{return this.$utils.formatDate14(JSON.stringify(row.start_time))}"
        ></el-table-column>
        <el-table-column
          prop="stop_time"
          label="结束时间"
          :formatter="(row)=>{return this.$utils.formatDate14(JSON.stringify(row.stop_time))}"
        ></el-table-column>
      </el-table>
      <div class="admin-table-pager">
        <el-pagination
          @size-change="handleSizeChange "
          @current-change="handleCurrentChange "
          :current-page="tableQuery.page "
          :page-sizes="[10, 20, 50, 100] "
          :page-size="tableQuery.size "
          :total="tableData.total "
          layout="total, sizes, prev, pager, next, jumper "
          background
        ></el-pagination>
      </div>
    </el-card>
    <el-dialog
      width="50%"
      title="选择信息"
      :visible.sync="vehicleDialog"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :center="true"
      class="admin-dialog"
    >
      <choose-vcheckbox
        @button="xz"
        @success=" () => {this.getTable();this.vehicleDialog = false;}"
        :key="addKey"
      ></choose-vcheckbox>
    </el-dialog>
    <el-dialog
      width="30%"
      title="选择信息"
      :visible.sync="userDialog"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :center="true"
      class="admin-dialog"
    >
      <choose-ucheckbox
        @button="user"
        @success=" () => {this.getTable();this.userDialog = false;}"
        :key="addKey"
      ></choose-ucheckbox>
    </el-dialog>
  </div>
</template>
<script>
import { rules } from "@/utils/rules.js";
import moment from "moment";
import { getFaultSummaryByPage } from "@/api/index.js";
import chooseVcheckbox from "@/components/choose-vcheckbox.vue";
import chooseUcheckbox from "@/components/choose-ucheckbox.vue";
export default {
  components: { chooseVcheckbox, chooseUcheckbox },
  created() {},
  computed: {
    list: function() {
      return this.tableData.data.slice(
        (this.tableQuery.page - 1) * this.tableQuery.size,
        this.tableQuery.page * this.tableQuery.size
      );
    }
  },
  data() {
    return {
      vehicleDialog: false,
      userDialog: false,
      isCollapse: false,
      vehicleAlert: false,
      userAlert: false,
      vehicles: [],
      tableQuery: {
        start_time: "",
        stop_time: "",
        time: "",
        sim_ids: "",
        user_ids: "",
        license: "",
        real_name: "",
        size: 10,
        page: 1
      },
      rules: {
        ...rules,
        time: [
          {
            required: true,
            trigger: "change",
            validator: this.validateTime
          }
        ]
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
      tableLoading: false,
      addKey: 0,
      userdetailShow: false
    };
  },
  mounted() {},
  watch: {
    vehicleAlert: function() {
      if (this.tableQuery.license == "") {
        this.userAlert = false;
      }
    },
    userAlert: function() {
      if (this.tableQuery.real_name == "") {
        this.vehicleAlert = false;
      }
    }
  },
  methods: {
    exportExcel() {
      //导出excel
      var wsCol = [
        {
          A: "车牌号",
          B: "开始时间",
          C: "结束时间"
        }
      ];
      this.tableData.data.map(data => {
        wsCol.push({
          A: data.license,
          B: this.$utils.formatDate14(data.start_time),
          C: this.$utils.formatDate14(data.stop_time)
        });
      });
      this.$utils.exportExcel({
        data: wsCol,
        sheetName: "故障报警统计表",
        fileName: "故障报警统计表.xlsx"
      });
    },
    // 查询时间验证
    validateTime(rule, value, callback) {
      var date = moment(value[0]).add(3, "days")._d;
      date = moment(date).format("YYYY-MM-DD HH:mm:ss");
      if (value == "") {
        callback(new Error("请选择时间!"));
        return false;
      } else if (!moment(value[1]).isBefore(date)) {
        callback(new Error("选择时间不能大于3天!"));
        return false;
      } else {
        this.tableQuery.start_time = moment(value[0]).format("YYYYMMDDHHmmss");
        this.tableQuery.stop_time = moment(value[1]).format("YYYYMMDDHHmmss");
        callback();
      }
    },
    selectvehicle() {
      this.addKey++;
      this.vehicleDialog = true;
      this.tableQuery.license = "";
      this.tableQuery.sim_ids = "";
      this.userAlert = false;
    },
    selectuser() {
      this.addKey++;
      this.userDialog = true;
      this.tableQuery.real_name = "";
      this.tableQuery.sim_ids = "";
      this.vehicleAlert = false;
    },
    // 回来的数据
    xz(scope) {
      this.vehicleDialog = false;
      if (!scope.length == 0) {
        this.userAlert = true;
      }
      this.vehicles = [];
      for (var i = 0; i < scope.length; i++) {
        this.tableQuery.license =
          this.tableQuery.license + scope[i].license + ",";
        this.tableQuery.sim_ids =
          this.tableQuery.sim_ids + ("0" + scope[i].sim_id) + ",";
        this.vehicles.push({
          license: scope[i].license,
          license_color: scope[i].license_color,
          sim_id: scope[i].sim_id
        });
      }
      this.tableQuery.user_ids = "";
      this.tableQuery.sim_ids = this.tableQuery.sim_ids.substring(
        0,
        this.tableQuery.sim_ids.lastIndexOf(",")
      );
      this.tableQuery.license = this.tableQuery.license.substring(
        0,
        this.tableQuery.license.lastIndexOf(",")
      );
    },
    user(scope) {
      this.userDialog = false;
      if (scope.length > 0) {
        this.vehicleAlert = true;
      }
      for (var i = 0; i < scope.length; i++) {
        this.tableQuery.user_ids =
          this.tableQuery.user_ids + scope[i].user_id + ",";
        this.tableQuery.real_name =
          this.tableQuery.real_name + scope[i].real_name + ",";
      }
      this.tableQuery.user_ids = this.tableQuery.user_ids.substring(
        0,
        this.tableQuery.user_ids.lastIndexOf(",")
      );
      this.tableQuery.real_name = this.tableQuery.real_name.substring(
        0,
        this.tableQuery.real_name.lastIndexOf(",")
      );
    },
    //查询产品列表
    getTable() {
      if (this.tableQuery.real_name == "" && this.tableQuery.license == "") {
        return this.$notify({
          message: "请选择车辆或用户",
          title: "提示",
          type: "error"
        });
      } else if (this.tableQuery.time == []) {
        return this.$notify({
          message: "请选择时间",
          title: "提示",
          type: "error"
        });
      }
      this.tableLoading = true;
      this.$refs.baseForm.validate((isVaildate, errorItem) => {
        if (isVaildate) {
          var query = Object.assign({}, this.tableQuery);
          getFaultSummaryByPage(query)
            .then(res => {
              if (res.data.code == 0) {
                var data = [];
                var arr = {};
                this.vehicles.map(item => {
                  arr[item.sim_id] = item;
                });
                res.data.data.map(item => {
                  item.sim_id =
                    item.sim_id[0] == "0" ? item.sim_id.slice(1) : item.sim_id;
                  var obj = arr[item.sim_id];
                  if (!obj) {
                    return false;
                  }
                  item.license = obj.license;
                  item.license_color = obj.license_color;
                });
                data = res.data.data;
                this.$set(this.tableData, "data", Object.freeze(data));
                this.$set(this.tableData, "total", this.tableData.data.length);
              } else {
                this.$set(this.$data, "tableData", []);
                this.$emit("error");
                this.$notify({
                  message: res.data.msg,
                  title: "提示",
                  type: "error"
                });
              }
            })
            .catch(() => {
              this.$alert("接口错误", "提示", {
                type: "error"
              });
              this.$emit("error");
            });
        } else {
          var errormsg = "";
          for (var key in errorItem) {
            errormsg += errorItem[key][0].message + "<br>";
          }
          this.$notify.error({
            title: "错误",
            dangerouslyUseHTMLString: true,
            message: errormsg
          });
        }
      });
      this.tableLoading = false;
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
<style lang="less">
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
input[type="number"] {
  -moz-appearance: textfield;
}
.license-card {
  padding: 0 5px;
  border-radius: 4px;
  width: 9em;
  overflow: hidden;
  display: inline-block;
  text-align: center;
  box-sizing: border-box;
  position: relative;
  font-weight: bold;
  &:before {
    content: "";
    width: 4px;
    height: 4px;
    border-radius: 4px;
    background: #fff;
    position: absolute;
    left: 5px;
    top: 50%;
    margin-top: -2px;
  }
  &:after {
    content: "";
    width: 4px;
    height: 4px;
    border-radius: 4px;
    background: #fff;
    position: absolute;
    right: 5px;
    top: 50%;
    margin-top: -2px;
  }
}
</style>
