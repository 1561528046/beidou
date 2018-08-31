<template slot-scope="scope">
  <el-select v-model="company_id" placeholder="请选择" filterable no-match-text=" " :clearable="clearable">
    <template slot-scope="scope">
      <el-option v-for="item in list" :key="item.company_id" :label="item.company_name" :value="item.company_id">
      </el-option>
    </template>
  </el-select>
</template>
<script>
import { getDeviceCompanyAll } from "@/api/index.js";
export default {
  name: "select-company",
  data() {
    return {
      company_id: "",
      list: []
    };
  },
  watch: {
    company_id: function() {
      this.$emit("input", this.company_id);
      var company = "";
      if (this.company_id) {
        company = this.list.filter(item => {
          return item.company_id == this.company_id;
        })[0].company_name;
      }
      this.$emit("update:company_name", company);
    },
    value: function() {
      this.company_id = this.value;
      if (this.list.length == 0) {
        this.init();
      }
    }
  },
  computed: {},
  props: {
    value: String,
    clearable: Boolean
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      getDeviceCompanyAll().then(res => {
        if (res.data.code == 0 && res.data.data.length) {
          this.$set(this.$data, "list", res.data.data);
          if (this.value && this.value.length) {
            this.company_id = this.value;
          }
        }
      });
    }
  }
};
</script>