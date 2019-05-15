<template>
  <div>
    <el-card>
      <el-form ref="baseForm" size="small" label-width="110px" :rules="rules" :model="tableQuery">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item prop="time" label="时间">
              <el-date-picker
                style="width:100%"
                v-model="tableQuery.time"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="license" label="车辆">
              <el-input @focus="selectVehicle" v-model="tableQuery.license"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="alarm_name" label="报警类型">
              <el-input @focus="selectType" v-model="tableQuery.alarm_name"></el-input>
            </el-form-item>
          </el-col>
          <el-col v-if="isCollapse" :span="6">
            <el-form-item prop="source" label="报警来源">
              <el-select clearable style="width:100%" v-model="tableQuery.source">
                <el-option value="1" label="平台">平台</el-option>
                <el-option value="0" label="终端">终端</el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="6" v-if="isCollapse">
            <el-form-item prop label="报警等级">
              <el-select clearable v-model="tableQuery.alarm_lev" style="width:100%">
                <el-option value="1" label="一级"></el-option>
                <el-option value="2" label="二级"></el-option>
              </el-select>
            </el-form-item>
          </el-col>-->
          <el-col v-show="isCollapse" :span="6">
            <el-form-item label="驾驶员身份证">
              <el-input @focus="selectDriver" v-model="tableQuery.identity_id"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="isCollapse?24:6" style="text-align: right;">
            <el-form-item>
              <el-button type="primary" @click="isCollapse=!isCollapse" v-if="!isCollapse">展开</el-button>
              <el-button type="primary" @click="isCollapse=!isCollapse" v-if="isCollapse">收起</el-button>
              <el-button @click="selectAlarm" type="primary">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card shadow="always" class="admin-table-search">
      <div class="admin-table-actions">
        <el-button type="primary" @click="exportExcel" size="small">
          <i class="el-icon-download"></i> 导出
        </el-button>
      </div>
      <el-table :data="list" v-loading="tableLoading" style="width: 100%" class="admin-table-list">
        <el-table-column prop="license" label="车牌号">
          <template slot-scope="scope">
            <span
              class="license-card"
              :style="$dict.get_license_color(scope.row.license_color).style"
            >{{scope.row.license||"--"}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="license_color"
          label="车牌颜色"
          :formatter="(row)=>{return $dict.get_color(row.license_color)}"
        ></el-table-column>
        <el-table-column
          prop="AlarmSign"
          label="终端报警类型"
          :formatter="(row)=>{return this.$dict.getAlarm(JSON.stringify(row.AlarmSign))}"
        ></el-table-column>
        <el-table-column prop="RegionName" label="平台报警类型" :formatter="$utils.baseFormatter"></el-table-column>
        <el-table-column
          prop="Time"
          label="报警时间"
          :formatter="(row)=>{return this.$utils.formatDate14(JSON.stringify(row.Time))}"
        ></el-table-column>
        <el-table-column prop="Speed" label="速度" :formatter="$utils.baseFormatter "></el-table-column>
        <el-table-column label="经度" :formatter="(row)=>{return row.Longitude }"></el-table-column>
        <el-table-column label="纬度" :formatter="(row)=>{return  row.Latitude }"></el-table-column>
        <el-table-column label="高程" :formatter="(row)=>{return row.Altitude}"></el-table-column>
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
    <!-- 选择车辆 -->
    <el-dialog
      width="50%"
      title="选择车辆"
      :visible.sync="vehicleDialog"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :center="true"
      class="admin-dialog"
    >
      <card-vehicle :vehicle="vehicleList" @button="storageVehicle"></card-vehicle>
    </el-dialog>
    <!-- 选择报警类型 -->
    <el-dialog
      width="50%"
      title="选择报警类型"
      :visible.sync="typeDialog"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :center="true"
      class="admin-dialog"
    >
      <card-type :type="alarmList" @card="storageType"></card-type>
    </el-dialog>
    <!-- 选择驾驶员 -->
    <el-dialog
      width="50%"
      title="选择驾驶员"
      :visible.sync="driverDialog"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :center="true"
      class="admin-dialog"
    >
      <choose-driver @save="saveDriver" :key="addKey"></choose-driver>
    </el-dialog>
    <!-- 选择扩展报警类型 -->
    <el-dialog
      width="40%"
      title="选择报警类型"
      :visible.sync="type35658Dialog"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :center="true"
      class="admin-dialog"
    >
      <template>
        <el-checkbox-group v-model="typeList">
          <el-checkbox label="1">违规行驶报警</el-checkbox>
          <el-checkbox label="2">前撞报警</el-checkbox>
          <el-checkbox label="4">胎压异常报警</el-checkbox>
          <el-checkbox label="8">车道偏离报警</el-checkbox>
        </el-checkbox-group>
        <el-button
          @click="extensionAlarmType"
          style="display:block;margin:0 auto;margin-top:10px"
          size="small"
          type="primary"
        >提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import { rules } from "@/utils/rules.js";
import moment from "moment";
// import { location2address, gps2amap } from "@/utils/map-tools.js";
import selectAlarmtype from "@/components/select-alarmtype.vue";
import cardVehicle from "./components/card-vehicle.vue";
import cardType from "./components/card-type.vue";
import chooseDriver from "@/components/choose-driver.vue";
import { getAlarmDetailByPage, GetVehicleBySIMIDToPaper } from "@/api/index.js";
export default {
  components: { cardVehicle, cardType, selectAlarmtype, chooseDriver },
  created() {
    var alarm = [];
    for (var key in this.$dict.alarm) {
      alarm.push(key);
    }
    this.$set(this.tableQuery, "alarm_type", alarm.join(","));
    this.$set(this.$data, "alarmType", alarm.join(","));
  },
  data() {
    return {
      addKey: 0,
      alarmType: "",
      driverDialog: false,
      tableLoading: false,
      vehicleDialog: false,
      typeDialog: false,
      type35658Dialog: false,
      typeList: [],
      vehicleList: [],
      alarmTypes: [],
      alarmList: [],
      isCollapse: false,
      tableData: {
        data: [],
        total: 0
      },
      tableQuery: {
        platformACCErr: "",
        time: "",
        license: "",
        start_time: "",
        stop_time: "",
        sim_ids: "",
        alarm_name: "",
        alarm_type: "",
        source: "",
        alarmType35658: "",
        alarm35658_name: "",
        ji0x64_alarmtype: "",
        ji0x65_alarmtype: "",
        identity_id: "",
        alarm_lev: "",
        page: 1,
        size: 10
      },
      rules: {
        ...rules,
        time: [
          {
            required: true,
            trigger: "change",
            validator: this.validateTime
          }
        ],
        license: [
          {
            required: true,
            trigger: "change",
            message: "请选择车辆"
          }
        ]
      }
    };
  },
  computed: {
    list: function() {
      return this.tableData.data.slice(
        (this.tableQuery.page - 1) * this.tableQuery.size,
        this.tableQuery.page * this.tableQuery.size
      );
    }
  },
  methods: {
    exportExcel() {
      //导出excel
      var wsCol = [
        {
          A: "车牌号",
          B: "车牌颜色",
          C: "终端报警类型",
          D: "平台报警类型",
          E: "报警时间",
          F: "速度",
          G: "经度",
          H: "纬度",
          I: "高程"
        }
      ];
      this.tableData.data.map(data => {
        wsCol.push({
          A: data.license,
          B: this.$dict.get_color(data.license_color),
          C: this.$dict.getAlarm(data.AlarmSign),
          D: data.RegionName,
          E: this.$utils.formatDate14(data.Time),
          F: data.Speed,
          G: data.Longitude,
          H: data.Latitude,
          I: data.Altitude
        });
      });
      this.$utils.exportExcel({
        data: wsCol,
        sheetName: "报警明细表",
        fileName: "报警明细表.xlsx"
      });
    },
    extensionAlarmType() {
      this.type35658Dialog = false;
      this.$set(this.tableQuery, "alarmType35658", this.typeList.join(","));
      this.$set(
        this.tableQuery,
        "alarm35658_name",
        this.$dict.get_additional_alarmList(this.typeList)
      );
    },
    // 选择驾驶员
    selectDriver() {
      this.addKey++;
      this.driverDialog = true;
    },
    saveDriver(data) {
      this.driverDialog = false;
      this.$set(this.tableQuery, "identity_id", data.identity_id);
    },
    selectType35658() {
      this.type35658Dialog = true;
    },
    // 查询报警信息明细
    selectAlarm() {
      if (this.tableQuery.time == "" || this.tableQuery.time == null) {
        return this.$notify({
          message: "请选择时间",
          title: "提示",
          type: "error"
        });
      }
      if (this.tableQuery.license == "") {
        return this.$notify({
          message: "请选择车辆",
          title: "提示",
          type: "error"
        });
      }
      if (this.tableQuery.alarm_type == "") {
        this.tableQuery.alarm_type = this.alarmType;
      }
      this.tableLoading = true;
      this.$refs.baseForm.validate((isVaildate, errorItem) => {
        if (isVaildate) {
          var query = Object.assign({}, this.tableQuery);
          getAlarmDetailByPage(query)
            .then(res => {
              if (res.data.code == 0) {
                res.data.data.map(item => {
                  item.license = "";
                  item.license_color = "";
                  GetVehicleBySIMIDToPaper({ sim_id: item.SimId }).then(res => {
                    if (res.data.code == "0") {
                      item.license = res.data.data[0].license;
                      item.license_color = res.data.data[0].license_color;
                    }
                  });
                });
                this.$set(this.tableData, "data", res.data.data);
                this.$set(this.tableData, "total", res.data.count);
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
    // 选择车辆
    selectVehicle() {
      this.vehicleDialog = true;
    },
    // 选择报警类型
    selectType() {
      this.alarmList = this.alarmTypes;
      this.typeDialog = true;
    },
    // 选择好车辆的回调
    storageVehicle(data) {
      this.tableQuery.license = "";
      this.tableQuery.sim_ids = "";
      this.vehicleDialog = false;
      data.map(item => {
        item.sim_id =
          item.sim_id.length == 11 ? "0" + item.sim_id : item.sim_id;
        this.tableQuery.license = this.tableQuery.license + item.license + ",";
        this.tableQuery.sim_ids = this.tableQuery.sim_ids + item.sim_id + ",";
      });
      this.tableQuery.sim_ids = this.tableQuery.sim_ids.substring(
        0,
        this.tableQuery.sim_ids.lastIndexOf(",")
      );
      this.tableQuery.license = this.tableQuery.license.substring(
        0,
        this.tableQuery.license.lastIndexOf(",")
      );
    },
    //排序
    sortNumber(a, b) {
      return a - b;
    },
    // 选择好报警类型的回调
    storageType(data) {
      this.alarmTypes = data;
      this.tableQuery.alarm_name = "";
      this.tableQuery.alarm_type = "";
      this.typeDialog = false;
      data.map(item => {
        this.tableQuery.alarm_name =
          this.tableQuery.alarm_name + this.$dict.getAlarms(item) + ",";
        this.tableQuery.alarm_type = this.tableQuery.alarm_type + item + ",";
      });
      // data.sort(this.sortNumber);
      this.tableQuery.alarm_type = this.tableQuery.alarm_type.substring(
        0,
        this.tableQuery.alarm_type.lastIndexOf(",")
      );
      this.tableQuery.alarm_name = this.tableQuery.alarm_name.substring(
        0,
        this.tableQuery.alarm_name.lastIndexOf(",")
      );
    },
    // 分页
    handleSizeChange(val) {
      this.tableQuery.page = 1;
      this.tableQuery.size = val;
      this.tableData.data.map(itam => {
        GetVehicleBySIMIDToPaper({ sim_id: itam.SimId }).then(res => {
          if (res.data.code == "0") {
            itam.license = res.data.data[0].license;
            itam.license_color = res.data.data[0].license_color;
          }
        });
      });
    },
    handleCurrentChange(val) {
      this.tableQuery.page = val;
      this.tableData.data.map(itam => {
        GetVehicleBySIMIDToPaper({ sim_id: itam.SimId }).then(res => {
          if (res.data.code == "0") {
            itam.license = res.data.data[0].license;
            itam.license_color = res.data.data[0].license_color;
          }
        });
      });
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