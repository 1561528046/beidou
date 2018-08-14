<template>
  <el-select v-model="package_id" placeholder="请选择" filterable :clearable="clearable">
    <el-option v-for="item in list" :key="item.package_id" :label="item.title" :value="item.package_id">
    </el-option>
  </el-select>
</template>
<script>
import { getProductAll } from "@/api/index.js";
export default {
  name: "select-product",
  data() {
    return {
      package_id: "",
      list: []
    };
  },
  watch: {
    package_id: function() {
      this.$emit("input", this.package_id);
    },
    value: function() {
      this.package_id = this.value;
      if (this.list.length == 0) {
        this.init();
      }
    }
  },
  props: {
    value: String,
    clearable: Boolean
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      getProductAll().then(res => {
        if (res.data.code == 0 && res.data.data.length) {
          this.$set(this.$data, "list", res.data.data);
          if (this.value && this.value.length) {
            this.package_id = this.value;
          }
        }
      });
    }
  }
};
</script>