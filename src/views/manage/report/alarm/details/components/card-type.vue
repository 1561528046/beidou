<template>
  <el-form status-icon @submit.native.prevent size="small" ref="baseForm" class="msg-form">
    <el-form-item>
      <el-checkbox-group v-model="alarmList">
        <el-row>
          <el-col :span="8" v-for="(val,key) in $dict.alarm" :key="key">
            <el-checkbox :label="key">{{val}}</el-checkbox>
          </el-col>
        </el-row>
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
      alarmList: []
    };
  },
  methods: {
    formSubmit() {
      this.$emit("card", this.alarmList);
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
