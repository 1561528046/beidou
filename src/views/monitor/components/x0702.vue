<template>
  <div>
    <el-form :model="formData" size="small" ref="baseForm">
      <el-row :gutter="30">
        <el-col :span="8">
          <el-form-item label="驾驶员姓名">{{formData.driver_name||"--"}}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="驾驶员身份证编码">{{formData.driver_document||"--"}}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="从业资格证编码">{{formData.job_no||"--"}}</el-form-item>
        </el-col>
        <!-- <el-col :span="8">
                    <el-form-item label="发证机构名称民度">
                         {{vehicle.driver.?}}
                    </el-form-item>
        </el-col>-->
        <el-col :span="8">
          <el-form-item label="发证机构名称 ">{{formData.agency_name||"--"}}</el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { getDriverByID } from "@/api/index.js";
export default {
  created() {
    this.$set(this.$data, "sim_id", this.$props.vehicle.sim_id);
    this.getDriver();
  },
  data() {
    return {
      sim_id: "",
      formData: {}
    };
  },
  props: ["vehicle"],
  methods: {
    getDriver() {
      var data = {};
      if (this.sim_id.length == 11) {
        this.sim_id = "0" + this.sim_id;
      }
      data = {
        SimID: this.sim_id,
        MessageID: "x8702"
      };
      this.$instruction.send(JSON.stringify(data));
      getDriverByID({ sim_id: this.$props.vehicle.sim_id }).then(res => {
        if (res.data.code == 0) {
          this.$set(this.$data, "formData", res.data.data[0]);
        } else {
          return this.$notify({
            message: res.data.msg,
            title: "提示",
            type: "error"
          });
        }
      });
    }
  }
};
</script>
<style scoped lang="less">
.device-list {
  ul {
    display: flex;
    flex-wrap: wrap;
  }
  li {
    width: 33%;
    list-style-type: none;
  }
}
</style>
