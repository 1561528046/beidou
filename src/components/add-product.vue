<template>
    <el-collapse v-model="industry" accordion>
        <el-collapse-item v-for="(i,index) in industrys" :key="i" :name="index">
            <template slot="title">
                {{i}}
            </template>
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
            <el-form-item label="终端厂商">
                <el-table size="mini" :data="formData.company" border :span-method="objectSpanMethod" style="width: 100%; margin-top: 20px">
                    <el-table-column prop="company_id" label="类型" width="250">
                        <template slot-scope="scope">
                            <select-company v-model="formData.company[scope.$index].company_id" style="width:100%;" :clearable="true"></select-company>
                        </template>
                    </el-table-column>
                    <el-table-column prop="detail_name" label="类型">
                    </el-table-column>
                    <el-table-column prop="original_price" label="单价">
                        <template slot-scope="scope">
                            <el-input v-model="formData.company[scope.$index].original_price" placeholder="0" size="mini"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column prop="discount_price" label="优惠金额(元)">
                        <template slot-scope="scope">
                            <el-input v-model="formData.company[scope.$index].discount_price" placeholder="0" size="mini"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column prop="pay_type" label="收费方式" width="160">
                        <template slot-scope="scope">
                            <el-radio v-model="formData.company[scope.$index].pay_type" label="1">计费</el-radio>
                            <el-radio v-model="formData.company[scope.$index].pay_type" label="2">充值</el-radio>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="90">
                        <template slot-scope="scope">
                            <el-button size="small" icon="el-icon-delete" @click.native.prevent="deleteRow(scope.$index, formData.company)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
            <el-form-item label="短信">
                <el-table size="mini" :data="formData.sms" border style="width: 100%; margin-top: 20px">
                    <el-table-column prop="detail_type_name" label="类型">
                    </el-table-column>
                    <el-table-column prop="original_price" label="单价">
                        <template slot-scope="scope">
                            <el-input v-model="formData.sms[scope.$index].original_price" placeholder="0" size="mini"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column prop="discount_price" label="优惠金额(元)">
                        <template slot-scope="scope">
                            <el-input v-model="formData.sms[scope.$index].discount_price" placeholder="0" size="mini"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column prop="count" label="数量">
                        <template slot-scope="scope">
                            <el-input v-model="formData.sms[scope.$index].count" placeholder="0" size="mini"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column prop="pay_type" label="收费方式" width="160">
                        <template slot-scope="scope">
                            <el-radio label="1" v-model="formData.sms[scope.$index].pay_type">计费</el-radio>
                            <el-radio label="2" v-model="formData.sms[scope.$index].pay_type">充值</el-radio>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
        </el-collapse-item>
    </el-collapse>
</template>
<script>
import selectCompany from "@/components/select-company.vue";
export default {
  name: "add-product",
  data() {
    return {
      formData: {
        title: "",
        detail: [
          {
            detail_name: "新增",
            detail_type: "1",
            detail_type_name: "定位终端",
            pay_type: "1",
            original_price: "", //单价/原价
            discount_price: "", //优惠金额
            present_price: "", //现价
            count: "0"
          },
          {
            detail_name: "转网",
            detail_type: "1",
            detail_type_name: "定位终端",
            pay_type: "1",
            original_price: "",
            discount_price: "",
            present_price: "",
            count: "0"
          },
          {
            detail_name: "续费",
            detail_type: "1",
            detail_type_name: "定位终端",
            pay_type: "1",
            original_price: "",
            discount_price: "",
            present_price: "",
            count: "0"
          },
          {
            detail_name: "新增",
            detail_type: "2",
            detail_type_name: "视频终端",
            pay_type: "1",
            original_price: "",
            discount_price: "",
            present_price: "",
            count: "0"
          },
          {
            detail_name: "转网",
            detail_type: "2",
            detail_type_name: "视频终端",
            pay_type: "1",
            original_price: "",
            discount_price: "",
            present_price: "",
            count: "0"
          },
          {
            detail_name: "续费",
            detail_type: "2",
            detail_type_name: "视频终端",
            pay_type: "1",
            original_price: "",
            discount_price: "",
            present_price: "",
            count: "0"
          }
        ],
        company: [
          {
            detail_type: "3",
            detail_type_name: "设备厂家",
            company_id: "",
            detail_name: "开通",
            original_price: "", //单价
            discount_price: "", //优惠金额
            present_price: "", //现价
            pay_type: "1"
          },
          {
            detail_type: "3",
            detail_type_name: "设备厂家",
            company_id: "",
            detail_name: "续费",
            original_price: "", //单价
            discount_price: "", //优惠金额
            present_price: "", //现价
            pay_type: "1"
          }
        ],
        sms: [
          {
            detail_type: "4",
            detail_type_name: "短信",
            original_price: "", //单价
            discount_price: "", //优惠金额
            present_price: "", //现价
            count: "",
            pay_type: "1"
          }
        ]
      },
      industry: "",
      industrys: this.$dict.industry
    };
  },
  watch: {
    industry: function() {
      this.$emit("input", this.company_type);
    }
  },
  methods: {
    // 厂商删除
    deleteRow(index, rows) {
      rows.splice(index, 2);
    },
    // 合并单元格
    objectSpanMethod({ rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex === 0) {
          return {
            rowspan: 2,
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }

      if (columnIndex === 5) {
        if (rowIndex === 0) {
          return {
            rowspan: 2,
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    }
  },
  props: {
    value: String
  },
  created() {
    // console.log(this.$dict.company_type)
  },
  components: { selectCompany }
};
</script>