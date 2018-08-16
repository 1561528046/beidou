<template>
  <el-select :clearable="clearable" v-model="vehicle_type" placeholder="请选择车辆类型">
    <el-option v-for="(item,index) in vehicle_types" :key="index" :label="item" :value="index">
    </el-option>
  </el-select>
</template>
<script>
export default {
  name: "select-vehicle_type",
  data() {
    return {
      vehicle_type: this.$props.value,
      vehicle_types: this.$dict.vehicle_type
    };
  },
  watch: {
    vehicle_type: function() {
      this.$emit("input", this.vehicle_type);
    }
  },
  props: {
    value: [String],
    clearable: Boolean
  },
  created() {}
};
</script>