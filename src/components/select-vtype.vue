<template>
  <el-select :clearable="clearable" v-model="vtype" placeholder="请选择燃油种类">
    <el-option v-for="(item,key) in vtypes" :key="key.slice(1)" :label="item" :value="key.slice(1)">
    </el-option>
  </el-select>
</template>
<script>
export default {
  name: "select-vtype",
  data() {
    return {
      vtype: this.$props.value,
      vtypes: this.$dict.vtype
    };
  },
  watch: {
    vtype: function() {
      this.$emit("input", this.vtype);
    }
  },
  props: {
    value: [String, Number],
    clearable: Boolean
  },
  created() {}
};
</script>