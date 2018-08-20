<template>
  <el-select :clearable="clearable" v-model="flue_type" placeholder="请选择燃油种类">
    <el-option v-for="(item,index) in flue_types" :key="index" :label="item" :value="index">
    </el-option>
  </el-select>
</template>
<script>
export default {
  name: "select-flue_type",
  data() {
    return {
      flue_type: this.$props.value,
      flue_types: this.$dict.flue_type
    };
  },
  watch: {
    flue_type: function() {
      this.$emit("input", this.flue_type);
    }
  },
  props: {
    value: [String, Number],
    clearable: Boolean
  },
  created() {}
};
</script>