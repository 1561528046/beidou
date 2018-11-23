<template>
  <div style="padding:10px 10px;">
    <label style=" display:inline-block;font-size:14px; width:140px;">发送类型：</label>
    <el-select style="width:21.8%;margin-bottom:10px" size="small" v-model="send">
      <el-option value="x1207" label="申请交换指定车辆定位信息请求消息(1207)">申请交换指定车辆定位信息请求消息(1207)</el-option>
      <el-option value="x1208" label="取消交换指定车辆定位信息请求消息(1208)">取消交换指定车辆定位信息请求消息(1208)</el-option>
      <el-option value="x1209" label="补发车辆定位信息请求(1209)">补发车辆定位信息请求(1209)</el-option>
      <el-option value="x120C" label="主动上报驾驶员身份信息(120C)">主动上报驾驶员身份信息(120C)</el-option>
      <el-option value="x120D" label="主动上报车辆电子运单信息(120D)">主动上报车辆电子运单信息(120D)</el-option>
      <el-option value="x1401" label="报警督办应答(1401)">报警督办应答(1401)</el-option>
      <el-option value="x1402" label="上报报警信息(1402)">上报报警信息(1402)</el-option>
      <el-option value="x1403" label="主动上报报警处理结果(1403)">主动上报报警处理结果(1403)</el-option>
      <el-option value="x1601" label="补报车辆静态信息应答(1601)">补报车辆静态信息应答(1601)</el-option>
    </el-select>
    <div :is="component_name"></div>
  </div>
</template>
<script>
import sendX120C from "./send/send-x120C.vue";
import sendX120D from "./send/send-x120D.vue";
import sendX1207 from "./send/send-x1207.vue";
import sendX1208 from "./send/send-x1208.vue";
import sendX1209 from "./send/send-x1209.vue";
import sendX1401 from "./send/send-x1401.vue";
import sendX1402 from "./send/send-x1402.vue";
import sendX1403 from "./send/send-x1403.vue";
import sendX1601 from "./send/send-x1601.vue";
export default {
  components: {
    sendX120C,
    sendX120D,
    sendX1207,
    sendX1208,
    sendX1209,
    sendX1401,
    sendX1402,
    sendX1403,
    sendX1601
  },
  data() {
    return {
      send: "",
      component_name: ""
    };
  },
  watch: {
    send: function() {
      switch (this.send) {
        case "x1207":
          this.component_name = "sendX1207";
          break;
        case "x1208":
          this.component_name = "sendX1208";
          break;
        case "x1209":
          this.component_name = "sendX1209";
          break;
        case "x120C":
          this.component_name = "sendX120C";
          break;
        case "x120D":
          this.component_name = "sendX120D";
          break;
        case "x1401":
          this.component_name = "sendX1401";
          break;
        case "x1402":
          this.component_name = "sendX1402";
          break;
        case "x1403":
          this.component_name = "sendX1403";
          break;
        case "x1601":
          this.component_name = "sendX1601";
          break;
      }
    }
  }
};
</script>
