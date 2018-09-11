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
            <el-form-item prop="license" label="选择车辆">
              <el-button style=" display:inline-block; width:100%;height:32px;" @click="addFrom">
                <el-input type="text" v-model="tableQuery.license" style="position: absolute;left: 0px; top: 0px;"></el-input>
              </el-button>
            </el-form-item>
          </el-col>
          <el-col :span="3" style="text-align: right;">
            <el-form-item>
              <el-button type="primary" @click="getTable">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card shadow="always">
      <el-table :data="list" v-loading="tableLoading" style="width: 100%" class="admin-table-list">
        <el-table-column prop="license" label="车牌号" :formatter="$utils.baseFormatter">
          <template slot-scope="scope">
            <span class="license-card" :style="$dict.get_license_color(scope.row.license_color).style" @click="showDetails(scope)">{{scope.row.license}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="start_time" label="开始时间" :formatter="(row)=>{return this.$utils.formatDate14(JSON.stringify(row.start_time))}"> </el-table-column>
        <el-table-column prop="stop_time" label="结束时间" :formatter="(row)=>{return this.$utils.formatDate14(JSON.stringify(row.stop_time))}"> </el-table-column>
        <el-table-column prop="duration_ss" label="时长" :formatter="$utils.baseFormatter "> </el-table-column>
        <el-table-column prop="start_address" label="停车位置" :formatter="$utils.baseFormatter "> </el-table-column>
      </el-table>
      <div class="admin-table-pager">
        <el-pagination @size-change="handleSizeChange " @current-change="handleCurrentChange " :current-page="tableQuery.page " :page-sizes="[10, 20, 50, 100] " :page-size="tableQuery.size " :total="tableData.total " layout="total, sizes, prev, pager, next, jumper " background>
        </el-pagination>
      </div>
    </el-card>
    <el-dialog width="50%" title="选择信息" :visible.sync="addDialog" :append-to-body="true" :close-on-click-modal="false" :close-on-press-escape="false" :center="true" class="admin-dialog">
      <choose-vehicle @button="vehicleCallback" @success=" () => {this.getTable();this.addDialog = false;}" :key="addKey"></choose-vehicle>
    </el-dialog>
  </div>
</template>
<script>
import { rules } from "@/utils/rules.js";
import moment from "moment";
import { getStopDetailByPage } from "@/api/index.js";
import selectAlarmtype from "@/components/select-alarmtype.vue";
import chooseVehicle from "@/components/choose-vehicle.vue";
import { location2address, gps2amap } from "@/utils/map-tools.js";
export default {
  components: { chooseVehicle, selectAlarmtype },
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
      addDialog: false,
      addKey: 0,
      isCollapse: false,
      tableQuery: {
        start_time: "",
        stop_time: "",
        time: "",
        license: "",
        license_color: "",
        speed_limit: "",
        alarm_type: "",
        sim_ids: "",
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
        alarm_type: [
          {
            required: true,
            trigger: "change",
            message: "请选择报警类型"
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
      tableLoading: false,
      userdetailShow: false,
      dialog: true
    };
  },
  watch: {
    dialog: function() {
      this.addDialog = this.dialog;
    }
  },
  methods: {
    // 选择查询方式
    addFrom() {
      this.addKey++;
      this.addDialog = true;
      this.dialog = true;
    },
    // 回来的数据
    vehicleCallback(scope) {
      this.dialog = scope.row.dialog;
      this.tableQuery.license = scope.row.license;
      this.tableQuery.sim_ids = "0" + scope.row.sim_id;
      this.tableQuery.license_color = scope.row.license_color;
    },
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
    //查询列表
    getTable() {
      this.tableLoading = true;
      this.$refs.baseForm.validate((isVaildate, errorItem) => {
        if (isVaildate) {
          var query = Object.assign({}, this.tableQuery);
          getStopDetailByPage(query)
            .then(res => {
              if (res.data.code == 0) {
                var data = [];
                for (var i = 0; i < res.data.data.length; i++) {
                  res.data.data[i].license = this.tableQuery.license;
                  res.data.data[
                    i
                  ].license_color = this.tableQuery.license_color;
                  res.data.data[i].alertTime =
                    res.data.data[i].stop_time - res.data.data[i].start_time;
                  data.push(res.data.data[i]);
                }
                //1、gps坐标转高德坐标
                //2、高德坐标转成地址
                Promise.all([
                  gps2amap({
                    data: data,
                    longKey: "longitude",
                    latKey: "latitude"
                  }),
                  gps2amap({
                    data: data,
                    longKey: "longitude",
                    latKey: "latitude"
                  })
                ])
                  .then(res => {
                    data.map((item, index) => {
                      item.longitude = res[0][index].split(",")[0];
                      item.latitude = res[0][index].split(",")[1];
                    });
                  })
                  .then(() => {
                    Promise.all([
                      location2address({
                        data: data,
                        longKey: "longitude",
                        latKey: "latitude"
                      }),
                      location2address({
                        data: data,
                        longKey: "longitude",
                        latKey: "latitude"
                      })
                    ]).then(addressArr => {
                      data.map((item, index) => {
                        item.start_address = addressArr[0][index];
                        item.stop_address = addressArr[1][index];
                      });
                      this.$set(this.tableData, "data", Object.freeze(data));
                      this.$set(
                        this.tableData,
                        "total",
                        this.tableData.data.length
                      );
                    });
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