<template>
  <div style="padding:10px 198px;">
    <el-form>
      <el-row v-if="collectData.CommandWord==4">
        <el-col>
          <el-form-item label="时间：">{{collectData.RealTime}}</el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="脉冲系数：">{{collectData.PulseFactor}}</el-form-item>
        </el-col>
        <el-button size="small" type="primary">设置</el-button>
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