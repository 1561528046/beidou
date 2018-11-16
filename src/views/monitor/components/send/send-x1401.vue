<template>
  <div>
    <el-form :model="formData" :rules="rules" label-width="130px" label-position="left">
      <el-row>
        <el-col :span="8">
          <el-form-item label="车牌号：">
            <el-input style="width:90%" v-model="formData.VEHICLE_NO" size="small"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="车牌颜色：">
            <el-select style="width:90%" size="small" v-model="formData.VEHICLE_COLOR">
              <el-option v-for="(item,index) in this.$dict.color" :key="index" :value="index" :label="item">{{item}}</el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="报警督办ID：">
            <el-input v-model="formData.SUPERVISION_ID" size="small" style="width:90%;"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="报警处理结果：">
            <el-select style="width:90%;" size="small" v-model="formData.RESULT">
              <el-option value="0" label="处理中">处理中</el-option>
              <el-option value="1" label="以处理完毕">已处理完毕</el-option>
              <el-option value="2" label="不作处理">不作处理</el-option>
              <el-option value="3" label="将来处理">将来处理</el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-button @click="send" style="display:block;margin:0 auto;" type="primary" size="small">发送</el-button>
    </el-form>
  </div>
</template>
<script>
export default {
  created() {
    this.$instruction.on("x1401", eve => {
      console.log(eve.data);
    });
  },
  data() {
    return {
      formData: {
        MSG_ID: "x1400",
        DATA_TYPE: 0x1401,
        VEHICLE_NO: "",
        VEHICLE_COLOR: "",
        SUPERVISION_ID: "",
        RESULT: ""
      },
      rules: {
        VEHICLE_NO: [
          {
            required: true,
            message: "请输入车牌号",
            trigger: "change"
          }
        ],
        VEHICLE_COLOR: [
          {
            required: true,
            message: "请选择车牌颜色",
            trigger: "change"
          }
        ],
        DATA_TYPE: [
          {
            required: true,
            message: "请输入子业务类型标识",
            trigger: "change"
          }
        ]
      }
    };
  },
  methods: {
    send() {
      var data = JSON.stringify(this.formData);
      this.$instruction.send(data);
    }
  }
};
</script>