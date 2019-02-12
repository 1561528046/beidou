<template>
  <el-form
    status-icon
    :rules="rules"
    :model="formData"
    size="small"
    ref="baseForm"
    class="msg-form"
  >
    <!-- 设备信息 -->
    <el-row :gutter="30">
      <el-col :span="12">
        <el-col :span="12">
          <el-form-item label="终端类型" prop="device_type">
            <el-select v-model="formData.device_type" placeholder="选择终端类型" style="width:100%;">
              <el-option label="定位终端" value="1"></el-option>
              <el-option label="视频终端" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="终端ID" prop="device_no">
            <el-input v-model="formData.device_no" placeholder="终端ID"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="SIM ID" prop="sim_id">
            <el-input v-model="formData.sim_id" maxlength="14" placeholder="SIM ID"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="终端厂商" prop="company_id">
            <company-select v-model="formData.company_id" style="width: 100%;"></company-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="协议类型" prop="protocol_type">
            <span v-if="!formData.device_type">--</span>
            <span v-if="formData.device_type==1">808部标协议</span>
            <span v-if="formData.device_type==2">1078部标协议</span>
          </el-form-item>
        </el-col>
        <template v-if="formData.device_type==2">
          <el-col :span="24">
            <el-form-item label="存储介质" prop="save_media">
              <el-select v-model="formData.save_media" placeholder="选择" style="width:100%;">
                <el-option label="硬盘" value="1"></el-option>
                <el-option label="SD卡" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="摄像头数量" prop="camera_num">
              <br>
              <el-radio v-model="formData.camera_num" label="4">&nbsp; 4路</el-radio>
              <el-radio v-model="formData.camera_num" label="6">&nbsp; 6路</el-radio>
              <el-radio v-model="formData.camera_num" label="8">&nbsp; 8路</el-radio>
              <br>
              <el-radio v-model="formData.camera_num" label="10">10路</el-radio>
              <el-radio v-model="formData.camera_num" label="12">12路</el-radio>
              <el-radio v-model="formData.camera_num" label="14">14路</el-radio>
            </el-form-item>
          </el-col>
        </template>
      </el-col>
      <el-col :span="12">
        <el-col :span="12">
          <el-form-item prop="sim_no" label="SIM卡号">
            <el-input v-model="formData.sim_no"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="icc_id" label="ICCID">
            <el-input v-model="formData.icc_id"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="belong" label="所属运营商">
            <el-select v-model="formData.belong" style="width: 100%;">
              <el-option
                v-for="belongItem in belongSelect"
                :key="belongItem"
                :label="belongItem"
                :value="belongItem"
              ></el-option>
            </el-select>
            <el-input v-model="formData.belong" v-if="formData.belong == '其他'" placeholder="填写运营商"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="flow" label="流量">
            <el-input v-model="formData.flow"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="note" label="备注">
            <el-input v-model="formData.note"></el-input>
          </el-form-item>
        </el-col>
      </el-col>
    </el-row>
    <el-form-item>
      <el-button
        style="display:block; margin:0 auto"
        size="small"
        @click="addFill"
        type="primary"
      >提交</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { rules } from "@/utils/rules.js";
import {
  existDeviceId,
  existDeviceSimId,
  getDeviceAndSIMIDByVID,
  AddDeviceSimToVehicle
} from "@/api/index.js";
import companySelect from "@/components/select-company.vue";
export default {
  components: { companySelect },
  data() {
    return {
      belongSelect: ["中国移动", "中国联通", "中国电信", "其他"],
      formData: {
        device_type: "",
        device_no: "",
        company_id: "",
        sim_id: "",
        protocol_type: "",
        camera_num: "",
        save_media: "",
        sim_no: "",
        icc_id: "",
        belong: "",
        user_id: "",
        note: "",
        flow: "",
        vehicleId: ""
      },
      rules: {
        ...rules,
        device_type: [
          { required: true, trigger: "change", message: "必须选择终端类型" }
        ],
        company_id: [
          { required: true, trigger: "change", message: "必须选择终端厂商" }
        ],
        device_no: [
          {
            required: true,
            trigger: "blur",
            validator: this.validateDeviceId
          },
          {
            pattern: /^[0-9a-zA-Z]+$/,
            message: "只能输入字母和数字！"
          }
        ],
        sim_id: [
          {
            trigger: "blur",
            validator: this.validateDeviceSimId,
            required: true
          },
          {
            pattern: /^[0-9a-zA-Z]+$/,
            message: "只能输入字母和数字！"
          },
          {
            pattern: /^.{11}$/,
            message: "SimID只能为11位"
          }
        ],
        belong: { required: true, message: "请选择运营商", trigger: "change" },
        sim_no: [
          { trigger: "blur", validator: this.validateSimNo },
          {
            required: true,
            min: 11,
            max: 14,
            message: "长度在 11 到 14 个字符"
          },
          {
            pattern: /^[0-9a-zA-Z]+$/,
            message: "只能输入字母和数字！"
          }
        ],
        icc_id: [{ trigger: "blur", validator: this.validateIccid }]
      }
    };
  },
  watch: {
    "formData.device_type": function() {
      this.formData.protocol_type = this.formData.device_type;
    }
  },
  props: ["vehicleid"],
  created() {
    this.$set(this.formData, "vehicleId", this.$props.vehicleid);
    getDeviceAndSIMIDByVID({ vehicle_id: this.$props.vehicleid }).then(res => {
      if (res.data.code == 0) {
        this.$set(this.formData, "device_no", res.data.data[0].device_no);
        this.$set(this.formData, "sim_id", res.data.data[0].sim_id);
      } else {
        return this.$notify({
          message: res.data.msg,
          title: "提示",
          type: "error"
        });
      }
    });
  },
  methods: {
    // 提交
    addFill() {
      this.$refs.baseForm.validate(isVaildate => {
        if (isVaildate) {
          var postData = Object.assign({}, this.formData);
          AddDeviceSimToVehicle(postData)
            .then(res => {
              if (res.data.code == 0) {
                this.$emit("success");
                this.$notify({
                  message: res.data.msg,
                  title: "提示",
                  type: "success"
                });
              } else {
                this.$notify({
                  message: res.data.msg,
                  title: "提示",
                  type: "error"
                });
              }
            })
            .catch(() => {
              this.$alert("接口错误", "提示", {
                type: "error"
              });
            });
        }
      });
    },
    // 设备ID验证
    validateDeviceId(rule, value, callback) {
      if (value == "") {
        callback(new Error("请输入终端ID！"));
        return false;
      }
      existDeviceId({ device_id: value })
        .then(res => {
          if (res.data.code == 1) {
            callback(new Error("终端ID重复！"));
          } else {
            callback();
          }
        })
        .catch(() => {
          callback(new Error("服务器重复验证失效，请稍候再试"));
        });
    },
    // SIMID验证
    validateDeviceSimId(rule, value, callback) {
      if (value == "") {
        callback(new Error("请输入SimID"));
        return false;
      }
      existDeviceSimId({ sim_id: value })
        .then(res => {
          if (res.data.code == 1) {
            callback(new Error("SIMID重复！"));
          } else {
            callback();
          }
        })
        .catch(() => {
          callback(new Error("服务器重复验证失效，请稍候再试"));
        });
    }
  }
};
</script>