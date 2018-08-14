<template slot-scope="scope">
    <el-select v-model="role_id" placeholder="请选择" filterable no-match-text=" " :clearable="clearable">
        <template slot-scope="scope">
            <el-option v-for="item in list" :key="item.role_id" :label="item.role_name" :value="item.role_id">
            </el-option>
        </template>
    </el-select>
</template>
<script>
import { getRoleAll } from "@/api/index.js";
export default {
  name: "select-company",
  data() {
    return {
      role_id: "",
      list: []
    };
  },
  watch: {
    role_id: function() {
      this.$emit("input", this.role_id);
    },
    value: function() {
      this.role_id = this.value;
      if (this.list.length == 0) {
        this.init();
      }
    }
  },
  props: {
    value: String,
    clearable: Boolean
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      getRoleAll().then(res => {
        if (res.data.code == 0 && res.data.data.length) {
          this.$set(this.$data, "list", res.data.data);
          if (this.value && this.value.length) {
            this.role_id = this.value;
          }
        }
      });
    }
  }
};
</script>