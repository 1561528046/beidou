<template>
  <div style="padding:20px 200px;">
    <el-form label-position="left" label-width="82px">
      <el-row>
        <el-col :span="18">
          <el-form-item label="时间：">
            <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" size="small" style="width:100%;" v-model="time" type="datetime" placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="18">
          <el-button style="display:block;margin:0 auto;" @click="setting" size="small" type="primary">设置</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      time: "",
      vehicleData: [],
      set_type: ""
    };
  },
  created() {
    this.$instruction.on("x8701", evs => {
      var data = JSON.parse(evs.data);
      this.$emit("message", data);
    });
  },
  beforeDestroy() {
    this.$instruction.off("x8701");
  },
  watch: {},
  props: ["vehicle", "type"],
  methods: {
    setting() {
      this.$set(this.$data, "vehicleData", this.$props.vehicle);
      this.$set(this.$data, "set_type", this.$props.type);
      var data = {};
      var sim_id = "";
      var type = parseInt(this.set_type, 16);
      if (this.set_type == "83H") {
        this.vehicleData.map(item => {
          if (item.sim_id.length == 11) {
            sim_id = "0" + item.sim_id;
          } else {
            sim_id = item.sim_id;
          }
          data = {
            SimID: sim_id,
            MessageID: "x8701",
            CommandWord: type,
            InstallDate: this.time
          };
          data = JSON.stringify(data);
          this.$instruction.send(data);
        });
      }
    }
  }
};
</script>