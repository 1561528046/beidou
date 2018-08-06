<template>
  <el-select clearable v-model="industry" placeholder="请选择">
    <el-option v-for="(item,index) in industrys" :key="index" :label="item" :value="index">
    </el-option>
  </el-select>
</template>
<script>
export default {
  name: "select-industry",
  data() {
    return {
      industry: "",
      industrys: this.$dict.industry
    };
  },
  watch: {
    industry: function() {
      this.$emit("input", this.industry);
    },
    value: function() {
      this.industry = this.value;
    }
  },
  props: {
    value: [String, Number]
  },
  created() {}
};
</script>