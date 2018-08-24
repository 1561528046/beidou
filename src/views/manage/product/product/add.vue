<template>
  <div style="text-align: center;  background-color:#fff;">
    <el-form status-icon :rules="rules" :model="formData " ref="baseForm">
      <!-- <el-row :gutter="30">
            </el-row> -->
      <el-form-item label="产品名称" prop="title">
        <el-input placeholder="请输入" v-model="formData.title"></el-input>
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
import { addProducts } from "@/api/index.js";
import addProduct from "@/components/product/product-manage.vue";
export default {
  data() {
    return {
      button_type: true,
      formData: {
        title: ""
      },
      msg: "",
      rules: {
        ...rules,
        title: [
          { required: true, trigger: "change", message: "必须添加产品名称" }
        ]
      }
    };
  },
  watch: {},
  computed: {},
  created() {},
  methods: {
    buttontype() {
      if (this.button_type) {
        return "primary";
      } else {
        return "info";
      }
    },
    //添加产品
    formSubmit() {
      if (this.button_type) {
        this.$refs.baseForm.validate((isVaildate, errorItem) => {
          this.$nextTick(() => {
            if (isVaildate) {
              var postData = JSON.parse(JSON.stringify(this.formData));
              addProducts(postData)
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
        });
      }
    }
    // notify: function() {
    //   this.$refs.child.parentMsg(this.msg);
    // }
  },
  components: { selectCompany, addProduct }
};
</script>
<style>
</style>