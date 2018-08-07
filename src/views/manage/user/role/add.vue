<template>
    <el-form status-icon :rules="rules" :model="formData" size="small" ref="baseForm" class="msg-form">
        <!-- 设备信息 -->
        <el-row :gutter="30">
            <el-col :span="12">
                <el-form-item label="权限" prop="rights">
                    <el-tree :data="rights" show-checkbox node-key="id" :default-expanded-keys="[2, 3]" :default-checked-keys="[5]" :props="defaultProps">
                    </el-tree>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="角色名称" prop="device_id">
                    <el-input v-model="formData.role_name" placeholder="角色名称"></el-input>
                </el-form-item>
            </el-col>
        </el-row>
        <el-form-item style="text-align:center;">
            <el-button type="primary" @click="formSubmit" size="large">提交</el-button>
        </el-form-item>

        <!-- <button @click="$router.go(-1)">a</button> -->
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
        role_name: ""
      },
      rules: {
        ...rules
      },
      rights: [],
      defaultProps: {
        children: "children",
        label: "label"
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