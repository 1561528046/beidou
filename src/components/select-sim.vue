<template>
  <el-select v-model="sim_no" :placeholder="placeholder" filterable remote :remote-method="remoteMethod" :loading="loading" style="width: 100%;" :clearable="clearable">
    <el-option v-for="item in list" :key="item.sim_no" :label="item.sim_no" :value="item.sim_no">
    </el-option>
  </el-select>
</template>
<script>
import { getSimAll } from "@/api/index.js";
export default {
  data() {
    return {
      loading: false,
      sim_no: "",
      list: []
    };
  },
  watch: {
    sim_no: function() {
      this.$emit("input", this.sim_no);
    },
    value: function() {
      this.sim_no = this.$props.value;
    }
  },
  props: {
    value: [String, Number],
    state: Number,
    clearable: Boolean,
    placeholder: {
      type: [String],
      default: "请输入公司/个人名称搜索"
    }
  },
  created() {
    this.sim_no = this.value;
    this.initData();
  },
  methods: {
    initData() {
      if (!this.sim_no || this.sim_no < 3) {
        return false;
      }
      getSimAll({ sim_no: this.sim_no, state: this.$props.state }).then(res => {
        if (res.data.code == 0) {
          this.$set(this.$data, "list", res.data.data);
        } else {
          this.sim_no = "";
        }
      });
    },
    remoteMethod(query) {
      if (query < 3) {
        return false;
      }
      getSimAll({ sim_no: query, state: this.$props.state }).then(res => {
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