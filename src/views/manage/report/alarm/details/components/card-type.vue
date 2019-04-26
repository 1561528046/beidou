<template>
  <el-form status-icon @submit.native.prevent size="small" ref="baseForm" class="msg-form">
    <el-form-item>
      <el-checkbox-group v-model="checkList">
        <el-row>
          <el-col :span="8" v-for="(val,key) in $dict.alarm" :key="key">
            <el-checkbox :label="key">{{val}}</el-checkbox>
          </el-col>
          <!--  <el-col :span="8">
            <el-checkbox label="1">紧急报警</el-checkbox>
          </el-col>
          <el-col :span="8">
            <el-checkbox label="2">超速报警</el-checkbox>
          </el-col>
          <el-col :span="8">
            <el-checkbox label="4">疲劳驾驶</el-checkbox>
          </el-col>
          <el-col :span="8">
            <el-checkbox label="8">预警</el-checkbox>
          </el-col>
          <el-col :span="8">
            <el-checkbox label="8192">超速预警</el-checkbox>
          </el-col>
          <el-col :span="8">
            <el-checkbox label="16384">疲劳驾驶预警</el-checkbox>
          </el-col>
          <el-col :span="8">
            <el-checkbox label="262144">当天累计驾驶超时</el-checkbox>
          </el-col>
          <el-col :span="8">
            <el-checkbox label="524288">超时停车</el-checkbox>
          </el-col>
          <el-col :span="8">
            <el-checkbox label="1048576">进出区域</el-checkbox>
          </el-col>
          <el-col :span="8">
            <el-checkbox label="2097152">进出路线</el-checkbox>
          </el-col>
          <el-col :span="8">
            <el-checkbox label="4194304">路段行驶时间不足/过长</el-checkbox>
          </el-col>
          <el-col :span="8">
            <el-checkbox label="8388608">路线偏离报警</el-checkbox>
          </el-col>
          <el-col :span="8">
            <el-checkbox label="33554432">车辆油量异常</el-checkbox>
          </el-col>
          <el-col :span="8">
            <el-checkbox label="67108864">车辆被盗</el-checkbox>
          </el-col>
          <el-col :span="8">
            <el-checkbox label="134217728">车辆非法点火</el-checkbox>
          </el-col>
          <el-col :span="8">
            <el-checkbox label="536870912">碰撞预警</el-checkbox>
          </el-col>
          <el-col :span="8">
            <el-checkbox label="1073741824">侧翻预警</el-checkbox>
          </el-col>
          <el-col :span="8">
            <el-checkbox label="2147483648">非法开门报警</el-checkbox>
          </el-col>

          <el-col :span="8">
            <el-checkbox label="4294967296">视频信号丢失</el-checkbox>
          </el-col>
          <el-col :span="8">
            <el-checkbox label="8589934592">视频信号遮挡</el-checkbox>
          </el-col>
          <el-col :span="8">
            <el-checkbox label="17179869184">存储单元故障</el-checkbox>
          </el-col>
          <el-col :span="8">
            <el-checkbox label="34359738368">其他视频设备故障</el-checkbox>
          </el-col>
          <el-col :span="8">
            <el-checkbox label="68719476736">客车超员</el-checkbox>
          </el-col>
          <el-col :span="8">
            <el-checkbox label="137438953472">异常驾驶行为</el-checkbox>
          </el-col>
          <el-col :span="8">
            <el-checkbox label="274877906944">特殊录像报警达到存储阈值</el-checkbox> 
          </el-col>-->
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
      checkList: []
    };
  },
  methods: {
    formSubmit() {
      this.$emit("card", this.checkList);
    }
  },
  watch: {
    type: function() {
      this.$set(this.$data, "checkList", this.$props.type);
    }
  },
  props: {
    type: Array
  }
};
</script>
