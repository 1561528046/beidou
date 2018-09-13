<template>
  <el-form status-icon :rules="rules" :model="formData" size="small" ref="baseForm" class="msg-form">
    <!-- 设备信息 -->
    <el-row :gutter="30">
      <el-col :span="12">
        <el-form-item label="标注" prop="title">
          <el-input v-model="formData.title"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="远程IP" prop="remote_ip">
          <el-input v-model="formData.remote_ip"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="远程端口号" prop="remote_port">
          <el-input v-model="formData.remote_port"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="用户ID" prop="user_name">
          <el-input v-model="formData.user_name"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="密码" prop="password">
          <el-input v-model="formData.password"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="接入码" prop="access_code">
          <el-input v-model="formData.access_code"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="本地端口号" prop="local_port">
          <el-input v-model="formData.local_port"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="M1" prop="M1">
          <el-input v-model="formData.M1"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="IA1" prop="IA1">
          <el-input v-model="formData.IA1"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="IC1" prop="IC1">
          <el-input v-model="formData.IC1"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="Keys" prop="keys">
          <el-input v-model="formData.key_value"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="是否加密" prop="is_encryption_type">
          <el-checkbox v-model="formData.is_encryption_type" size="medium"></el-checkbox>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="是否启用" prop="protocol_type">
          <el-checkbox v-model="formData.enable_type" size="medium"></el-checkbox>
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item style="text-align:center;">
      <el-button type="primary" @click="formSubmit" size="large">提交</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { rules } from "@/utils/rules.js";
import { AddServer809 } from "@/api/index.js";
export default {
  data() {
    return {
      formData: {
        title: "",
        remote_ip: "",
        remote_port: "",
        user_name: "",
        password: "",
        access_code: "",
        local_port: "",
        M1: "",
        IA1: "",
        IC1: "",
        key_value: "",
        is_encryption_type: false,
        is_encryption: 2,
        enable_type: true,
        enable: 1
      },
      rules: {
        ...rules
      }
    };
  },
  watch: {},
  created() {},
  methods: {
    formSubmit() {
      if (this.formData.enable_type) {
        this.formData.enable = 1;
      } else {
        this.formData.enable = 2;
      }
      this.$refs.baseForm.validate((isVaildate, errorItem) => {
        if (isVaildate) {
          var postData = Object.assign({}, this.formData);
          AddServer809(postData)
            .then(res => {
              if (res.data.code == 0) {
                this.formData.title = "";
                this.formData.remote_ip = "";
                this.formData.remote_port = "";
                this.formData.user_name = "";
                this.formData.password = "";
                this.formData.access_code = "";
                this.formData.local_port = "";
                this.formData.M1 = "";
                this.formData.IA1 = "";
                this.formData.IC1 = "";
                this.formData.keys = "";
                this.formData.M1 = "";
                this.formData.is_encryption_type = false;
                this.formData.is_encryption = 2;
                this.formData.enable_type = true;
                this.formData.enable = 1;
                this.$emit("success");
                this.$notify({
                  message: res.data.msg,
                  title: "提示",
                  type: "success"
                });
              } else {
                this.$emit("error");
                this.$notify({
                  message: res.data.msg,
                  title: "提示",
                  type: "error"
                });
              }
            })
            .catch(() => {
              this.$alert("接口错误", "提示", {
                type: "error"
              });
              this.$emit("error");
            });
        } else {
          var errormsg = "";
          for (var key in errorItem) {
            errormsg += errorItem[key][0].message + "<br>";
          }
          this.$notify.error({
            title: "错误",
            dangerouslyUseHTMLString: true,
            message: errormsg
          });
        }
      });
    }
  },
  components: {}
};
</script>
<style>
</style>