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
          <el-form-item label="时间：">
            <el-date-picker style="width:90%" size="small" v-model="time" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
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
    this.$instruction.on("x1209", eve => {
      console.log(eve.data);
    });
  },
  data() {
    return {
      time: "",
      formData: {
        MSG_ID: "x1200",
        DATA_TYPE: 0x1209,
        VEHICLE_NO: "",
        VEHICLE_COLOR: "",
        START_TIME: "",
        END_TIME: ""
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
        time: [
          {
            required: true,
            message: "请选择时间",
            trigger: "change"
          }
        ]
      }
    };
  },
  methods: {
    send() {
      this.formData.START_TIME = this.time[0];
      this.formData.END_TIME = this.time[1];
      var data = JSON.stringify(this.formData);
      this.$instruction.send(data);
    }
  }
};
</script>