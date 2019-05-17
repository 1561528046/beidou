<template>
  <el-form
    status-icon
    :rules="rules"
    :model="formData"
    size="small"
    ref="baseForm"
    class="msg-form"
  >
    <el-row :gutter="30">
      <el-col :span="12">
        <el-form-item label="司机身份识别卡编号" prop="driver_card_id">
          <el-input v-model="formData.driver_card_id" maxlength="10"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="姓名" prop="driver_name">
          <el-input v-model="formData.driver_name" maxlength="20"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="联系电话" prop="tel">
          <el-input v-model="formData.tel" maxlength="20"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="驾驶证有效期" prop="validity">
          <el-date-picker
            style="width:100%"
            v-model="formData.validity"
            type="daterange"
            value-format="yyyyMMdd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="出生日期" prop="driver_birth">
          <el-date-picker
            style="width:100%"
            v-model="formData.driver_birth"
            type="datetime"
            value-format="yyyyMMdd"
            placeholder="选择日期时间"
          ></el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="性别" prop="driver_sex">
          <el-select v-model="formData.driver_sex" style="width:100%">
            <el-option value="1" label="男">男</el-option>
            <el-option value="2" label="女">女</el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="住址" prop="address">
          <el-input v-model="formData.address"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="准驾车型" prop="quasi_driving">
          <el-select v-model="formData.quasi_driving" style="width:100%">
            <el-option value="A1" label="A1"></el-option>
            <el-option value="A2" label="A2"></el-option>
            <el-option value="A3" label="A3"></el-option>
            <el-option value="B1" label="B1"></el-option>
            <el-option value="B2" label="B2"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="驾驶证号" prop="identity_id">
          <el-input v-model="formData.identity_id"></el-input>
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="驾驶员正面照">
          <el-upload
            class="avatar-uploader"
            accept="image/jpeg"
            :headers="uploadHeaders"
            :action="$dict.API_URL+'/vehicle/UploadImgLocal/'"
            :show-file-list="false"
            :on-success="(res,file)=>{uploadSuccess('photo_path',res,file)}"
            :before-upload="uploadBefore"
          >
            <img
              v-if="formData.photo_path "
              :src="$dict.BASE_URL+formData.photo_path "
              class="avatar"
            >
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item style="text-align:center; padding-top:20px;">
      <el-button type="primary" @click="formSubmit" size="large">提交</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { rules } from "@/utils/rules.js";
import { updateDriver, getDriver } from "@/api/index.js";
export default {
  data() {
    return {
      uploadHeaders: {
        Authorization: this.$store.state.user.token
      },
      formData: {
        driver_id: this.$props.driver_id,
        driver_sex: "", //性别
        driver_birth: "", //出生日期
        quasi_driving: "", //准驾车型
        identity_id: "", //驾驶证号
        driver_card_id: "", //驾驶员身份识别卡编号
        driver_name: "", //姓名
        tel: "", //联系电话
        validity: "",
        address: "", //住址
        photo_path: "", //驾驶员正面照
        begin_date: "", //驾驶证有效期开始
        end_date: "" //驾驶证有效期结束
      },
      rules: {
        ...rules,
        validity: [
          {
            required: true,
            trigger: "change",
            validator: this.validateTime
          }
        ],
        driver_name: [
          {
            required: true,
            message: "请填写姓名",
            trigger: "change"
          }
        ],
        identity_id: [
          {
            required: true,
            message: "请填写驾驶证号",
            trigger: "change"
          }
        ],
        driver_card_id: [
          {
            required: true,
            message: "请填写驾驶员身份识别卡编号",
            trigger: "change"
          }
        ],
        tel: [
          { required: true, trigger: "change", validator: this.validateTel }
        ],
        quasi_driving: [
          {
            required: true,
            message: "请选择准驾车型",
            trigger: "change"
          }
        ]
      }
    };
  },
  props: {
    driver_id: String
  },
  computed: {},
  created() {
    getDriver({ driver_id: this.formData.driver_id }).then(res => {
      if (res.data.code == 0 && res.data.data.length) {
        var mixinData = Object.assign({}, this.formData, res.data.data[0]);
        mixinData.validity = [mixinData.begin_date, mixinData.end_date];
        this.$set(this.$data, "formData", mixinData);
      }
    });
  },
  methods: {
    //  驾驶员图片上传
    uploadSuccess(flied, res) {
      this.formData[flied] = res.data[0].path;
    },
    uploadBefore(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 5;
      if (!isJPG) {
        this.$message.error("必须上传 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 5MB!");
      }
      return isJPG && isLt2M;
    },
    // 时间验证
    validateTime(rule, value, callback) {
      if (value == "" || !value) {
        callback(new Error("请选择驾驶证有效期!"));
        return false;
      } else {
        this.formData.begin_date = value[0];
        this.formData.end_date = value[1];
        callback();
      }
    },
    validateTel(rule, value, callback) {
      var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (!myreg.test(value)) {
        callback(new Error("联系电话格式错误!"));
        return false;
      } else {
        callback();
      }
    },
    formSubmit() {
      this.$refs.baseForm.validate((isVaildate, errorItem) => {
        if (isVaildate) {
          var postData = Object.assign({}, this.formData);
          updateDriver(postData)
            .then(res => {
              if (res.data.code == 0) {
                this.$emit("success");
                this.$message.success(res.data.msg);
              } else {
                this.$emit("error");
                this.$message.error(res.data.msg);
              }
            })
            .catch(() => {
              this.$message.error("接口错误");
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
  }
};
</script>