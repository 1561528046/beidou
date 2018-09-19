<template>
  <el-select v-model="area_id" :placeholder="placeholder" filterable remote :remote-method="remoteMethod" :loading="loading" style="width: 100%;" :clearable="clearable">
    <el-option v-for="item in areas" :key="item.area_id" :label="item.area_name" :value="item.area_id">
    </el-option>
  </el-select>
</template>
<script>
import { getAreaByName } from "@/api/index.js";
export default {
  data() {
    return {
      loading: false,
      type: true,
      area_id: "",
      areas: []
    };
  },
  watch: {
    area_id: function() {
      this.$emit("input", this.area_id);
      var area = this.getAreaObj(this.area_id)[0];
      if (area == undefined) {
        return this.$emit("update:area", {});
      }
      area.province_id = area.province_id == 0 ? "" : area.province_id;
      area.city_id = area.city_id == 0 ? "" : area.city_id;
      area.county_id = area.county_id == 0 ? "" : area.county_id;
      this.$emit("update:area", this.getAreaObj(this.area_id)[0] || {});
    }
  },
  props: {
    clearable: Boolean,
    placeholder: {
      type: [String],
      default: "请输入地区名字"
    }
  },
  created() {},
  methods: {
    getAreaObj(area_id) {
      return this.areas.filter(area => {
        return area.area_id == area_id;
      });
    },
    remoteMethod(query) {
      if (query) {
        getAreaByName({ area_name: query }).then(res => {
          if (res.data.code == 0) {
            this.$set(this.$data, "areas", res.data.data);
          } else {
            this.$set(this.$data, "areas", []);
          }
        });
      }
    }
  }
};
</script>