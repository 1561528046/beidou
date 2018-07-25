<template>
  <div class="vehicle-form">
    <el-form label-width="200px" status-icon :rules="rules" :model="formData" size="small" ref="baseForm">
      <!-- 服务商信息 -->
      <el-card shadow="hover">
        <div slot="header" class="clearfix">
          <span>服务商信息 </span>
        </div>

        <el-form-item label="用户帐号" prop="user_name">
          <el-input v-model="formData.user_name"></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="pass_word">
          <el-input v-model="formData.pass_word" type="password"></el-input>
        </el-form-item>
        <el-form-item label="公司名称" prop="company">
          <el-input v-model="formData.company" maxlength="255"></el-input>
        </el-form-item>
        <el-form-item label="所属行业" prop="vehicle_type">
          <el-input v-model="formData.vehicle_type" maxlength="255"></el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="linkman">
          <el-input v-model="formData.linkman" maxlength="20"></el-input>
        </el-form-item>

        <el-form-item label="联系电话" prop="tel">
          <el-input v-model="formData.tel" maxlength="20"></el-input>
        </el-form-item>

        <el-form-item label="地址" prop="address">
          <el-input v-model="formData.address"></el-input>
        </el-form-item>

        <el-form-item label="所属角色" prop="role_id">
          <el-select v-model="formData.role_id" placeholder="选择所属角色" style="width:100%;">
            <el-option label="代理" value="1"></el-option>
            <el-option label="监控员" value="2"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="服务到期日期" prop="end_date">
          <el-date-picker v-model="formData.end_date" :picker-options="pickerOptions" align="center" type="date" placeholder="选择日期"
            style="width:100%;">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="所属地区">
          <city-select v-model="formData.area" style="width:100%;"></city-select>
        </el-form-item>

      </el-card>

      <el-form-item style="text-align:center;">
        <el-button type="primary" @click="formSubmit" size="large">立即创建</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import { rules } from "@/utils/rules.js";
  import moment from "moment";
  import citySelect from "@/components/city-select.vue";
  import { addUser } from "@/api/index.js";
  export default {
    data() {
      return {
        formData: {
          "user_name": "",
          pass_word: "",
          "province_id": "",
          "city_id": "",
          "county_id": "",
          "company": "",
          "vehicle_type": "",
          "linkman": "",
          "tel": "",
          "address": "",
          "device_num": "",
          "role_id": "",
        },
        pickerOptions: {
          shortcuts: [
            {
              text: "今天",
              onClick(picker) {
                picker.$emit("pick", new Date());
              }
            },
            {
              text: "一年后",
              onClick(picker) {
                const date = moment(new Date()).add(1, "year");
                picker.$emit("pick", date);
              }
            },
            {
              text: "两年后",
              onClick(picker) {
                const date = moment(new Date()).add(2, "year");
                picker.$emit("pick", date);
              }
            }
          ]
        },
        rules: {
          ...rules,
          vehicle_no: [
            {
              trigger: "blur",
              component: this,
              validator: function (rule, value, callback) {
                var fule_type = rule.component.formData.fule_type;
                var vehicleNo01, vehicleNo02, vehicleNo03;
                // 如果是电车，那么走新的判断，程超
                if (fule_type == "3") {
                  vehicleNo01 = /^[\u4e00-\u9fa5]{1}[A-Za-z0-9]{7}$/;
                  vehicleNo02 = /^[\u4e00-\u9fa5]{2}[A-Za-z0-9]{6}$/;
                  vehicleNo03 = /^[\u4e00-\u9fa5]{1}[A-Za-z0-9]{6}[\u4e00-\u9fa5]{1}$/;
                } else {
                  vehicleNo01 = /^[\u4e00-\u9fa5]{1}[A-Za-z0-9]{6}$/;
                  vehicleNo02 = /^[\u4e00-\u9fa5]{2}[A-Za-z0-9]{5}$/;
                  vehicleNo03 = /^[\u4e00-\u9fa5]{1}[A-Za-z0-9]{5}[\u4e00-\u9fa5]{1}$/;
                }
                var result =
                  vehicleNo01.test(value) ||
                  vehicleNo02.test(value) ||
                  vehicleNo03.test(value);
                if (result) {
                  callback();
                } else {
                  callback(new Error("车牌号不正确"));
                }
              }
            }
          ]
        }
      };
    },
    computed: {},
    created() { },
    methods: {
      formSubmit() {
        this.$refs.baseForm.validate((isVaildate, errorItem) => {
          if (isVaildate) {
            addUser(this.formData).then((res) => {
              console.log(res);
            })
          } else {
            console.log(isVaildate, errorItem);
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
<style scoped lang="less">
  .vehicle-form {
    padding: 20px;
    .el-card {
      margin-bottom: 20px;
    }
  }
</style>