<template>
    <div>
        <el-form :model="formData" size="small" ref="baseForm">
            <el-row :gutter="30">
                <el-col :span="8">
                    <el-form-item label="驾驶员姓名">
                        {{vehicle.driver.DriverName||"--"}}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="驾驶员身份证编码">
                        {{vehicle.driver.DriverDocument||"--"}}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="从业资格证编码">
                        {{vehicle.driver.JobNo||"--"}}
                    </el-form-item>
                </el-col>
                <!-- <el-col :span="8">
                    <el-form-item label="发证机构名称民度">
                         {{vehicle.driver.?}}
                    </el-form-item>
                </el-col> -->
                <el-col :span="8">
                    <el-form-item label="发证机构名称 ">
                        {{vehicle.driver.AgencyName||"--"}}
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>
<script>
export default {
  created() {
    this.$instruction.send(JSON.stringify(this.form));
    this.vehicle.driver = this.vehicle.driver || {};
  },
  data() {
    return {
      form: {
        SimID: this.$utils.formatSim(this.vehicle.sim_id),
        MessageID: "x8702"
      },
      formData: {}
    };
  },
  props: ["vehicle"],
  methods: {}
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
