<template>
    <el-select clearable v-model="alarm_type" placeholder="请选择">
        <el-option v-for="(item,index) in alarm_types" :key="item" :label="item" :value="index">
        </el-option>
    </el-select>
</template>
<script>
export default {
  name: "select-alarmtype",
  data() {
    return {
      alarm_type: "",
      alarm_types: this.$dict.alarm_type
    };
  },
  watch: {
    alarm_type: function() {
      this.$emit("input", this.alarm_type);
    }
  },
  props: {
    value: String
  },
  created() {}
};
</script>