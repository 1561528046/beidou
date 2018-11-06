<template>
  <el-form>
    <el-form-item label="">
      <el-table size="mini" :data="formData.detail" border style="width: 100%; margin-top: 20px">
        <el-table-column prop="detail_type_name" label="类型">
        </el-table-column>
        <el-table-column prop="detail_name" label="名称" width="120">
        </el-table-column>
        <el--column prop="original_price" label="单价">
          <template slot-scope="scope">
            <el-form-item :class="{error:scope.row.error}">
              <el-input v-on:input="inputFunc(scope)" type="number" onkeyup="this.value=this.value.replace(/\D/g,'')" onafterpaste="this.value=this.value.replace(/\D/g,'')" v-model="formData.detail[scope.$index].original_price" placeholder="0" size="mini"></el-input>
            </el-form-item>
          </template>
        </el--column>
        <el-table-column prop="discount_price" label="优惠金额(元)">
          <template slot-scope="scope">
            <el-form-item :class="{error:scope.row.error}">
              <el-input v-on:input="inputFuncs(scope)" type="number" onkeyup="this.value=this.value.replace(/\D/g,'')" onafterpaste="this.value=this.value.replace(/\D/g,'')" v-model="formData.detail[scope.$index].discount_price" placeholder="0" size="mini"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column prop="pay_type" label="收费方式" width="200">
          <template slot-scope="scope">
            <el-radio v-model="formData.detail[scope.$index].pay_type" label="1">计费</el-radio>
            <el-radio v-model="formData.detail[scope.$index].pay_type" label="2">充值</el-radio>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
  </el-form>
</template>
<script>
import selectCompany from "@/components/select-company.vue";
import { rules } from "@/utils/rules.js";
export default {
  name: "product-item",
  data() {
    return {
      formData: {
        detail: [
          {
            detail_name: "新增",
            detail_type: "1",
            detail_type_name: "定位终端",
            pay_type: "1",
            original_price: "", //单价/原价
            discount_price: "", //优惠金额
            present_price: "", //现价
            count: "0",
            car_type: ""
          },
          {
            detail_name: "转网",
            detail_type: "1",
            detail_type_name: "定位终端",
            pay_type: "1",
            original_price: "",
            discount_price: "",
            present_price: "",
            count: "0",
            car_type: ""
          },
          {
            detail_name: "续费",
            detail_type: "1",
            detail_type_name: "定位终端",
            pay_type: "1",
            original_price: "",
            discount_price: "",
            present_price: "",
            count: "0",
            car_type: ""
          },
          {
            detail_name: "新增",
            detail_type: "2",
            detail_type_name: "视频终端",
            pay_type: "1",
            original_price: "",
            discount_price: "",
            present_price: "",
            count: "0",
            car_type: ""
          },
          {
            detail_name: "转网",
            detail_type: "2",
            detail_type_name: "视频终端",
            pay_type: "1",
            original_price: "",
            discount_price: "",
            present_price: "",
            count: "0",
            car_type: ""
          },
          {
            detail_name: "续费",
            detail_type: "2",
            detail_type_name: "视频终端",
            pay_type: "1",
            original_price: "",
            discount_price: "",
            present_price: "",
            count: "0",
            car_type: ""
          }
        ]
      }
    };
  },
  watch: {
    formData: {
      handler: function() {
        this.$emit("update", JSON.parse(JSON.stringify(this.formData)));
      },
      deep: true
    }
  },
  methods: {
    //单价验证
    inputFunc(scope) {
      scope.row.original_price = parseInt(scope.row.original_price);
      scope.row.discount_price = parseInt(scope.row.discount_price);
      if (scope.row.discount_price > scope.row.original_price) {
        this.$set(scope.row, "error", true);
        this.button_type = false;
      } else {
        this.$set(scope.row, "error", false);
        this.button_type = true;
        scope.row.present_price =
          scope.row.original_price - scope.row.discount_price;
      }
    },
    // 优惠金额验证
    inputFuncs(scope) {
      scope.row.original_price = parseInt(scope.row.original_price);
      scope.row.discount_price = parseInt(scope.row.discount_price);
      if (scope.row.discount_price > scope.row.original_price) {
        this.$set(scope.row, "error", true);
        this.button_type = false;
      } else {
        this.$set(scope.row, "error", false);
        this.button_type = true;
        scope.row.present_price =
          scope.row.original_price - scope.row.discount_price;
      }
    }
  },
  rules: {
    ...rules
  },
  props: {
    value: String
  },
  created() {},
  components: { selectCompany }
};
</script>