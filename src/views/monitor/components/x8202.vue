<template>
  <el-form ref="form" :model="form" label-width="140px" @submit.native.prevent>
    <el-form-item label="时间间隔">
      <el-input-number :min="1" v-model="form.TimeInterval"></el-input-number>
    </el-form-item>
    <el-form-item label="位置跟踪有效期">
      <el-input-number :min="1" v-model="form.TrackExpire"></el-input-number>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" native-type="submit" @click="formSubmit">立即下发</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
export default {
  data() {
    return {
      form: {
        SimID: this.$utils.formatSim(this.vehicle.sim_id),
        MessageID: "x8202",
        TimeInterval: 0,
        TrackExpire: 0
      }
    };
  },
  props: ["vehicle"],
  created() {
    this.$instruction.on("x8202", this.vehicle.sim_id, this.messageSuccess);
  },
  methods: {
    messageSuccess(evt) {
      var data = JSON.parse(evt.data);
      if (data.code == 0) {
        this.$message.success("执行成功！");
      } else {
        this.$message.warning("执行失败");
      }
    },
    formSubmit() {
      this.$instruction.send(JSON.stringify(this.form));
    },
    response() {}
  },
  beforeDestroy() {
    this.$instruction.offAll("x8202", this.$props.vehicle.sim_id);
  }
};
</script>