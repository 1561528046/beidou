<template>
  <el-form status-icon @submit.native.prevent size="small" ref="baseForm" class="msg-form">
    <el-form-item label="常规报警类型：">
      <el-checkbox-group v-model="alarm">
        <el-checkbox v-for="(val,key) in $dict.alarm" :key="key" :label="key">{{val}}</el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item label="高级驾驶辅助报警类型：">
      <el-checkbox-group v-model="alarm_64">
        <el-checkbox v-for="(val,key) in $dict.additional_alarm_64" :key="key" :label="key">{{val}}</el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item label="驾驶员状态监控报警类型：">
      <el-checkbox-group v-model="alarm_65">
        <el-checkbox v-for="(val,key) in $dict.additional_alarm_65" :key="key" :label="key">{{val}}</el-checkbox>>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item style="text-align:center; margin-top:20px;margin-bottom:-10px;">
      <el-button type="primary" size="small" @click="formSubmit">提交</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
export default {
  created() {},
  mounted() {},
  data() {
    return {
      alarm: [],
      alarm_64: [],
      alarm_65: []
    };
  },
  methods: {
    formSubmit() {
      var data = {};
      data = {
        alarm: this.alarm,
        alarm_64: this.alarm_64,
        alarm_65: this.alarm_65
      };
      this.$emit("card", data);
    }
  },
  watch: {
    type: function() {
      // this.$set(this.$data, "alarm", this.$props.type);
    }
  },
  props: {
    // type: Array
  }
};
</script>
