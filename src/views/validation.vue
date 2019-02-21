<template>
  <div class="login-form">
    <el-form v-if="!type">
      <el-row :gutter="20">
        <el-col :span="2">
          <el-form-item>
            <div style="display:inline-block;width:100%;height:100%" @click="replaceCode">
              <img :src="url" style="width:100%;height:100%;margin-left:10px" alt>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-form-item>
            <el-input size="small" v-model="code" placeholder="请输入验证码"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-form-item>
            <el-button @click="formSubmit" size="small">提交</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span v-if="type">无消息内容</span>
    <router-link :to="{name:'login'}">
      <el-button
        style="position:absolute;top:3px;right:31px;"
        size="small"
        icon="el-icon-arrow-left"
      >
        <span>返回</span>
      </el-button>
    </router-link>
  </div>
</template>
<script>
import { GetLoginCount, SubmitCode } from "@/api/index.js";
export default {
  created() {
    this.getLoginCount();
  },
  data() {
    return {
      type: false,
      code: "",
      url: ""
    };
  },
  methods: {
    replaceCode() {
      this.getVerifyCodeImg();
    },
    getLoginCount() {
      GetLoginCount().then(res => {
        if (res.data.code == 0) {
          this.type = true;
        } else if (res.data.code == 1) {
          this.type = false;
          this.$set(this.$data, "url", "");
          this.$set(this.$data, "code", "");
          this.getVerifyCodeImg();
        }
      });
    },
    getVerifyCodeImg() {
      var num = Math.random()
        .toString(36)
        .substr(2, 15);
      var url = this.$dict.BASE_URL + `api/gghypt/GetVerifyCodeImg` + "?" + num;
      this.$set(this.$data, "url", url);
    },
    formSubmit() {
      if (this.code == "") {
        return this.$notify({
          message: "请输入验证码",
          title: "提示",
          type: "error"
        });
      }
      SubmitCode({ code: this.code }).then(res => {
        if (res.data.result) {
          this.getLoginCount();
          return this.$notify({
            message: "提交成功",
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
    }
  }
};
</script>