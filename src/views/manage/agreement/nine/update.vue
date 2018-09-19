<template>
  <el-form status-icon :rules="rules" :model="formData" size="small" ref="baseForm" class="msg-form">
    <!-- 设备信息 -->
    <el-row :gutter="30">
      <el-col :span="12">
        <el-form-item label="平台名称" prop="title">
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
import { GetServerById, UpdateServer809 } from "@/api/index.js";
export default {
  data() {
    return {
      formData: {
        server_id: this.$props.server_id,
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
        title: [{ required: true, trigger: "blur", message: "请输入平台名称" }],
        remote_ip: [
          {
            required: true,
            trigger: "blur",
            validator: this.validateIp
          }
        ],
        remote_port: [
          {
            required: true,
            trigger: "blur",
            validator: this.validateDuankou
          }
        ],
        local_port: [
          {
            required: true,
            trigger: "blur",
            validator: this.validateLocalDuankou
          }
        ]
      },
      tableData: {
        data: []
      }
    };
  },
  watch: {},
  props: {
    server_id: String
  },
  created() {
    this.getTable();
  },
  methods: {
    validateIp(rule, value, callback) {
      var exp = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
      var reg = value.match(exp);
      if (reg == null) {
        callback(new Error("远程IP地址不合法!"));
        return false;
      } else {
        callback();
      }
    },
    validateDuankou(rule, value, callback) {
      var parten = /^(\d)+$/g;
      if (
        parten.test(value) &&
        parseInt(value) <= 65535 &&
        parseInt(value) >= 0
      ) {
        callback();
      } else {
        callback(new Error("远程端口号错误!"));
        return false;
      }
    },
    validateLocalDuankou(rule, value, callback) {
      var parten = /^(\d)+$/g;
      if (
        parten.test(value) &&
        parseInt(value) <= 65535 &&
        parseInt(value) >= 0
      ) {
        callback();
      } else {
        callback(new Error("本地端口号错误!"));
        return false;
      }
    },
    formSubmit() {
      if (this.formData.enable_type) {
        this.formData.enable = 1;
      } else {
        this.formData.enable = 2;
      }
      if (this.formData.is_encryption_type) {
        this.formData.is_encryption = 1;
      } else {
        this.formData.is_encryption = 2;
      }
      this.$refs.baseForm.validate((isVaildate, errorItem) => {
        if (isVaildate) {
          var postData = Object.assign({}, this.formData);
          UpdateServer809(postData)
            .then(res => {
              if (res.data.code == 0) {
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
    },
    getTable() {
      GetServerById({ server_id: this.formData.server_id, flag: 809 }).then(
        res => {
          if (res.data.code == 0) {
            var mixinData = Object.assign({}, this.formData, res.data.data[0]);
            this.$set(this.$data, "formData", mixinData);
          } else {
            this.$message.error(res.data.msg);
          }
        }
      );
    }
  },
  components: {}
};
</script>
<style>
</style>