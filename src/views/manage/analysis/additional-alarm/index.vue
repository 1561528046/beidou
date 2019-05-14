<template>
  <div class="admin-table-container">
    <el-card shadow="always" class="admin-table-search" style="margin-bottom:20px;">
      <el-form :model="tableQuery" ref="baseForm" :rules="rules" label-width="80px" label-position="left" class="table-search" size="small">
        <el-row :gutter="30">
          <el-col :span="6">
            <el-form-item prop="time" label="时间">
              <el-date-picker v-model="tableQuery.time" value-format="yyyy-MM-dd" format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item prop="user_id" label="用户">
              <select-user v-model="tableQuery.user_id" :clearable="true"></select-user>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item prop="alarm_level" label="报警级别">
              <el-select v-model="tableQuery.alarm_level">
                <el-option label="全部" value></el-option>
                <el-option label="一级" value="1"></el-option>
                <el-option label="二级" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item prop="alarm_type" label="报警类型">
              <el-select v-model="tableQuery.alarm_type" multiple collapse-tags>
                <el-option :label="val" :value="'x64-'+key" v-for=" (val,key)  in $dict.additional_alarm_64" :key="'x64-'+key"></el-option>
                <el-option :label="val" :value="'x65-'+key" v-for=" (val,key)  in $dict.additional_alarm_65" :key="'x65-'+key"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4" style="text-align: right;">
            <el-form-item>
              <el-button type="primary" @click="getChart">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card>
          <div slot="header">基本情况</div>
          <bar-base :query="queryData" style="height:300px;"></bar-base>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div slot="header">驾驶员状态监测系统报警分布</div>
          <pie-driver :query="queryData" style="height:300px;"></pie-driver>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div slot="header">高级驾驶辅助系统报警分布</div>
          <pie-vehicle :query="queryData" style="height:300px;"></pie-vehicle>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top:20px;">
      <el-col :span="12">
        <el-card>
          <div slot="header">车辆报警TOP5</div>
          <bar-vehicle :query="queryData" style="height:300px;"></bar-vehicle>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <div slot="header">驾驶员报警TOP5</div>
          <bar-driver :query="queryData" style="height:300px;"></bar-driver>
        </el-card>
      </el-col>
      <el-col :span="24" style="margin-top:20px;">
        <el-card>
          <div slot="header">报警趋势</div>
          <baojingqushi :query="queryData" style="height:300px;"></baojingqushi>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import baojingqushi from "./baojingqushi";
import barVehicle from "./bar-vehicle";
import barDriver from "./bar-driver";
import barBase from "./bar-base";
import pieDriver from "./pie-driver";
import pieVehicle from "./pie-vehicle";
import selectUser from "@/components/select-user.vue";
import moment from "moment";
export default {
  components: {
    baojingqushi,
    barVehicle,
    barDriver,
    pieDriver,
    pieVehicle,
    barBase,
    selectUser
  },
  data() {
    return {
      queryData: {},
      rules: {
        time: [
          {
            required: true,
            trigger: "change",
            validator: this.validateTime
          },
          {
            required: true,
            trigger: "change",
            message: "请选择/填写该项"
          }
        ],
        alarm_type: [
          {
            required: true,
            trigger: "change",
            message: "请选择/填写该项"
          }
        ]
      },
      tableQuery: {
        time: [],
        x64: "",
        x65: "",
        start_time: "",
        end_time: "",
        user_id: "",
        alarm_level: "",
        alarm_type: []
      }
    };
  },
  mounted() {
    var alarmTypes = [];
    Object.keys(this.$dict.additional_alarm_64).map(key => {
      alarmTypes.push("x64-" + key);
    });
    Object.keys(this.$dict.additional_alarm_65).map(key => {
      alarmTypes.push("x65-" + key);
    });
    this.$set(this.tableQuery, "alarm_type", alarmTypes);
    this.$set(this.tableQuery, "time", [
      moment()
        .subtract(2, "days")
        .format("YYYY-MM-DD"),
      moment().format("YYYY-MM-DD")
    ]);
    this.getChart();
  },
  methods: {
    getChart() {
      this.$refs.baseForm.validate(isVaildate => {
        if (isVaildate) {
          var data = JSON.parse(JSON.stringify(this.tableQuery));
          data.x64 = [];
          data.x65 = [];
          data.alarm_type.map(item => {
            var val = item.split("-");
            data[val[0]].push(val[1]);
          });
          data.x64 = data.x64.join(",");
          data.x65 = data.x65.join(",");
          delete data.alarm_type;
          delete data.time;
          this.$set(this.$data, "queryData", data);
        }
      });
    },
    // 查询时间验证
    validateTime(rule, value, callback) {
      var date = moment(value[0]).add(3, "days")._d;
      date = moment(date).format("YYYY-MM-DD");
      if (value == "") {
        callback(new Error("请选择时间!"));
        return false;
      } else if (!moment(value[1]).isBefore(date)) {
        callback(new Error("选择时间不能大于3天!"));
        return false;
      } else {
        this.tableQuery.start_time = moment(value[0]).format("YYYYMMDD");
        this.tableQuery.end_time = moment(value[1]).format("YYYYMMDD");
        callback();
      }
    }
  }
};
</script>

<style>
</style>
