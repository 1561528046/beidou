<template>
  <div>
    <el-table :data="areaData" style="width: 100%">
      <el-table-column prop="license" label="车牌号"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="chooseVehicle(scope)">选择</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { getLicense } from "@/api/index.js";
export default {
  created() {
    if (this.$props.area.length == 2) {
      this.$set(this.areaForm, "province_id", this.$props.area[0]);
      this.$set(this.areaForm, "city_id", this.$props.area[1]);
    } else {
      this.$set(this.areaForm, "province_id", this.$props.area[0]);
      this.$set(this.areaForm, "city_id", this.$props.area[1]);
      this.$set(this.areaForm, "county_id", this.$props.area[2]);
    }
    this.selectVehicle();
  },
  data() {
    return {
      areaData: [],
      areaForm: {
        province_id: "",
        city_id: "",
        county_id: ""
      }
    };
  },
  props: {
    area: Array
  },
  methods: {
    // 查询车辆
    selectVehicle() {
      getLicense(this.areaForm).then(res => {
        if (res.data.code == 0) {
          this.$set(this.$data, "areaData", res.data.data);
        } else {
          return this.$notify({
            message: res.data.msg,
            title: "提示",
            type: "error"
          });
        }
      });
    },
    // 选择车辆
    chooseVehicle(scope) {
      this.$emit("choose", scope.row);
    }
  }
};
</script>