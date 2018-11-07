<template>
  <div style="padding:10px 198px;">
    <el-form>
      <el-row v-if="collectData.CommandWord==2">
        <el-col>
          <el-form-item label="时间：">
            {{collectData.RealTimeClock}}
          </el-form-item>
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