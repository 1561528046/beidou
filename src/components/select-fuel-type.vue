<template>
  <el-select :clearable="clearable" v-model="fuel_type" placeholder="请选择燃油种类">
    <el-option v-for="(item,index) in fuel_types" :key="index" :label="item" :value="index">
    </el-option>
  </el-select>
</template>
<script>
export default {
  name: "select-fuel_type",
  data() {
    return {
      fuel_type: "",
      fuel_types: this.$dict.fuel_type
    };
  },
  watch: {
    fuel_type: function() {
      this.$emit("input", this.fuel_type);
    },
    value: function() {
      this.fuel_type = this.$props.value;
    }
  },
  props: {
    value: [String, Number],
    clearable: Boolean
  },
  created() {}
};
</script>