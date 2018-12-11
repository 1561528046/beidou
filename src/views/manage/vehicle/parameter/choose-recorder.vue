<template>
  <div style="width:100%;">
    <el-table height="300" :data="communication.data" style="width:100%" class="admin-table-list">
      <el-table-column fixed prop="license" label="车牌号" :formatter="$utils.baseFormatter"></el-table-column>
      <el-table-column fixed prop="operating" label="操作状态"></el-table-column>
    </el-table>
    <div style="width:50%;float:left">
      <div style="padding: 10px 200px;">
        <label style="display:inline-block;width:110px; ">采集类型：</label>
        <el-select style="width:60%;" v-model="collect_type" size="small">
          <el-option value="00H" label="记录仪执行标准版本">记录仪执行标准版本</el-option>
          <el-option value="01H" label="当前驾驶人信息">当前驾驶人信息</el-option>
          <el-option value="02H" label="记录仪实时时间">记录仪实时时间</el-option>
          <el-option value="03H" label="累计行驶里程">累计行驶里程</el-option>
          <el-option value="04H" label="记录仪脉冲系数">记录仪脉冲系数</el-option>
          <el-option value="07H" label="唯一性编号">唯一性编号</el-option>
        </el-select>
        <el-button size="small" @click="collect" type="primary" style="margin-left:20px;">采集</el-button>
      </div>
      <div :is="collect_name" :collect="collectData"></div>
    </div>
    <div style="width:50%;float:right;">
      <div style="padding:10px 200px;">
        <label style="display:inline-block;width:82px;">设置类型：</label>
        <el-select style="width:59%;" v-model="set_type" size="small">
          <el-option value="83H" label="记录仪初次安装日期">记录仪初次安装日期</el-option>
          <el-option value="C2H" label="记录仪时间">记录仪时间</el-option>
          <el-option value="C3H" label="记录仪脉冲系数">记录仪脉冲系数</el-option>
          <el-option value="C4H" label="初始里程">初始里程</el-option>
        </el-select>
      </div>
      <div :is="set_name" @message="setData" :type="set_type" :vehicle="communication.data"></div>
    </div>
  </div>
</template>
<script>
import collectStandard from "./components/collect-standard.vue";
import collectDriver from "./components/collect-driver.vue";
import collectRealtime from "./components/collect-realtime.vue";
import collectMileage from "./components/collect-mileage.vue";
import collectPulse from "./components/collect-pulse.vue";
import collectUniqueness from "./components/collect-uniqueness.vue";
import settingInstall from "./components/setting-install.vue";
import settingTime from "./components/setting-time.vue";
import settingPulse from "./components/setting-pulse.vue";
import settingMileage from "./components/setting-mileage";
export default {
  components: {
    collectStandard,
    collectDriver,
    collectRealtime,
    collectMileage,
    collectPulse,
    collectUniqueness,
    settingInstall,
    settingTime,
    settingPulse,
    settingMileage
  },
  data() {
    return {
      collect_name: "",
      collect_type: "",
      set_name: "",
      set_type: "",
      add: "",
      collectData: {},
      communication: {
        data: []
      }
    };
  },
  created() {
    this.$instruction.on("x0700", eve => {
      var data = JSON.parse(eve.data);
      this.$set(this.$data, "collectData", data);
    });
    this.$instruction.on("x8700", eve => {
      var data = JSON.parse(eve.data);
      var sim_id = "";
      this.communication.data.map(item => {
        if (item.sim_id.length == 11) {
          sim_id = "0" + item.sim_id;
        } else {
          sim_id = item.sim_id;
        }
        if (sim_id == data.SimID) {
          switch (data.CommandWord) {
            case 0:
              this.$set(item, "operating", "记录仪执行标准版本采集成功");
              break;
            case 1:
              this.$set(item, "operating", "当前驾驶人信息采集成功");
              break;
            case 2:
              this.$set(item, "operating", "记录仪实时时间采集成功");
              break;
            case 3:
              this.$set(item, "operating", "累计行驶里程采集成功");
              break;
            case 4:
              this.$set(item, "operating", "记录仪脉冲系数采集成功");
              break;
            case 7:
              this.$set(item, "operating", "唯一性编号采集成功");
              break;
          }
        }
      });
    });
  },
  // beforeDestroy() {
  //   this.$instruction.off("x0700");
  // },
  watch: {
    set_type: {
      handler: function() {
        switch (this.set_type) {
          case "83H":
            this.set_name = settingInstall;
            break;
          case "C2H":
            this.set_name = settingTime;
            break;
          case "C3H":
            this.set_name = settingPulse;
            break;
          case "C4H":
            this.set_name = settingMileage;
            break;
        }
      }
    },
    message: {
      handler: function() {
        this.$set(this.communication, "data", this.$props.message);
        this.communication.data.map(item => {
          this.$set(item, "operating", "");
        });
      }
    },
    collect_type: {
      handler: function() {
        this.collectData = {};
      }
    }
  },
  props: {
    message: Array
  },
  methods: {
    collect() {
      if (this.communication.data.length == 0) {
        return this.$notify({
          message: "请选择车辆!",
          title: "提示",
          type: "error"
        });
      } else if (this.communication.data.length > 1) {
        return this.$notify({
          message: "无法进行批量采集!",
          title: "提示",
          type: "error"
        });
      } else if (this.collect_type == "") {
        return this.$notify({
          message: "请选择采集类型!",
          title: "提示",
          type: "error"
        });
      }
      switch (this.collect_type) {
        //记录仪执行标准版本
        case "00H":
          this.collect_name = collectStandard;
          break;
        case "01H":
          this.collect_name = collectDriver;
          break;
        case "02H":
          this.collect_name = collectRealtime;
          break;
        case "03H":
          this.collect_name = collectMileage;
          break;
        case "04H":
          this.collect_name = collectPulse;
          break;
        case "06H":
          this.collect_name = "";
          break;
        case "07H":
          this.collect_name = collectUniqueness;
          break;
      }
      var data = {};
      var sim_id;
      var type = parseInt(this.collect_type, 16);
      if (this.communication.data[0].sim_id.length == 11) {
        sim_id = "0" + this.communication.data[0].sim_id;
      } else {
        sim_id = this.communication.data[0].sim_id;
      }
      data = {
        SimID: sim_id,
        MessageID: "x8700",
        CommandWord: type
      };
      data = JSON.stringify(data);
      this.$instruction.send(data);
    },
    setData(data) {
      var sim_id = "";
      if (data.code == "0") {
        this.communication.data.map(item => {
          if (item.sim_id.length == 11) {
            sim_id = "0" + item.sim_id;
          } else {
            sim_id = item.sim_id;
          }
          if (data.CommandWord == 131) {
            if (data.SimID == sim_id) {
              this.$set(item, "operating", "记录仪初次安装日期指令发送成功");
            }
          } else if (data.CommandWord == 194) {
            if (data.SimID == sim_id) {
              this.$set(item, "operating", "记录仪时间指令发送成功");
            }
          } else if (data.CommandWord == 195) {
            if (data.SimID == sim_id) {
              this.$set(item, "operating", "记录仪脉冲系数指令发送成功");
            }
          } else if (data.CommandWord == 196) {
            if (data.SimID == sim_id) {
              this.$set(item, "operating", "初始里程指令发送成功");
            }
          }
        });
      }
    }
  }
};
</script>
