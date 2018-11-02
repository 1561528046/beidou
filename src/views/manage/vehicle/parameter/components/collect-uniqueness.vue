<template>
  <div style="padding:10px 198px;">
    <el-form>
      <el-row>
        <el-col>
          <el-form-item label="生产厂CCC认证代码：">{{CertificationCode}}</el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="认证产品型号：">{{CertifyProductModel}}</el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="初次安装日期：">{{ProductionDate}}</el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="产品生产流水号：">{{SerialNumber}}</el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
export default {
  created() {
    this.getTable();
  },
  data() {
    return {
      collectData: {},
      CertificationCode: "",
      CertifyProductModel: "",
      ProductionDate: "",
      SerialNumber: ""
    };
  },
  props: ["collect"],
  methods: {
    getTable() {
      this.$set(this.$data, "collectData", this.$props.collect);
      if (this.collectData.CommandWord == 5) {
        this.CertificationCode = this.collectData.CertificationCode;
        this.CertifyProductModel = this.collectData.CertifyProductModel;
        this.ProductionDate = this.collectData.ProductionDate;
        this.SerialNumber = this.collectData.SerialNumber;
      } else {
        this.CertificationCode = "";
        this.CertifyProductModel = "";
        this.ProductionDate = "";
        this.SerialNumber = "";
      }
    }
  }
};
</script>