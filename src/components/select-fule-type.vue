<template>
  <el-select :clearable="clearable" v-model="fule_type" placeholder="请选择燃油种类">
    <el-option v-for="(item,index) in fule_types" :key="index" :label="item" :value="index">
    </el-option>
  </el-select>
</template>
<script>
export default {
  name: "select-fule_type",
  data() {
    return {
      fule_type: this.$props.value,
      fule_types: this.$dict.fule_type
    };
  },
  watch: {
    fule_type: function() {
      this.$emit("input", this.fule_type);
    }
  },
  props: {
    value: [String, Number],
    clearable: Boolean
  },
  created() {}
};
</script>