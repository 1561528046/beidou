<template >
  <div>
    <el-table height="300" :data="communication.data" style="width: 100%" class="admin-table-list">
      <el-table-column prop="license" label="车牌号" :formatter="$utils.baseFormatter"> </el-table-column>
      <el-table-column prop="operate" label="操作状态"></el-table-column>
    </el-table>
    <el-form label-width="150px" label-position="left" class="table-search" size="small">
      <label>设置类型：</label>
      <el-select @change="chooseSetting" size="small" v-model="parameter" style="margin-bottom:10px;">
        <el-option value="1" label="文本信息下发">文本信息下发</el-option>
        <el-option value="2" label="信息服务">信息服务</el-option>
        <el-option value="3" label="数据下行透传">数据下行透传</el-option>
      </el-select>
      <!-- 文本信息下发 -->
      <div v-if="text_Information" style="width:30%;margin:0 auto; text-align:center;">
        <el-form-item label="标志">
          <div style="width:360px;">
            <el-checkbox v-model="text.emergency" style="width:120px; margin-left:0;text-align:left;">紧急</el-checkbox>
            <el-checkbox v-model="text.device_TTS" style="width:120px; margin-left:0;text-align:left;">终端TTS播读</el-checkbox>
            <el-checkbox v-model="text.device_displayer" style="width:120px; margin-left:0;text-align:left;">终端显示器显示</el-checkbox>
            <el-checkbox v-model="text.advertising" style="width:120px; margin-left:0;text-align:left;">广告屏显示</el-checkbox>
            <el-radio v-model="text.information" label="0" style="width:120px; margin-left:0;text-align:left;">中心导航信息</el-radio>
            <el-radio v-model="text.information" label="1" style="width:120px; margin-left:0;text-align:left;">CAN故障码信息</el-radio>
          </div>
        </el-form-item>
        <el-form-item label="文本信息">
          <el-input v-model="text.text_content"></el-input>
        </el-form-item>
        <el-button type="primary" @click="setup()" size="small">设置</el-button>
      </div>
      <!-- 信息服务 -->
      <div v-if="service" style="width:30%;margin:0 auto; text-align:center;">
        <el-form-item label="信息类型">
          <el-select v-model="information.information_type" style="width:100%;">
            <el-option value="1" label="每日新闻">每日新闻</el-option>
            <el-option value="2" label="天气预报">天气预报</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="信息内容">
          <el-input v-model="information.information_content"></el-input>
        </el-form-item>
        <el-button type="primary" @click="setup()" size="small">设置</el-button>
      </div>
      <!-- 数据下行透传 -->
      <div v-if="passthrough" style="width:30%;margin:0 auto; text-align:center;">
        <el-form-item label="透传消息类型">
          <el-select v-model="reply.message_type" style="width:100%;">
            <el-option value="0x00" label="GNSS模块详细定位数据">GNSS模块详细定位数据</el-option>
            <el-option value="0x0B" label="道路运输证IC卡信息">道路运输证IC卡信息</el-option>
            <el-option value="0x41" label="串口1透传">串口1透传</el-option>
            <el-option value="0x42" label="串口2透传">串口2透传</el-option>
            <!-- <el-option>用户自定义透传</el-option> -->
          </el-select>
        </el-form-item>
        <el-form-item label="透传消息内容">
          <el-input v-model="reply.content"></el-input>
        </el-form-item>
        <el-button type="primary" @click="setup()" size="small">设置</el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
import chooseParameter from "@/components/choose-parameter.vue";
export default {
  components: { chooseParameter },
  //   name: "choose-communication",
  data() {
    return {
      information: {
        information_type: "",
        information_content: ""
      },
      text: {
        emergency: false, //紧急
        device_TTS: false, //终端TTS播读
        device_displayer: false, //终端显示器显示
        advertising: false, //广告屏显示
        information: "0",
        text_content: ""
      },
      reply: {
        message_type: "",
        content: ""
      },
      text_Information: false,
      service: false,
      passthrough: false,
      parameter: "",
      instruction: "",
      selectedVehicles: [],
      length: 0,
      vehicleDialog: false,
      communication: {
        data: []
      },
      tableQuery: {
        license: "",
        user_name: "",
        type: 1
      },
      tableData: {
        total: 0,
        data: []
      },
      tableLoading: true
    };
  },
  created() {
    this.$instruction.on("x8300", eve => {
      var data = JSON.parse(eve.data);
      var sim_id = "";
      if (data.code == "0") {
        this.communication.data.map(item => {
          sim_id = item.sim_id.length == 11 ? "0" + item.sim_id : item.sim_id;
          if (sim_id == data.SimID) {
            this.$set(item, "operate", "文本信息下发设置成功");
          }
        });
      }
    });
    this.$instruction.on("x8304", eve => {
      var data = JSON.parse(eve.data);
      var sim_id = "";
      if (data.code == "0") {
        this.communication.data.map(item => {
          sim_id = item.sim_id.length == 11 ? "0" + item.sim_id : item.sim_id;
          if (sim_id == data.SimID) {
            this.$set(item, "operate", "信息服务设置成功");
          }
        });
      }
    });
    this.$instruction.on("x8900", evs => {
      var data = JSON.parse(evs.data);
      var sim_id;
      if (data.code == 0) {
        this.communication.data.map(item => {
          if (item.sim_id.length == 11) {
            sim_id = "0" + item.sim_id;
          } else {
            sim_id = item.sim_id;
          }
          if (data.SimID == sim_id) {
            this.$set(item, "operate", "数据下行透传设置成功");
          }
        });
      }
    });
  },
  // beforeDestroy() {
  //   this.$instruction.off("x8900");
  // },
  watch: {
    parameter: function() {
      this.text.emergency = false; //紧急
      this.text.device_TTS = false; //终端TTS播读
      this.text.device_displayer = false; //终端显示器显示
      this.text.advertising = false; //广告屏显示
      this.text.information = "0";
      this.text.text_content = "";
      this.information.information_type = "";
      this.information.information_content = "";
      this.reply.message_type = "";
      this.reply.content = "";
    },
    message: {
      handler: function() {
        this.$set(this.communication, "data", this.$props.message);
      },
      deep: true
    }
  },
  computed: {},
  props: {
    message: Array,
    respond: String
  },
  methods: {
    //区域展示
    chooseSetting(type) {
      if (type == "1") {
        this.text_Information = true;
        this.service = false;
        this.passthrough = false;
      } else if (type == "2") {
        this.text_Information = false;
        this.service = true;
        this.passthrough = false;
      } else if (type == "3") {
        this.text_Information = false;
        this.service = false;
        this.passthrough = true;
      }
    },
    // 设置
    setup() {
      if (this.communication.data.length == 0) {
        return this.$notify({
          message: "请选择车辆!",
          title: "提示",
          type: "error"
        });
      }
      var sim_id = "";
      var type = "";
      var content = "";
      var data = {};
      if (this.parameter == "1") {
        if (this.text.text_content == "") {
          return this.$notify({
            message: "请输入文本信息!",
            title: "提示",
            type: "error"
          });
        }
        var num = ["0", "0", "0", "0", "0", "0", "0", "0"];
        if (this.text.emergency) {
          num[7] = "1";
          //紧急
        }
        if (this.text.device_TTS) {
          num[4] = "1";
          //终端TTS播读
        }
        if (this.text.device_displayer) {
          num[5] = "1";
          //终端显示器显示
        }
        if (this.text.advertising) {
          num[3] = "1";
          //广告屏显示
        }
        if (this.text.information == "0") {
          num[2] = "0";
          //中心导航
        } else {
          num[2] = "1";
        }
        num = parseInt(num.toString().replace(/,/g, ""), 2);
        content = this.text.text_content;
        this.communication.data.map(item => {
          sim_id = item.sim_id.length == 11 ? "0" + item.sim_id : item.sim_id;
          data = {
            MessageID: "x8300",
            SimID: sim_id,
            Flag: num,
            Text: content
          };
          data = JSON.stringify(data);
          this.$instruction.send(data);
        });
      } else if (this.parameter == "2") {
        type = this.information.information_type;
        content = this.information.information_content;
        this.communication.data.map(item => {
          sim_id = item.sim_id.length == 11 ? "0" + item.sim_id : item.sim_id;
          data = {
            MessageID: "x8304",
            SimID: sim_id,
            MessageServiceType: type,
            MessageSerciceContent: content
          };
          data = JSON.stringify(data);
          this.$instruction.send(data);
        });
      } else if (this.parameter == "3") {
        type = parseInt(this.reply.message_type, 16);
        content = this.reply.content;
        this.communication.data.map(item => {
          sim_id = item.sim_id.length == 11 ? "0" + item.sim_id : item.sim_id;
          data = {
            SimID: sim_id,
            MessageID: "x8900",
            TransportType: type, //透传消息类型
            TransportContent: content //透传消息内容
          };
          data = JSON.stringify(data);
          this.$instruction.send(data);
        });
      }
    }
  }
};
</script>