<template>
  <div class="admin-table-container" style="position: absolute;left:0;right:0;bottom:0;top:107px;">
    <el-card shadow="always" style="height:100%;" class="full-box">
      <div class="bind-box" style="height:100%;">
        <el-tabs
          style=" width: 100%;position: relative; background-color:#fff;"
          type="border-card"
          @tab-click="handleClick"
        >
          <el-tab-pane label="通讯设置">
            <select-vehicle @choose="selectVehicle"></select-vehicle>
            <choose-communication
              :respond="respond"
              :message="communication"
              @instruction="instruction"
              @setting="setting"
            ></choose-communication>
          </el-tab-pane>
          <el-tab-pane label="车辆信息设置">
            <select-vehicle @choose="selectVehicle"></select-vehicle>
            <choose-information
              :respond="respond"
              :message="information"
              @instruction="instruction"
              @setting="setting"
            ></choose-information>
          </el-tab-pane>
          <el-tab-pane label="行车报警设置">
            <select-vehicle @choose="selectVehicle"></select-vehicle>
            <choose-alarm
              :respond="respond"
              :message="alarm"
              @instruction="instruction"
              @setting="setting"
            ></choose-alarm>
          </el-tab-pane>
          <el-tab-pane label="终端上报时间间隔设置">
            <select-vehicle @choose="selectVehicle"></select-vehicle>
            <choose-report
              :respond="respond"
              :message="report"
              @instruction="instruction"
              @setting="setting"
            ></choose-report>
          </el-tab-pane>
          <el-tab-pane label="终端通话设置">
            <select-vehicle @choose="selectVehicle"></select-vehicle>
            <choose-device
              :respond="respond"
              :message="device"
              @instruction="instruction"
              @setting="setting"
            ></choose-device>
          </el-tab-pane>
          <el-tab-pane label="拍照设置">
            <select-vehicle @choose="selectVehicle"></select-vehicle>
            <choose-picture
              :respond="respond"
              :message="picture"
              @instruction="instruction"
              @setting="setting"
            ></choose-picture>
          </el-tab-pane>
          <el-tab-pane label="终端参数设置">
            <select-vehicle @choose="selectVehicle"></select-vehicle>
            <choose-fill :respond="respond" :message="fill"></choose-fill>
          </el-tab-pane>
          <el-tab-pane label="事件设置">
            <select-vehicle @choose="selectVehicle"></select-vehicle>
            <!--   @instruction="instruction"  -->
            <choose-event :respond="respond" :message="event" @setting="setting"></choose-event>
          </el-tab-pane>
          <el-tab-pane label="信息点播菜单设置">
            <select-vehicle @choose="selectVehicle"></select-vehicle>
            <!--   @instruction="instruction"  -->
            <choose-demand :respond="respond" :message="demand" @setting="setting"></choose-demand>
          </el-tab-pane>
          <el-tab-pane label="其它设置">
            <select-vehicle @choose="selectVehicle"></select-vehicle>
            <!--   @instruction="instruction" -->
            <choose-other :respond="respond" :message="other" @setting="setting"></choose-other>
          </el-tab-pane>
          <el-tab-pane label="采集指定记录">
            <select-vehicle @choose="selectVehicle"></select-vehicle>
            <choose-collect :message="specified"></choose-collect>
          </el-tab-pane>
          <el-tab-pane label="行车记录仪">
            <select-vehicle @choose="selectVehicle"></select-vehicle>
            <choose-recorder :message="recorder"></choose-recorder>
          </el-tab-pane>
          <el-tab-pane label="高级驾驶辅助系统参数设置">
            <select-vehicle @choose="selectVehicle"></select-vehicle>
            <choose-adas></choose-adas>
          </el-tab-pane>
          <el-tab-pane label="驾驶员状态系统参数设置">
            <select-vehicle @choose="selectVehicle"></select-vehicle>
            <choose-dss></choose-dss>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>
  </div>
</template>
<script>
import chooseParameter from "@/components/choose-parameter.vue";
import selectVehicle from "./select-vehicle.vue";
import chooseCommunication from "./choose-communication.vue";
import chooseInformation from "./choose-information.vue";
import chooseAlarm from "./choose-alarm.vue";
import chooseReport from "./choose-report.vue";
import chooseDevice from "./choose-device.vue";
import choosePicture from "./choose-picture.vue";
import chooseOther from "./choose-other.vue";
import chooseEvent from "./choose-event.vue";
import chooseDemand from "./choose-demand.vue";
import chooseCollect from "./choose-collect.vue";
import chooseRecorder from "./choose-recorder.vue";
import chooseFill from "./choose-fill.vue";
import chooseAdas from "./choose-adas.vue";
import chooseDss from "./choose-dss.vue";
export default {
  components: {
    chooseAdas,
    chooseDss,
    selectVehicle,
    chooseParameter,
    chooseCommunication,
    chooseInformation,
    chooseAlarm,
    chooseReport,
    chooseDevice,
    choosePicture,
    chooseOther,
    chooseEvent,
    chooseDemand,
    chooseCollect,
    chooseRecorder,
    chooseFill
  },
  created() {
    this.$instruction.on("x8106", eve => {
      this.fromSend(eve.data);
    });
    this.$instruction.on("x8103", eve => {
      this.fromSend(eve.data);
    });
    this.$instruction.on("x0104", eve => {
      this.fromSend(eve.data);
    });
  },
  beforeDestroy() {
    this.timerDown();
  },
  props: {},
  data() {
    return {
      respond: "",
      timer: {},
      selectedVehicles: [],
      length: 0,
      vehicleDialog: false,
      parameter_type: 1,
      tableQuery: {
        license: "",
        user_name: "",
        type: 1
      },
      tableData: {
        total: 0,
        data: []
      },
      communication: [],
      information: [],
      alarm: [],
      device: [],
      report: [],
      picture: [],
      event: [],
      demand: [],
      other: [],
      specified: [],
      recorder: [],
      fill: [],
      tableLoading: true
    };
  },
  watch: {
    tableQuery: {
      handler: function() {
        if (this.tableQuery.type == 1) {
          this.tableQuery.user_name = "";
          this.getTable();
        } else {
          this.tableQuery.license = "";
          this.getTable();
        }
      },
      deep: true
    }
  },
  methods: {
    fromSend(data) {
      this.respond = data;
    },
    timerDown() {
      clearInterval(this.timer);
    },
    //采集发送指令
    instruction(arr) {
      var data = {};
      data = {
        MessageID: "x8106",
        SimID: arr[1],
        ParameterId: arr[0]
      };
      data = JSON.stringify(data);
      this.$instruction.send(data);
    },
    // 设置发送指令
    setting(arr) {
      var data = {};
      data = {
        MessageID: "x8103",
        SimID: arr[1],
        ParameterId: arr[0],
        ParameterValue: arr[2]
      };
      data = JSON.stringify(data);
      this.$instruction.send(data);
    },
    selectVehicle(scope) {
      if (this.parameter_type == 1) {
        this.communication = scope;
      } else if (this.parameter_type == 2) {
        this.information = scope;
      } else if (this.parameter_type == 3) {
        this.alarm = scope;
      } else if (this.parameter_type == 4) {
        this.report = scope;
      } else if (this.parameter_type == 5) {
        this.device = scope;
      } else if (this.parameter_type == 6) {
        this.picture = scope;
      } else if (this.parameter_type == 7) {
        this.event = scope;
      } else if (this.parameter_type == 8) {
        this.demand = scope;
      } else if (this.parameter_type == 9) {
        this.other = scope;
      } else if (this.parameter_type == 10) {
        this.specified = scope;
      } else if (this.parameter_type == 11) {
        this.recorder = scope;
      } else if (this.parameter_type == 12) {
        this.fill = scope;
      }
    },
    vehicleClick() {
      this.vehicleDialog = true;
    },
    vehicleArr(scope) {
      this.vehicleDialog = false;
      this.length = scope.length;
      scope.map(item => {
        item.operating = "--";
      });
      this.$set(this.communication, "data", scope);
    },
    handleClick(tab) {
      if (tab.label == "通讯设置") {
        this.parameter_type = 1;
      } else if (tab.label == "车辆信息设置") {
        this.parameter_type = 2;
      } else if (tab.label == "行车报警设置") {
        this.parameter_type = 3;
      } else if (tab.label == "终端上报时间间隔设置") {
        this.parameter_type = 4;
      } else if (tab.label == "终端通话设置") {
        this.parameter_type = 5;
      } else if (tab.label == "拍照设置") {
        this.parameter_type = 6;
      } else if (tab.label == "事件设置") {
        this.parameter_type = 7;
      } else if (tab.label == "信息点播菜单设置") {
        this.parameter_type = 8;
      } else if (tab.label == "其它设置") {
        this.parameter_type = 9;
      } else if (tab.label == "采集指定记录") {
        this.parameter_type = 10;
      } else if (tab.label == "行车记录仪") {
        this.parameter_type = 11;
      } else if (tab.label == "终端参数设置") {
        this.parameter_type = 12;
      }
    },
    getTable() {
      console.log(this.tableQuery);
    },
    handleSizeChange(val) {
      //每页数量切换
      this.tableQuery.page = 1;
      this.tableQuery.size = val;
      this.getTable();
    },
    handleCurrentChange(val) {
      //翻页
      this.tableQuery.page = val;
      this.getTable();
    }
  }
};
</script>
<style>
.bind-box {
  display: flex;
  margin: -20px;
  font-size: 14px;
  height: 100%;
}
.user-header {
  height: 40px;
  line-height: 40px;
  background: #f5f7fa;
  margin: 0;
  border-bottom: 1px solid #ebeef5;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #000;
}
.user-list {
  position: absolute;
  top: 100px;
  bottom: 32px;
  width: 100%;
  overflow: auto;
}
.user-pager {
  background: #f1f1f1;
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 32px;
  line-height: 32px;
  text-align: center;
}
.el-input__inner {
  text-align: center;
}
/* ul,
li {
  margin: 0;
  padding: 0;
}
li {
  height: 32px;
  line-height: 32px;
  overflow: hidden;
  list-style-type: none;
  box-sizing: border-box;
  padding: 0 15px;
}
li.active {
  color: #fff;
  background-color: #1890ff !important;
}
li:hover {
  background-color: #f5f7fa;
  cursor: pointer;
} */
.el-card__body {
  height: 100%;
}
.el-form-item--small.el-form-item {
  margin-bottom: 36px;
}
</style>
