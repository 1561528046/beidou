<template slot-scope="scope">
    <div>
        <el-form :model="formData" size="small">
            <div slot="header" class="clearfix">
                <span style="font-size:16px">SIM卡信息</span>
            </div>
            <el-row :gutter="30">
                <el-col :span="8">
                    <el-form-item label="SIM卡号：">
                        <label>{{formData.sim_no}}</label>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="ICCID：">
                        <label>{{formData.icc_id}}</label>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="所属运营商：">
                        <label>{{formData.belong}}</label>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="流量：">
                        <label>{{formData.flow}}</label>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="备注：">
                        <label>{{formData.note}}</label>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>
<script>
import { getSim } from "@/api/index.js";
export default {
  created() {
    this.getTable();
  },
  data() {
    return {
      sim_id: "",
      formData: {}
    };
  },
  props: ["vehicle"],
  methods: {
    getTable() {
      this.$set(this.$data, "sim_id", this.$props.vehicle.sim_id);
      getSim({ id: this.sim_id }).then(res => {
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