<template>
  <div>
    <el-form :model="formData" label-width="200px" label-position="left" size="small">
      <el-row :gutter="20">
        <el-col>
          <el-form-item label="特殊报警录像存储阈值">
            <el-input v-model="formData.x0079Item.AlarmValue" placeholder="请输入特殊报警录像存储阈值（1-99）"></el-input>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="特殊报警录像持续时间">
            <el-input v-model="formData.x0079Item.AlarmDuration" placeholder="请输入特殊报警录像持续时间（分钟）"></el-input>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="特殊报警标识持续起始时间">
            <el-input v-model="formData.x0079Item.AlarmStartTime" placeholder="请输入特殊报警标识持续起始时间（分钟）"></el-input>
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
      if (data.Parameters[0].ParameterId == 121) {
        this.$set(this.formData, "x0079Item", data.Parameters[0].x0079Item[0]);
      }
    });
  },
  data() {
    return {
      formData: {
        MessageID: "x8103",
        SimID: "",
        ParameterId: 121,
        x0079Item: {
          AlarmValue: "", //特殊报警录像存储阈值
          AlarmDuration: "", //特殊报警录像持续时间
          AlarmStartTime: "" //特殊报警录像起始时间
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