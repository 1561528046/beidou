<template slot-scope="scope">
    <div>
        <el-form :model="formData" size="small" v-if="hasSimNo">
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
        <div v-if="!hasSimNo">
            车辆没有绑定sim卡!
        </div>
    </div>
</template>
<script>
import { getSim } from "@/api/index.js";
export default {
  created() {
    this.getSimInfo();
  },
  data() {
    return {
      hasSimNo: true,
      sim_id: "",
      formData: {}
    };
  },
  watch: {
    "$props.vehicle.info.sim_no": function() {
      this.getSimInfo();
    }
  },
  props: ["vehicle"],
  methods: {
    getSimInfo() {
      this.$set(this.$data, "sim_id", this.$props.vehicle.sim_id);
      if (this.$props.vehicle.info && this.$props.vehicle.info.sim_no) {
        this.hasSimNo = true;
        getSim({ id: this.$props.vehicle.info.sim_no }).then(res => {
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
      } else {
        this.hasSimNo = false;
      }
    }
  }
};
</script>