<template>
  <div>
    <el-form :model="formData" :rules="rules" label-width="130px" label-position="left">
      <el-row>
        <el-col :span="8">
          <el-form-item label="目标车牌号：">
            <el-input style="width:90%" v-model="formData.VEHICLE_NO" size="small"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="目标车牌颜色：">
            <el-select style="width:90%" size="small" v-model="formData.VEHICLE_COLOR">
              <el-option v-for="(item,index) in this.$dict.color" :key="index" :value="index" :label="item">{{item}}</el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="子业务类型标识：">
            <el-input style="width:90%" size="small" v-model="formData.DATA_TYPE"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="车牌号：">
            <el-input style="width:90%" size="small" v-model="formData.DATA_TYPE"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="车牌颜色：">
            <el-input v-model="formData.INFO_ID" size="small" style="width:90%;"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="运输行业编码：">
            <el-input size="small" style="width:90%"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="车籍地：">
            <el-input size="small" style="width:90%"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="业户ID：">
            <el-input size="small" style="width:90%"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="业户名称：">
            <el-input size="small" style="width:90%"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="业户联系电话：">
            <el-input size="small" style="width:90%"></el-input>
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
    this.$instruction.on("x1601", eve => {
      console.log(eve.data);
    });
  },
  data() {
    return {
      formData: {
        DATA_TYPE: "",
        VEHICLE_NO: "",
        VEHICLE_COLOR: ""
      },
      CAR_INFO: {
        VIN: "",
        VEHICLE_COLOR: "",
        VEHICLE_TYPE: "",
        TRANS_TYPE: "",
        VEHICLE_NATIONALITY: "",
        OWERS_ID: "",
        OWERS_NAME: "",
        WOERS_TEL: ""
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