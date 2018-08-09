<template>
    <el-form>
        <el-form-item label="定位终端-授权车辆">
            <el-table size="mini" :data="formData.detail" border style="width: 100%; margin-top: 20px">
                <el-table-column prop="detail_type_name" label="类型">
                </el-table-column>
                <el-table-column prop="detail_name" label="名称" width="120">
                </el-table-column>
                <el-table-column prop="original_price" label="单价">
                    <template slot-scope="scope">
                        <el-input v-model="formData.detail[scope.$index].original_price" placeholder="0" size="mini"></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="discount_price" label="优惠金额(元)">
                    <template slot-scope="scope">
                        <el-input v-model="formData.detail[scope.$index].discount_price" placeholder="0" size="mini"></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="pay_type" label="收费方式" width="160">
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
      },
      industry: "",
      industrys: this.$dict.industry
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
    // handleMouseEnter: function(row, column, cell, event) {
    //   console.log(row, column, cell, event);
    //   cell.style.backgroundColor = "white";
    // }
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