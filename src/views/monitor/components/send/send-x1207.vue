<template>
  <div>
    <el-form :model="formData" :rules="rules" label-width="140px" label-position="left">
      <el-row>
        <el-col :span="8">
          <el-form-item prop="VEHICLE_NO" label="车牌号：">
            <el-input style="width:90%" v-model="formData.VEHICLE_NO" size="small"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="VEHICLE_COLOR" label="车牌颜色：">
            <el-select style="width:90%" size="small" v-model="formData.VEHICLE_COLOR">
              <el-option v-for="(item,index) in this.$dict.color" :key="index" :value="index" :label="item">{{item}}</el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="时间：">
            <el-date-picker style="width:90%" value-format="yyyy-MM-dd HH:mm:ss" size="small" v-model="time" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="上级平台：">
            <el-select v-model="formData.MSG_GNSSCENTERID" style="width:90%" size="small">
              <el-option v-for="item in tableData" :key="item.server_id" :value="item.access_code" :label="item.title">{{item.title}}</el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-button @click="send" style="display:block;margin:0 auto;" type="primary" size="small">发送</el-button>
    </el-form>
  </div>
</template>
<script>
import { GetServerByPage } from "@/api/index.js";
export default {
  created() {
    GetServerByPage({ page: 1, size: 999, flag: 809, title: "" }).then(res => {
      if (res.data.code == 0) {
        this.$set(this.$data, "tableData", res.data.data);
      }
    });
    this.$instruction.on("x1207", eve => {
      console.log(eve.data);
    });
  },
  data() {
    return {
      tableData: [],
      time: "",
      formData: {
        MSG_ID: "X1200",
        DATA_TYPE: 0x1207,
        VEHICLE_NO: "",
        VEHICLE_COLOR: "",
        START_TIME: "",
        END_TIME: "",
        MSG_GNSSCENTERID: ""
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
      if (this.time != "" && this.time != null) {
        this.formData.START_TIME = this.time[0];
        this.formData.END_TIME = this.time[1];
      } else {
        this.formData.START_TIME = "";
        this.formData.END_TIME = "";
      }
      var data = JSON.stringify(this.formData);
      this.$instruction.send(data);
    }
  }
};
</script>