<template>
  <el-form status-icon :rules="rules" :model="formData" size="small" ref="baseForm" class="msg-form">
    <!-- 设备信息 -->
    <el-row :gutter="30">
      <el-col :span="12">
        <el-form-item label="标注" prop="device_no">
          <el-input></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="远程IP" prop="sim_id">
          <el-input></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="远程端口号" prop="company_id">
          <el-input></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="用户ID" prop="protocol_type">
          <el-input></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="密码" prop="protocol_type">
          <el-input></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="接入码" prop="protocol_type">
          <el-input></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="本地端口号" prop="protocol_type">
          <el-input></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="M1" prop="protocol_type">
          <el-input></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="IA1" prop="protocol_type">
          <el-input></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="IC1" prop="protocol_type">
          <el-input></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="Keys" prop="protocol_type">
          <el-input></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="是否加密" prop="protocol_type">
          <el-checkbox size="medium"></el-checkbox>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="是否启用" prop="protocol_type">
          <el-checkbox size="medium"></el-checkbox>
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
import { addDevice, existDeviceId, existDeviceSimId } from "@/api/index.js";
import companySelect from "@/components/select-company.vue";
export default {
  data() {
    return {
      formData: {
        area: [],
        device_type: "",
        device_no: "",
        company_id: "",
        sim_id: "",
        protocol_type: "",
        install_date: "",
        camera_num: "",
        save_media: "",
        state: "",
        time: ""
      },
      rules: {
        ...rules,
        device_type: [
          { required: true, trigger: "change", message: "必须选择终端类型" }
        ],
        company_id: [
          { required: true, trigger: "change", message: "必须选择终端厂商" }
        ],
        device_no: [
          {
            required: true,
            trigger: "blur",
            validator: this.validateDeviceId
          },
          {
            pattern: /^[0-9a-zA_Z]+$/,
            message: "只能输入字母和数字！"
          }
        ],
        sim_id: [{ trigger: "blur", validator: this.validateDeviceSimId }]
      }
    };
  },
  watch: {
    "formData.device_type": function() {
      this.formData.protocol_type = this.formData.device_type;
    }
  },
  created() {},
  methods: {
    validateDeviceId(rule, value, callback) {
      if (value == "") {
        callback(new Error("请输入设备ID！"));
        return false;
      }
      existDeviceId({ device_id: value })
        .then(res => {
          if (res.data.code == 1) {
            callback(new Error("设备ID重复！"));
          } else {
            callback();
          }
        })
        .catch(() => {
          callback(new Error("服务器重复验证失效，请稍候再试"));
        });
    },
    validateDeviceSimId(rule, value, callback) {
      if (value == "") {
        callback();
        return false;
      }
      existDeviceSimId({ sim_id: value })
        .then(res => {
          if (res.data.code == 1) {
            callback(new Error("SIMID重复！"));
          } else {
            callback();
          }
        })
        .catch(() => {
          callback(new Error("服务器重复验证失效，请稍候再试"));
        });
    },
    formSubmit() {
      this.$refs.baseForm.validate((isVaildate, errorItem) => {
        if (isVaildate) {
          var postData = Object.assign({}, this.formData);
          addDevice(postData)
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
    }
  },
  components: { companySelect }
};
</script>
<style>
</style>