<template>
  <div style="text-align: center;  background-color:#fff;">
    <el-form status-icon :rules="rules" :model="formData " ref="baseForm">
      <!-- <el-row :gutter="30">
      </el-row>-->
      <el-form-item label="产品名称" prop="title">
        <el-input placeholder="请输入" v-model="formData.title"></el-input>
      </el-form-item>
      <el-form-item style="text-align:center;">
        <template slot-scope="scope">
          <el-button @click="formSubmit" size="large">提交</el-button>
        </template>
      </el-form-item>
    </el-form>
  </div>
</template>
<style>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
input[type="number"] {
  -moz-appearance: textfield;
}
.error .el-form-item__content .el-input .el-input__inner {
  border-color: #f56c6c;
}
</style>
<script>
import { addProducts, getUserPackage } from "@/api/index.js";
import { rules } from "@/utils/rules.js";
export default {
  data() {
    return {
      formData: {
        userid: "",
        title: ""
      },
      msg: "",
      rules: {
        ...rules,
        title: [
          { required: true, trigger: "change", message: "必须添加产品名称" }
        ]
      }
    };
  },
  created() {
    this.$set(this.formData, "userid", this.$props.user.user_id);
  },
  props: {
    user: Object
  },
  methods: {
    //添加产品
    formSubmit() {
      this.$refs.baseForm.validate(isVaildate => {
        this.$nextTick(() => {
          if (isVaildate) {
            var postData = JSON.parse(JSON.stringify(this.formData));
            addProducts(postData)
              .then(res => {
                if (res.data.code == 0) {
                  getUserPackage({ userid: this.formData.userid }).then(res => {
                    if (res.data.code == 0) {
                      this.$router.push({
                        name: "product_update",
                        params: { id: res.data.data[0].package_id }
                      });
                    }
                  });
                } else {
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
          }
        });
      });
    }
  }
};
</script>
