<template>
  <div>
    <el-form>
      <el-row :gutter="30">
        <el-col :span="6">
          <el-form-item label="采集类型：">
            <el-select style="width:100%;" v-model="collect_type" size="small" clearable>
              <el-option value="08H" label="行驶速度记录">行驶速度记录</el-option>
              <el-option value="09H" label="位置信息记录">位置信息记录</el-option>
              <el-option value="10H" label="事故疑点记录">事故疑点记录</el-option>
              <el-option value="11H" label="超时驾驶记录">超时驾驶记录</el-option>
              <el-option value="13H" label="外部供电记录">外部供电记录</el-option>
              <el-option value="14H" label="参数修改记录">参数修改记录</el-option>
              <el-option value="15H" label="速度状态日志">速度状态日志</el-option>
              <el-option value="12H" label="驾驶人身份记录">驾驶人身份记录</el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="时间：">
            <el-date-picker style="margin-left:20px;" value-format="yyyy-MM-dd HH:mm:ss" size="small" v-model="time" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="最大单位数据块个数：">
            <el-input size="small" v-model="block_data"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" size="small" @click="collect" style="margin-left:20px;margin-top:43px;">采集</el-button>
        </el-col>
      </el-row>
    </el-form>
    <div :is="collect_name" :message="collectData"></div>
  </div>
</template>
<script>
import collectDriving from "./specified/collect-driving.vue";
import collectLocation from "./specified/collect-location.vue";
import collectAccident from "./specified/collect-accident.vue";
import collectTimeout from "./specified/collect-timeout.vue";
import collectSupply from "./specified/collect-supply.vue";
import collectParameter from "./specified/collect-parameter.vue";
import collectSpeed from "./specified/collect-speed.vue";
import collectDriver from "./specified/collect-driver.vue";
export default {
  components: {
    collectDriving,
    collectLocation,
    collectAccident,
    collectTimeout,
    collectSupply,
    collectParameter,
    collectSpeed,
    collectDriver
  },
  created() {
    this.$instruction.on("x0700", eve => {
      var data = JSON.parse(eve.data);
      this.$set(this.$data, "collectData", data);
    });
  },
  // beforeDestroy() {
  //   this.$instruction.off("x0700");
  // },
  data() {
    return {
      time: "",
      block_data: "",
      communication: {
        data: []
      },
      collect_type: "",
      collect_name: "",
      collectData: {}
    };
  },
  watch: {
    message: {
      handler: function() {
        this.$set(this.communication, "data", this.$props.message);
      }
    }
  },
  props: {
    message: Array
  },
  methods: {
    collect() {
      // if (this.communication.data.length == 0) {
      //   return this.$notify({
      //     message: "请选择车辆!",
      //     title: "提示",
      //     type: "error"
      //   });
      // } else if (this.collect_type == "") {
      //   return this.$notify({
      //     message: "请选择采集类型!",
      //     title: "提示",
      //     type: "error"
      //   });
      // } else if (this.time == "" || this.time == null) {
      //   return this.$notify({
      //     message: "请选择时间!",
      //     title: "提示",
      //     type: "error"
      //   });
      // } else if (this.block_data == "") {
      //   return this.$notify({
      //     message: "请输入最大单位数据块个数!",
      //     title: "提示",
      //     type: "error"
      //   });
      // }
      var data = {};
      var sim_id = "";
      var command_word = parseInt(this.collect_type, 16);
      var start_time = this.time[0];
      var end_time = this.time[1];
      this.communication.data.map(item => {
        if (item.sim_id.length == 11) {
          sim_id = "0" + item.sim_id;
        } else {
          sim_id = item.sim_id;
        }
        data = {
          SimID: sim_id,
          MessageID: "x8700",
          CommandWord: command_word, //命令字
          StartTime: start_time, //开始时间
          EndTime: end_time, //结束时间
          MaxUnitDataCount: this.block_data //最大单位数据块个数
        };
        data = JSON.stringify(data);
        this.$instruction.send(data);
      });
      switch (this.collect_type) {
        case "08H":
          this.collect_name = collectDriving;
          break;
        case "09H":
          this.collect_name = collectLocation;
          break;
        case "10H":
          this.collect_name = collectAccident;
          break;
        case "11H":
          this.collect_name = collectTimeout;
          break;
        case "13H":
          this.collect_name = collectSupply;
          break;
        case "14H":
          this.collect_name = collectParameter;
          break;
        case "15H":
          this.collect_name = collectSpeed;
          break;
        case "12H":
          this.collect_name = collectDriver;
          break;
      }
    }
  }
};
</script>