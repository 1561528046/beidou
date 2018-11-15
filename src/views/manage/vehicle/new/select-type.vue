<template slot-scope="scope">
  <el-select v-model="prodName" placeholder="请输入" filterable no-match-text="" remote :remote-method="remoteMethod" :loading="loading" :clearable="clearable" style="width:100%">
    <template slot-scope="scope">
      <el-option v-for="item in list" :key="item.prodName" :label="item.prodName" :value="item.prodName">
      </el-option>
    </template>
  </el-select>
</template>
<script>
import { getVehicleType } from "@/api/index.js";
export default {
  data() {
    return {
      loading: false,
      prodName: "",
      list: []
    };
  },
  watch: {
    prodName: function() {
      this.$emit("input", this.prodName);
    },
    vbrandName: function() {
      this.list = [];
      this.prodName = "";
    },
    value: function() {
      this.init();
    }
  },
  computed: {},
  props: {
    vbrandName: String,
    value: String,
    clearable: Boolean
  },
  created() {
    if (this.$props.value.length) {
      this.init();
    }
  },
  methods: {
    remoteMethod(query) {
      if (query.length < 3) {
        return false;
      }
      this.loading = true;
      getVehicleType({ brand_name: this.vbrandName, brand_mold: query })
        .then(res => {
          this.loading = false;
          if (res.data.code == 0 && res.data.data.length) {
            this.$set(this.$data, "list", res.data.data);
          } else {
            this.$set(this.$data, "list", []);
          }
        })
        .catch(() => {
          this.loading = false;
          this.$set(this.$data, "list", []);
        });
    },
    init() {
      if (!this.value) {
        //如果没有默认值，不渲染
        return false;
      }
      getVehicleType({ brand_name: this.vbrandName, brand_mold: this.value })
        .then(res => {
          this.loading = false;
          if (res.data.code == 0 && res.data.data.length) {
            this.$set(this.$data, "list", res.data.data);
            this.$nextTick(() => {
              this.prodName = this.value;
            });
          } else {
            this.$set(this.$data, "list", []);
          }
        })
        .catch(() => {
          this.loading = false;
          this.$set(this.$data, "list", []);
        });
    }
  }
};
</script>