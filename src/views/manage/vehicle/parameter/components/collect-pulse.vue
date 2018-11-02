<template>
  <div style="padding:10px 198px;">
    <el-form>
      <el-row>
        <el-col>
          <el-form-item label="时间：">{{RealTime}}</el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="脉冲系数：">{{PulseFactor}}</el-form-item>
        </el-col>
        <el-button size="small" type="primary">设置</el-button>
      </el-row>
    </el-form>
  </div>
</template>
<script>
export default {
  created() {
    this.getTable();
  },
  data() {
    return {
      collectData: {},
      RealTime: "",
      PulseFactor: ""
    };
  },
  props: ["collect"],
  methods: {
    getTable() {
      this.$set(this.$data, "collectData", this.$props.collect);
      if (this.collectData.CommandWord == 4) {
        this.RealTime = this.collectData.RealTime;
        this.PulseFactor = this.collectData.PulseFactor;
      } else {
        this.RealTime = "";
        this.PulseFactor = "";
      }
    }
  }
};
</script>