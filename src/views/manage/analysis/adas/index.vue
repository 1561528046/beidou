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
          <!-- <el-col v-show="isCollapse" :span="6">
            <el-form-item label="报警来源">
              <el-select clearable style="width:100%" v-model="tableQuery.source">
                <el-option value="1" label="平台">平台</el-option>
                <el-option value="0" label="终端">终端</el-option>
              </el-select>
            </el-form-item>
          </el-col>-->
          <el-col v-show="isCollapse" :span="6">
            <el-form-item label="报警等级">
              <el-select clearable v-model="tableQuery.alarm_lev" style="width:100%">
                <el-option value="1" label="一级"></el-option>
                <el-option value="2" label="二级"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-show="isCollapse" :span="6">
            <el-form-item label="驾驶员身份证">
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
        <el-table-column
          prop="license_color"
          :formatter="(row)=>{return $dict.get_color(row.license_color)}"
          label="车牌颜色"
        ></el-table-column>
        <el-table-column
          prop="Time"
          label="时间"
          :formatter="(row)=>{return  $utils.formatDate14(row.Time)}"
        ></el-table-column>
        <el-table-column
          prop="JI0x64AlarmType"
          label="报警类型"
          :formatter="(row)=>{return $dict.get_additional_alarm_64(row.JI0x64AlarmType)}"
        ></el-table-column>
        <el-table-column prop="JI0x64AlarmLevel" label="终端报警级别">
          <template slot-scope="scope">
            <label v-if="scope.row.JI0x64AlarmLevel==0">无</label>
            <label v-if="scope.row.JI0x64AlarmLevel==1">一级报警</label>
            <label v-if="scope.row.JI0x64AlarmLevel==2">二级报警</label>
          </template>
        </el-table-column>
        <el-table-column prop="JIPlatformAlarmLev2" label="平台判断二级报警">
          <template slot-scope="scope">
            <label v-if="scope.row.JIPlatformAlarmLev2==0">否</label>
            <label v-if="scope.row.JIPlatformAlarmLev2==1">是</label>
          </template>
        </el-table-column>
        <el-table-column prop="JI0x64SignStatus" label="开始时间">
          <template slot-scope="scope">
            <label
              v-if="scope.row.JI0x64SignStatus==1"
            >{{ $utils.formatDate14(JSON.stringify(scope.row.Time))}}</label>
            <label v-if="scope.row.JI0x64SignStatus!=1">--</label>
          </template>
        </el-table-column>
        <el-table-column prop="JI0x64SignStatus" label="结束时间">
          <template slot-scope="scope">
            <label
              v-if="scope.row.JI0x64SignStatus==2"
            >{{ $utils.formatDate14(JSON.stringify(scope.row.Time))}}</label>
            <label v-if="scope.row.JI0x64SignStatus!=2">--</label>
          </template>
        </el-table-column>
        <el-table-column prop="Speed" label="速度" :formatter="$utils.baseFormatter "></el-table-column>
        <el-table-column prop="Latitude" label="纬度" :formatter="$utils.baseFormatter"></el-table-column>
        <el-table-column prop="Longitude" label="经度" :formatter="$utils.baseFormatter"></el-table-column>
        <el-table-column prop="Altitude" label="高程" :formatter="$utils.baseFormatter"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-popover ref="popover4" placement="right" width="400" trigger="click">
              <el-table :data="attachmentList">
                <el-table-column prop="file_name" label="文件名称"></el-table-column>
                <el-table-column prop="file_size" label="文件大小"></el-table-column>
                <el-table-column prop="file_type" label="文件类型">
                  <template slot-scope="scope">
                    <label v-if="scope.row.file_type=='0'">图片</label>
                    <label v-if="scope.row.file_type=='1'">音频</label>
                    <label v-if="scope.row.file_type=='2'">视频</label>
                    <label v-if="scope.row.file_type=='3'">文本</label>
                    <label v-if="scope.row.file_type=='4'">其他</label>
                  </template>
                </el-table-column>
                <el-table-column prop label="操作">
                  <template slot-scope="scope">
                    <a :href="$dict.BASE_URL+scope.row.file_path" download>下载</a>
                  </template>
                </el-table-column>
              </el-table>
            </el-popover>
            <el-button
              type="primary"
              @click="selectAttachment(scope)"
              v-popover:popover4
              size="small"
            >查看附件</el-button>
          </template>
        </el-table-column>
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
        <el-checkbox label="1">前向碰撞报警</el-checkbox>
        <el-checkbox label="2">车道偏离报警</el-checkbox>
        <el-checkbox label="3">车距过近报警</el-checkbox>
        <el-checkbox label="4">行人碰撞报警</el-checkbox>
        <el-checkbox style="margin-left:0" label="5">频繁变道报警</el-checkbox>
        <el-checkbox label="6">道路标识超限报警</el-checkbox>
        <el-checkbox style="margin-left:2px" label="7">障碍物报警</el-checkbox>
        <el-checkbox style="margin-left:44px" label="10">道路标志识别事件</el-checkbox>
        <el-checkbox style="margin-left:0" label="11">主动抓拍事件</el-checkbox>
      </el-checkbox-group>
      <el-button
        size="small"
        type="primary"
        @click="saveAlarm"
        style="margin:0 auto;display:block"
      >提交</el-button>
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
  </div>
</template>
<script>
import { rules } from "@/utils/rules.js";
import moment from "moment";
import {
  getAlarmDetailByPage,
  GetVehicleBySIMIDToPaper,
  GetInfoByPlatformAlarmId,
  GetFilesByIdInfo
} from "@/api/index.js";
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
      attachmentList: [],
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
        ji0x64_alarmtype: "1,2,3,4,5,6,7,16,17",
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
    selectAttachment(scope) {
      GetInfoByPlatformAlarmId({
        platform_alarm_id: scope.row.JI0x64PlatformAlarmId
      }).then(res => {
        if (res.data.code == 0) {
          if (res.data.data.length > 0) {
            GetFilesByIdInfo({ id_info: res.data.data[0].id_info }).then(
              res => {
                if (res.data.code == 0) {
                  this.$set(this.$data, "attachmentList", res.data.data);
                } else {
                  return this.$notify({
                    message: res.data.msg,
                    title: "提示",
                    type: "error"
                  });
                }
              }
            );
          }
        } else {
          return this.$notify({
            message: res.data.msg,
            title: "提示",
            type: "error"
          });
        }
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
    //   查询
    getTable() {
      if (this.tableQuery.ji0x64_alarmtype == "") {
        this.tableQuery.ji0x64_alarmtype = "1,2,3,4,5,6,7,10,11";
      }
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
    exportExcel() {
      var start_time = moment(this.tableQuery.time[0]).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      var stop_time = moment(this.tableQuery.time[1]).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      var name =
        start_time + "-" + stop_time + " " + this.$store.state.user.real_name;
      //导出excel
      var wsCol = [
        {
          A: "车牌号",
          B: "车牌颜色",
          C: "报警类型",
          D: "终端报警级别",
          E: "平台判断二级报警",
          F: "开始时间",
          G: "结束时间",
          H: "速度",
          I: "纬度",
          J: "经度",
          K: "高程",
          L: "时间"
        }
      ];
      this.tableData.data.map(data => {
        var level = "";
        if (data.JI0x64AlarmLevel == 0) {
          level = "无";
        } else if (data.JI0x64AlarmLevel == 1) {
          level = "一级报警";
        } else if (data.JI0x64AlarmLevel == 2) {
          level = "二级报警";
        }
        wsCol.push({
          A: data.license,
          B: this.$dict.get_color(data.license_color),
          C: this.$dict.get_additional_alarm_64(data.JI0x64AlarmType),
          D: level,
          E: data.JIPlatformAlarmLev2 == 0 ? "否" : "是",
          F:
            data.JI0x64SignStatus == 1
              ? this.$utils.formatDate14(JSON.stringify(data.Time))
              : "--",
          G:
            data.JI0x64SignStatus == 2
              ? this.$utils.formatDate14(JSON.stringify(data.Time))
              : "--",
          H: data.Speed,
          I: data.Latitude,
          J: data.Longitude,
          K: data.Altitude,
          L: this.$utils.formatDate14(JSON.stringify(data.Time))
        });
      });
      this.$utils.exportExcel({
        data: wsCol,
        sheetName: "高级驾驶辅助报警",
        fileName: "高级驾驶辅助报警" + name + ".xlsx"
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
        item.sim_id =
          item.sim_id.length == 11 ? "0" + item.sim_id : item.sim_id;
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
        str = str + this.$dict.get_additional_alarm_64(item) + ",";
      });
      str = str.substring(0, str.lastIndexOf(","));
      this.$set(this.tableQuery, "alarm_name", str);
      this.$set(this.tableQuery, "ji0x64_alarmtype", this.alarmList.join(","));
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