<template>
  <div style="text-align: center; width:100%;" class="admin-table-container">
    <el-form status-icon :rules="rules" :model="formData" ref="baseForm">
      <!-- <el-row :gutter="30 ">
            </el-row> -->
      <el-card shadow="hover" style="margin-bottom:20px;">
        <el-form-item prop="title">
          <template>
            <div style="width:200px;">
              <label style="font-size:16px;">产品名称：</label>
              {{formData.title}}
              <el-button type="primary" icon="el-icon-edit" circle size="mini"></el-button>
            </div>
          </template>
        </el-form-item>
      </el-card>
      <el-card shadow="hover">
        <el-form-item>
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-plus" style="float:left;" @click="addFrom(scope)">添加收费项</el-button>
          </template>
        </el-form-item>
        <el-form-item>
          <template>
            <label style="float:left;font-size:16px;">收费项信息：</label>
          </template>
        </el-form-item>
        <!-- 授权车辆 -->
        <el-collapse accordion style="overflow:hidden;" v-if="!formData.detail[0]==''">
          <el-collapse-item name="1">
            <template slot="title">
              <div style="float:left;">
                授权车辆
                <i class="header-icon iconfont icon-car-fill"></i>
              </div>
            </template>
            <el-form-item>
              <el-table size="mini" :data="formData.detail" border style="width: 100%; margin-top: 20px">
                <el-table-column prop="car_type" label="车辆类型">
                  <template slot-scope="scope">
                    <label></label>
                  </template>
                </el-table-column>
                <el-table-column prop="detail_type" label="终端类型">
                </el-table-column>
                <el-table-column prop="detail_name" label="收费单项">
                </el-table-column>
                <el-table-column prop="original_price" label="单价">
                </el-table-column>
                <el-table-column prop="discount_price" label="优惠金额(元)">
                </el-table-column>
                <el-table-column prop="pay_type" label="付费方式">
                  <template slot-scope="scope">
                    <label v-if="scope.row.pay_type==1">计费</label>
                    <label v-if="scope.row.pay_type==2">充值</label>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="200">
                  <template slot-scope="scope">
                    <el-button size="small" type="primary" icon="el-icon-edit">编辑</el-button>
                    <el-button size="small" icon="el-icon-delete" @click="delFrom(scope)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-collapse-item>
        </el-collapse>
        <!-- 授权厂商 -->
        <el-collapse accordion style="overflow:hidden;" v-if="!formData.company[0]==''">
          <el-collapse-item name="1">
            <template slot="title">
              <div style="float:left;">
                授权厂商
                <i class="header-icon iconfont icon-company"></i>
              </div>
            </template>
            <el-form-item>
              <el-table size="mini" :data="formData.company" border style="width: 100%; margin-top: 20px">
                <el-table-column prop="company_id" label="终端厂商">
                  <template slot-scope="scope">
                    {{scope.row.company_name}}
                  </template>
                </el-table-column>
                <el-table-column prop="detail_name" label="收费单项">
                </el-table-column>
                <el-table-column prop="original_price" label="单价">
                </el-table-column>
                <el-table-column prop="discount_price" label="优惠金额(元)">
                </el-table-column>
                <el-table-column prop="pay_type" label="计费方式">
                  <template slot-scope="scope">
                    <label v-if="scope.row.pay_type==1">计费</label>
                    <label v-if="scope.row.pay_type==2">充值</label>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="200">
                  <template slot-scope="scope">
                    <el-button size="small" icon="el-icon-edit">编辑</el-button>
                    <el-button size="small" icon="el-icon-delete">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-collapse-item>
        </el-collapse>
        <!-- SIM卡 -->
        <el-collapse accordion style="overflow:hidden;" v-if="!formData.sim[0]==''">
          <el-collapse-item name="1">
            <template slot="title">
              <div style="float:left;">
                SIM卡
                <i class="header-icon iconfont icon-sim"></i>
              </div>
            </template>
            <el-form-item>
              <el-table size="mini" :data="formData.sim" border style="width: 100%; margin-top: 20px">
                <el-table-column prop="company_id" label="运营商" width="240">
                </el-table-column>
                <el-table-column prop="detail_name" label="计费方式">
                </el-table-column>
                <el-table-column prop="original_price" label="使用流量">
                </el-table-column>
                <el-table-column prop="discount_price" label="使用周期">
                </el-table-column>
                <el-table-column prop="pay_type" label="单价">
                </el-table-column>
                <el-table-column label="操作" width="200">
                  <template slot-scope="scope">
                    <el-button size="small" icon="el-icon-update">编辑</el-button>
                    <el-button size="small" icon="el-icon-delete">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-collapse-item>
        </el-collapse>
        <!-- 短信 -->
        <el-collapse accordion style="overflow:hidden;" v-if="!formData.sms[0]==''">
          <el-collapse-item name="1">
            <template slot="title">
              <div style="float:left;">
                短信
                <i class="header-icon el-icon-mobile-phone"></i>
              </div>
            </template>
            <el-form-item prop="sms">
              <el-table size="mini" :data="formData.sms" border style="width: 100%; margin-top: 20px">
                <el-table-column prop="original_price" label="单价">
                </el-table-column>
                <el-table-column prop="discount_price" label="优惠金额(元)">
                </el-table-column>
                <el-table-column prop="count" label="数量">
                </el-table-column>
                <el-table-column prop="pay_type" label="计费方式">
                </el-table-column>
                <el-table-column prop="pay_type" label="操作" width="200">
                  <template slot-scope="scope">
                    <el-button type="primary">编辑</el-button>
                    <el-button type="primary">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-collapse-item>
        </el-collapse>
      </el-card>
      <el-form-item style="text-align:center; ">
        <template slot-scope="scope">
          <!-- <el-button type="primary" size="large">返回</el-button> -->
        </template>
      </el-form-item>
    </el-form>
  </div>
</template>
<style>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
input[type="number"] {
  -moz-appearance: textfield;
}
.error .el-form-item__content .el-input .el-input__inner {
  border-color: #f56c6c;
}
</style>
<script>
import { rules } from "@/utils/rules.js";
import selectCompany from "@/components/select-company.vue";
import update_add from "./update_add.vue";
import { getProduct, getProductDetail, delProductDetail } from "@/api/index.js";
export default {
  data() {
    return {
      button_type: true,
      formData: {
        package_id: "",
        title: "",
        detail: [],
        company: [],
        sim: [],
        sms: []
      },
      msg: "",
      rules: {
        ...rules
      },
      arr: 1,
      arr2: 3
    };
  },
  watch: {},
  created() {
    this.formData.package_id = this.$route.params.id;
    this.getP();
    this.detaiN();
  },
  filters: {},
  computed: {},
  methods: {
    // 根据id查询产品名称
    getP() {
      getProduct({ package_id: this.formData.package_id }).then(res => {
        if (res.data.code == 0) {
          this.formData.title = res.data.data[0].title;
        }
      });
    },
    // 根据id查询收费项
    detaiN() {
      getProductDetail({ package_id: this.formData.package_id }).then(res => {
        if (res.data.code == 0) {
          for (var i = 0; i < res.data.data.length; i++) {
            if (res.data.data[i].detail_type == 1) {
              // 定位终端
              this.formData.detail.push(res.data.data[i]);
            } else if (res.data.data[i].detail_type == 2) {
              // 视频终端
              this.formData.detail.push(res.data.data[i]);
            } else if (res.data.data[i].detail_type == 3) {
              // 厂商
              this.formData.company.push(res.data.data[i]);
            } else if (res.data.data[i].detail_type == 4) {
              // 短信
              this.formData.sms.push(res.data.data[i]);
            } else if (res.data.data[i].detail_type == 5) {
              // sim卡
              this.formData.sim.push(res.data.data[i]);
            }
          }
        }
      });
      console.log(this.formData.detail);
    },
    // 添加单一收费项
    addFrom() {
      var vNode = this.$createElement(update_add, {
        key: this.addKey++,
        props: {
          package_id: this.formData.package_id
        },
        on: {
          success: () => {
            this.detaiN();
            this.$msgbox.close();
          },
          error: function() {}
        }
      });
      this.$msgbox({
        showConfirmButton: false, //是否显示确定按钮
        customClass: "admin-message-form",
        title: "添加",
        closeOnClickModal: false, //是否可通过点击遮罩关闭 MessageBox
        closeOnPressEscape: false, //是否可通过按下 ESC 键关闭 MessageBox
        message: vNode
      });
    },
    // 删除单一收费项
    delFrom(scope) {
      this.$confirm("确认删除？")
        .then(() => {
          delProductDetail({ detail_id: scope.row.detail_id }).then(res => {
            if (res.data.code == 0) {
              this.$message.success(res.data.msg);
              this.detaiN();
            } else {
              this.$message.error(res.data.msg);
            }
          });
        })
        .catch(() => {});
    }
  },
  components: { selectCompany, update_add }
};
</script>
<style>
</style>