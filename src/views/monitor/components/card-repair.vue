<template slot-scope="scope">
  <div>
    <el-form :model="tableQuery" size="small" v-if="hasSimNo">
      <el-row :gutter="30">
        <el-col :span="5">
          <el-form-item label="故障类型：">
            <label v-if="tableQuery.fault_type=='1'">设备故障</label>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="故障原因：">
            <el-input v-model="tableQuery.reason" style="width:70%"></el-input>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="7">
                    <el-form-item label="是否录入全国平台：">
                        <el-radio v-model="tableQuery.is_enter" label="1">是</el-radio>
                        <el-radio v-model="tableQuery.is_enter" label="2">否</el-radio>
                    </el-form-item>
        </el-col>-->
        <el-col :span="3">
          <el-button @click="declare" style="float:right" type="primary" size="small">申报</el-button>
        </el-col>
      </el-row>
    </el-form>
    <div v-if="!hasSimNo">车辆没有绑定sim卡!</div>
  </div>
</template>
<script>
import { getSim, getUpdateVehicleState, getVehicle } from "@/api/index.js";
export default {
  created() {
    this.getSimInfo();
  },
  data() {
    return {
      hasSimNo: true,
      vehicleData: {},
      data: {},
      sim_id: "",
      formData: {},
      tableQuery: {
        vehicle_id: "",
        is_enter: "2",
        type: "",
        device_id: "",
        license: "",
        owner: "",
        linkman: "",
        tel: "",
        fault_type: "1",
        reason: "",
        repair_state: "1"
      }
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
      this.$set(this.$data, "data", this.$props.vehicle);
      getVehicle({ vehicle_id: this.data.vehicle_id }).then(rev => {
        if (rev.data.code == 0) {
          this.$set(this.tableQuery, "vehicle_id", rev.data.data[0].vehicle_id);
          this.$set(this.tableQuery, "type", rev.data.data[0].type);
          this.$set(this.tableQuery, "device_id", rev.data.data[0].device_id);
          this.$set(this.tableQuery, "license", rev.data.data[0].license);
          this.$set(this.tableQuery, "owner", rev.data.data[0].owner);
          this.$set(this.tableQuery, "linkman", rev.data.data[0].linkman);
          this.$set(this.tableQuery, "tel", rev.data.data[0].tel);
          this.$set(this.tableQuery, "reason", rev.data.data[0].reason);
        }
      });
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
    },
    declare() {
      getUpdateVehicleState(this.tableQuery).then(res => {
        if (res.data.code == 0) {
          return this.$notify({
            message: res.data.msg,
            title: "提示",
            type: "success"
          });
        } else {
          return this.$notify({
            message: res.data.msg,
            title: "提示",
            type: "error"
          });
        }
      });
    }
  }
};
</script>