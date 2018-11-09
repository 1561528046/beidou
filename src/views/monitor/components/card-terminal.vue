<template slot-scope="scope">
  <div v-loading="true">
    <el-form :model="formData" size="small">
      <div slot="header" class="clearfix">
        <span style="font-size:16px">终端属性</span>
      </div>
      <el-row :gutter="30">
        <el-col :span="8">
          <el-form-item prop="MakerID" label="制造商ID：">
            {{formData.MakerID}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="TerminalModelNo" label="终端型号：">
            {{formData.TerminalModelNo}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="TerminalID" label="终端ID：">
            {{formData.TerminalID}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="ICCID" label="ICCID号：">
            {{formData.ICCID}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="HardwareVersionLength" label="终端硬件版本号长度：">
            {{formData.HardwareVersionLength}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="HardwareVersion" label="终端硬件版本号：">
            {{formData.HardwareVersion}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="FirmwareVersionLength" label="终端固件版本号长度：">
            {{formData.FirmwareVersionLength}}
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="FirmwareVersion" label="终端固件版本号：">
            {{formData.FirmwareVersion}}
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="TerminalType" label="终端类型：">
            {{TerminalType}}
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="GNSSProperty" label="CNSS模块属性：">
            {{GNSSProperty}}
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="COMMProperty" label="通信模块属性：">
            {{COMMProperty}}
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
export default {
  created() {
    this.$instruction.on("x0107", eve => {
      var data = JSON.parse(eve.data);
      this.$set(this.$data, "formData", data);
      this.$set(this.$data, "device_type", this.formData.TerminalType);
      this.$set(this.$data, "CNSS", this.formData.GNSSProperty);
      this.$set(this.$data, "COMM", this.formData.COMMProperty);
    });
  },
  data() {
    return {
      sim_id: "",
      device_type: "",
      CNSS: "",
      COMM: "",
      TerminalType: "",
      GNSSProperty: "",
      COMMProperty: "",
      formData: {}
    };
  },
  watch: {
    device_type: function() {
      var terminal = this.device_type.toString(2);
      switch (terminal.length) {
        case 1:
          terminal = "0000000" + terminal;
          break;
        case 2:
          terminal = "000000" + terminal;
          break;
        case 3:
          terminal = "00000" + terminal;
          break;
        case 4:
          terminal = "0000" + terminal;
          break;
        case 5:
          terminal = "000" + terminal;
          break;
        case 6:
          terminal = "00" + terminal;
          break;
        case 7:
          terminal = "0" + terminal;
          break;
      }
      var arr = [];
      if (terminal[7] == 1) {
        arr.push("适用客运车辆");
      } else {
        arr.push("不适用客运车辆");
      }
      if (terminal[6] == 1) {
        arr.push("适用危险品车辆");
      } else {
        arr.push("不适用危险品车辆");
      }
      if (terminal[5] == 1) {
        arr.push("适用普通货运车辆");
      } else {
        arr.push("不适用普通货运车辆");
      }
      if (terminal[4] == 1) {
        arr.push("适用出租车辆");
      } else {
        arr.push("不适用出租车辆");
      }
      if (terminal[1] == 1) {
        arr.push("支持硬盘录像");
      } else {
        arr.push("不支持硬盘录像");
      }
      if (terminal[0] == 1) {
        arr.push("分体机");
      } else {
        arr.push("一体机");
      }
      arr = arr.toString();
      this.$set(this.$data, "TerminalType", arr);
    },
    CNSS: function() {
      var cnss = this.CNSS.toString(2);
      switch (cnss.length) {
        case 1:
          cnss = "0000000" + cnss;
          break;
        case 2:
          cnss = "000000" + cnss;
          break;
        case 3:
          cnss = "00000" + cnss;
          break;
        case 4:
          cnss = "0000" + cnss;
          break;
      }
      var arr = [];
      if (cnss[7] == 1) {
        arr.push("支持GPS定位");
      } else {
        arr.push("不支持GPS定位");
      }
      if (cnss[6] == 1) {
        arr.push("支持北斗定位");
      } else {
        arr.push("不支持北斗定位");
      }
      if (cnss[5] == 1) {
        arr.push("支持GLONASS定位");
      } else {
        arr.push("不支持GLONASS定位");
      }
      if (cnss[4] == 1) {
        arr.push("支持Galileo定位");
      } else {
        arr.push("不支持Galileo定位");
      }
      arr = arr.toString();
      this.$set(this.$data, "GNSSProperty", arr);
    },
    COMM: function() {
      var comm = this.COMM.toString(2);
      switch (comm.length) {
        case 1:
          comm = "0000000" + comm;
          break;
        case 2:
          comm = "000000" + comm;
          break;
        case 3:
          comm = "00000" + comm;
          break;
        case 4:
          comm = "0000" + comm;
          break;
        case 5:
          comm = "000" + comm;
          break;
        case 6:
          comm = "00" + comm;
          break;
        case 7:
          comm = "0" + comm;
          break;
      }
      var arr = [];
      if (comm[7] == 1) {
        arr.push("支持GPRS通信");
      } else {
        arr.push("不支持GPRS通信");
      }
      if (comm[6] == 1) {
        arr.push("支持CDMA通信");
      } else {
        arr.push("不支持CDMA通信");
      }
      if (comm[5] == 1) {
        arr.push("支持TD-SCDMA通信");
      } else {
        arr.push("不支持TD-SCDMA通信");
      }
      if (comm[4] == 1) {
        arr.push("支持WCDMA通信");
      } else {
        arr.push("不支持WCDMA通信");
      }
      if (comm[3] == 1) {
        arr.push("支持CDMA2000通信");
      } else {
        arr.push("不支持CDMA2000通信");
      }
      if (comm[2] == 1) {
        arr.push("支持TD-LTE通信");
      } else {
        arr.push("不支持TD-LTE通信");
      }
      if (comm[0] == 1) {
        arr.push("支持其它通信方式");
      } else {
        arr.push("不支持其它通信方式");
      }
      arr = arr.toString();
      this.$set(this.$data, "COMMProperty", arr);
    }
  },
  methods: {}
};
</script>