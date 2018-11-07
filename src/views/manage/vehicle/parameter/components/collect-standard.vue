<template>
  <div style="padding:10px 198px;">
    <el-form>
      <el-row v-if="collectData.CommandWord==0">
        <el-col>
          <el-form-item label="年号：">{{collectData.YearLater}}</el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="修改单号：">{{collectData.UpdateOrders}}</el-form-item>
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