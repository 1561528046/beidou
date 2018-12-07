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
          <el-col :span="7">
            <el-form-item prop="time" label="时间">
              <el-date-picker
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
          <el-col :span="7">
            <el-form-item prop="license" label="选择车辆">
              <el-button style=" display:inline-block; width:100%;height:32px;" @click="addFrom">
                <el-input
                  type="text"
                  v-model="tableQuery.license"
                  style="position: absolute;left: 0px; top: 0px;"
                ></el-input>
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
      <div class="admin-table-actions">
        <el-button type="primary" @click="exportExcel" size="small">
          <i class="el-icon-download"></i> 导出
        </el-button>
      </div>
      <el-table :data="list" v-loading="tableLoading" style="width: 100%" class="admin-table-list">
        <el-table-column prop="License" label="车牌号" :formatter="$utils.baseFormatter "></el-table-column>
        <el-table-column
          prop="GoOnlineTime"
          label="上线时间"
          :formatter="(row)=>{return this.$utils.formatDate14(JSON.stringify(row.GoOnlineTime))}"
        ></el-table-column>
        <el-table-column
          prop="OffTime"
          label="下线时间"
          :formatter="(row)=>{return this.$utils.formatDate14(JSON.stringify(row.OffTime))}"
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
      :visible.sync="addDialog"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :center="true"
      class="admin-dialog"
    >
      <choose-vehicle
        @button="vehicleCallback"
        @success=" () => {this.getTable();this.addDialog = false;}"
        :key="addKey"
      ></choose-vehicle>
    </el-dialog>
  </div>
</template>
<script>
import { rules } from "@/utils/rules.js";
import moment from "moment";
import { GetOnlineDetailByPage } from "@/api/index.js";
import chooseVehicle from "@/components/choose-vehicle.vue";
import { location2address, gps2amap } from "@/utils/map-tools.js";
export default {
  components: { chooseVehicle },
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
    exportExcel() {
      //导出excel
      var wsCol = [
        {
          A: "车牌号",
          B: "上线时间",
          C: "下线时间"
        }
      ];
      this.tableData.data.map(data => {
        wsCol.push({
          A: data.License,
          B: this.$utils.formatDate14(JSON.stringify(data.GoOnlineTime)),
          C: this.$utils.formatDate14(JSON.stringify(data.OffTime))
        });
      });
      this.$utils.exportExcel({
        data: wsCol,
        sheetName: "车辆上下线统计表",
        fileName: "车辆上下线统计表.xlsx"
      });
    },
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
      if (scope.row.sim_id.length == 11) {
        this.tableQuery.sim_id = "0" + scope.row.sim_id;
      } else {
        this.tableQuery.sim_id = scope.row.sim_id;
      }
      this.tableQuery.license_color = scope.row.license_color;
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
    //查询列表
    getTable() {
      if (this.tableQuery.license == "") {
        return this.$notify({
          message: "请选择车辆和报警类型",
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
          GetOnlineDetailByPage(query)
            .then(res => {
              if (res.data.code == 0) {
                var data = [];
                for (var i = 0; i < res.data.data.length; i++) {
                  res.data.data[i].license = this.tableQuery.license;
                  res.data.data[
                    i
                  ].license_color = this.tableQuery.license_color;
                  data.push(res.data.data[i]);
                }
                Promise.all([
                  gps2amap({
                    data: data,
                    longKey: "start_longitude",
                    latKey: "start_latitude"
                  }),
                  gps2amap({
                    data: data,
                    longKey: "stop_longitude",
                    latKey: "stop_latitude"
                  })
                ])
                  .then(res => {
                    data.map((item, index) => {
                      item.start_longitude = res[0][index].split(",")[0];
                      item.start_latitude = res[0][index].split(",")[1];
                      item.stop_longitude = res[1][index].split(",")[0];
                      item.stop_latitude = res[1][index].split(",")[1];
                    });
                  })
                  .then(() => {
                    Promise.all([
                      location2address({
                        data: data,
                        longKey: "start_longitude",
                        latKey: "start_latitude"
                      }),
                      location2address({
                        data: data,
                        longKey: "stop_longitude",
                        latKey: "stop_latitude"
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