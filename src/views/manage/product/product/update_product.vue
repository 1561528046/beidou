<template>
  <div>
    <el-form status-icon :rules="rules" :model="formData " ref="baseForm">
      <!-- <el-row :gutter="30">
            </el-row> -->
      <!-- 车辆 -->
      <el-form-item v-show="formData.detail_type==1">
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
          <label style="float:left;">单价</label>
          <el-input v-model="formData.original_price" type="number" onkeyup="this.value=this.value.replace(/\D/g,'')" onafterpaste="this.value=this.value.replace(/\D/g,'')" placeholder="0" size="medium" style="border-color: #f56c6c;"></el-input>
        </template>
      </el-form-item>
      <!-- 厂商 -->
      <el-form-item v-show="formData.detail_type==2">
        <template slot-scope="scope">
          <label style="float:left;">终端厂商</label>
          <select-company v-model="formData.company_id" :company_name.sync="formData.company_name" style="width:100%;" :clearable="true"></select-company>
          <label style="float:left;">收费单项</label>
          <el-select style="width:100%;" v-model="formData.detail_name">
            <el-option value="开通">开通</el-option>
            <el-option value="续费">续费</el-option>
          </el-select>
          <label style="float:left;">计费方式</label>
          <el-select v-model="formData.pay_type" style="width:100%;">
            <el-option label="计费" value="1">计费</el-option>
            <el-option label="充值" value="2">充值</el-option>
          </el-select>
          <label style="float:left;">单价</label>
          <el-input v-model="formData.original_price" type="number" onkeyup="this.value=this.value.replace(/\D/g,'')" onafterpaste="this.value=this.value.replace(/\D/g,'')" placeholder="0" size="medium" style="border-color: #f56c6c;"></el-input>
        </template>
      </el-form-item>
      <!-- 短信 -->
      <el-form-item v-show="formData.detail_type==3">
        <template slot-scope="scope">
          <label style="float:left;">数量</label>
          <el-input v-model="formData.count" type="number" onkeyup="this.value=this.value.replace(/\D/g,'')" onafterpaste="this.value=this.value.replace(/\D/g,'')" placeholder="0" size="medium" style="border-color: #f56c6c;"></el-input>
          <label style="float:left;">计费方式</label>
          <el-select v-model="formData.pay_type" style="width:100%;">
            <el-option label="计费" value="1">计费</el-option>
            <el-option label="充值" value="2">充值</el-option>
          </el-select>
          <label style="float:left;">单价</label>
          <el-input v-model="formData.original_price" type="number" onkeyup="this.value=this.value.replace(/\D/g,'')" onafterpaste="this.value=this.value.replace(/\D/g,'')" placeholder="0" size="medium" style="border-color: #f56c6c;"></el-input>
        </template>
      </el-form-item>
      <!-- sim卡 -->
      <el-form-item v-show="formData.detail_type==4">
        <template slot-scope="scope">
          <label style="float:left;">运营商</label>
          <select-group style="width:100%;" v-model="formData.detail_name"></select-group>
          <label style="float:left;">收费单项(使用流量/M)</label>
          <select-flow style="width:100%;" v-model="formData.count"></select-flow>
          <label style="float:left;">计费方式</label>
          <el-select v-model="formData.pay_type" style="width:100%;">
            <el-option label="计费" value="1">计费</el-option>
            <el-option label="充值" value="2">充值</el-option>
          </el-select>
          <label style="float:left;">单价</label>
          <el-input v-model="formData.original_price" type="number" onkeyup="this.value=this.value.replace(/\D/g,'')" onafterpaste="this.value=this.value.replace(/\D/g,'')" placeholder="0" size="medium" style="border-color: #f56c6c;"></el-input>
        </template>
      </el-form-item>
      <el-form-item style="text-align:center;">
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
import selectFlow from "@/components/select-flow.vue";
import selectGroup from "@/components/select-group.vue";
import { addProductDetail } from "@/api/index.js";
import addProduct from "@/components/product/product-manage.vue";
export default {
  data() {
    return {
      flow: [],
      belongSelect: ["中国移动", "中国联通", "中国电信"],
      industrys: this.$dict.industry,
      button_type: true,
      formData: {
        package_id: this.$props.parent_id,
        detail: "",
        detail_name: "",
        detail_type: this.$props.parent_type,
        original_price: "",
        discount_price: "",
        present_price: "",
        pay_type: "",
        company_id: "",
        company_name: "",
        count: "",
        car_type: "",
        car_name: "",
        device_type: ""
      },
      msg: "",
      rules: {
        ...rules
      }
    };
  },
  components: {
    selectCompany,
    addProduct,
    selectDeviceType,
    selectIndustry,
    selectFlow,
    selectGroup
  },
  props: {
    parent_id: String,
    parent_type: Number
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
      if (!this.formData.detail_type == 1) {
        this.formData.device_type = "";
      }
      if (this.formData.device_type == 1) {
        this.formData.pay_type = "1";
      }
      if (this.formData.detail_type == 3) {
        this.formData.detail_name = "短信";
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
  }
};
</script>
<style>
</style>