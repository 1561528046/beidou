<template>
  <div class="post-form">
    <el-form label-width="200px" status-icon :rules="rules" :model="formData" size="small" ref="baseForm">
      <el-card shadow="hover">
        <div slot="header" class="clearfix">
          <span>添加司机 </span>
        </div>
        <el-form-item label="司机卡id" prop="driver_card_id">
          <el-input v-model="formData.driver_card_id" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="driver_name">
          <el-input v-model="formData.driver_name" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="tel">
          <el-input v-model="formData.tel" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="驾驶证有效期" prop="license_validity">
          <el-date-picker v-model="formData.license_validity" type="date" placeholder="选择日期" format="yyyy 年 MM 月 dd 日" value-format="yyyyMMdd"
            style="width:100%;">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="身份证 " prop="identity_id">
          <el-input v-model="formData.identity_id" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="选择车辆" prop="vehicle_id">
          <el-input v-model="formData.vehicle_id"></el-input>
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
  import { addDriver } from "@/api/index.js";
  export default {
    data() {
      return {
        formData: {
          "driver_card_id": "",
          "driver_name": "",
          "tel": "",
          "license_validity": "",
          "identity_id": "",
          "vehicle_id": "",
        },
        rules: {
          ...rules,
          driver_card_id: [{ required: true, message: "必须填写司机卡ID", trigger: "change" }],
        }
      };
    },
    computed: {},
    created() {

    },
    methods: {
      formSubmit() {
        this.$refs.baseForm.validate((isVaildate, errorItem) => {
          if (isVaildate) {
            var postData = Object.assign({}, this.formData);
            addDriver(postData)
              .then(res => {
                if (res.data.code == 0) {
                  this.$message.success(res.data.msg);
                  this.$router.push({ "name": "driver" })
                } else {
                  this.$message.error(res.data.msg);
                }
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
  };
</script>