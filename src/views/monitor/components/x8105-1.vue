<template>
    <div>
        <el-form :model="formData" size="small" ref="baseForm">
            <el-row :gutter="30">
                <el-col :span="8">
                    <el-form-item label="URL地址">
                        <el-input v-model="formData.URL"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="拨号点名称">
                        <el-input v-model="formData.point_name"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="拨号用户名">
                        <el-input v-model="formData.point_user"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="拨号密码">
                        <el-input v-model="formData.password"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="地址">
                        <el-input v-model="formData.address"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="TCP端口">
                        <el-input v-model="formData.TCP"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="UDP端口">
                        <el-input v-model="formData.UDP"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="制造商ID">
                        <el-input v-model="formData.manufacturersID"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="硬件版本">
                        <el-input v-model="formData.hardware"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="固件版本">
                        <el-input v-model="formData.firmware"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="连接到指定服务器时限">
                        <el-input v-model="formData.time_limit"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-button @click="sendInstruction" type="primary" size="small" style="display:block; margin:0 auto">设置</el-button>
        </el-form>
    </div>
</template>
<script>
export default {
  created() {
    this.$set(this.$data, "vehicleData", this.$props.vehicle);
    this.$instruction.on("x8105", eve => {
      var data = JSON.parse(eve.data);
      if (data.code == "0") {
        return this.$notify({
          message: "设置成功!",
          title: "提示",
          type: "success"
        });
      }
    });
  },
  data() {
    return {
      vehicleData: {},
      formData: {
        URL: "", //URL地址
        point_name: "", //拨号点名称
        point_user: "", //拨号点用户名
        password: "", //拨号密码
        address: "", //地址
        TCP: "", //TCP
        UDP: "", //UDP
        manufacturersID: "", //制造商ID
        hardware: "", //硬件版本
        firmware: "", //固件版本
        time_limit: "" //连接到指定服务器时限
      }
    };
  },
  props: ["vehicle"],
  methods: {
    sendInstruction() {
      var data = {};
      var sim_id = "";
      var str =
        this.formData.URL +
        ";" +
        this.formData.point_name +
        ";" +
        this.formData.point_user +
        ";" +
        this.formData.password +
        ";" +
        this.formData.address +
        ";" +
        this.formData.TCP +
        ";" +
        this.formData.UDP +
        ";" +
        this.formData.manufacturersID +
        ";" +
        this.formData.hardware +
        ";" +
        this.formData.firmware +
        ";" +
        this.formData.time_limit;
      if (this.vehicleData.sim_id.length == 11) {
        sim_id = "0" + this.vehicleData.sim_id;
      } else {
        sim_id = this.vehicleData.sim_id;
      }
      data = {
        SimID: sim_id,
        MessageID: "x8105",
        CommandWord: "1",
        CommandParameters: str
      };
      data = JSON.stringify(data);
      this.$instruction.send(data);
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
