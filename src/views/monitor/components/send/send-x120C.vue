<template>
  <div>
    <el-form :model="formData" :rules="rules" label-width="140px" label-position="left">
      <el-row>
        <el-col :span="8">
          <el-form-item prop="VEHICLE_NO" label="车牌号：">
            <!-- <el-input style="width:90%" v-model="formData.VEHICLE_NO" size="small"></el-input> -->
            <el-autocomplete class="inline-input" size="small" style="width:90%" :popper-class="autoplate" v-model="formData.VEHICLE_NO" :fetch-suggestions="querySearch" placeholder="请输入车牌号" :trigger-on-focus="false" @select="selectVehicle">
            </el-autocomplete>
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
          <el-form-item label="驾驶员姓名：">
            <el-input v-model="formData.DRIVER_NAME" style="width:90%" size="small"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="身份证编号：">
            <el-input v-model="formData.DRIVER_ID" style="width:90%" size="small"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="从业资格证号：">
            <el-input v-model="formData.LICENCE" style="width:90%" size="small"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="发证机构名称：">
            <el-input v-model="formData.ORG_NAME" style="width:90%" size="small"></el-input>
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
      <el-form-item>
        <el-button @click="send" style="display:block;margin:0 auto;" type="primary" size="small">发送</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
/*eslint-disable*/
import { GetServerByPage, GetVehicleByLicense } from "@/api/index.js";
export default {
  created() {
    GetServerByPage({ page: 1, size: 999, flag: 809, title: "" }).then(res => {
      if (res.data.code == 0) {
        this.$set(this.$data, "tableData", res.data.data);
      }
    });
    this.$instruction.on("x1200", eve => {
      var data = JSON.parse(eve.data);
      if (data.code == "0" && data.DATA_TYPE == 4620) {
        return this.$notify({
          message: "主动上报驾驶员身份信息发送成功!",
          title: "提示",
          type: "success"
        });
      }
    });
  },
  data() {
    return {
      autoplate: "",
      tableData: [],
      vehilceData: {
        license: ""
      },
      formData: {
        MessageID: "x1200",
        DATA_TYPE: 0x120c,
        VEHICLE_NO: "",
        VEHICLE_COLOR: "",
        DRIVER_NAME: "",
        DRIVER_ID: "",
        LICENCE: "",
        ORGNAM: "",
        MSG_GNSSCENTERID: ""
      },
      rules: {
        VEHICLE_NO: [
          {
            required: true,
            message: "请输入车牌号",
            trigger: "blur"
          }
        ],
        VEHICLE_COLOR: [
          {
            required: true,
            message: "请选择车牌颜色",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    send() {
      var data = JSON.stringify(this.formData);
      this.$instruction.send(data);
    },
    querySearch(queryString, cb) {
      var vehicleList = Array.from(monitor.data.values());
      console.log(vehicleList);
      var arr = [];
      if (queryString.length < 7 && queryString.length > 3) {
        this.autoplate = "";
        arr = this.fuzzyQuery(vehicleList, queryString);
        cb(arr);
      } else {
        this.autoplate = "autoplate";
      }
    },
    fuzzyQuery(list, keyWord) {
      var arr = [];
      list.map(item => {
        if (item.license.split(keyWord).length > 1) {
          item.value = item.license;
          arr.push(item);
        }
      });
      return arr;
    },
    selectVehicle() {
      this.vehilceData.license = this.formData.VEHICLE_NO;
      GetVehicleByLicense(this.vehilceData).then(res => {
        if (res.data.code != 0) {
          return this.$notify({
            message: res.data.msg,
            title: "提示",
            type: "error"
          });
        }
      });
    }
  }
};
</script>