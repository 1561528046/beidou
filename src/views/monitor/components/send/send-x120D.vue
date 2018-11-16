<template>
  <div>
    <el-form :model="formData" :rules="rules" label-width="140px" label-position="left">
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
          <el-form-item label="子业务类型标识：">
            <el-input style="width:90%" size="small" v-model="formData.DATA_TYPE"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="电子运单数据内容：">
            <el-input v-model="formData.EWAYBILL_INFO" size="small" style="width:90%"></el-input>
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
    this.$instruction.on("x120D", eve => {
      console.log(eve.data);
    });
  },
  data() {
    return {
      formData: {
        DATA_TYPE: "",
        VEHICLE_NO: "",
        VEHICLE_COLOR: "",
        EWAYBILL_INFO: ""
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
        ],
        EWAYBILL_INFO: [
          {
            required: true,
            message: "请输入电子运单数据内容",
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