<template>
  <div>
    <el-form :model="formData" size="small" ref="baseForm">
      <el-row :gutter="30">
        <el-col :span="8">
          <el-form-item label="连接控制">
            <el-select style="width:100%;" v-model="formData.control">
              <el-option value="0" label="切换到指定监管平台服务器"></el-option>
              <el-option value="1" label="切换回原缺省监管平台服务器"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col v-if="serverState" :span="8">
          <el-form-item label="监管平台鉴权码">
            <el-input v-model="formData.code"></el-input>
          </el-form-item>
        </el-col>
        <el-col v-if="serverState" :span="8">
          <el-form-item label="拨号点名称">
            <el-input v-model="formData.point_name"></el-input>
          </el-form-item>
        </el-col>
        <el-col v-if="serverState" :span="8">
          <el-form-item label="拨号用户名">
            <el-input v-model="formData.point_user"></el-input>
          </el-form-item>
        </el-col>
        <el-col v-if="serverState" :span="8">
          <el-form-item label="拨号密码">
            <el-input v-model="formData.password"></el-input>
          </el-form-item>
        </el-col>
        <el-col v-if="serverState" :span="8">
          <el-form-item label="地址">
            <el-input v-model="formData.address"></el-input>
          </el-form-item>
        </el-col>
        <el-col v-if="serverState" :span="8">
          <el-form-item label="TCP端口">
            <el-input v-model="formData.TCP"></el-input>
          </el-form-item>
        </el-col>
        <el-col v-if="serverState" :span="8">
          <el-form-item label="UDP端口">
            <el-input v-model="formData.UDP"></el-input>
          </el-form-item>
        </el-col>
        <el-col v-if="serverState" :span="8">
          <el-form-item label="连接到指定服务器时限">
            <el-input v-model="formData.time_limit"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-button
        @click="sendInstruction"
        type="primary"
        size="small"
        style="display:block; margin:0 auto"
      >设置</el-button>
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
          message: "指令发送成功",
          title: "提示",
          type: "success"
        });
      }
    });
  },
  data() {
    return {
      vehicleData: {},
      serverState: true,
      formData: {
        control: "", //连接控制
        code: "", //监管平台鉴权码
        point_name: "", //拨号点名称
        point_user: "", //拨号点用户名
        password: "", //拨号密码
        address: "", //地址
        TCP: "", //TCP
        UDP: "", //UDP
        time_limit: "" //连接到指定服务器时限
      }
    };
  },
  watch: {
    formData: {
      handler: function() {
        if (this.formData.control == "1") {
          this.serverState = false;
        } else {
          this.serverState = true;
        }
      },
      deep: true
    }
  },
  props: ["vehicle"],
  methods: {
    sendInstruction() {
      var data = {};
      var sim_id = "";
      var str =
        this.formData.control +
        ";" +
        this.formData.code +
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
        this.formData.time_limit;
      if (this.vehicleData.sim_id.length == 11) {
        sim_id = "0" + this.vehicleData.sim_id;
      } else {
        sim_id = this.vehicleData.sim_id;
      }
      if (str[0] == "1") {
        str = "1;";
      }
      data = {
        SimID: sim_id,
        MessageID: "x8105",
        CommandWord: "2",
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
