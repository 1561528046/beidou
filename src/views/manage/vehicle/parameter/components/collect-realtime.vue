<template>
  <div style="padding:10px 198px;">
    <el-form>
      <el-row>
        <el-col>
          <el-form-item label="时间：">
            {{time}}
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
      time: ""
    };
  },
  props: ["collect"],
  methods: {
    getTable() {
      this.$set(this.$data, "collectData", this.$props.collect);
      if (this.collectData.CommandWord == 2) {
        this.time = this.collectData.RealTimeClock;
      } else {
        this.time = "";
      }
    }
  }
};
</script>