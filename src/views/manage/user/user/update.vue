<template>
  <div class="post-form">
    <el-form
      label-position="top"
      :rules="rules"
      :model="formData"
      size="small"
      ref="baseForm"
      class="msg-form"
      @submit.native.prevent
    >
      <el-collapse v-model="opened" class="user-collapse">
        <el-collapse-item title="帐号登录信息" name="1">
          <template slot="title">
            <div class="user-form-header">帐号登录信息</div>
          </template>
          <div class="user-form-body">
            <el-row :gutter="30">
              <el-col :span="6">
                <el-form-item label="登陆帐号" prop="user_name">{{formData.user_name||"--"}}</el-form-item>
              </el-col>
              <!-- <el-col :span="6">
                <el-form-item label="所属用户" prop="parent_id">{{formData.parent_real_name||"--"}}</el-form-item>
              </el-col>-->
              <!-- <el-col :span="6">
                <el-form-item
                  label="所属分组"
                  prop="group_id"
                  v-if="formData.parent_id"
                >{{formData.group_name||"--"}}</el-form-item>
              </el-col>-->
              <el-col :span="6">
                <el-form-item label="所属角色" prop="role_id">{{formData.role_name||"--"}}</el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="用户类型" prop="user_type">
                  <label v-if="formData.user_type=='1'">企业用户</label>
                  <label v-if="formData.user_type=='2'">终端用户</label>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="30">
              <el-col :span="12">
                <el-form-item label="密码" prop="pass_word">
                  <el-input v-model="formData.pass_word" type="password" placeholder="******"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="确认密码" prop="re_pass_word">
                  <el-input v-model="formData.re_pass_word" type="password" placeholder="******"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-collapse-item>
        <el-collapse-item title="企业信息" name="2">
          <template slot="title">
            <div class="user-form-header">企业信息</div>
          </template>
          <div class="user-form-body">
            <el-row :gutter="30">
              <el-col :span="12">
                <el-form-item label="企业名称" prop="real_name">
                  <el-input v-model="formData.real_name" maxlength="255"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="所属地区">
                  <select-city v-model="formData.area" style="width:100%;" :clearable="true"></select-city>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="所属行业" prop="industry">
                  <select-industry v-model="formData.industry" style="width:100%;"></select-industry>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="法人姓名" prop="corporation">
                  <el-input v-model="formData.corporation" maxlength="30"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="营业执照号" prop="business_no">
                  <el-input v-model="formData.business_no" maxlength="50"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="企业地址" prop="address">
                  <el-input v-model="formData.address"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="联系人" prop="linkman">
                  <el-input v-model="formData.linkman" maxlength="20"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="联系电话" prop="tel">
                  <el-input v-model="formData.tel" maxlength="20"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="道路运输许可证" prop="tel">
                  <el-input v-model="formData.user_transport_license" maxlength="20"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="核发机关" prop="tel">
                  <el-input v-model="formData.user_issue_office" maxlength="20"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-collapse-item>
        <el-collapse-item name="3">
          <template slot="title">
            <div class="user-form-header">帐号授权信息</div>
          </template>
          <div class="user-form-body">
            <el-row :gutter="30">
              <el-col :span="24">
                <el-form-item label="授权终端数量">
                  <el-switch v-model="device_total_turn"></el-switch>
                </el-form-item>
                <el-form-item
                  label
                  prop="device_total"
                  v-if="device_total_turn"
                  style="width:150px;"
                >
                  <el-input-number
                    :min="1"
                    :precision="0"
                    :step="1"
                    type="number"
                    v-model="formData.device_total"
                    style="width:100%"
                  >
                    <template slot="append">台</template>
                  </el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="帐号到期时间">
                  <el-switch v-model="expiry_time_turn"></el-switch>
                </el-form-item>
                <el-form-item label prop="expiry_time" v-if="expiry_time_turn" style="width:350px;">
                  <el-date-picker
                    v-model="formData.expiry_time"
                    type="date"
                    placeholder="选择日期"
                    format="yyyy 年 MM 月 dd 日"
                    value-format="yyyyMMdd"
                    style="width:100%;"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-collapse-item>
      </el-collapse>

      <el-form-item style="text-align:center; padding-top:20px;">
        <el-button
          type="primary"
          @click="formSubmit"
          native-type="submit"
          size="large"
          :loading="postloading"
        >提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import selectCity from "@/components/select-city.vue";
import { updateUser, getUser } from "@/api/index.js";
import selectIndustry from "@/components/select-industry.vue";
export default {
  components: {
    selectCity,
    selectIndustry
  },
  data() {
    return {
      isInit: false,
      postloading: false,
      opened: ["1", "2", "3"],
      device_total_turn: false,
      expiry_time_turn: false,
      formData: {
        area: [],
        user_transport_license: "",
        user_issue_office: "",
        user_name: "",
        pass_word: "",
        re_pass_word: "",
        province_id: "",
        city_id: "",
        county_id: "",
        real_name: "",
        industry: "",
        linkman: "",
        tel: "",
        address: "",
        device_num: "",
        device_total: "",
        role_id: "",
        expiry_time: "",
        group_id: "",
        parent_id: "",
        corporation: "",
        business_no: ""
      },
      rules: {
        industry: [
          { required: true, message: "请选择所属行业", trigger: "change" }
        ],
        real_name: [
          {
            required: true,
            message: "必须填写企业名称",
            trigger: "change"
          }
        ],
        pass_word: [
          {
            trigger: "blur",
            validator: this.validatePassword
          }
        ],
        re_pass_word: [
          {
            trigger: "blur",
            component: this,
            validator: this.validatePassword2
          }
        ]
      }
    };
  },
  watch: {
    device_total_turn: function(value) {
      if (!value) {
        this.formData.device_total = "";
      }
    },
    expiry_time_turn: function(value) {
      if (!value && this.isInit) {
        this.formData.expiry_time = "";
      }
    }
  },
  props: ["user_id"],
  created() {
    this.formData.user_id = this.user_id;
    getUser({ user_id: this.formData.user_id }).then(res => {
      if (res.data.code == 0 && res.data.data.length) {
        var mixinData = Object.assign({}, this.formData, res.data.data[0]);
        mixinData.re_pass_word = mixinData.pass_word = "";
        mixinData.area = [];
        if (mixinData.province_id) {
          mixinData.area.push(mixinData.province_id);
        }
        if (mixinData.city_id) {
          mixinData.area.push(mixinData.city_id);
        }
        if (mixinData.county_id) {
          mixinData.area.push(mixinData.county_id);
        }
        if (mixinData.device_total) {
          this.device_total_turn = true;
        }
        mixinData.expiry_time =
          mixinData.expiry_time == "0" ? "" : mixinData.expiry_time;
        if (mixinData.expiry_time) {
          mixinData.expiry_time = this.$utils.formatDate(mixinData.expiry_time);
          this.expiry_time_turn = true;
        }

        this.$set(this.$data, "formData", mixinData);
        this.$nextTick(() => {
          this.isInit = true;
        });
      }
    });
  },
  methods: {
    validatePassword(rule, value, callback) {
      if (value.length) {
        if (value.length < 3 || value.length > 20) {
          callback(new Error("长度在 3 到 20 个字符"));
          return false;
        }
        if (this.formData.re_pass_word != "") {
          this.$refs.baseForm.validateField("re_pass_word");
        }
      }
      callback();
    },
    validatePassword2(rule, value, callback) {
      if (!value.length) {
        callback();
        return false;
      }
      if (value.length < 3 || value.length > 20) {
        callback(new Error("长度在 3 到 20 个字符"));
        return false;
      }
      if (this.formData.pass_word === this.formData.re_pass_word) {
        callback();
      } else {
        callback(new Error("两次密码不一样"));
      }
    },
    formSubmit() {
      this.postloading = true;
      this.$refs.baseForm.validate((isVaildate, errorItem) => {
        if (isVaildate) {
          var areaObj = this.$utils.formatArea(this.formData.area);
          var postData = Object.assign({}, this.formData, areaObj);
          postData.device_total = postData.device_total || "";
          postData.expiry_time = postData.expiry_time || "";
          postData.expiry_time = postData.expiry_time.replace(/-/g, "");
          if (postData.pass_word != "") {
            postData.pass_word = postData.pass_word.MD5(16);
          } else {
            postData.pass_word == "";
          }
          delete postData.re_pass_word;
          updateUser(postData)
            .then(res => {
              this.postloading = false;
              if (res.data.code == 0) {
                this.$emit("success");
                this.$notify.success({
                  title: "成功",
                  message: res.data.msg
                });
              } else {
                this.$emit("error");
                this.$notify.error({
                  title: "失败",
                  message: res.data.msg
                });
              }
            })
            .catch(() => {
              this.postloading = false;
              this.$notify.error({
                title: "失败",
                message: "接口错误"
              });
              this.$emit("error");
            });
        } else {
          this.postloading = false;
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
  }
};
</script>