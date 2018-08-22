<template>
  <el-form status-icon :rules="rules" :model="formData" size="small" ref="baseForm">
    <!-- 设备信息 -->
    <el-form-item label="终端厂商" prop="company_id">
      <company-select v-model="formData.company_id" style="width: 360px;"></company-select>
      <!-- <el-input v-model="formData.company_name"></el-input> -->
    </el-form-item>
    <el-form-item v-if="formData.company_id">
      <el-upload action="medium" drag accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel " :http-request="uploadFunc " :show-file-list="false" class="o-el-upload--text">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">只能上传excel文件
          <em>点击上传</em>
        </div>
      </el-upload>
    </el-form-item>

    <!-- <button @click="$router.go(-1)">a</button> -->
  </el-form>
</template>
<script>
import companySelect from "@/components/select-company.vue";
export default {
  data() {
    return {
      formData: {
        company_id: ""
      },
      rules: {
        company_id: [
          { required: true, trigger: "change", message: "必须选择终端厂商" }
        ]
      }
    };
  },
  created() {},
  methods: {
    uploadFunc(uploadObj) {
      this.$refs.baseForm.validate(isVaildate => {
        if (isVaildate) {
          var formData = new FormData();
          formData.append("ff", uploadObj.file);
          this.$ajax
            .post("/public/UploadExcel", formData, {
              params: { table: 2, company_id: this.formData.company_id }
            })
            .then(res => {
              if (res.data.code == 0) {
                this.$emit("success");
                this.$notify({
                  title: "成功",
                  message: res.data.msg,
                  type: "success"
                });
              } else {
                this.$emit("error");
                this.$notify({
                  title: "失败",
                  message: res.data.msg,
                  type: "error"
                });
              }
            })
            .catch(() => {
              this.$notify({
                title: "提示",
                message: "接口错误",
                type: "error"
              });
              this.$emit("error");
            });
        }
      });
    }
  },
  components: { companySelect }
};
</script>
<style>
</style>