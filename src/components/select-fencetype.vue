<template>
    <el-select clearable v-model="fence_type" placeholder="请选择">
        <el-option v-for="(item,index) in fence_types" :key="item" :label="item" :value="index">
        </el-option>
    </el-select>
</template>
<script>
export default {
  name: "select-fencetype",
  data() {
    return {
      fence_type: "",
      fence_types: this.$dict.fence_type
    };
  },
  watch: {
    fence_type: function() {
      this.$emit("input", this.fence_type);
    }
  },
  props: {
    value: String
  },
  created() {}
};
</script>