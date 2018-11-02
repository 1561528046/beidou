<template>
  <div style="padding:10px 198px;">
    <el-form>
      <el-row>
        <el-col>
          <el-form-item label="机动车驾驶证：">
            {{license}}
          </el-form-item>
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
      license: ""
    };
  },
  props: ["collect"],
  methods: {
    getTable() {
      this.$set(this.$data, "collectData", this.$props.collect);
      if (this.collectData.CommandWord == 1) {
        this.license = this.collectData.LicenseNo;
      } else {
        this.license = "";
      }
    }
  }
};
</script>