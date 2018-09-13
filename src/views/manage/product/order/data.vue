<template>
  <el-form status-icon :rules="rules" size="small" ref="baseForm" class="msg-form">
    <el-row :gutter="30">
      <el-col :span="12">
        <el-table :data="tableQuery.data" style="width: 100%" height="300" class="admin-table-list" border>
          <el-table-column prop="img1" label="图片" :formatter="$utils.baseFormatter">
            <template slot-scope="scope">
              <img :src="scope.row.img1" alt="" style="width:100%; height:100%;">
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="12">
        <el-table :data="tableQuery.data" style="width: 100%" height="300" class="admin-table-list" border>
          <el-table-column prop="img2" label="图片" :formatter="$utils.baseFormatter">
            <template slot-scope="scope">
              <img :src="scope.row.img2" alt="" style="width:100%; height:100%;">
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="24" style="margin-top:10px;">
        <el-table :data="tableQuery.data" style="width: 100%" class="admin-table-list" border>
          <el-table-column prop="content" label="备注" :formatter="$utils.baseFormatter">
          </el-table-column>
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
      tableQuery: {
        data: []
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
      getEnquiry({ sub_id: this.formData.order_no }).then(res => {
        if (res.data.code == 0) {
          for (var i = 0; i < res.data.data.length; i++) {
            res.data.data[i].img1 = this.$dict.BASE_URL + res.data.data[i].img1;
            res.data.data[i].img2 = this.$dict.BASE_URL + res.data.data[i].img2;
          }
          this.tableQuery.data = res.data.data;
        }
      });
    }
  },
  components: { companySelect }
};
</script>
<style>
</style>