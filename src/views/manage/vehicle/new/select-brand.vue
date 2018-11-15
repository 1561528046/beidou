<template slot-scope="scope">
  <el-select v-model="vbrandCode" placeholder="请输入" filterable no-match-text="123" remote :remote-method="remoteMethod" :loading="loading" :clearable="clearable" style="width:100%">
    <template slot-scope="scope">
      <el-option v-for="item in list" :key="item.vbrandCode" :label="item.vbrandName" :value="item.vbrandCode">
      </el-option>
    </template>
  </el-select>
</template>
<script>
import { getVehicleBrand } from "@/api/index.js";
export default {
  name: "select-brand",
  data() {
    return {
      loading: false,
      vbrandCode: "",
      list: []
    };
  },
  watch: {
    vbrandCode: function() {
      if (!this.vbrandCode) {
        return false;
      }
      this.$emit("input", this.vbrandCode);
      this.$emit(
        "update:vbrandName",
        this.list.filter(item => {
          return item.vbrandCode == this.vbrandCode;
        })[0].vbrandName
      );
    },
    value: function() {
      this.init();
      // this.vbrandCode = this.value;
      // if (this.list.length == 0) {
      //   this.init();
      // }
    }
  },
  computed: {},
  props: {
    vbrandName: String,
    value: String,
    clearable: Boolean
  },
  created() {
    this.init();
  },
  methods: {
    remoteMethod(query) {
      this.loading = true;
      getVehicleBrand({ brand_name: query })
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
      if (!this.$props.value) {
        return false;
      }
      getVehicleBrand({ brand_name: this.vbrandName })
        .then(res => {
          this.loading = false;
          if (res.data.code == 0 && res.data.data.length) {
            this.$set(this.$data, "list", res.data.data);
            this.$nextTick(() => {
              this.vbrandCode = this.$props.value;
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