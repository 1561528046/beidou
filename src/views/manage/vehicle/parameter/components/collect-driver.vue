<template>
  <div style="padding:10px 198px;">
    <el-form>
      <el-row v-if="collectData.CommandWord == 1">
        <el-col>
          <el-form-item label="机动车驾驶证：">
            {{collectData.LicenseNo}}
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