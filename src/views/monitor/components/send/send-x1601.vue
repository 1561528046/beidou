<template>
  <div>
    <el-form :model="formData" :rules="rules" label-width="140px" label-position="left">
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
          <el-form-item label="车牌号：">
            <el-input style="width:90%" size="small" v-model="CAR_INFO.VIN"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="车牌颜色：">
            <el-select style="width:90%" size="small" v-model="CAR_INFO.VEHICLE_COLOR">
              <el-option v-for="(item,index) in this.$dict.color" :key="index" :value="index" :label="item">{{item}}</el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="车辆类型：">
            <el-select style="width:90%" size="small" v-model="CAR_INFO.VEHICLE_TYPE">
              <el-option v-for="(item,index) in this.$dict.vehicle" :key="index" :value="index" :label="item">{{item}}</el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="运输行业编码：">
            <el-input v-model="CAR_INFO.TRANS_TYPE" size="small" style="width:90%"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="车籍地：">
            <el-input v-model="CAR_INFO.VEHICLE_NATIONALITY" size="small" style="width:90%"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="业户ID：">
            <el-input v-model="CAR_INFO.OWERS_ID" size="small" style="width:90%"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="业户名称：">
            <el-input v-model="CAR_INFO.OWERS_NAME" size="small" style="width:90%"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="业户联系电话：">
            <el-input v-model="CAR_INFO.WOERS_TEL" size="small" style="width:90%"></el-input>
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
import { rules } from "@/utils/rules.js";
import { GetServerByPage } from "@/api/index.js";
export default {
  created() {
    GetServerByPage({ page: 1, size: 999, flag: 809, title: "" }).then(res => {
      if (res.data.code == 0) {
        this.$set(this.$data, "tableData", res.data.data);
      }
    });
    this.$instruction.on("x1601", eve => {
      console.log(eve.data);
    });
  },
  data() {
    return {
      tableData: [],
      formData: {
        MSG_ID: "x1600",
        DATA_TYPE: 0x1601,
        VEHICLE_NO: "",
        VEHICLE_COLOR: "",
        CAR_INFO: "",
        MSG_GNSSCENTERID: ""
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
        ...rules,
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
        ]
      }
    };
  },
  methods: {
    send() {
      var str = "";
      str =
        "VIN:=" +
        this.CAR_INFO.VIN +
        ";" +
        "VEHICLE_COLOR:=" +
        this.CAR_INFO.VEHICLE_COLOR +
        ";" +
        "VEHICLE_TYPE:=" +
        this.CAR_INFO.VEHICLE_TYPE +
        ";" +
        "TRANS_TYPE:=" +
        this.CAR_INFO.TRANS_TYPE +
        ";" +
        "VEHICLE_NATIONALITY:=" +
        this.CAR_INFO.VEHICLE_NATIONALITY +
        ";" +
        "OWERS_ID:=" +
        this.CAR_INFO.OWERS_ID +
        ";" +
        "OWERS_NAME:=" +
        this.CAR_INFO.OWERS_NAME +
        ";" +
        "WOERS_TEL:=" +
        this.CAR_INFO.WOERS_TEL;
      this.formData.CAR_INFO = str;
      var data = JSON.stringify(this.formData);
      this.$instruction.send(data);
    }
  }
};
</script>