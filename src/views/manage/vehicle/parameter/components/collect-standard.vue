<template>
  <div style="padding:10px 198px;">
    <el-form>
      <el-row>
        <el-col>
          <el-form-item label="年号：">{{YearLater}}</el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="修改单号：">{{UpdateOrders}}</el-form-item>
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
      YearLater: "",
      UpdateOrders: ""
    };
  },
  props: ["collect"],
  methods: {
    getTable() {
      this.$set(this.$data, "collectData", this.$props.collect);
      if (this.collectData.CommandWord == 0) {
        this.YearLater = this.collectData.YearLater;
        this.UpdateOrders = this.collectData.UpdateOrders;
      } else {
        this.YearLater = "";
        this.UpdateOrders = "";
      }
    }
  }
};
</script>