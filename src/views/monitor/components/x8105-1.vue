<template>
    <div>
        <el-form :model="formData" size="small" ref="baseForm">
            <el-row :gutter="30">
                <el-col :span="8">
                    <el-form-item label="URL地址">
                        <el-input></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="拨号点名称">
                        <el-input></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="拨号用户名">
                        <el-input></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="拨号密码">
                        <el-input></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="地址">
                        <el-input></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="TCP端口">
                        <el-input></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="UDP端口">
                        <el-input></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="制造商ID">
                        <el-input></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="硬件版本">
                        <el-input></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="固件版本">
                        <el-input></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="连接到指定服务器时限">
                        <el-input></el-input>
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
