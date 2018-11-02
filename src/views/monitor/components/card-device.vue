<template>
    <div>
        <el-form :model="formData" size="small" ref="baseForm">
            <el-row :gutter="30">
                <el-col :span="8">
                    <el-form-item label="终端类型：">
                        <label v-if="formData.device_type=='1'">定位终端</label>
                        <label v-if="formData.device_type=='2'">视频终端</label>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="终端ID：" prop="device_no">
                        <label>{{formData.device_no || "--"}}</label>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="SIM ID：" prop="sim_id">
                        <label>{{formData.sim_id || "--"}}</label>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="终端厂商：" prop="company_name">
                        <label width>{{formData.company_name || "--"}}</label>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="协议类型：" prop="protocol_type">
                        <label v-if="formData.protocol_type=='1'">808部标协议</label>
                        <label v-if="formData.protocol_type=='2'">1078部标协议</label>
                    </el-form-item>
                </el-col>
                <el-col :span="8" v-if="formData.device_type=='2'">
                    <el-form-item label="存储介质：" prop="save_media">
                        <label v-if="formData.save_media=='1'">硬盘</label>
                        <label v-if="formData.save_media=='2'">SD卡</label>
                    </el-form-item>
                </el-col>
                <el-col :span="24" v-if="formData.device_type=='2'">
                    <el-form-item label="摄像头数量：" prop="camera_num">
                        <label v-if="formData.camera_num=='4'">4路</label>
                        <label v-if="formData.camera_num=='6'">6路</label>
                        <label v-if="formData.camera_num=='8'">8路</label>
                        <label v-if="formData.camera_num=='10'">10路</label>
                        <label v-if="formData.camera_num=='12'">12路</label>
                        <label v-if="formData.camera_num=='14'">14路</label>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div class="device-list" v-loading="x0104Loding" element-loading-text="正在载入">
            <ul>
                <li><strong>终端心跳发送间隔: </strong>{{deviceParam["x0001"]}}</li>
                <li><strong>TCP 消息应答超时时间: </strong>{{deviceParam["x0002"]}}</li>
                <li><strong>TCP 消息重传次数: </strong>{{deviceParam["x0003"]}}</li>
                <li><strong>UDP 消息应答超时时间: </strong>{{deviceParam["x0004"]}}</li>
                <li><strong>UDP 消息重传次数: </strong>{{deviceParam["x0005"]}}</li>
                <li><strong>SMS 消息应答超时时间: </strong>{{deviceParam["x0006"]}}</li>
                <li><strong>SMS 消息重传次数: </strong>{{deviceParam["x0007"]}}</li>
                <li><strong>主服务器 APN: </strong>{{deviceParam["x0010"]}}</li>
                <li><strong>主服务器无线通信拨号用户名: </strong>{{deviceParam["x0011"]}}</li>
                <li><strong>主服务器无线通信拨号密码: </strong>{{deviceParam["x0012"]}}</li>
                <li><strong>主服务器地址: </strong>{{deviceParam["x0013"]}}</li>
                <li><strong>备份服务器 APN: </strong>{{deviceParam["x0014"]}}</li>
                <li><strong>备份服务器无线通信拨号用户名: </strong>{{deviceParam["x0015"]}}</li>
                <li><strong>备份服务器无线通信拨号密码: </strong>{{deviceParam["x0016"]}}</li>
                <li><strong>备份服务器地址: </strong>{{deviceParam["x0017"]}}</li>
                <li><strong>服务器 TCP 端口: </strong>{{deviceParam["x0018"]}}</li>
                <li><strong>服务器 UDP 端口: </strong>{{deviceParam["x0019"]}}</li>
                <li><strong>位置汇报策略: </strong>{{["定时汇报","定距汇报","定时和定距汇报"][deviceParam["x0020"]]}}</li>
                <li><strong>位置汇报方案: </strong>{{["根据 ACC 状态","根据登录状态和 ACC"][deviceParam["x0021"]]}}</li>
                <li><strong>驾驶员未登录汇报时间间隔: </strong>{{deviceParam["x0022"]}}</li>
                <li><strong>休眠时汇报时间间隔: </strong>{{deviceParam["x0027"]}}</li>
                <li><strong>紧急报警时汇报时间间隔: </strong>{{deviceParam["x0028"]}}</li>
                <li><strong>缺省时间汇报间隔: </strong>{{deviceParam["x0029"]}}</li>
                <li><strong>缺省距离汇报间隔: </strong>{{deviceParam["x002c"]}}</li>
                <li><strong>驾驶员未登录汇报距离间隔: </strong>{{deviceParam["x002d"]}}</li>
                <li><strong>休眠时汇报距离间隔: </strong>{{deviceParam["x002e"]}}</li>
                <li><strong>紧急报警时汇报距离间隔: </strong>{{deviceParam["x002f"]}}</li>
                <li><strong>拐点补传角度: </strong>{{deviceParam["x0030"]}}</li>
                <li><strong>监控平台电话号码: </strong>{{deviceParam["x0040"]}}</li>
                <li><strong>复位电话号码: </strong>{{deviceParam["x0041"]}}</li>
                <li><strong>恢复出厂设置电话号码: </strong>{{deviceParam["x0042"]}}</li>
                <li><strong>监控平台 SMS 电话号码: </strong>{{deviceParam["x0043"]}}</li>
                <li><strong>终端电话接听策略: </strong>{{deviceParam["x0045"]}}</li>
                <li><strong>每次最长通话时间: </strong>{{deviceParam["x0046"]}}</li>
                <li><strong>当月最长通话时间: </strong>{{deviceParam["x0047"]}}</li>
                <li><strong>监听电话号码: </strong>{{deviceParam["x0048"]}}</li>
                <li><strong>监管平台特权短信号码: </strong>{{deviceParam["x0049"]}}</li>
                <li><strong>报警屏蔽字: </strong>{{deviceParam["x0050"]}}</li>
                <li><strong>报警发送文本 SMS 开关: </strong>{{deviceParam["x0051"]}}</li>
                <li><strong>报警拍摄开关: </strong>{{deviceParam["x0052"]}}</li>
                <li><strong>报警拍摄存储标志: </strong>{{deviceParam["x0053"]}}</li>
                <li><strong>关键标志: </strong>{{deviceParam["x0054"]}}</li>
                <li><strong>最高速度: </strong>{{deviceParam["x0055"]}}</li>
                <li><strong>超速持续时间: </strong>{{deviceParam["x0056"]}}</li>
                <li><strong>连续驾驶时间门限: </strong>{{deviceParam["x0057"]}}</li>
                <li><strong>当天累计驾驶时间门限: </strong>{{deviceParam["x0058"]}}</li>
                <li><strong>最小休息时间: </strong>{{deviceParam["x0059"]}}</li>
                <li><strong>最长停车时间: </strong>{{deviceParam["x005a"]}}</li>
                <li><strong>图像/视频质量: </strong>{{deviceParam["x0070"]}}</li>
                <li><strong>亮度: </strong>{{deviceParam["x0071"]}}</li>
                <li><strong>对比度: </strong>{{deviceParam["x0072"]}}</li>
                <li><strong>饱和度: </strong>{{deviceParam["x0073"]}}</li>
                <li><strong>色度: </strong>{{deviceParam["x0074"]}}</li>
                <li><strong>车辆里程表读数: </strong>{{deviceParam["x0080"]}}</li>
                <li><strong>车辆所在的省域ID: </strong>{{deviceParam["x0081"]}}</li>
                <li><strong>车辆所在的市域 ID: </strong>{{deviceParam["x0082"]}}</li>
                <li><strong>公安交通管理部门颁发的机动车号牌: </strong>{{deviceParam["x0083"]}}</li>
                <li><strong>车牌颜色: </strong>{{deviceParam["x0084"]}}</li>
            </ul>

        </div>
    </div>
</template>
<script>
import { getDevice } from "@/api/index.js";
export default {
  created() {
    this.getTable();
    this.$instruction.send(JSON.stringify(this.form));
    this.x0104Loding = true;
    this.$instruction.on("x0104A", this.form.SimID, this.x0104);
  },
  data() {
    return {
      x0104Loding: false,
      deviceParam: {},
      form: {
        SimID: this.$utils.formatSim(this.vehicle.sim_id),
        MessageID: "x8104"
      },
      device_id: "",
      formData: {}
    };
  },
  props: ["vehicle"],
  methods: {
    x0104(evt) {
      this.x0104Loding = false;
      //       var msg =
      //   "^x0104A|1,0;2,0;3,0;4,0;5,0;6,0;7,0;16,;17,;18,;19,192.168.88.125;20,;21,;22,;23,;24,8888;25,0;32,0;33,0;34,0;39,0;40,0;41,0;44,0;45,0;46,0;47,0;48,0;49,0;64,;65,;66,;67,;68,;69,0;70,0;71,0;72,;73,;80,0;81,0;82,0;83,0;84,0;85,0;86,0;87,0;88,0;89,0;90,0;112,0;113,0;114,0;115,0;116,0;128,0;129,123;130,123;131,;132,0|010000000004$";
      var msg = evt.data;
      var msgArr = msg
        .replace("^", "")
        .replace("$", "")
        .split("|");
      var msgData = msgArr[1];
      var deviceParamArr = msgData.split(";");
      var deviceParam = {};
      deviceParamArr.map(item => {
        var param = item.split(",");
        param[0] = "x" + "0".repeat(4 - param[0].length) + param[0];
        deviceParam[param[0]] = param[1] == undefined ? "--" : param[1];
      });
      this.$set(this.$data, "deviceParam", deviceParam);
    },
    getTable() {
      this.$set(this.$data, "device_id", this.$props.vehicle.device_id);
      getDevice({ device_id: this.device_id }).then(res => {
        if (res.data.code == 0) {
          if (res.data.data.length == 0) {
            this.$set(this.$data, "formData", {});
          } else {
            this.$set(this.$data, "formData", res.data.data[0]);
          }
        } else {
          this.$message.error(res.data.msg);
        }
      });
    }
  }
};
</script>
<style scoped lang="less">
.device-list {
  border-top: 1px dashed #ccc;
  padding-top: 15px;
  ul {
    display: flex;
    flex-wrap: wrap;
  }
  li {
    width: 33%;
    height: 30px;
    line-height: 30px;
    list-style-type: none;
    strong {
      color: #888;
      font-size: 14px;
      font-weight: normal;
    }
  }
}
</style>
