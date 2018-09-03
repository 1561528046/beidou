<template>
    <el-select clearable v-model="fault_type" placeholder="请选择">
        <el-option v-for="(item,index) in fault_types" :key="item" :label="item" :value="index">
        </el-option>
    </el-select>
</template>
<script>
export default {
  name: "select-faulttype",
  data() {
    return {
      fault_type: "",
      fault_types: this.$dict.fault_type
    };
  },
  watch: {
    fault_type: function() {
      this.$emit("input", this.fault_type);
    }
  },
  props: {
    value: String
  },
  created() {}
};
</script>