<template>
  <div style="text-align: center; width:1000px; margin:0 auto; background-color:#fff;">
    <el-form status-icon :rules=" rules " :model="formData " ref="baseForm ">
      <!-- <el-row :gutter="30 ">
            </el-row> -->
      <el-form-item label="产品名称">
        <el-input placeholder="请输入" v-model="formData.title"></el-input>
      </el-form-item>
      <!--车辆类型组件 -->
      <add-product></add-product>
      <el-form-item style="text-align:center; ">
        <el-button type="primary " @click="formSubmit " size="large ">提交</el-button>
      </el-form-item>

      <!-- <button @click="$router.go(-1) ">a</button> -->
    </el-form>
  </div>
</template>
<script>
import { rules } from "@/utils/rules.js";
import selectCompany from "@/components/select-company.vue";
import { addDeviceCompany } from "@/api/index.js";
import addProduct from "@/components/add-product";
export default {
  data() {
    return {
      formData: {
        title: ""
      },
      activeName: "1",
      rules: {
        ...rules
      }
    };
  },
  computed: {},
  created() {},
  methods: {
    formSubmit() {
      console.log(this.$refs);
      this.$refs.baseForm.validate((isVaildate, errorItem) => {
        if (isVaildate) {
          var areaObj = this.$utils.formatArea(this.formData.area);
          var postData = Object.assign({}, this.formData, areaObj);
          postData.device_total = postData.device_total || 0;
          addDeviceCompany(postData)
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
    },
    // 厂商删除
    deleteRow(index, rows) {
      rows.splice(index, 2);
    },
    //添加厂商
    addRow(index, rows) {
      rows.splice(index + 2, 0, {}, {});
    },
    // 合并单元格
    objectSpanMethod({ rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex === 0) {
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

      if (columnIndex === 5) {
        if (rowIndex === 0) {
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
  components: { selectCompany, addProduct }
};
</script>
<style>
</style>