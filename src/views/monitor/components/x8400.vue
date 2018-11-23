<template>
  <el-form ref="form" :model="form" label-width="80px" @submit.native.prevent>
    <!-- 普通通话
监听通话 -->
    <el-form-item label="通话方式" required>
      <el-select v-model="form.CallBackFlag">
        <el-option label="普通通话" value="0"></el-option>
        <el-option label="监听通话" value="1"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="电话号码">
      <el-input v-model="form.PhoneNumber"></el-input>
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
        MessageID: "x8400",
        SimID: this.$utils.formatSim(this.vehicle.sim_id),
        CallBackFlag: "0",
        PhoneNumber: ""
      }
    };
  },
  props: ["vehicle"],
  created() {
    this.$instruction.on("x8400", this.vehicle.sim_id, evt => {
      var msg = JSON.parse(evt.data);
      if (msg.code == 0) {
        this.$message.success("执行成功！");
      } else {
        this.$message.warning("执行失败");
      }
      this.loading = false;
    });
  },
  methods: {
    formSubmit() {
      this.$instruction.send(JSON.stringify(this.form));
    }
  },
  beforeDestroy() {
    this.$instruction.offAll("x8400", this.$props.vehicle.sim_id);
  }
};
</script>