<template>
  <div class="admin-table-container">
    <el-card shadow="always" class="admin-table-search">
      <el-form :model="tableQuery" ref="baseForm" :rules="rules" label-width="80px" label-position="left" class="table-search" size="small">
        <el-row :gutter="30">
          <el-col :span="6">
            <el-form-item prop="time" label="时间">
              <el-date-picker style="width:347px;" v-model="tableQuery.time" value-format="yyyyMMddHHmmss" format="yyyy-MM-dd HH:mm" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="license" label="车辆">
              <el-button style=" display:inline-block; width:100%;height:32px;" @click="selectvehicle">
                <el-input type="text" v-model="tableQuery.license" style="position: absolute;left: 0px; top: 0px;"></el-input>
              </el-button>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="real_name" label="用户">
              <el-button style=" display:inline-block; width:100%;height:32px;" @click="selectuser">
                <el-input type="text" v-model="tableQuery.real_name" style="position: absolute;left: 0px; top: 0px;"></el-input>
              </el-button>
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
      </div>
      <el-table :data="tableData.data" v-loading="tableLoading" style="width: 100%" class="admin-table-list">
        <el-table-column prop="" label="登录账号" :formatter="$utils.baseFormatter"> </el-table-column>
        <el-table-column prop="" label="用户名称" :formatter="$utils.baseFormatter"> </el-table-column>
        <el-table-column prop="" label="开始时间" :formatter="$utils.baseFormatter"> </el-table-column>
        <el-table-column prop="" label="结束时间" :formatter="$utils.baseFormatter"> </el-table-column>
        <el-table-column prop="" label="总次数" :formatter="$utils.baseFormatter"> </el-table-column>
        <el-table-column prop="" label="总时长" :formatter="$utils.baseFormatter"> </el-table-column>
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
      <choose-user @button="user" @success=" () => {this.getTable();this.userDialog = false;}" :key="addKey"></choose-user>
    </el-dialog>
  </div>
</template>
<script>
import { rules } from "@/utils/rules.js";
import { getLoginSummaryByPage } from "@/api/index.js";
import chooseVcheckbox from "@/components/choose-vcheckbox";
import chooseUser from "@/components/choose-user";
export default {
  components: { chooseVcheckbox, chooseUser },
  created() {
    this.keyupSubmit();
  },
  data() {
    return {
      vehicleDialog: false,
      userDialog: false,
      isCollapse: false,
      tableQuery: {
        start_time: "",
        stop_time: "",
        time: "",
        user_ids: "",
        license: "",
        real_name: "",
        size: 10,
        page: 1
      },
      rules: {
        ...rules,
        license: [
          {
            required: true,
            trigger: "change",
            message: "请输入车牌号"
          }
        ],
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
  methods: {
    // 查询时间验证
    validateTime(rule, value, callback) {
      if (value == "") {
        callback(new Error("请选择时间!"));
        return false;
      } else if (parseInt(value[1]) - parseInt(value[0]) > 2000000) {
        callback(new Error("选择时间不能大于3天!"));
        return false;
      } else {
        this.tableQuery.start_time = value[0];
        this.tableQuery.stop_time = value[1];
        callback();
      }
    },
    selectvehicle() {
      this.addKey++;
      this.vehicleDialog = true;
    },
    selectuser() {
      this.addKey++;
      this.userDialog = true;
    },
    // 回来的数据
    xz(scope) {
      this.vehicleDialog = false;
      for (var i = 0; i < scope.length; i++) {
        this.tableQuery.license =
          this.tableQuery.license + scope[i].license + ",";
        this.tableQuery.user_ids = scope[i].user_id + ",";
      }
      this.tableQuery.user_ids = this.tableQuery.user_ids.substring(
        0,
        this.tableQuery.user_ids.lastIndexOf(",")
      );
      this.tableQuery.license = this.tableQuery.license.substring(
        0,
        this.tableQuery.license.lastIndexOf(",")
      );
    },
    user(scope) {
      this.userDialog = false;
      for (var i = 0; i < scope.length; i++) {
        this.tableQuery.real_name =
          this.tableQuery.real_name + scope[i].real_name + ",";
      }
      this.tableQuery.real_name = this.tableQuery.real_name.substring(
        0,
        this.tableQuery.real_name.lastIndexOf(",")
      );
    },
    //查询产品列表
    getTable() {
      this.tableLoading = true;
      this.tableQuery.user_ids = "64,65,66,67,68";
      this.$refs.baseForm.validate((isVaildate, errorItem) => {
        if (isVaildate) {
          var query = Object.assign({}, this.tableQuery);
          getLoginSummaryByPage(query)
            .then(res => {
              if (res.data.code == 0) {
                console.log(res.data.data);
                var data = [];
                data = res.data.data;
                this.$set(this.tableData, "data", Object.freeze(data));
                this.$set(this.tableData, "total", this.tableData.data.length);
                console.log(this.tableData.data);
                this.$emit("success");
                this.$notify({
                  message: res.data.msg,
                  title: "提示",
                  type: "success"
                });
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
<style>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
input[type="number"] {
  -moz-appearance: textfield;
}
</style>