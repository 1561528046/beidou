<template>
    <div>
        <el-form :model="tableData" size="small" ref="baseForm">
            <el-row :gutter="30">
                <el-col :span="8">
                    <el-form-item label="终端类型" prop="device_type">
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="终端ID" prop="device_no">
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="SIM ID" prop="sim_no">
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="终端厂商" prop="company_name">
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="协议类型" prop="protocol_type">
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="存储介质" prop="save_media">
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="摄像头数量" prop="camera_num">
                        <template>
                            <label>4路</label>
                            <label>6路</label>
                            <label>8路</label>
                            <label>10路</label>
                            <label>12路</label>
                            <label>14路</label>
                        </template>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>

    </div>
</template>
<script>
// import { getDevice } from "@/api/index.js";
export default {
  created() {
    console.log(this.$props.vehicle);
  },
  data() {
    return {
      tableData: {}
    };
  },
  props: ["vehicle"],
  methods: {
    getTable() {
      //   getDevice({ device_id: this.$props.device_id }).then(res => {
      //     if (res.data.code == 0) {
      //       this.$set(this.$data, "tableData", res.data.data);
      //     } else {
      //       this.$message.error(res.data.msg);
      //     }
      //   });
    }
  }
};
</script>
