<template>
    <el-select clearable v-model="order_state" placeholder="请选择">
        <el-option v-for="(item,index) in order_states" :key="item" :label="item" :value="index">
        </el-option>
    </el-select>
</template>
<script>
export default {
  name: "select-orderstate",
  data() {
    return {
      order_state: "",
      order_states: this.$dict.order_state
    };
  },
  watch: {
    order_state: function() {
      this.$emit("input", this.order_state);
    }
  },
  props: {
    value: String
  },
  created() {}
};
</script>