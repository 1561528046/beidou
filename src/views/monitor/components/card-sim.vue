<template slot-scope="scope">
    <div style="width:40%;">
        <el-form :model="tableData" size="small" ref="baseForm">
            <el-card shadow="hover">
                <div slot="header" class="clearfix">
                    <span style="font-size:16px">SIM卡信息</span>
                </div>
                <el-row :gutter="30">
                    <el-col :span="8">
                        <el-form-item label="SIM卡号" prop="sim_no">
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="ICCID" prop="camera_num">
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="所属运营商" prop="belong">
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="流量" prop="flow">
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="备注" prop="note">
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-card>
        </el-form>
    </div>
</template>
<script>
// import { getSim } from "@/api/index.js";
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
    sim_id: String
  },
  methods: {
    getTable() {
      //   getSim({ sim_id: this.$props.sim_id }).then(res => {
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