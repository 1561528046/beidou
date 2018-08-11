<template>
  <div style="text-align: center; width:100%; background-color:#fff;">
    <el-form status-icon :rules="rules" :model="formData " ref="baseForm">
      <!-- <el-row :gutter="30 ">
            </el-row> -->
      <el-form-item label="产品名称" prop="title">
        <el-input placeholder="请输入" v-model="formData.title"></el-input>
      </el-form-item>
      <el-collapse v-model="activeName" accordion>
        <el-collapse-item title="短信" name="1">
          <el-form-item label="" prop="sms">
            <el-table size="mini" :data="formData.sms" border style="width: 100%; margin-top: 20px">
              <el-table-column prop="detail_type_name" label="类型" width="240">
              </el-table-column>
              <el-table-column prop="original_price" label="单价">
                <template slot-scope="scope">
                  <el-form-item :class="{error:scope.row.error}">
                    <el-input v-on:input="inputFunc(scope)" type="number" onkeyup="this.value=this.value.replace(/\D/g,'')" onafterpaste="this.value=this.value.replace(/\D/g,'')" v-model="formData.sms[scope.$index].original_price" placeholder="0" size="mini" style="border-color: #f56c6c;"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="discount_price" label="优惠金额(元)">
                <template slot-scope="scope">
                  <el-form-item :class="{error:scope.row.error}">
                    <el-input v-on:input="inputFuncs(scope)" type="number" onkeyup="this.value=this.value.replace(/\D/g,'')" onafterpaste="this.value=this.value.replace(/\D/g,'')" v-model="formData.sms[scope.$index].discount_price" placeholder="0" size="mini"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="count" label="数量">
                <template slot-scope="scope">
                  <el-input type="number" onkeyup="this.value=this.value.replace(/\D/g,'')" onafterpaste="this.value=this.value.replace(/\D/g,'')" v-model="formData.sms[scope.$index].count" placeholder="0" size="mini"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="pay_type" label="收费方式" width="160">
                <template slot-scope="scope">
                  <el-radio label="1" v-model="formData.sms[scope.$index].pay_type">计费</el-radio>
                  <el-radio label="2" v-model="formData.sms[scope.$index].pay_type">充值</el-radio>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-collapse-item>
      </el-collapse>
      <el-collapse v-model="activeName" accordion>
        <el-collapse-item title="设备厂商" name="1">
          <el-form-item label="设备厂商">
            <el-table size="mini" :data="formData.company" border :span-method="objectSpanMethod" style="width: 100%; margin-top: 20px">
              <el-table-column prop="company_id" label="类型" width="240">
                <template slot-scope="scope">
                  <select-company v-on:input="companyFunc(scope)" v-if="!scope.row.isAdd" v-model="formData.company[scope.$index].company_id" style="width:100%;" :clearable="true"></select-company>
                  <el-button v-if="scope.row.isAdd" size="mini" @click="addRow(scope.$index, formData.company)" type="primary" icon="el-icon-plus"></el-button>
                </template>
              </el-table-column>
              <el-table-column prop="detail_name" label="类型">
              </el-table-column>
              <el-table-column prop="original_price" label="单价">
                <template slot-scope="scope">
                  <el-form-item :class="{error:scope.row.error}">
                    <el-input v-on:input="inputFunc(scope)" type="number" onkeyup="this.value=this.value.replace(/\D/g,'')" onafterpaste="this.value=this.value.replace(/\D/g,'')" v-model="formData.company[scope.$index].original_price" placeholder="0" size="mini"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="discount_price" label="优惠金额(元)">
                <template slot-scope="scope">
                  <el-form-item :class="{error:scope.row.error}">
                    <el-input v-on:input="inputFuncs(scope)" type="number" onkeyup="this.value=this.value.replace(/\D/g,'')" onafterpaste="this.value=this.value.replace(/\D/g,'')" v-model="formData.company[scope.$index].discount_price" placeholder="0" size="mini"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="pay_type" label="收费方式" width="160">
                <template slot-scope="scope">
                  <el-radio v-model="formData.company[scope.$index].pay_type" label="1">计费</el-radio>
                  <el-radio v-model="formData.company[scope.$index].pay_type" label="2">充值</el-radio>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="90">
                <template slot-scope="scope">
                  <el-button size="small" icon="el-icon-delete" @click.native.prevent="deleteRow(scope.$index, formData.company)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-collapse-item>
      </el-collapse>

      <!--车辆类型组件 -->
      <add-product ref="child" @update="(data)=>{updateFormDatas(data)}"></add-product>
      <!-- <button @click="$router.go(-1) ">a</button> -->
      <el-form-item style="text-align:center; ">
        <template slot-scope="scope">
          <el-button :type="buttontype(scope)" v-on:click="notify" @click="formSubmit" size="large">提交</el-button>
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
        title: "",
        company: [
          {
            detail_type: "3",
            detail_type_name: "设备厂家",
            company_id: "",
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
      }
    };
  },
  watch: {},
  computed: {},
  created() {},
  methods: {
    companyFunc(scope) {
      console.log(scope.row.company_id);
    },
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
      }
    },
    updateFormDatas(data) {
      this.formData.detail = data.detail;
      console.log(this.formData.detail.length);
    },
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
    },
    // 厂商删除
    deleteRow(index, rows) {
      rows.splice(index, 2);
    },
    //添加厂商
    addRow(index, rows) {
      rows.splice(
        index,
        0,
        {
          detail_type: "3",
          detail_type_name: "设备厂家",
          company_id: "",
          detail_name: "开通",
          original_price: "", //单价
          discount_price: "", //优惠金额
          present_price: "", //现价
          pay_type: "1",
          add_id: ""
        },
        {
          detail_type: "3",
          detail_type_name: "设备厂家",
          company_id: "",
          detail_name: "开通",
          original_price: "", //单价
          discount_price: "", //优惠金额
          present_price: "", //现价
          pay_type: "1",
          add_id: ""
        }
      );
    },
    // 合并单元格
    objectSpanMethod({ row, rowIndex, columnIndex }) {
      if (row.isAdd) {
        return {
          rowspan: 1,
          colspan: 6
        };
      } else {
        if (columnIndex === 0 || columnIndex === 5) {
          if (rowIndex % 2 == 0) {
            return {
              rowspan: 2,
              colspan: 1
            };
          } else {
            return {
              rowspan: 0,
              colspan: 0
            };
          }
        }
      }
    },
    notify: function() {
      this.$refs.child.parentMsg(this.msg);
    }
  },
  components: { selectCompany, addProduct }
};
</script>
<style>
</style>