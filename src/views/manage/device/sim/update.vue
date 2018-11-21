<template>
  <div class="post-form" style="width: 500px;">
    <el-form label-position="top" status-icon :rules="rules" :model="formData" size="small" ref="baseForm">
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item prop="sim_no" label="SIM卡号">
            <el-input v-model="formData.sim_no" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="icc_id" label="ICCID">
            <el-input v-model="formData.icc_id" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="belong" label="所属运营商">
            <el-input v-model="formData.belong" placeholder="填写运营商" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="note" label="备注">
            <el-input v-model="formData.note"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="flow" label="流量">
            <el-input v-model="formData.flow"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item style="text-align:center;">
        <el-button type="primary" @click="formSubmit" size="large">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { rules } from "@/utils/rules.js";
import { updateSim, getSim } from "@/api/index.js";
import userSelect from "@/components/select-user.vue";
export default {
  data() {
    return {
      belongSelect: ["中国移动", "中国联通", "中国电信", "其他"],
      belong: "",
      formData: {
        sim_no: this.$props.sim_no,
        icc_id: "",
        belong: "",
        user_id: "",
        note: "",
        flow: ""
      },
      rules: {
        ...rules
      }
    };
  },
  props: {
    sim_no: String
  },
  created() {
    getSim({ id: this.formData.sim_no }).then(res => {
      if (res.data.code == 0 && res.data.data.length) {
        var mixinData = Object.assign({}, this.formData, res.data.data[0]);
        if (this.belongSelect.indexOf(mixinData.belong) == -1) {
          this.belong = "其他";
          var tempBelong = mixinData.belong;
          this.$nextTick(() => {
            this.$set(this.formData, "belong", tempBelong);
          });
        } else {
          this.belong = mixinData.belong;
        }
        this.$set(this.$data, "formData", mixinData);
      }
    });
  },
  watch: {
    belong: function() {
      if (this.belong == "其他") {
        this.formData.belong = "";
      } else {
        this.formData.belong = this.belong;
      }
    }
  },
  methods: {
    formSubmit() {
      this.$refs.baseForm.validate((isVaildate, errorItem) => {
        if (isVaildate) {
          var postData = Object.assign({}, this.formData);
          postData.id = postData.sim_no;
          updateSim(postData)
            .then(res => {
              if (res.data.code == 0) {
                this.$emit("success");
                this.$notify.success({
                  title: "成功",
                  message: res.data.msg
                });
              } else {
                this.$emit("error");
                this.$notify.error({
                  title: "错误",
                  message: res.data.msg
                });
              }
            })
            .catch(() => {
              this.$notify.error({
                title: "错误",
                message: "接口错误"
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
  components: { userSelect }
};
</script>
<style>
</style>