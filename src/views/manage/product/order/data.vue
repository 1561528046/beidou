<template>
  <el-form status-icon :rules="rules" :model="formData" size="small" ref="baseForm" class="msg-form">
    <el-row :gutter="30">
      <el-col :span="12">
        <el-table style="width: 100%" height="300" class="admin-table-list" border>
          <el-table-column prop="" label="图片" :formatter="$utils.baseFormatter"> </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="12">
        <el-table style="width: 100%" height="300" class="admin-table-list" border>
          <el-table-column prop="" label="文字" :formatter="$utils.baseFormatter"> </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </el-form>
</template>
<script>
import { rules } from "@/utils/rules.js";
import { getEnquiry } from "@/api/index.js";
import companySelect from "@/components/select-company.vue";
export default {
  data() {
    return {
      formData: {
        order_no: this.$props.order_no
      },
      rules: {
        ...rules
      }
    };
  },
  watch: {},
  created() {
    this.formSubmit();
  },
  props: {
    order_no: String
  },
  methods: {
    formSubmit() {
      getEnquiry({ order_no: this.formData.order_no }).then(res => {
        if (res.data.code == 0) {
          console.log(res.data.data);
        }
      });
    }
  },
  components: { companySelect }
};
</script>
<style>
</style>