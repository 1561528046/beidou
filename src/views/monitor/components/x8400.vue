<template>
  <el-form ref="form" :model="form" label-width="80px" @submit.native.prevent>
    <!-- 普通通话
监听通话 -->
    <el-form-item label="通话方式" required>
      <el-select v-model="form.type">
        <el-option label="普通通话" value="0"></el-option>
        <el-option label="监听通话" value="1"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="电话号码">
      <el-input v-model="form.tel"></el-input>
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
        tel: "",
        type: "0"
      }
    };
  },
  props: ["vehicle"],
  created() {
    var sim = this.$utils.formatSim(this.vehicle.sim_id);
    this.$instruction.on("x8202", sim, () => {
      this.$message.success("执行成功！");
    });
  },
  methods: {
    formSubmit() {
      var sim = this.$utils.formatSim(this.vehicle.sim_id);
      var arr = ["^x8400", this.form.type, this.form.tel, sim];
      this.$instruction.send(arr.join("|") + "$");
    }
  },
  beforeDestroy() {
    this.$instruction.offAll("x8400", this.$props.vehicle.sim_id);
  }
};
</script>
<style>
</style>