<template>
  <div class="admin-table-container">
    <el-card shadow="always" class="admin-table-search">
      <el-form :model="tableQuery" ref="baseForm" :rules="rules" label-width="80px" label-position="left" class="table-search" size="small" @submit.native.prevent>
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
          <el-col :span="10" style="text-align: right;">
            <el-form-item>
              <el-button type="primary" native-type="submit" :loading="tableLoading" @click="getTable">查询</el-button>
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
            <span class="license-card" :style="$dict.get_license_color(scope.row.license_color).style" @click="showDetails(scope)">{{scope.row.license}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="time" label="时间" :formatter="(row)=>{return this.$utils.formatDate14(JSON.stringify(row.time))}"> </el-table-column>
        <el-table-column prop="speed" label="速度(公里/时)" :formatter="$utils.baseFormatter "> </el-table-column>>
        <el-table-column prop="em_0x01" label="行驶里程" :formatter="$utils.baseFormatter "> </el-table-column>
        <el-table-column prop="address" label="当时位置" :formatter="$utils.baseFormatter "> </el-table-column>
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
import moment from "moment";
import { getReport } from "@/api/index.js";
import selectAlarmtype from "@/components/select-alarmtype.vue";
import chooseVehicle from "@/components/choose-vehicle.vue";
import { location2address, gps2amap } from "@/utils/map-tools.js";
export default {
  components: { chooseVehicle, selectAlarmtype },
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
        sim_id: "",
        size: 10,
        page: 1
      },
      rules: {
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
    exportExcel() {
      //导出excel
      var wsCol = [
        {
          A: "车牌号",
          B: "时间",
          C: "速度",
          D: "里程",
          E: "位置",
          F: "GPS经纬度"
        }
      ];
      this.tableData.data.map(data => {
        wsCol.push({
          A: data.license,
          B: this.$utils.formatDate14(data.time),
          C: data.speed,
          D: data.em_0x01,
          E: data.address,
          F: data.longitude + "," + data.latitude
        });
      });
      this.$utils.exportExcel({
        data: wsCol,
        sheetName: "行驶轨迹明细",
        fileName: "行驶轨迹明细.xlsx"
      });
      // // var ws = XLSX.utils.json_to_sheet(
      // //   [
      // //     { A: "S", B: "h", C: "e", D: "e", E: "t", F: "J", G: "S" },
      // //     { A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7 },
      // //     { A: 2, B: 3, C: 4, D: 5, E: 6, F: 7, G: 8 }
      // //   ],
      // //   { header: ["A", "B", "C", "D", "E", "F", "G"], skipHeader: true }
      // // );
      // var ws = XLSX.utils.json_to_sheet(wsCol);
      // const wb = XLSX.utils.book_new();
      // XLSX.utils.book_append_sheet(wb, ws, "行驶轨迹明细");
      // XLSX.writeFile(wb, "行驶轨迹明细.xlsx");
    },
    addFrom() {
      this.addKey++;
      this.addDialog = true;
      this.dialog = true;
    },
    // 回来的数据
    vehicleCallback(scope) {
      this.dialog = scope.row.dialog;
      this.tableQuery.license = scope.row.license;
      this.tableQuery.sim_id = "0" + scope.row.sim_id;
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
      this.$refs.baseForm.validate((isVaildate, errorItem) => {
        if (isVaildate) {
          this.tableLoading = true;
          var query = Object.assign({}, this.tableQuery);
          getReport(query)
            .then(res => {
              this.tableLoading = false;
              if (res.data.code == 0) {
                var data = [];
                for (var i = 0; i < 2; i++) {
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

                var loader = this.$loading({
                  text: "正在转换坐标"
                });
                gps2amap({
                  data: data,
                  longKey: "longitude",
                  latKey: "latitude"
                })
                  .then(res => {
                    data.map((item, index) => {
                      item.amap_longitude = res[index].split(",")[0];
                      item.amap_latitude = res[index].split(",")[1];
                    });
                  })
                  .catch(() => {
                    loader.close();
                  })
                  .then(() => {
                    loader.close();
                    loader = this.$loading({
                      text: "正在转换地址"
                    });
                    location2address({
                      data: data,
                      longKey: "amap_longitude",
                      latKey: "amap_latitude"
                    })
                      .then(addressArr => {
                        loader.close();
                        data.map((item, index) => {
                          item.address = addressArr[index];
                        });
                        this.$set(this.tableData, "data", Object.freeze(data));
                        this.$set(
                          this.tableData,
                          "total",
                          this.tableData.data.length
                        );
                      })
                      .catch(() => {
                        loader.close();
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
    },
    // 分页
    handleSizeChange(val) {
      this.tableQuery.page = 1;
      this.tableQuery.size = val;
    },
    handleCurrentChange(val) {
      this.tableQuery.page = val;
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