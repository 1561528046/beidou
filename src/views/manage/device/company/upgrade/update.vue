<template>
  <div class="admin-table-container">
    <el-form :model="formData" size="small" label-width="80px">
      <el-row :gutter="20">
        <el-col>
          <el-form-item label="设备类型">
            <el-select v-model="formData.external_type" style="width:100%">
              <el-option value="01" label="终端"></el-option>
              <el-option value="02" label="保留"></el-option>
              <el-option value="03" label="ADAS"></el-option>
              <el-option value="04" label="DSM"></el-option>
              <el-option value="05" label="BSD"></el-option>
              <el-option value="06" label="TPMS"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="版本号">
            <el-input v-model="formData.version"></el-input>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="上传类型">
            <el-select v-model="formData.upload_type" style="width:100%">
              <el-option value="0" label="文件包"></el-option>
              <el-option value="1" label="网络地址"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col v-show="formData.upload_type=='1'">
          <el-form-item label="链接">
            <el-input v-model="formData.httpurl"></el-input>
          </el-form-item>
        </el-col>
        <el-col v-show="formData.upload_type=='0'">
          <el-form-item label="上传">
            <el-upload
              action="medium"
              class="upload-demo"
              :http-request="uploadFunc "
              :file-list="fileList"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col style="text-align:center">
          <el-form-item label-width="0">
            <el-button type="primary" @click="submitForm">提交</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import {
  UpdateDeviceUpgradePackage,
  GetPackageModelById
} from "@/api/index.js";
import upgradeUpload from "./upload.vue";
export default {
  components: { upgradeUpload },
  created() {
    GetPackageModelById({ rowid: this.$props.rowid }).then(res => {
      if (res.data.code == 0) {
        res.data.data[0].fileData = {};
        var arr = [];
        arr.push({
          name: res.data.data[0].filename,
          url: this.$dict.BASE_URL + res.data.data[0].filepath
        });
        this.$set(this.$data, "fileList", arr);
        this.$set(this.$data, "formData", res.data.data[0]);
      } else {
        return this.$notify({
          message: res.data.msg,
          title: "提示",
          type: "error"
        });
      }
    });
  },
  watch: {
    "formData.upload_type": function() {
      if (this.formData.upload_type == "0") {
        this.formData.httpurl = "";
      } else if (this.formData.upload_type == "1") {
        this.fileList = [];
      }
    }
  },
  data() {
    return {
      fileList: [],
      addKey: 0,
      formData: {
        company_id: "",
        external_type: "",
        version: "",
        upload_type: "",
        httpurl: "",
        fileData: {}
      }
    };
  },
  props: {
    companyid: String,
    rowid: String
  },
  methods: {
    uploadFunc(uploadObj) {
      var formData = new FormData();
      formData.append("ff", uploadObj.file);
      this.$set(this.$data, "fileList", [
        { name: uploadObj.file.name, url: uploadObj.file.type }
      ]);
      this.$set(this.formData, "fileData", formData);
    },
    // 添加升级包
    submitForm() {
      UpdateDeviceUpgradePackage(this.formData).then(res => {
        if (res.data.code == 0) {
          this.$emit("success");
          return this.$notify({
            message: "修改成功",
            title: "提示",
            type: "success"
          });
        } else {
          return this.$notify({
            message: res.data.msg,
            title: "提示",
            type: "error"
          });
        }
      });
    }
  }
};
</script>