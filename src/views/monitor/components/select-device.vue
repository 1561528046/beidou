<template slot-scope="scope">
    <div style="width:40%;">
        <el-form :model="tableData" size="small" ref="baseForm">
            <el-card shadow="hover">
                <div slot="header" class="clearfix">
                    <span style="font-size:16px">设备信息 </span>
                </div>
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
                    <el-col :span="8">
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
            </el-card>
        </el-form>

    </div>
</template>
<script>
// import { getDevice } from "@/api/index.js";
export default {
  created() {
    this.getTable();
  },
  data() {
    return {
      tableData: {}
    };
  },
  props: {
    device_id: String
  },
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
