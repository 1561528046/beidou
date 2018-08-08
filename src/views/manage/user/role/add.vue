<template>
<<<<<<< HEAD
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
=======
    <div class="post-form">
        <el-form label-position="top" status-icon :rules="rules" :model="formData" size="small" ref="baseForm" class="msg-form">
            <el-row :gutter="30">
                <el-col :span="12">
                    <el-form-item label="登陆帐号" prop="user_name">
                        <el-input v-model="formData.user_name"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="所属角色" prop="role_id">
                        <el-select v-model="formData.role_id" placeholder="选择所属角色" style="width:100%;">
                            <el-option label="代理" value="1"></el-option>
                            <el-option label="监控员" value="2"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="密码" prop="pass_word">
                        <el-input v-model="formData.pass_word" type="password"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="确认密码" prop="re_pass_word">
                        <el-input v-model="formData.re_pass_word" type="password"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item label="公司/个人名称" prop="real_name">
                        <el-input v-model="formData.real_name" maxlength="255"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="所属地区">
                        <select-city v-model="formData.area" style="width:100%;"></select-city>
                    </el-form-item>
                </el-col>
                <el-col :span="12" v-if="user_type==2">
                    <el-form-item label="所属行业" prop="industry">
                        <!-- <el-input v-model="formData.industry" maxlength="255"></el-input> -->
                        <select-industry v-model="formData.industry" style="width:100%;"></select-industry>
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
                    <el-form-item label="地址" prop="address">
                        <el-input v-model="formData.address"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="授权终端数量">
                        <el-switch v-model="device_total_turn"> </el-switch>
                    </el-form-item>
                    <el-form-item label="" prop="device_total" v-if="device_total_turn" style="width:150px;">
                        <el-input-number :min="1" :precision="0" :step="1" type="number" v-model="formData.device_total" style="width:100%">
                            <template slot="append">台</template>
                        </el-input-number>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="帐号到期时间">
                        <el-switch v-model="expiry_time_turn"> </el-switch>
                    </el-form-item>
                    <el-form-item label="" prop="expiry_time" v-if="expiry_time_turn" style="width:350px;">
                        <el-date-picker v-model="formData.expiry_time" type="date" placeholder="选择日期" format="yyyy 年 MM 月 dd 日" value-format="yyyyMMdd" style="width:100%;">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-form-item style="text-align:center; padding-top:20px;">
                <el-button type="primary" @click="formSubmit" size="large">提交</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import { rules } from "@/utils/rules.js";
import selectCity from "@/components/select-city.vue";
import { addUser, existUserName } from "@/api/index.js";
import selectIndustry from "@/components/select-industry.vue";
export default {
  data() {
    return {
      device_total_turn: false,
      expiry_time_turn: false,
      formData: {
        area: [],
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
        expiry_time: ""
      },
      rules: {
        ...rules,
        role_id: [
          { required: true, message: "必须选择角色", trigger: "change" }
        ],
        real_name: [
          {
            required: true,
            message: "必须填写公司/个人名称",
            trigger: "change"
          }
        ],
        user_name: [
          { trigger: "blur", validator: this.validateUserName },
          { required: true, message: "请输入用户名", trigger: "change" },
          {
            min: 3,
            max: 20,
            message: "长度在 3 到 20 个字符",
            trigger: "change"
          }
        ],
        re_pass_word: [
          {
            trigger: "blur",
            component: this,
            validator: this.validatePassword2
          },
          { required: true, message: "两次密码不一样", trigger: "blur" }
        ],
        pass_word: [
          {
            required: true,
            min: 3,
            max: 20,
            message: "长度在 3 到 20 个字符",
            trigger: "change",
            validator: this.validatePassword
          }
        ]
>>>>>>> 20bc04012bcc5b6d0d960b17a69d7a2724ff68ed
      }
    };
  },
  watch: {
<<<<<<< HEAD
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
=======
    device_total_turn: function() {
      this.formData.device_total = "";
    },
    expiry_time_turn: function() {
      this.formData.expiry_time = "";
    }
  },
  props: ["user_type"], //来自router的user_type 根据user_type 区分公司和个人
  created() {},
  methods: {
    validateUserName(rule, value, callback) {
      if (value == "") {
        callback(new Error("请输入登陆帐号！"));
        return false;
      }
      existUserName({ user_name: value })
        .then(res => {
          if (res.data.code == 1) {
            callback(new Error("登陆帐号重复！"));
>>>>>>> 20bc04012bcc5b6d0d960b17a69d7a2724ff68ed
          } else {
            callback();
          }
        })
        .catch(() => {
          callback(new Error("服务器重复验证失效，请稍候再试"));
        });
    },
<<<<<<< HEAD
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
=======
    validatePassword(rule, value, callback) {
      if (this.formData.pass_word) {
        if (this.formData.re_pass_word != "") {
          this.$refs.baseForm.validateField("re_pass_word");
        }
        callback();
      } else {
        callback(new Error("请输入密码"));
      }
    },
    validatePassword2(rule, value, callback) {
      if (this.formData.pass_word === this.formData.re_pass_word) {
        callback();
      } else {
        callback(new Error("两次密码不一样"));
      }
>>>>>>> 20bc04012bcc5b6d0d960b17a69d7a2724ff68ed
    },
    formSubmit() {
      this.$refs.baseForm.validate((isVaildate, errorItem) => {
        if (isVaildate) {
<<<<<<< HEAD
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
=======
          var areaObj = this.$utils.formatArea(this.formData.area);
          var postData = Object.assign({}, this.formData, areaObj);
          postData.device_total = postData.device_total || 0;
          postData.expiry_time = postData.expiry_time || 0;
          postData.user_type = this.user_type;
          postData.pass_word = postData.pass_word.MD5(16);
          delete postData.re_pass_word;
          addUser(postData)
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
                  title: "失败",
                  message: res.data.msg
>>>>>>> 20bc04012bcc5b6d0d960b17a69d7a2724ff68ed
                });
              }
            })
            .catch(() => {
<<<<<<< HEAD
              this.$alert("接口错误", "提示", {
                type: "error"
=======
              this.$notify.error({
                title: "失败",
                message: "接口错误"
>>>>>>> 20bc04012bcc5b6d0d960b17a69d7a2724ff68ed
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
<<<<<<< HEAD
  components: { companySelect }
};
</script>
<style>
=======
  components: { selectCity, selectIndustry }
};
</script>
>>>>>>> 20bc04012bcc5b6d0d960b17a69d7a2724ff68ed
