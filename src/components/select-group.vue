<template>
  <el-select clearablet v-model="detail_name" placeholder="请选择">
    <el-option v-for="item in list" :key="item.belong" :label="item.belong" :value="item.belong"></el-option>
  </el-select>
</template>
<script>
import { getGroupByBelong } from "@/api/index.js";
export default {
  data() {
    return {
      detail_name: "",
      list: []
    };
  },
  watch: {
    detail_name: function() {
      this.$emit("input", this.detail_name);
    }
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      getGroupByBelong().then(res => {
        if (res.data.code == 0) {
          this.$set(this.$data, "list", res.data.data);
        }
      });
    }
  }
};
</script>
