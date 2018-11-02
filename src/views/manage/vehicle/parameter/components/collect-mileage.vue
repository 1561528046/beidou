<template>
  <div style="padding:10px 198px;">
    <el-form>
      <el-row>
        <el-col>
          <el-form-item label="实时时间：">{{RealTime}}</el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="记录仪初次安装时间：">{{SetupTime}}</el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="初始里程：">{{BeginMileage}}</el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="累计行驶里程：">{{EndMileage}}</el-form-item>
        </el-col>
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
      SetupTime: "",
      BeginMileage: "",
      EndMileage: ""
    };
  },
  props: ["collect"],
  methods: {
    getTable() {
      this.$set(this.$data, "collectData", this.$props.collec);
      if (this.collectData.CommandWord == 3) {
        this.RealTime = this.collectData.RealTime;
        this.SetupTime = this.collectData.SetupTime;
        this.BeginMileage = this.collectData.BeginMileage;
        this.EndMileage = this.collectData.EndMileage;
      } else {
        this.RealTime = "";
        this.SetupTime = "";
        this.BeginMileage = "";
        this.EndMileage = "";
      }
    }
  }
};
</script>