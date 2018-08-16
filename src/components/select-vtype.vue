<template>
  <el-select :clearable="clearable" v-model="vtype" placeholder="请选择燃油种类">
    <el-option v-for="(item,index) in vtypes" :key="index" :label="item" :value="index">
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