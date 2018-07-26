<template>
  <div class="post-form">
    <el-form label-width="200px" status-icon :rules="rules" :model="formData" size="small" ref="baseForm">
      <el-card shadow="hover">
        <div slot="header" class="clearfix">
          <span>添加用户 </span>
        </div>
        <el-form-item label="用户帐号" prop="user_name">
          <el-input v-model="formData.user_name"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pass_word">
          <el-input v-model="formData.pass_word" type="password"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="re_pass_word">
          <el-input v-model="formData.re_pass_word" type="password"></el-input>
        </el-form-item>
        <el-form-item label="所属角色" prop="role_id">
          <el-select v-model="formData.role_id" placeholder="选择所属角色" style="width:100%;">
            <el-option label="代理" value="1"></el-option>
            <el-option label="监控员" value="2"></el-option>
          </el-select>
        </el-form-item>
        <template v-if="user_type==2">
          <el-form-item label="公司名称" prop="company">
            <el-input v-model="formData.company" maxlength="255"></el-input>
          </el-form-item>
          <el-form-item label="所属行业" prop="industry">
            <el-input v-model="formData.industry" maxlength="255"></el-input>
          </el-form-item>
          <el-form-item label="所属地区">
            <city-select v-model="formData.area" style="width:100%;"></city-select>
          </el-form-item>
        </template>
        <el-form-item label="联系人" prop="linkman">
          <el-input v-model="formData.linkman" maxlength="20"></el-input>
        </el-form-item>

        <el-form-item label="联系电话" prop="tel">
          <el-input v-model="formData.tel" maxlength="20"></el-input>
        </el-form-item>

        <el-form-item label="地址" prop="address">
          <el-input v-model="formData.address"></el-input>
        </el-form-item>
      </el-card>

      <el-form-item style="text-align:center; padding-top:20px;">
        <el-button type="primary" @click="formSubmit" size="large">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import { rules } from "@/utils/rules.js";
  import citySelect from "@/components/city-select.vue";
  import { addUser, getUser } from "@/api/index.js";
  export default {
    data() {
      return {
        formData: {
          user_id: this.$route.params.user_id,
          area: [],
          "user_name": "",
          pass_word: "",
          re_pass_word: "",
          "province_id": "",
          "city_id": "",
          "county_id": "",
          "company": "",
          "industry": "",
          "linkman": "",
          "tel": "",
          "address": "",
          "device_num": "",
          "role_id": "",
        },
        rules: {
          ...rules,
          role_id: [{ required: true, message: "必须选择角色", trigger: "change" }],
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
        }
      };
    },
    computed: {},
    props: ["user_type"],//来自router的user_type 根据user_type 区分公司和个人
    created() {
      getUser({ user_id: this.formData.user_id }).then((res) => {
        if (res.data.code == 0 && res.data.data.length) {
          var mixinData = Object.assign({}, this.formData, res.data.data[0]);
          mixinData.re_pass_word = mixinData.pass_word;
          mixinData.area = [mixinData.province_id, mixinData.city_id, mixinData.county_id];
          this.$set(this.$data, "formData", mixinData);
        }
      })
    },
    methods: {
      validatePassword(rule, value, callback) {
        if (this.formData.pass_word) {
          if (this.formData.re_pass_word != "") {
            this.$refs.baseForm.validateField('re_pass_word')
          }
          callback();
        } else {
          callback(new Error('请输入密码'));
        }


      },
      validatePassword2(rule, value, callback) {
        if (this.formData.pass_word === this.formData.re_pass_word) {
          callback();
        } else {
          callback(new Error("两次密码不一样"));
        }

      },
      formSubmit() {
        this.$refs.baseForm.validate((isVaildate, errorItem) => {
          if (isVaildate) {
            this.tableLoading = true;
            var areaObj = this.$utils.formatArea(this.formData.area);
            var postData = Object.assign({}, this.formData, areaObj);
            addUser(postData)
              .then(res => {
                this.$set(this.$data, "tableData", res.data);
                this.tableLoading = false;
              })
              .catch(() => { });
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
    },
    components: { citySelect }
  };
</script>