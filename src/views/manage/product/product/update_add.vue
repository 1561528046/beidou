<template>
  <div style="text-align: center; width: 600px ; height:600px; background-color:#fff;">
    <el-form status-icon :rules="rules" :model="formData " ref="baseForm">
      <!-- <el-row :gutter="30 ">
            </el-row> -->
      <el-form-item label="选择服务项" prop="detail_type">
        <el-select v-model="formData.detail_type" style="width:100%; float:left;">
          <el-option label="授权车辆" value="1">授权车辆</el-option>
          <el-option label="授权厂商" value="3">授权厂商</el-option>
          <el-option label="SIM卡" value="5">SIM卡</el-option>
          <el-option label="短信" value="4">短信</el-option>
        </el-select>
      </el-form-item>
      <!-- 车辆 -->
      <el-form-item v-if="formData.detail_type=='1'">
        <template slot-scope="scope">
          <label style="float:left;">车辆类型</label>
          <select-industry v-model="formData.car_type" style="width:100%;"></select-industry>
          <label style="float:left;">终端类型</label>
          <select-device-type v-model="formData.device_type" style="width:100%;"></select-device-type>
          <label style="float:left;">收费单项</label>
          <el-select v-model="formData.detail_name" style="width:100%;">
            <el-option value="新增">新增</el-option>
            <el-option value="续费">续费</el-option>
            <el-option value="转网">转网</el-option>
          </el-select>
          <label style="float:left;">计费方式</label>
          <el-select v-model="formData.pay_type" style="width:100%;">
            <el-option value="1">计费</el-option>
            <el-option value="2">充值</el-option>
          </el-select>
          <label style="float:left;">单价</label>
          <el-input v-model="formData.original_price" type="number" onkeyup="this.value=this.value.replace(/\D/g,'')" onafterpaste="this.value=this.value.replace(/\D/g,'')" placeholder="0" size="medium" style="border-color: #f56c6c;"></el-input>
        </template>
      </el-form-item>
      <!-- 厂商 -->
      <el-form-item v-if="formData.detail_type=='3'" :model="formData.company">
        <template slot-scope="scope">
          <label style="float:left;">终端厂商</label>
          <select-company style="width:100%;" :clearable="true"></select-company>
          <label style="float:left;">收费单项</label>
          <el-select style="width:100%;">
            <el-option value="1">开通</el-option>
            <el-option value="2">续费</el-option>
          </el-select>
          <label style="float:left;">计费方式</label>
          <el-select style="width:100%;">
            <el-option>计费</el-option>
            <el-option>充值</el-option>
          </el-select>
          <label style="float:left;">单价</label>
          <el-input type="number" onkeyup="this.value=this.value.replace(/\D/g,'')" onafterpaste="this.value=this.value.replace(/\D/g,'')" placeholder="0" size="medium" style="border-color: #f56c6c;"></el-input>
        </template>
      </el-form-item>
      <!-- 短信 -->
      <el-form-item v-if="formData.detail_type=='4'" :model="formData.sms">
        <template slot-scope="scope">
          <label style="float:left;">单价</label>
          <el-input type="number" onkeyup="this.value=this.value.replace(/\D/g,'')" onafterpaste="this.value=this.value.replace(/\D/g,'')" placeholder="0" size="medium" style="border-color: #f56c6c;"></el-input>
          <label style="float:left;">数量</label>
          <el-input type="number" onkeyup="this.value=this.value.replace(/\D/g,'')" onafterpaste="this.value=this.value.replace(/\D/g,'')" placeholder="0" size="medium" style="border-color: #f56c6c;"></el-input>
          <label style="float:left;">计费方式</label>
          <el-select style="width:100%;">
            <el-option>计费</el-option>
            <el-option>充值</el-option>
          </el-select>
        </template>
      </el-form-item>
      <!-- sim卡 -->
      <el-form-item v-if="formData.detail_type=='5'" :model="formData.sim">
        <template slot-scope="scope">
          <label style="float:left;">运营商</label>
          <el-select style="width: 100%;">
            <el-option v-for="belongItem in belongSelect" :key="belongItem" :label="belongItem" :value="belongItem"></el-option>
          </el-select>
          <el-input v-model="formData.belong" v-if="belong == '其他'" placeholder="填写运营商"></el-input>
          <label style="float:left;">计费方式</label>
          <el-select style="width:100%;">
            <el-option>计费</el-option>
            <el-option>充值</el-option>
          </el-select>
          <label style="float:left;">使用流量</label>
          <el-input type="number" onkeyup="this.value=this.value.replace(/\D/g,'')" onafterpaste="this.value=this.value.replace(/\D/g,'')" placeholder="0" size="medium" style="border-color: #f56c6c;"></el-input>
          <label style="float:left;">单价</label>
          <el-input type="number" onkeyup="this.value=this.value.replace(/\D/g,'')" onafterpaste="this.value=this.value.replace(/\D/g,'')" placeholder="0" size="medium" style="border-color: #f56c6c;"></el-input>
        </template>
      </el-form-item>
      <el-form-item style="text-align:center; ">
        <template slot-scope="scope">
          <el-button :type="buttontype(scope)" @click="formSubmit" size="large">提交</el-button>
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
import { rules } from "@/utils/rules.js";
import selectCompany from "@/components/select-company.vue";
import selectIndustry from "@/components/select-industry.vue";
import selectDeviceType from "@/components/select-devicetype.vue";
import { addProductDetail } from "@/api/index.js";
import addProduct from "@/components/product/product-manage.vue";
export default {
  data() {
    return {
      belongSelect: ["中国移动", "中国联通", "中国电信", "其他"],
      industrys: this.$dict.industry,
      button_type: true,
      formData: {
        package_id: this.$props.package_id,
        detail_name: "",
        detail_type: "",
        original_price: "",
        present_price: "",
        pay_type: "",
        company_id: "",
        company_name: "",
        count: "",
        car_type: "",
        device_type: ""
      },
      msg: "",
      rules: {
        ...rules,
        detail_type: [
          { required: true, message: "请选择服务项", trigger: "change" }
        ]
      }
    };
  },
  props: {
    package_id: String
  },
  watch: {},
  computed: {},
  created() {},
  methods: {
    //单价验证
    inputFunc(scope) {
      scope.row.original_price = parseInt(scope.row.original_price);
      scope.row.discount_price = parseInt(scope.row.discount_price);
      if (scope.row.discount_price > scope.row.original_price) {
        this.$set(scope.row, "error", true);
        this.button_type = false;
      } else {
        this.$set(scope.row, "error", false);
        this.button_type = true;
        scope.row.present_price =
          scope.row.original_price - scope.row.discount_price;
      }
    },
    // 优惠金额验证
    inputFuncs(scope) {
      scope.row.original_price = parseInt(scope.row.original_price);
      scope.row.discount_price = parseInt(scope.row.discount_price);
      if (scope.row.discount_price > scope.row.original_price) {
        this.$set(scope.row, "error", true);
        this.button_type = false;
      } else {
        this.$set(scope.row, "error", false);
        this.button_type = true;
        scope.row.present_price =
          scope.row.original_price - scope.row.discount_price;
      }
    },
    updateFormDatas(data) {
      this.formData.detail = data.detail;
    },
    buttontype() {
      if (this.button_type) {
        return "primary";
      } else {
        return "info";
      }
    },
    //添加收费项
    formSubmit() {
      if (this.formData.detail_type == 1) {
        this.detail_type = this.formData.device_type;
      }
      this.$refs.baseForm.validate((isVaildate, errorItem) => {
        if (isVaildate) {
          var postData = Object.assign({}, this.formData);
          addProductDetail(postData)
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
                });
              }
            })
            .catch(() => {
              this.$alert("接口错误", "提示", {
                type: "error"
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

    // notify: function() {
    //   this.$refs.child.parentMsg(this.msg);
    // }
  },
  components: { selectCompany, addProduct, selectDeviceType, selectIndustry }
};
</script>
<style>
</style>