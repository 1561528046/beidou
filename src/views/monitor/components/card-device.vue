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
        <li>
          <strong>终端心跳发送间隔:</strong>
          {{deviceParam["O1"]}}
        </li>
        <li>
          <strong>TCP 消息应答超时时间:</strong>
          {{deviceParam["O2"]}}
        </li>
        <li>
          <strong>TCP 消息重传次数:</strong>
          {{deviceParam["O3"]}}
        </li>
        <li>
          <strong>UDP 消息应答超时时间:</strong>
          {{deviceParam["O4"]}}
        </li>
        <li>
          <strong>UDP 消息重传次数:</strong>
          {{deviceParam["O5"]}}
        </li>
        <li>
          <strong>SMS 消息应答超时时间:</strong>
          {{deviceParam["O6"]}}
        </li>
        <li>
          <strong>SMS 消息重传次数:</strong>
          {{deviceParam["O7"]}}
        </li>
        <li>
          <strong>主服务器 APN:</strong>
          {{deviceParam["O16"]}}
        </li>
        <li>
          <strong>主服务器无线通信拨号用户名:</strong>
          {{deviceParam["O17"]}}
        </li>
        <li>
          <strong>主服务器无线通信拨号密码:</strong>
          {{deviceParam["O18"]}}
        </li>
        <li>
          <strong>主服务器地址:</strong>
          {{deviceParam["O19"]}}
        </li>
        <li>
          <strong>备份服务器 APN:</strong>
          {{deviceParam["O20"]}}
        </li>
        <li>
          <strong>备份服务器无线通信拨号用户名:</strong>
          {{deviceParam["O21"]}}
        </li>
        <li>
          <strong>备份服务器无线通信拨号密码:</strong>
          {{deviceParam["O22"]}}
        </li>
        <li>
          <strong>备份服务器地址:</strong>
          {{deviceParam["O23"]}}
        </li>
        <li>
          <strong>服务器 TCP 端口:</strong>
          {{deviceParam["O24"]}}
        </li>
        <li>
          <strong>服务器 UDP 端口:</strong>
          {{deviceParam["O25"]}}
        </li>
        <li>
          <strong>道路运输证 IC 卡认证主服务器 IP 地址或域名:</strong>
          {{deviceParam["O26"]}}
        </li>
        <li>
          <strong>道路运输证 IC 卡认证主服务器 TCP 端口:</strong>
          {{deviceParam["O27"]}}
        </li>
        <li>
          <strong>道路运输证 IC 卡认证主服务器 UDP 端口:</strong>
          {{deviceParam["O28"]}}
        </li>
        <li>
          <strong>道路运输证 IC 卡认证备份服务器 IP 地址或域名:</strong>
          {{deviceParam["O29"]}}
        </li>
        <li>
          <strong>位置汇报策略:</strong>
          {{["定时汇报","定距汇报","定时和定距汇报"][deviceParam["O32"]]}}
        </li>
        <li>
          <strong>位置汇报方案:</strong>
          {{["根据 ACC 状态","根据登录状态和 ACC状态"][deviceParam["O33"]]}}
        </li>
        <li>
          <strong>驾驶员未登录汇报时间间隔:</strong>
          {{deviceParam["O34"]}}
        </li>
        <li>
          <strong>休眠时汇报时间间隔:</strong>
          {{deviceParam["O39"]}}
        </li>
        <li>
          <strong>紧急报警时汇报时间间隔:</strong>
          {{deviceParam["O40"]}}
        </li>
        <li>
          <strong>缺省时间汇报间隔:</strong>
          {{deviceParam["O41"]}}
        </li>
        <li>
          <strong>缺省距离汇报间隔:</strong>
          {{deviceParam["O44"]}}
        </li>
        <li>
          <strong>驾驶员未登录汇报距离间隔:</strong>
          {{deviceParam["O45"]}}
        </li>
        <li>
          <strong>休眠时汇报距离间隔:</strong>
          {{deviceParam["O46"]}}
        </li>
        <li>
          <strong>紧急报警时汇报距离间隔:</strong>
          {{deviceParam["O47"]}}
        </li>
        <li>
          <strong>拐点补传角度:</strong>
          {{deviceParam["O48"]}}
        </li>
        <li>
          <strong>电子围栏半径:</strong>
          {{deviceParam["O49"]}}
        </li>
        <li>
          <strong>监控平台电话号码:</strong>
          {{deviceParam["O64"]}}
        </li>
        <li>
          <strong>复位电话号码:</strong>
          {{deviceParam["O65"]}}
        </li>
        <li>
          <strong>恢复出厂设置电话号码:</strong>
          {{deviceParam["O66"]}}
        </li>
        <li>
          <strong>监控平台 SMS 电话号码:</strong>
          {{deviceParam["O67"]}}
        </li>
        <li>
          <strong>接收终端 SMS 文本报警号码</strong>
          {{deviceParam["O68"]}}
        </li>
        <li>
          <strong>终端电话接听策略:</strong>
          {{["自动接听","ACC ON 时自动接听，OFF 时手动接听"][deviceParam["O69"]]}}
        </li>
        <li>
          <strong>每次最长通话时间:</strong>
          {{deviceParam["O70"]}}
        </li>
        <li>
          <strong>当月最长通话时间:</strong>
          {{deviceParam["O71"]}}
        </li>
        <li>
          <strong>监听电话号码:</strong>
          {{deviceParam["O72"]}}
        </li>
        <li>
          <strong>监管平台特权短信号码:</strong>
          {{deviceParam["O73"]}}
        </li>
        <li>
          <strong>报警屏蔽字:</strong>
          {{deviceParam["O80"]}}
        </li>
        <li>
          <strong>报警发送文本 SMS 开关:</strong>
          {{deviceParam["O81"]}}
        </li>
        <li>
          <strong>报警拍摄开关:</strong>
          {{deviceParam["O82"]}}
        </li>
        <li>
          <strong>报警拍摄存储标志:</strong>
          {{deviceParam["O83"]}}
        </li>
        <li>
          <strong>关键标志:</strong>
          {{deviceParam["O84"]}}
        </li>
        <li>
          <strong>最高速度:</strong>
          {{deviceParam["O85"]}}
        </li>
        <li>
          <strong>超速持续时间:</strong>
          {{deviceParam["O86"]}}
        </li>
        <li>
          <strong>连续驾驶时间门限:</strong>
          {{deviceParam["O87"]}}
        </li>
        <li>
          <strong>当天累计驾驶时间门限:</strong>
          {{deviceParam["O88"]}}
        </li>
        <li>
          <strong>最小休息时间:</strong>
          {{deviceParam["O89"]}}
        </li>
        <li>
          <strong>最长停车时间:</strong>
          {{deviceParam["O90"]}}
        </li>
        <li>
          <strong>超速报警预警差值:</strong>
          {{deviceParam["O91"]}}
        </li>
        <li>
          <strong>疲劳驾驶预警差值:</strong>
          {{deviceParam["O92"]}}
        </li>
        <li>
          <strong>碰撞报警参数设置:</strong>
          {{deviceParam["O93"]}}
        </li>
        <li>
          <strong>侧翻报警参数设置:</strong>
          {{deviceParam["O94"]}}
        </li>
        <li>
          <strong>定时拍照控制</strong>
          {{deviceParam["O101"]}}
        </li>
        <li>
          <strong>定距拍照控制</strong>
          {{deviceParam["O102"]}}
        </li>
        <li>
          <strong>图像/视频质量:</strong>
          {{deviceParam["O112"]}}
        </li>
        <li>
          <strong>亮度:</strong>
          {{deviceParam["O113"]}}
        </li>
        <li>
          <strong>对比度:</strong>
          {{deviceParam["O114"]}}
        </li>
        <li>
          <strong>饱和度:</strong>
          {{deviceParam["O115"]}}
        </li>
        <li>
          <strong>色度:</strong>
          {{deviceParam["O116"]}}
        </li>
        <li>
          <strong>车辆里程表读数:</strong>
          {{deviceParam["O128"]}}
        </li>
        <li>
          <strong>车辆所在的省域ID:</strong>
          {{deviceParam["O129"]}}
        </li>
        <li>
          <strong>车辆所在的市域 ID:</strong>
          {{deviceParam["O130"]}}
        </li>
        <li>
          <strong>公安交通管理部门颁发的机动车号牌:</strong>
          {{deviceParam["O131"]}}
        </li>
        <li>
          <strong>车牌颜色:</strong>
          {{this.$dict.get_color(JSON.stringify(deviceParam["O132"]))}}
        </li>
        <li>
          <strong>GNSS 定位模式:</strong>
          {{deviceParam["O144"]}}
        </li>
        <li>
          <strong>GNSS 波特率:</strong>
          {{deviceParam["O145"]}}
        </li>
        <li>
          <strong>GNSS 模块详细定位数据输出频率:</strong>
          {{deviceParam["O146"]}}
        </li>
        <li>
          <strong>GNSS 模块详细定位数据采集频率:</strong>
          {{deviceParam["O147"]}}
        </li>
        <li>
          <strong>GNSS 模块详细定位数据上传方式:</strong>
          {{deviceParam["O148"]}}
        </li>
        <li>
          <strong>NSS 模块详细定位数据上传设置:</strong>
          {{deviceParam["O149"]}}
        </li>
        <li>
          <strong>CAN 总线通道 1 采集时间间隔(ms):</strong>
          {{deviceParam["O256"]}}
        </li>
        <li>
          <strong>CAN 总线通道 1 上传时间间隔(s):</strong>
          {{deviceParam["O257"]}}
        </li>
        <li>
          <strong>CAN 总线通道 2 采集时间间隔(ms):</strong>
          {{deviceParam["O258"]}}
        </li>
        <li>
          <strong>CAN 总线通道 2 上传时间间隔(s):</strong>
          {{deviceParam["O259"]}}
        </li>
        <li>
          <strong>CAN 总线 ID 单独采集设置:</strong>
          {{deviceParam["O272"]}}
        </li>
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
      var msg = JSON.parse(evt.data);
      msg.Parameters.map(item => {
        var str = "O" + item.ParameterId;
        this.$set(this.deviceParam, str, item.ParameterValue);
      });
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
