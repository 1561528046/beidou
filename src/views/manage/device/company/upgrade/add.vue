<template>
  <div class="admin-table-container">
    <el-form :model="tableQuery" size="small" label-width="80px">
      <el-row :gutter="20">
        <el-col>
          <el-form-item label="设备类型">
            <el-select v-model="tableQuery.external_type" style="width:100%">
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
            <el-input v-model="tableQuery.version"></el-input>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="上传类型">
            <el-select v-model="tableQuery.upload_type" style="width:100%">
              <el-option value="0" label="文件包"></el-option>
              <el-option value="1" label="网络地址"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col v-show="tableQuery.upload_type=='1'">
          <el-form-item label="链接">
            <el-input v-model="tableQuery.httpurl"></el-input>
          </el-form-item>
        </el-col>
        <el-col v-show="tableQuery.upload_type=='0'">
          <el-form-item label="上传">
            <upgrade-upload @success="saveFile" :key="addKey"></upgrade-upload>
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
import { AddDeviceUpgradePackage } from "@/api/index.js";
import upgradeUpload from "./upload.vue";
export default {
  components: { upgradeUpload },
  created() {},
  data() {
    return {
      addKey: 0,
      tableQuery: {
        company_id: this.$props.companyid,
        external_type: "",
        version: "",
        upload_type: "",
        httpurl: "",
        fileData: {}
      }
    };
  },
  props: {
    companyid: String
  },
  methods: {
    // 添加升级包
    submitForm() {
      AddDeviceUpgradePackage(this.tableQuery).then(res => {
        if (res.data.code == 0) {
          this.$emit("success");
        } else {
          return this.$notify({
            message: res.data.msg,
            title: "提示",
            type: "error"
          });
        }
      });
    },
    // 保存上传文件路径
    saveFile(data) {
      this.$set(this.tableQuery, "fileData", data);
    }
  }
};
</script>