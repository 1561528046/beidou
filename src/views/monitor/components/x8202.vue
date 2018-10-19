<template>
  <el-form ref="form" :model="form" label-width="80px" @submit.native.prevent>
    <el-form-item label="时间间隔">
      <el-input v-model="form.step"></el-input>
    </el-form-item>
    <el-form-item label="时间间隔">
      <el-input v-model="form.expires"></el-input>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" native-type="submit" @click="formSubmit">立即创建</el-button>
      <el-button>取消</el-button>
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
  created() {},
  methods: {
    formSubmit() {
      var arr = [
        "^x8202",
        this.form.step,
        this.form.expires,
        "0".repeat(12 - this.$props.vehicle.sim_id.length) +
          this.$props.vehicle.sim_id
      ];
      this.$emit("instruction", arr.join("|") + "$");
      this.form;
    }
  }
};
</script>
<style>
</style>