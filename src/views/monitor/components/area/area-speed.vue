<template>
  <div>
    <!-- 分段限速 -->
    <el-form :model="formData">
      <el-row :gutter="30">
        <el-col>
          <el-form-item label="规则名称">
            <el-input size="small" v-model="formData.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="最高速度">
            <el-input size="small" v-model="formData.MaxSpeed"></el-input>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="最低速度">
            <el-input size="small" v-model="formData.MinSpeed"></el-input>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="偏移宽度">
            <el-input size="small" v-model="formData.offset_width"></el-input>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="时间范围">
            <el-date-picker v-model="time" style="width:100%" size="small" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-form-item>
          <el-button size="small" type="primary" @click="formSubmit">提交</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      time: "",
      formData: {
        name: "",
        MaxSpeed: "",
        MinSpeed: "",
        offset_width: ""
      }
    };
  },
  methods: {
    formSubmit() {}
  }
};
</script>