<template>
  <el-form status-icon :rules="rules" :model="formData" size="small" ref="baseForm">
    <el-form-item>
      <el-upload
        action="medium"
        class="upload-demo"
        :http-request="uploadFunc "
        :file-list="fileList"
      >
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>
    </el-form-item>
  </el-form>
</template>
<script>
import { GetPackageModelById } from "@/api/index.js";
import companySelect from "@/components/select-company.vue";
export default {
  data() {
    return {
      fileList: [],
      formData: {
        company_id: ""
      },
      rules: {}
    };
  },
  props: {
    rowid: String
  },
  watch: {},
  created() {
    if (this.$props.rowid) {
      this.getPackage();
    }
  },
  methods: {
    getPackage() {
      GetPackageModelById({ rowid: this.$props.rowid }).then(res => {
        if (res.data.code == 0) {
          var arr = [];
          arr.push({
            name: res.data.data[0].filename,
            url: this.$dict.BASE_URL + res.data.data[0].filepath
          });
          this.$set(this.$data, "fileList", arr);
        } else {
          return this.$notify({
            message: res.data.msg,
            title: "提示",
            type: "error"
          });
        }
      });
    },
    uploadFunc(uploadObj) {
      this.$refs.baseForm.validate(isVaildate => {
        if (isVaildate) {
          var formData = new FormData();
          formData.append("ff", uploadObj.file);
          this.$set(this.$data, "fileList", [
            { name: uploadObj.file.name, url: uploadObj.file.type }
          ]);
          this.$emit("success", formData);
        }
      });
    }
  },
  components: { companySelect }
};
</script>
