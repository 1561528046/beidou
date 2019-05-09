<template>
  <div>
    <el-form :model="formData" size="small">
      <el-row :gutter="20">
        <el-col>
          <el-form-item label="车辆荷载人数">
            <el-input placeholder="请输入车辆荷载人数" v-model="formData.x007BItem.LoadNumber"></el-input>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="疲劳程度阈值">
            <el-input placeholder="请输入疲劳程度阈值" v-model="formData.x007BItem.TiredValue"></el-input>
          </el-form-item>
        </el-col>
        <el-col style="text-align:center">
          <el-form-item label-width="0">
            <el-button @click="submitForm" type="primary">提交</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
export default {
  created() {
    if (this.$props.simid) {
      this.$set(this.formData, "SimID", "0" + this.$props.simid);
    }
    this.$instruction.on("x0104", evt => {
      var data = JSON.parse(evt.data);
      if (data.Parameters[0].ParameterId == 123) {
        this.$set(this.formData, "x007BItem", data.Parameters[0].x007BItem[0]);
      }
    });
  },
  data() {
    return {
      formData: {
        MessageID: "x8103",
        SimID: "",
        ParameterId: 123,
        x007BItem: {
          LoadNumber: "", //车辆荷载人数
          TiredValue: "" //疲劳程度阈值
        }
      }
    };
  },
  props: ["simid"],
  methods: {
    submitForm() {
      this.$instruction.send(JSON.stringify(this.formData));
    }
  }
};
</script>