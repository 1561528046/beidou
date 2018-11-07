<template>
  <div style="padding:10px 198px;">
    <el-form>
      <el-row v-if="collectData.CommandWord==7">
        <el-col>
          <el-form-item label="生产厂CCC认证代码：">{{collectData.CertificationCode}}</el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="认证产品型号：">{{collectData.CertifyProductModel}}</el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="初次安装日期：">{{collectData.ProductionDate}}</el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="产品生产流水号：">{{collectData.SerialNumber}}</el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
export default {
  created() {},
  data() {
    return {
      collectData: {}
    };
  },
  props: ["collect"],
  watch: {
    collect: {
      handler: function() {
        this.$set(this.$data, "collectData", this.$props.collect);
      },
      deep: true
    }
  },
  methods: {}
};
</script>