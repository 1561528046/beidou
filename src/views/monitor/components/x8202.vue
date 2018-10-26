<template>
  <el-form ref="form" :model="form" label-width="80px" @submit.native.prevent>
    <el-form-item label="时间间隔">
      <el-input v-model="form.step"></el-input>
    </el-form-item>
    <el-form-item label="位置跟踪有效期">
      <el-input v-model="form.expires"></el-input>
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
        expires: 0,
        step: 0
      }
    };
  },
  props: ["vehicle"],
  created() {
    var sim =
      "0".repeat(12 - this.$props.vehicle.sim_id.length) +
      this.$props.vehicle.sim_id;
    this.$instruction.on("x8202", sim, this.messageSuccess);
  },
  methods: {
    messageSuccess() {
      this.$message.success("执行成功！");
    },
    formSubmit() {
      var sim =
        "0".repeat(12 - this.$props.vehicle.sim_id.length) +
        this.$props.vehicle.sim_id;
      var arr = ["^x8202", this.form.step, this.form.expires, sim];
      this.$instruction.send(arr.join("|") + "$");
    },
    response() {}
  },
  beforeDestroy() {
    this.$instruction.offAll("x8202", this.$props.vehicle.sim_id);
  }
};
</script>
<style>
</style>