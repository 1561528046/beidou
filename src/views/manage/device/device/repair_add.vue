<template>
  <el-form status-icon :rules="rules" :model="formData" size="small" ref="baseForm" class="msg-form">
    <!-- 设备信息 -->
    <el-row :gutter="30">
      <el-col :span="12">
        <el-form-item prop="remark" label="维修原因">
          <el-input v-model="formData.remark"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="back_time" label="返厂时间">
          <el-date-picker type="date" v-model="formData.back_time" align="center" placeholder="选择日期" style="width:100%;" format="yyyy-MM-dd" value-format="yyyyMMdd">
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="logistics" label=" 物流信息">
          <el-input v-model="formData.logistics"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="last_logistics_no" label=" 物流单号">
          <el-input v-model="formData.last_logistics_no"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item style="text-align:center;">
      <el-button type="primary " size="large " @click="formSubmit">提交</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { rules } from "@/utils/rules.js";
import { updateDeviceRepair, getDeviceAll } from "@/api/index.js";
import selectDevice from "@/components/select-device.vue";
export default {
  data() {
    return {
      formData: {
        remark: "",
        device_id: this.$props.device_id,
        back_time: "",
        logistics: "",
        last_logistics_no: "",
        operate_type: "3"
      },
      rules: {
        ...rules,
        remark: [
          { required: true, message: "请填写维修原因", trigger: "change" }
        ],
        back_time: [
          { required: true, message: "请填写返厂时间", trigger: "change" }
        ],
        logistics: [
          { required: true, message: "请填写物流信息", trigger: "change" }
        ],
        last_logistics_no: [
          { required: true, message: "请填写物流单号", trigger: "change" }
        ]
      },
      simss: [],
      simee: {},
      restaurants: [],
      state1: "",
      state2: ""
    };
  },
  props: {
    device_id: String
  },
  computed: {},
  created() {},
  mounted() {
    this.restaurants = this.loadAll();
  },
  methods: {
    querySearch(queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return restaurant => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    },
    loadAll() {
      getDeviceAll().then(res => {
        if (res.data.code == 0) {
          for (var i = 0; i < res.data.data.length; i++) {
            if (res.data.data[i].real_name !== " ") {
              this.simss.push({ value: res.data.data[i].device_id });
            }
          }
        }
      });
      return this.simss;
    },
    handleSelect(item) {
      this.simee = { value: item.value };
    },
    formSubmit() {
      this.$refs.baseForm.validate((isVaildate, errorItem) => {
        if (isVaildate) {
          var postData = Object.assign({}, this.formData);
          updateDeviceRepair(postData)
            .then(res => {
              if (res.data.code == 0) {
                this.$emit("success");
                this.$notify({
                  title: "成功",
                  message: res.data.msg,
                  type: "success"
                });
              } else {
                this.$emit("error");
                this.$notify({
                  title: "失败",
                  message: res.data.msg,
                  type: "error"
                });
              }
            })
            .catch(() => {
              this.$message.error("接口错误 ");
              this.$emit("error ");
            });
        } else {
          var errormsg = " ";
          for (var key in errorItem) {
            errormsg += errorItem[key][0].message + "<br>";
          }
          this.$notify.error({
            title: "错误",
            dangerouslyUseHTMLString: true,
            message: errormsg
          });
        }
      });
    }
  },
  components: { selectDevice }
};
</script>
<style>
</style>