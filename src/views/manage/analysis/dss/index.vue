<template>
  <div class="admin-table-container">
    <el-card shadow="always" class="admin-table-search">
      <el-form :rules="rules" ref="baseForm" label-width="100px" :model="tableQuery" size="small">
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
            <el-form-item label="报警类型">
              <el-input @focus="selectType" v-model="tableQuery.alarm_name"></el-input>
            </el-form-item>
          </el-col>
          <el-col v-show="isCollapse" :span="6">
            <el-form-item label="报警来源">
              <el-select clearable style="width:100%" v-model="tableQuery.source">
                <el-option value="1" label="平台">平台</el-option>
                <el-option value="0" label="终端">终端</el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-show="isCollapse" :span="6">
            <el-form-item label="报警等级">
              <el-select clearable v-model="tableQuery.alarm_lev" style="width:100%">
                <el-option value="1" label="一级"></el-option>
                <el-option value="2" label="二级"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-show="isCollapse" :span="6">
            <el-form-item label="驾驶员">
              <el-input @focus="selectDriver" v-model="tableQuery.identity_id"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="isCollapse?24:6" style="text-align: right;">
            <el-form-item>
              <el-button type="primary" @click="isCollapse=!isCollapse" v-if="!isCollapse">展开</el-button>
              <el-button type="primary" @click="isCollapse=!isCollapse" v-if="isCollapse">收起</el-button>
              <el-button @click="getTable" type="primary">查询</el-button>
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
      <el-table :data="tableData.data" style="width: 100%">
        <el-table-column prop="license" label="车牌号"></el-table-column>
        <el-table-column prop="license_color" label="车牌颜色"></el-table-column>
        <el-table-column
          prop="JI0x65AlarmType"
          label="报警类型"
          :formatter="(row)=>{return $dict.get_additional_alarm_65(row.JI0x65AlarmType)}"
        ></el-table-column>
        <el-table-column
          prop="Time"
          label="时间"
          :formatter="(row)=>{return this.$utils.formatDate14(JSON.stringify(row.Time))}"
        ></el-table-column>
        <el-table-column prop="Speed" label="速度" :formatter="$utils.baseFormatter "></el-table-column>
        <el-table-column label="纬度" :formatter="(row)=>{return  row.Latitude }"></el-table-column>
        <el-table-column label="经度" :formatter="(row)=>{return row.Longitude }"></el-table-column>
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
      <choose-vcheckbox @button="saveVehicle" :key="addKey"></choose-vcheckbox>
    </el-dialog>
    <!-- 选择报警类型 -->
    <el-dialog
      width="35%"
      title="选择报警类型"
      :visible.sync="alarmDialog"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :center="true"
      class="admin-dialog"
    >
      <el-checkbox-group v-model="alarmList">
        <el-checkbox label="1">疲劳驾驶报警</el-checkbox>
        <el-checkbox label="2">接打电话报警</el-checkbox>
        <el-checkbox label="3">抽烟报警</el-checkbox>
        <el-checkbox label="4">分神驾驶报警</el-checkbox>
        <el-checkbox style="margin-left:0" label="5">驾驶员异常报警</el-checkbox>
        <el-checkbox label="6">无驾驶员</el-checkbox>
        <el-checkbox style="margin-left:2px" label="10">自动抓拍事件</el-checkbox>
        <el-checkbox style="margin-left:44px" label="11">驾驶员变更事件</el-checkbox>
      </el-checkbox-group>
      <el-button
        size="small"
        type="primary"
        @click="saveAlarm"
        style="margin:0 auto;display:block"
      >提交</el-button>
    </el-dialog>
    <!-- 选择车辆 -->
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
  </div>
</template>
<script>
import { rules } from "@/utils/rules.js";
import moment from "moment";
import { getAlarmDetailByPage, GetVehicleBySIMIDToPaper } from "@/api/index.js";
import chooseVcheckbox from "@/components/choose-vcheckbox.vue";
import chooseDriver from "@/components/choose-driver.vue";
export default {
  components: { chooseVcheckbox, chooseDriver },
  data() {
    return {
      addKey: 0,
      driverDialog: false,
      alarmDialog: false,
      vehicleDialog: false,
      isCollapse: false,
      alarmList: [],
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
      tableData: {
        data: [],
        total: 0
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
  methods: {
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
    //   查询
    getTable() {
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
    },
    //   导出
    //   导出
    exportExcel() {
      //导出excel
      var wsCol = [
        {
          A: "车牌号",
          B: "车牌颜色",
          C: "报警类型",
          D: "时间",
          E: "速度",
          F: "经度",
          G: "纬度"
        }
      ];
      this.tableData.data.map(data => {
        wsCol.push({
          A: data.license,
          B: this.$dict.get_color(data.license_color),
          C: this.$dict.get_additional_alarm_65(data.JI0x65AlarmType),
          D: this.$utils.formatDate14(JSON.stringify(data.Time)),
          E: data.Speed,
          F: data.Longitude,
          G: data.Latitude
        });
      });
      this.$utils.exportExcel({
        data: wsCol,
        sheetName: "高级驾驶辅助报警",
        fileName: "高级驾驶辅助报警.xlsx"
      });
    },
    //  选择车辆
    selectVehicle() {
      this.addKey++;
      this.vehicleDialog = true;
    },
    saveVehicle(data) {
      this.vehicleDialog = false;
      var license = "";
      var sim_ids = "";
      data.map(item => {
        license = license + item.license + ",";
        sim_ids = sim_ids + item.sim_id + ",";
      });
      license = license.substring(0, license.lastIndexOf(","));
      sim_ids = sim_ids.substring(0, sim_ids.lastIndexOf(","));
      this.$set(this.tableQuery, "license", license);
      this.$set(this.tableQuery, "sim_ids", sim_ids);
    },
    //   选择报警类型
    selectType() {
      this.addKey++;
      this.alarmDialog = true;
    },
    saveAlarm() {
      this.alarmDialog = false;
      var str = "";
      this.alarmList.map(item => {
        str = str + this.$dict.get_additional_alarm_65(item) + ",";
      });
      str = str.substring(0, str.lastIndexOf(","));
      this.$set(this.tableQuery, "alarm_name", str);
      this.$set(this.tableQuery, "ji0x65_alarmtype", this.alarmList.join(","));
    },
    // 选择驾驶员
    selectDriver() {
      this.addKey++;
      this.driverDialog = true;
    },
    saveDriver(data) {
      this.driverDialog = false;
      this.$set(this.tableQuery, "identity_id", data.identity_id);
    }
  }
};
</script>