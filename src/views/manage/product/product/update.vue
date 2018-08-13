<template>
  <div style="text-align: center; width:100%; background-color:#fff;">
    <el-form status-icon :rules="rules" :model="formData " ref="baseForm">
      <!-- <el-row :gutter="30 ">
            </el-row> -->
      <el-form-item label="产品名称" prop="title">
        <el-input placeholder="请输入" v-model="formData.title"></el-input>
      </el-form-item>
      <el-form-item>
        <template>
          <el-button type="primary" icon="el-icon-plus" style="float:left;" @click="addFrom"></el-button>
        </template>
      </el-form-item>
      <el-form-item style="text-align:center; ">
        <template slot-scope="scope">
          <el-button type="primary" size="large">提交</el-button>
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
import update_add from "./update_add.vue";
export default {
  data() {
    return {
      list: [],
      company_id: "",
      button_type: true,
      formData: {
        package_id: "",
        title: "",
        company: [
          {
            detail_type: "3",
            detail_type_name: "设备厂家",
            company_id: "",
            comapny_name: "",
            detail_name: "开通",
            original_price: "", //单价
            discount_price: "", //优惠金额
            present_price: "", //现价
            pay_type: "1",
            add_id: "1",
            count: "0"
          },
          {
            detail_type: "3",
            detail_type_name: "设备厂家",
            company_id: "",
            company_name: "",
            detail_name: "续费",
            original_price: "", //单价
            discount_price: "", //优惠金额
            present_price: "", //现价
            pay_type: "1",
            add_id: "1",
            count: "0"
          },
          {
            isAdd: true
          }
        ],
        sms: [
          {
            detail_type: "4",
            detail_type_name: "短信",
            original_price: "", //单价
            discount_price: "", //优惠金额
            present_price: "", //现价
            count: "",
            pay_type: "1"
          }
        ],
        detail: []
      },
      msg: "",
      rules: {
        ...rules,
        title: [
          { required: true, trigger: "change", message: "必须添加产品名称" }
        ]
      },
      arr: 1,
      arr2: 3
    };
  },
  watch: {},
  created() {},
  filters: {},
  computed: {
    // 下拉列表
  },
  methods: {
    // 添加单一收费项
    addFrom() {
      var vNode = this.$createElement(update_add, {
        key: this.addKey++,
        on: {
          success: () => {
            this.getTable();
            this.$msgbox.close();
          },
          error: function() {}
        }
      });
      this.$msgbox({
        showConfirmButton: false, //是否显示确定按钮
        customClass: "admin-message-form",
        title: "添加",
        closeOnClickModal: false, //是否可通过点击遮罩关闭 MessageBox
        closeOnPressEscape: false, //是否可通过按下 ESC 键关闭 MessageBox
        message: vNode
      });
    }
  },
  components: { selectCompany, update_add }
};
</script>
<style>
</style>