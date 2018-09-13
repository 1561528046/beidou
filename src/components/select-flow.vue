<template>
  <el-select clearablet v-model="count" placeholder="请选择">
    <el-option v-for="item in list" :key="item.flow" :label="item.flow" :value="item.flow"></el-option>
  </el-select>
</template>
<script>
import { getGroupByFlow } from "@/api/index.js";
export default {
  data() {
    return {
      count: "",
      list: []
    };
  },
  created() {
    this.initData();
  },
  watch: {
    count: function() {
      this.$emit("input", this.count);
    }
  },
  methods: {
    initData() {
      getGroupByFlow().then(res => {
        if (res.data.code == 0) {
          this.$set(this.$data, "list", res.data.data);
        }
      });
    }
  }
};
</script>
