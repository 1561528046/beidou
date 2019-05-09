<template>
  <div>
    <el-form :model="formData" size="small" label-width="60px">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="名称">
            <el-input v-model="formData.pic_name" placeholder="请输入名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="描述">
            <el-input v-model="formData.pic_describe" placeholder="请输入描述"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" style="text-align:right">
          <el-form-item label-width="0">
            <el-button type="primary" @click="submitForm">提交</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { getVideoPrintscreenByID, updatePrintscreen } from "@/api/index.js";
export default {
  created() {
    this.getScreenByID();
  },
  data() {
    return {
      formData: {
        pic_name: "",
        pic_describe: ""
      }
    };
  },
  props: ["rowid"],
  methods: {
    submitForm() {
      updatePrintscreen(this.formData).then(res => {
        if (res.data.code == 0) {
          this.$emit("success");
          return this.$notify({
            message: "修改成功",
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
    },
    getScreenByID() {
      getVideoPrintscreenByID({ rowid: this.$props.rowid }).then(res => {
        if (res.data.code == 0) {
          console.log(res.data.data[0]);
          this.$set(this.$data, "formData", res.data.data[0]);
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