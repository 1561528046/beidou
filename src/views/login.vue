<template>
  <div class="login-form">
    <el-form status-icon :rules="rules" :model="formData" size="small" ref="baseForm">
      <el-form-item label="登陆帐号" prop="user_name">
        <el-input v-model="formData.user_name"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="pass_word">
        <el-input v-model="formData.pass_word" type="password"></el-input>
      </el-form-item>

      <el-form-item style="text-align:center; padding-top:20px;">
        <el-button type="primary" @click="formSubmit" size="large">登陆</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<style scoped lang="less">
  .login-form {
    margin: 0 auto;
    margin-top: 10%;
    width: 25%;
  }
</style>
<script>
  import { rules } from "@/utils/rules.js";
  import { loginIn } from "@/api/index.js";
  export default {
    data() {
      return {

        formData: {
          user_name: "",
          pass_word: "",

        },
        rules: {
          ...rules,
          user_name: [{ required: true, message: "用户名不能为空", trigger: "change" }],
          pass_word: [
            {
              required: true,
              min: 3,
              max: 20,
              message: "密码长度在 3 到 20 个字符",
              trigger: "change",
              validator: this.validatePassword
            }
          ]
        }
      };
    },

    methods: {
      formSubmit() {
        this.$refs.baseForm.validate((isVaildate, errorItem) => {
          if (isVaildate) {
            var postData = Object.assign({}, this.formData);
            postData.pass_word = postData.pass_word.MD5(16);
            loginIn(postData)
              .then(res => {
                if (res.data.code == 0) {
                  this.$message.success(res.data.msg);
                  localStorage.ACCOUTNtoken = res.data.token;
                } else {
                  this.$message.error(res.data.msg);
                }
              })
              .catch(() => {
                this.$message.error("接口错误");
              });
          } else {
            var errormsg = "";
            for (var key in errorItem) {
              errormsg += errorItem[key][0].message + "<br>";
            }
            this.$notify.error({
              title: '错误',
              dangerouslyUseHTMLString: true,
              message: errormsg
            });

          }
        })
      }
    }
  };
</script>