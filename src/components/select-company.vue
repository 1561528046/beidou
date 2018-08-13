<template slot-scope="scope">
  <el-select v-model="company_id" placeholder="请选择" filterable no-match-text=" " :clearable="clearable">
    <template slot-scope="scope">
      <el-option v-for="item in lists" :key="item.company_id" :label="item.company_name" :value="item.company_id">
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
    },
    value: function() {
      this.company_id = this.value;
      if (this.list.length == 0) {
        this.init();
      }
    }
  },
  computed: {
    lists: function() {
      var metas = [];
      for (var i = 0; i < this.list.length; i++) {
        if (this.list[i].company_id == this.company_id) {
          console.log(1);
        } else {
          metas.push(this.list[i]);
        }
      }
      return metas;
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