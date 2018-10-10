<template>
    <div>
        <el-form :model="formData" size="small" ref="baseForm">
            <el-row :gutter="30">
                <el-col :span="8">
                    <el-form-item label="终端类型：">
                        <label v-if="formData.device_type=='1'">定位终端</label>
                        <label v-if="formData.device_type=='2'">视频终端</label>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="终端ID：" prop="device_no">
                        <label>{{formData.device_no}}</label>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="SIM ID：" prop="sim_id">
                        <label>{{formData.sim_id}}</label>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="终端厂商：" prop="company_name">
                        <label width>{{formData.company_name}}</label>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="协议类型：" prop="protocol_type">
                        <label v-if="formData.protocol_type=='1'">808部标协议</label>
                        <label v-if="formData.protocol_type=='2'">1078部标协议</label>
                    </el-form-item>
                </el-col>
                <el-col :span="8" v-if="formData.device_type=='2'">
                    <el-form-item label="存储介质：" prop="save_media">
                        <label v-if="formData.save_media=='1'">硬盘</label>
                        <label v-if="formData.save_media=='2'">SD卡</label>
                    </el-form-item>
                </el-col>
                <el-col :span="24" v-if="formData.device_type=='2'">
                    <el-form-item label="摄像头数量：" prop="camera_num">
                        <label v-if="formData.camera_num=='4'">4路</label>
                        <label v-if="formData.camera_num=='6'">6路</label>
                        <label v-if="formData.camera_num=='8'">8路</label>
                        <label v-if="formData.camera_num=='10'">10路</label>
                        <label v-if="formData.camera_num=='12'">12路</label>
                        <label v-if="formData.camera_num=='14'">14路</label>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>

    </div>
</template>
<script>
import { getDevice } from "@/api/index.js";
export default {
  created() {
    this.getTable();
  },
  data() {
    return {
      device_id: "",
      formData: {}
    };
  },
  props: ["vehicle"],
  methods: {
    getTable() {
      this.$set(this.$data, "device_id", this.$props.vehicle.device_id);
      getDevice({ device_id: this.device_id }).then(res => {
        if (res.data.code == 0) {
          if (res.data.data.length == 0) {
            this.$set(this.$data, "formData", {});
          } else {
            this.$set(this.$data, "formData", res.data.data[0]);
          }
        } else {
          this.$message.error(res.data.msg);
        }
      });
    }
  }
};
</script>
