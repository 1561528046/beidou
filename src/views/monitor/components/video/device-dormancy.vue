<template>
  <div>
    <el-form :model="formData" label-width="130px" size="small">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="休眠唤醒模式">
            <el-select style="width:100%" v-model="formData.SleepWakeMode">
              <el-option value="0" label="条件唤醒">条件唤醒</el-option>
              <el-option value="1" label="定时唤醒">定时唤醒</el-option>
              <el-option value="2" label="手动唤醒">手动唤醒</el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="唤醒条件类型">
            <el-select style="width:100%" v-model="formData.WakeConditionType">
              <el-option value="0" label="紧急报警">紧急报警</el-option>
              <el-option value="1" label="碰撞侧翻报警">碰撞侧翻报警</el-option>
              <el-option value="2" label="车辆开门">车辆开门</el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="定时唤醒日设置">
            <el-checkbox-group v-model="wakeList">
              <el-checkbox label="0">周一</el-checkbox>
              <el-checkbox label="1">周二</el-checkbox>
              <el-checkbox label="2">周三</el-checkbox>
              <el-checkbox label="3">周四</el-checkbox>
              <el-checkbox label="4">周五</el-checkbox>
              <el-checkbox label="5">周六</el-checkbox>
              <el-checkbox label="6">周日</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="定时唤醒启用标志">
            <el-checkbox-group v-model="markList">
              <el-checkbox label="0">时间段1</el-checkbox>
              <el-checkbox label="1">时间段2</el-checkbox>
              <el-checkbox label="2">时间段3</el-checkbox>
              <el-checkbox label="3">时间段4</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="时间段1唤醒时间">
            <el-time-picker v-model="time1" placeholder="任意时间点"></el-time-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="时间段1关闭时间">
            <el-time-picker v-model="time1" placeholder="任意时间点"></el-time-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="时间段2唤醒时间">
            <el-time-picker v-model="time1" placeholder="任意时间点"></el-time-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="时间段2关闭时间">
            <el-time-picker v-model="time1" placeholder="任意时间点"></el-time-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="时间段3唤醒时间">
            <el-time-picker v-model="time1" placeholder="任意时间点"></el-time-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="时间段3关闭时间">
            <el-time-picker v-model="time1" placeholder="任意时间点"></el-time-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="时间段4唤醒时间">
            <el-time-picker v-model="time1" placeholder="任意时间点"></el-time-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="时间段4关闭时间">
            <el-time-picker v-model="time1" placeholder="任意时间点"></el-time-picker>
          </el-form-item>
        </el-col>
        <el-col style="text-align:center">
          <el-form-item label-width="0">
            <el-button type="primary">提交</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      time1: "",
      wakeList: [],
      markList: [],
      formData: {
        SleepWakeMode: "", //休眠唤醒模式
        WakeConditionType: "", //唤醒条件类型
        TimedWakeDaySetting: "", //定时唤醒日设置
        WakeParameters: [] //日定时唤醒参数列表
      }
    };
  }
};
</script>