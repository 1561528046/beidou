<template>
  <div>
    <el-form status-icon :model="formData" size="small" ref="baseForm">
      <el-form-item>
        <el-upload
          action="medium"
          drag
          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          :http-request="uploadFunc "
          :show-file-list="false"
          class="o-el-upload--text"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            只能上传excel文件
            <em>点击上传</em>
          </div>
        </el-upload>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      formData: {}
    };
  },
  methods: {
    uploadFunc(uploadObj) {
      this.$refs.baseForm.validate(isVaildate => {
        if (isVaildate) {
          var formData = new FormData();
          formData.append("ff", uploadObj.file);
          this.$ajax
            .post("/public/UploadExcel", formData, { params: { table: 4 } })
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
  }
};
</script>