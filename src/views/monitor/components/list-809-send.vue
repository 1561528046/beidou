<template>
    <div style="padding:10px 10px;">
        <label style="font-size:14px;">发送类型：</label>
        <el-select style="width:20%;" size="small" v-model="send">
            <el-option value="1" label="申请交换指定车辆定位信息请求消息">申请交换指定车辆定位信息请求消息</el-option>
            <el-option value="2" label="取消交换指定车辆定位信息请求消息">取消交换指定车辆定位信息请求消息</el-option>
            <el-option value="3" label="补发车辆定位信息请求">补发车辆定位信息请求</el-option>
            <el-option value="4" label="主动上报驾驶员身份信息">主动上报驾驶员身份信息</el-option>
            <el-option value="5" label="主动上报车辆电子运单信息">主动上报车辆电子运单信息</el-option>
            <el-option value="6" label="平台查岗应答">平台查岗应答</el-option>
            <el-option value="7" label="报警督办应答">报警督办应答</el-option>
            <el-option value="8" label="上报报警信息">上报报警信息</el-option>
            <el-option value="9" label="主动上报报警处理结果">主动上报报警处理结果</el-option>
            <el-option value="10" label="补报车辆静态信息请求消息">补报车辆静态信息请求消息</el-option>
        </el-select>
    </div>
</template>
<script>
export default {
  data() {
    return {
      send: ""
    };
  }
};
</script>
