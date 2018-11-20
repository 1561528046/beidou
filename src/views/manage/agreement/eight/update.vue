<template>
  <el-form status-icon :rules="rules" :model="formData" size="small" ref="baseForm" class="msg-form">
    <!-- 设备信息 -->
    <el-row :gutter="30">
      <el-col :span="24">
        <el-form-item label="平台名称" prop="title">
          <el-input v-model="formData.title"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="IP" prop="ip">
          <el-input v-model="formData.ip" maxlength="14" placeholder="IP"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="端口号" prop="port">
          <el-input v-model="formData.port" maxlength="14" placeholder="端口号"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="是否启用" prop="enable_type">
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
import { GetServerById, UpdateServer808 } from "@/api/index.js";
export default {
  data() {
    return {
      formData: {
        server_id: this.$props.server_id,
        title: "",
        ip: "",
        port: "",
        enable_type: true,
        enable: 1
      },
      rules: {
        title: [{ required: true, trigger: "blur", message: "请输入平台名称" }],
        ip: [
          {
            required: true,
            trigger: "blur",
            validator: this.validateIp
          }
        ],
        port: [
          {
            required: true,
            trigger: "blur",
            validator: this.validateDuankou
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
    // IP验证
    validateIp(rule, value, callback) {
      var exp = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
      var reg = value.match(exp);
      if (reg == null) {
        callback(new Error("IP地址不合法!"));
        return false;
      } else {
        callback();
      }
    },
    // 端口号验证
    validateDuankou(rule, value, callback) {
      var parten = /^(\d)+$/g;
      if (
        parten.test(value) &&
        parseInt(value) <= 65535 &&
        parseInt(value) >= 0
      ) {
        callback();
      } else {
        callback(new Error("端口错误!"));
        return false;
      }
    },
    // 编辑
    formSubmit() {
      if (this.formData.enable_type) {
        this.formData.enable = 1;
      } else {
        this.formData.enable = 2;
      }
      this.$refs.baseForm.validate((isVaildate, errorItem) => {
        if (isVaildate) {
          var postData = Object.assign({}, this.formData);
          UpdateServer808(postData)
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
    // 获取单条数据
    getTable() {
      GetServerById({ server_id: this.formData.server_id, flag: 808 }).then(
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