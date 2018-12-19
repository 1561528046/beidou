<template>
  <el-form ref="baseForm" :model="form" label-width="150px" @submit.native.prevent size="small">
    <el-tabs v-model="type" @tab-click="changeType">
      <el-tab-pane label="自动模式" name="0">
        <el-form-item label="录音时长(单位 秒)">
          <el-input-number :min="1" :max="60" v-model="form.RecordingTime"></el-input-number>
        </el-form-item>
        <el-form-item label="保存方式">
          <el-radio v-model="form.SaveFlag" label="0">实时上传</el-radio>
          <el-radio v-model="form.SaveFlag" label="1">保存</el-radio>
        </el-form-item>
        <el-form-item label="音频采样率">
          <el-select v-model="form.RecordSampingRate">
            <el-option label="8K" value="0"></el-option>
            <el-option label="11K" value="1"></el-option>
            <el-option label="23K" value="2"></el-option>
            <el-option label="32K" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="formSubmit('auto')" :loading="loading">立即下发</el-button>
        </el-form-item>
      </el-tab-pane>
      <el-tab-pane label="手动模式" name="1">
        <el-form-item label="保存方式">
          <el-radio v-model="form.SaveFlag" label="0">实时上传</el-radio>
          <el-radio v-model="form.SaveFlag" label="1">保存</el-radio>
        </el-form-item>
        <el-form-item label="音频采样率">
          <el-select v-model="form.RecordSampingRate">
            <el-option label="8K" value="0"></el-option>
            <el-option label="11K" value="1"></el-option>
            <el-option label="23K" value="2"></el-option>
            <el-option label="32K" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="formSubmit('begin',1)" :loading="loading">开始</el-button>
          <el-button type="primary" @click="formSubmit('stop')">停止</el-button>
        </el-form-item>
      </el-tab-pane>
    </el-tabs>
    <el-table :data="audioList" size="mini">
      <el-table-column prop="SimID" label="sim id"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <audio :src="getMediaUrl(scope.row)" controls></audio>
          <!-- <el-button size="mini" @click="remove(scope.row)">播放</el-button> -->
        </template>
      </el-table-column>
    </el-table>
  </el-form>
</template>
<style lang="less" scoped>
.anwser-list {
  li {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }
  .add {
    text-align: center;
  }
}
</style>
<script>
export default {
  data() {
    return {
      timeout: 0,
      loading: false,
      type: "0",
      audioList: [],
      form: {
        SimID: this.$utils.formatSim(this.vehicle.sim_id),
        MessageID: "x8804",
        RecordingCommand: 1, //指令
        RecordingTime: "", //录音时长
        SaveFlag: "0", //保存标志
        RecordSampingRate: "3" //采样率
      }
    };
  },
  props: ["vehicle"],
  created() {
    this.$instruction.on("x8801", this.vehicle.sim_id, this.x8801);
    this.$instruction.on("x0800", this.vehicle.sim_id, this.x0800);
    this.$instruction.on("x8800", this.vehicle.sim_id, this.x8800);
  },
  methods: {
    x8804(evt) {
      var msg = JSON.parse(evt.data);
      if (msg.code == 0) {
        this.$message.success("已发送");
      } else {
        this.$message.warning("发送失败");
      }
    },
    x0800() {
      this.$message.success("已开始录音");
    },
    x8800(evt) {
      var msg = JSON.parse(evt.data);
      this.audioList.push(msg);
      this.loading = false;
      clearTimeout(this.timeout);
    },
    getMediaUrl(row) {
      var url =
        this.$dict.BASE_URL +
        `api/MultiMedia/GetMultiMediaByType?type=1&sim_id=${
          row.SimID
        }&media_id=${row.MultimediaDataID}`;
      return url;
    },
    changeType() {
      var newForm = {
        SimID: this.$utils.formatSim(this.vehicle.sim_id),
        MessageID: "x8804",
        RecordingCommand: 1, //指令
        RecordingTime: this.form.RecordingTime, //录音时长
        SaveFlag: "0", //保存标志
        RecordSampingRate: "3" //采样率
      };
      this.$set(this.$data, "form", newForm);
    },
    formSubmit(command, num) {
      clearTimeout(this.timeout);
      if (command == "auto") {
        this.form.RecordingCommand = 1;
      }
      if (command == "begin") {
        this.form.RecordingCommand = 1;
      }
      if (command == "stop") {
        this.form.RecordingCommand = 0;
      }
      if (num == 1 && num != undefined) {
        this.form.RecordingTime = 0;
      }
      this.$instruction.send(JSON.stringify(this.form));
      this.loading = true;
      this.timeout = setTimeout(() => {
        this.loading = false;
      }, 25000);
    }
  },
  beforeDestroy() {
    this.$instruction.off("x8804", this.vehicle.sim_id, this.x8804);
    this.$instruction.off("x0800", this.vehicle.sim_id, this.x0800);
    this.$instruction.off("x8800", this.vehicle.sim_id, this.x8800);
  }
};
</script>
