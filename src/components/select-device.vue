<template>
  <div>
    <el-select v-model="device_no" placeholder="请选择" filterable remote :remote-method="remoteMethod" :loading="loading" style="width: 100%;" :clearable="clearable">
      <el-option v-for="item in list" :key="item.device_no" :label="item.device_no" :value="item.device_no">
      </el-option>
    </el-select>
  </div>
</template>
<script>
import { getDeviceAll } from "@/api/index.js";
export default {
  data() {
    return {
      loading: false,
      device_no: "",
      list: []
    };
  },
  watch: {
    device_no: function() {
      this.$emit("input", this.device_no);
      var currentData = this.list.filter(item => {
        return item.device_no == this.device_no;
      });
      currentData = currentData[0] || [];
      this.$emit("update:company_name", currentData.company_name);
      this.$emit("update:device_id", currentData.device_id);
    }
  },
  props: {
    value: String,
    query: Object,
    state: Number,
    clearable: Boolean
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      if (!this.$props.value) {
        return false;
      }
      getDeviceAll({
        device_no: this.$props.value,
        state: this.$props.state
      }).then(res => {
        if (res.data.code == 0) {
          this.$set(this.$data, "list", res.data.data);
          this.device_no = this.value;
        } else {
          this.device_no = "";
        }
      });
    },
    remoteMethod(query) {
      if (query < 3) {
        return false;
      }
      getDeviceAll({ device_no: query, state: this.$props.state }).then(res => {
        if (res.data.code == 0) {
          this.$set(this.$data, "list", res.data.data);
        } else {
          this.$set(this.$data, "list", []);
        }
      });
    }
  }
};
</script>