<template>
  <div style="padding:10px 198px;">
    <el-form>
      <el-row v-if="collectData.CommandWord==3">
        <el-col>
          <el-form-item label="实时时间：">{{collectData.RealTime}}</el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="记录仪初次安装时间：">{{collectData.SetupTime}}</el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="初始里程：">{{collectData.BeginMileage}}</el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="累计行驶里程：">{{collectData.EndMileage}}</el-form-item>
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