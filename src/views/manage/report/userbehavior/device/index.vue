<template>
  <div class="admin-table-container">
    <el-card shadow="always" class="admin-table-search">
      <el-form :model="tableQuery" ref="baseForm" :rules="rules" label-width="80px" label-position="left" class="table-search" size="small">
        <el-row :gutter="30">
          <el-col :span="7">
            <el-form-item prop="time" label="时间">
              <el-date-picker v-model="tableQuery.time" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item prop="device_no" label="设备">
              <el-input :disabled="userAlert" @focus="selectdevice" type="text" v-model="tableQuery.device_no" style="position: absolute;left: 0px; top: 0px;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10" style="text-align: right;">
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
      <el-table :data="list" v-loading="tableLoading" style="width: 100%" class="admin-table-list">
        <el-table-column prop="" label="设备号" :formatter="$utils.baseFormatter"> </el-table-column>
        <el-table-column prop="" label="所属公司" :formatter="$utils.baseFormatter "> </el-table-column>
        <el-table-column prop="" label="所属车辆" :formatter="$utils.baseFormatter "> </el-table-column>
        <el-table-column prop="" label="变更内容"> </el-table-column>
        <el-table-column prop="time" label="变更时间" :formatter="(row)=>{return this.$utils.formatDate14(JSON.stringify(row.time))}"> </el-table-column>
        <el-table-column prop="" label="变更人"> </el-table-column>
        <el-table-column prop="" label="变更详情"> </el-table-column>
      </el-table>
      <div class="admin-table-pager">
        <el-pagination @size-change="handleSizeChange " @current-change="handleCurrentChange " :current-page="tableQuery.page " :page-sizes="[10, 20, 50, 100] " :page-size="tableQuery.size " :total="tableData.total " layout="total, sizes, prev, pager, next, jumper " background>
        </el-pagination>
      </div>
    </el-card>
    <el-dialog width="30%" title="选择信息" :visible.sync="deviceDialog" :append-to-body="true" :close-on-click-modal="false" :close-on-press-escape="false" :center="true" class="admin-dialog">
      <select-deviceno @choosedevice="device" @success=" () => {this.getTable();this.deviceDialog = false;}" :key="addKey"></select-deviceno>
    </el-dialog>
  </div>
</template>
<script>
import { rules } from "@/utils/rules.js";
import moment from "moment";
import { getLoginDetailByPage } from "@/api/index.js";
import chooseVcheckbox from "@/components/choose-vcheckbox.vue";
import chooseUcheckbox from "@/components/choose-ucheckbox.vue";
import selectDeviceno from "@/components/select-deviceno.vue";
export default {
  components: { chooseVcheckbox, chooseUcheckbox, selectDeviceno },
  created() {
    this.keyupSubmit();
  },
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
      deviceDialog: false,
      isCollapse: false,
      vehicleAlert: false,
      userAlert: false,
      vehicles: [],
      tableQuery: {
        start_time: "",
        stop_time: "",
        time: "",
        device: "",
        device_ids: "",
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
    // 查询时间验证
    validateTime(rule, value, callback) {
      var date = moment(value[0]).add(30, "days")._d;
      date = moment(date).format("YYYY-MM-DD HH:mm:ss");
      if (value == "") {
        callback(new Error("请选择时间!"));
        return false;
      } else if (!moment(value[1]).isBefore(date)) {
        callback(new Error("选择时间不能大于30天!"));
        return false;
      } else {
        this.tableQuery.start_time = moment(value[0]).format("YYYYMMDDHHmmss");
        this.tableQuery.stop_time = moment(value[1]).format("YYYYMMDDHHmmss");
        callback();
      }
    },
    selectdevice() {
      this.deviceDialog = true;
      this.tableQuery.device_ids = "";
      this.tableQuery.device_no = "";
    },
    // 回来的数据
    device(scope) {
      this.deviceDialog = false;
      for (var i = 0; i < scope.length; i++) {
        this.tableQuery.device_no =
          this.tableQuery.device_no + scope[i].device_no + ",";
        this.tableQuery.device_ids =
          this.tableQuery.device_ids + scope[i].device_id + ",";
      }
      this.tableQuery.device_no = this.tableQuery.device_no.substring(
        0,
        this.tableQuery.device_no.lastIndexOf(",")
      );
      this.tableQuery.device_ids = this.tableQuery.device_ids.substring(
        0,
        this.tableQuery.device_ids.lastIndexOf(",")
      );
    },
    //查询产品列表
    getTable() {
      this.tableLoading = true;
      this.$refs.baseForm.validate((isVaildate, errorItem) => {
        if (isVaildate) {
          var query = Object.assign({}, this.tableQuery);
          getLoginDetailByPage(query)
            .then(res => {
              if (res.data.code == 0) {
                var data = [];
                var arr = {};
                this.vehicles.map(item => {
                  arr[item.device_id] = item;
                });
                res.data.data.map(item => {
                  item.device_id =
                    item.device_id[0] == "0"
                      ? item.device_id.slice(1)
                      : item.device_id;
                  var obj = arr[item.device_id];
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
