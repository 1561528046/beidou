<template>
  <div>
    <div style="width:40%;display:inline-block">
      <el-table
        @select="selectAlarm"
        @select-all="selectAlarmAll"
        ref="multipleTable"
        height="500"
        :data="alarmData"
        tooltip-effect="dark"
        style="width: 100%"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="alarm_name" label="报警类型"></el-table-column>
      </el-table>
    </div>
    <div style="width:60%;display:inline-block;height:500px">
      <el-form :model="formData" size="small" label-width="80px">
        <el-row :gutter="20">
          <el-col>
            <el-form-item label="监控通道">
              <el-checkbox-group v-model="channel">
                <el-checkbox
                  v-for="item in channelData"
                  :value="item.logical_channel"
                  :key="item.logical_channel"
                  :label="item.logical_channel"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="视频预览">
              <el-radio v-model="formData.is_video_preview" label="1">是</el-radio>
              <el-radio v-model="formData.is_video_preview" label="0">否</el-radio>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="警音提醒">
              <el-radio v-model="formData.is_alarm_alert" label="1">是</el-radio>
              <el-radio v-model="formData.is_alarm_alert" label="0">否</el-radio>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="是否启用">
              <el-radio v-model="formData.is_enabled" label="1">是</el-radio>
              <el-radio v-model="formData.is_enabled" label="0">否</el-radio>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="联动时间">
              <el-date-picker
                style="width:100%"
                v-model="formData.time"
                type="datetimerange"
                range-separator="至"
                value-format="yyyyMMddHHmmss"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col style="text-align:center">
            <el-form-item label-width="0">
              <el-button @click="addLinkage" type="primary">提交</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>
<script>
import { addAlarmLink, getChannelByDeviceID } from "@/api/index.js";
export default {
  created() {
    for (var i in this.$dict.alarm) {
      this.alarmData.push({
        alarm_type: i,
        alarm_name: this.$dict.getAlarms(i)
      });
    }
    this.$set(this.formData, "sim_id", this.$props.simid);
    this.getChannel();
  },
  data() {
    return {
      alarmData: [],
      alarm: [],
      channelData: [],
      channel: [],
      formData: {
        time: "",
        sim_id: "",
        alarm_type: "",
        logical_channel: "",
        StartTime: "",
        EndTime: "",
        is_video_preview: "", //是否视频预览：0不预览，1预览
        is_alarm_alert: "", //是否警音提醒：0不提醒，1提醒
        is_enabled: "" //是否启用：0不启用，1启用
      }
    };
  },
  props: ["id", "simid"],
  methods: {
    // 查询通道信息
    getChannel() {
      getChannelByDeviceID({ device_id: this.$props.id }).then(res => {
        if (res.data.code == 0) {
          this.$set(this.$data, "channelData", res.data.data);
        } else {
          return this.$notify({
            message: res.data.msg,
            title: "提示",
            type: "error"
          });
        }
      });
    },
    //   添加
    addLinkage() {
      if (this.formData.time) {
        this.formData.StartTime = this.formData.time[0];
        this.formData.EndTime = this.formData.time[1];
      }
      this.formData.alarm_type = this.alarm.join();
      this.formData.logical_channel = this.channel.join();
      addAlarmLink(this.formData).then(res => {
        if (res.data.code == 0) {
          this.$emit("success");
          return this.$notify({
            message: "添加成功",
            title: "提示",
            type: "success"
          });
        } else {
          return this.$notify({
            message: res.data.msg,
            title: "提示",
            type: "error"
          });
        }
      });
    },
    // 选择报警类型
    selectAlarm(selection) {
      var arr = [];
      selection.map(item => {
        arr.push(item.alarm_type);
      });
      this.$set(this.$data, "alarm", arr);
    },
    selectAlarmAll(selection) {
      var arr = [];
      selection.map(item => {
        arr.push(item.alarm_type);
      });
      this.$set(this.$data, "alarm", arr);
    }
  }
};
</script>