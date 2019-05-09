<template>
  <div v-if="viewData">
    <el-row>
      <el-col :span="12">
        报警ID:{{viewData.AlarmID}}
        <el-tag size="mini" v-if="viewData.SignStatus==1">开始</el-tag>
        <el-tag size="mini" v-if="viewData.SignStatus==2">结束</el-tag>
      </el-col>
      <el-col :span="12">
        报警类型:
        {{$dict.additional_alarm_64[viewData.AlarmType]}}
      </el-col>
      <el-col :span="12">报警级别:{{viewData.AlarmLevel}}</el-col>
      <el-col :span="12" v-if="viewData.alarmType<=1">前车车速:{{viewData.FrontCarSpeed}}</el-col>
      <el-col :span="12" v-if="viewData.alarmType<=1">前车/行人距离:{{viewData.FrontCarDistance}}</el-col>
      <el-col :span="12" v-if="viewData.alarmType==2">偏离类型:{{viewData.DeviationType==1?"左侧偏离":"右侧偏离"}}</el-col>
      <el-col :span="12" v-if="viewData.alarmType==6||viewData.alarmType==10">
        道路标志识别类型:
        {{$dict.additional_alarm_64_road_sign[viewData.RoadSignType]}}
      </el-col>
      <el-col :span="12">道路标志识别数据:{{viewData.RoadSignNum}}</el-col>
      <el-col :span="12">车速:{{viewData.Speed}}</el-col>
      <el-col :span="12">纬度:{{viewData.Altitude}}</el-col>
      <el-col :span="12">经度:{{viewData.Latitude}}</el-col>
      <el-col :span="12">日期时间:{{viewData.DateTime}}</el-col>
      <el-col :span="12">终端ID:{{viewData.AlarmSign.TerminalID}}</el-col>
      <el-col :span="12">时间:{{viewData.AlarmSign.DateTime}}</el-col>
      <el-col :span="12">序号:{{viewData.AlarmSign.SerialNO}}</el-col>
      <el-col :span="12">附件数量:{{viewData.AlarmSign.AttachmentCount}}</el-col>
      <!-- <el-col :span="12">车辆状态:{{viewData.VehicleStatus}}</el-col> -->
      <el-col :span="12">附件数量:{{viewData.AlarmSign.AttachmentCount}}</el-col>
      <el-col :span="12">ACC状态: {{getVehicleStatus(viewData.AlarmSign.VehicleStatus,0)?"关闭":"打开"}}</el-col>
      <el-col :span="12">左转向状态: {{getVehicleStatus(viewData.AlarmSign.vehicleStatus,1)?"关闭":"打开"}}</el-col>
      <el-col :span="12">右转向状态: {{getVehicleStatus(viewData.AlarmSign.vehicleStatus,2)?"关闭":"打开"}}</el-col>
      <el-col :span="12">雨刮器状态: {{getVehicleStatus(viewData.AlarmSign.vehicleStatus,3)?"关闭":"打开"}}</el-col>
      <el-col :span="12">制动状态: {{getVehicleStatus(viewData.AlarmSign.vehicleStatus,4)?"未制动":"制动"}}</el-col>
      <el-col :span="12">插卡状态: {{getVehicleStatus(viewData.AlarmSign.vehicleStatus,5)?"未插卡":"已插卡"}}</el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: ["data"],
  data() {
    return {
      alarmTypeDict: {}
    };
  },
  computed: {
    viewData: function() {
      return this.$props.data;
    }
  },
  methods: {
    getVehicleStatus(status, bitIndex) {
      var t = status & (1 << bitIndex);
      return t == bitIndex;
    }
  }
};
</script>

<style>
</style>
