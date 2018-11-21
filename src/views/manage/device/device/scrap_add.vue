<template>
  <el-form status-icon :rules="rules" :model="formData" size="small" ref="baseForm" class="msg-form">
    <!-- 设备信息 -->
    <el-row :gutter="30">
      <el-col :span="24">
        <el-form-item prop="remark" label="报废原因">
          <el-input v-model="formData.remark"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item style="text-align:center;">
      <el-button type="primary " size="large " @click="formSubmit">提交</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { rules } from "@/utils/rules.js";
import { updateDeviceRepair } from "@/api/index.js";
import selectDevice from "@/components/select-device.vue";
export default {
  data() {
    return {
      formData: {
        remark: "",
        device_id: this.$props.device_id,
        back_time: "",
        logistics: "",
        last_logistics_no: "",
        operate_type: "5"
      },
      rules: {
        ...rules,
        remark: [
          { required: true, message: "请填写报废原因", trigger: "change" },
          { min: 2, message: "请输入不少于2个字符", trigger: "change" },
          {
            pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/,
            message: "不允许输入空格等特殊符号"
          }
        ]
      }
    };
  },
  props: {
    device_id: String
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {
    formSubmit() {
      this.$refs.baseForm.validate((isVaildate, errorItem) => {
        if (isVaildate) {
          var postData = Object.assign({}, this.formData);
          updateDeviceRepair(postData)
            .then(res => {
              if (res.data.code == 0) {
                this.$emit("success");
                this.$notify({
                  title: "成功",
                  message: res.data.msg,
                  type: "success"
                });
              } else {
                this.$emit("error");
                this.$notify({
                  title: "失败",
                  message: res.data.msg,
                  type: "error"
                });
              }
            })
            .catch(() => {
              this.$message.error("接口错误 ");
              this.$emit("error ");
            });
        } else {
          var errormsg = " ";
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
  components: { selectDevice }
};
</script>
<style>
</style>