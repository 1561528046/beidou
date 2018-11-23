<template>
  <div style="text-align: center;">
    <el-form status-icon :rules="rules" :model="formData" ref="baseForm">
      <el-row :gutter="30">
        <el-col :span="24">
          <el-form-item label="终端厂商名称" prop="company_name">
            <el-input v-model="formData.company_name"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item style="text-align:center;">
        <el-button type="primary" @click="formSubmit" size="large">添加</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { rules } from "@/utils/rules.js";
import citySelect from "@/components/select-city.vue";
import { addDeviceCompany } from "@/api/index.js";
export default {
  data() {
    return {
      formData: {
        area: [],
        company_id: "", //设备厂商id
        company_name: "", //设备厂商名称
        company_type: "" //设备厂商类型：1前装厂商，2后装厂商
      },
      rules: {
        ...rules,
        company_name: [
          {
            required: true,
            message: "请输入厂商名称",
            trigger: "change"
          }
        ],
        company_type: [
          {
            required: true,
            message: "请选择厂商类型",
            trigger: "change"
          }
        ]
      }
    };
  },
  computed: {},
  created() {},
  methods: {
    // 添加
    formSubmit() {
      this.$refs.baseForm.validate((isVaildate, errorItem) => {
        if (isVaildate) {
          var areaObj = this.$utils.formatArea(this.formData.area);
          var postData = Object.assign({}, this.formData, areaObj);
          postData.device_total = postData.device_total || 0;
          addDeviceCompany(postData)
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
  },
  components: { citySelect }
};
</script>