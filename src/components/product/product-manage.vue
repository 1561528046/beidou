<template>
  <el-collapse v-model="industry" accordion>
    <el-collapse-item v-for="(i,index) in industrys" :key="i" :name="index">
      <template slot="title">
        <div style="float:left">{{i}}</div>
      </template>
      <product-item :id="index" @update="(data)=>{updateFormData(index,data)}"></product-item>
    </el-collapse-item>
  </el-collapse>
</template>
<script>
import productItem from "./product-item.vue";
export default {
  components: { productItem },
  name: "add-product",
  data() {
    return {
      details: {
        "1": [
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
        ],
        "2": [
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
        ],
        "3": [
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
        ],
        "4": [
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
        ],
        "5": [
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
        ],
        "6": [
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
        ],
        "7": [
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
        ],
        "8": [
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
        ],
        "9": [
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
        ],
        "10": [
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
      formDatas: {
        detail: []
      },
      messages: [],
      industry: "",
      industrys: this.$dict.industry
    };
  },
  watch: {
    // 监听details 向formDatas.detail中添加数据
    details: {
      handler: function() {
        this.formDatas.detail = [];
        Object.keys(this.details).map(key => {
          this.$set(
            this.formDatas,
            "detail",
            this.formDatas.detail.concat(this.details[key])
          );
        });
      },
      deep: true
    },
    //监听formDatas向第一层发送数据
    formDatas: {
      handler: function() {
        this.$emit("update", this.formDatas);
      },
      deep: true
    },
    messages: {
      handler: function() {
        this.formDatas.detail = [];
        Object.keys(this.details).map(key => {
          this.$set(
            this.formDatas,
            "detail",
            this.formDatas.detail.concat(this.details[key])
          );
        });
      },
      handlers: function() {
        this.$emit("update", JSON.parse(JSON.stringify(this.formDatas.detail)));
      },
      deep: true
    }
  },
  props: {
    value: String
  },
  methods: {
    updateFormData(index, data) {
      for (var i = 0; i < data.detail.length; i++) {
        data.detail[i].car_type = index;
      }
      this.details[index] = data.detail;
    },
    parentMsg: function(msg) {
      this.messages.push(msg);
    }
  },
  created() {}
};
</script>