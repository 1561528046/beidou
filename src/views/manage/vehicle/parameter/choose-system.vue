<template>
  <div>
    <el-form label-width="200px" size="small">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="一级报警连续时间限制（分钟）">
            <el-input v-model="time"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="一级报警连续时间内数量限制（分钟）">
            <el-input v-model="count"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item>
            <el-button type="primary" @click="setSystem">设置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { UpdateConfig, GetConfigList } from "@/api/index.js";
export default {
  created() {
    GetConfigList(this.formData).then(res => {
      if (res.data.code == 0) {
        this.$set(this.$data, "count", res.data.data[0].c_value);
        this.$set(this.$data, "time", res.data.data[1].c_value);
      } else {
        return this.$notify({
          message: res.data.msg,
          title: "提示",
          type: "error"
        });
      }
    });
  },
  data() {
    return {
      time: "",
      count: "",
      formData: {
        c_keys: "lev1_time,lev1_count",
        c_values: ""
      }
    };
  },
  methods: {
    setSystem() {
      this.formData.c_values = this.time + "," + this.count;
      UpdateConfig(this.formData).then(res => {
        if (res.data.code == 0) {
          return this.$notify({
            message: "设置成功",
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