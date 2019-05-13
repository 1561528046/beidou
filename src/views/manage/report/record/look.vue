<template>
  <div>
    <el-form :model="formData" size="small">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-row>
            <el-col>
              <el-form-item label="姓名">{{formData.driver_name}}</el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="性别">
                <label v-show="formData.driver_sex=='1'">男</label>
                <label v-show="formData.driver_sex=='2'">女</label>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="出生日期">{{$utils.formatDate(formData.driver_birth)}}</el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="住址">{{formData.address}}</el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="联系方式">{{formData.tel}}</el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="准驾车型">
                <label v-show="formData.quasi_driving=='A1'">A1</label>
                <label v-show="formData.quasi_driving=='A2'">A2</label>
                <label v-show="formData.quasi_driving=='A3'">A3</label>
                <label v-show="formData.quasi_driving=='B1'">B1</label>
                <label v-show="formData.quasi_driving=='B2'">B2</label>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="驾驶证号">{{formData.identity_id}}</el-form-item>
            </el-col>
            <el-col>
              <el-form-item
                label="驾驶证有效期"
              >{{$utils.formatDate(formData.begin_date)}}——{{$utils.formatDate(formData.end_date)}}</el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="驾驶员身份识别卡编号">{{formData.driver_card_id}}</el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-form-item label="驾驶员正面照">
            <div style="width:220px;height:220px">
              <img :src="$dict.BASE_URL+formData.photo_path" style="width:100%;height:100%" alt>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="记录姓名">{{formData.driver_name1}}</el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="记录照片">
            <div style="width:220px;height:220px">
              <img :src="formData.url" style="width:100%;height:100%" alt>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { GetDriverCheckByID } from "@/api/index.js";
// import moment from "moment";
export default {
  data() {
    return {
      formData: {}
    };
  },
  mounted() {},
  created() {
    GetDriverCheckByID({ sim_id: this.$props.simID }).then(res => {
      if (res.data.code == 0) {
        res.data.data[0].url =
          this.$dict.BASE_URL +
          `api/MultiMedia/GetMultiMediaByType?type=${0}&sim_id=${this.$utils.formatSim(
            res.data.data[0].sim_id
          )}&media_id=${res.data.data[0].multimedia_id}`;
        this.$set(this.$data, "formData", res.data.data[0]);
      } else {
        return this.$notify({
          message: res.data.msg,
          title: "提示",
          type: "error"
        });
      }
    });
  },
  watch: {},
  props: {
    simID: String
  }
};
</script>