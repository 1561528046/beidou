<template>
  <div style="text-align: center; width:97%;" class="admin-table-container">
    <el-form status-icon :rules="rules" :model="formData" ref="baseForm">
      <!-- <el-row :gutter="30 ">
            </el-row> -->
      <el-card shadow="hover" style="margin-bottom:20px; height: 72px;">
        <el-form-item prop="title" style="padding:0;">
          <template>
            <div style="width:280px; line-height:33px;">
              <label style="font-size:16px; float:left;">产品名称：</label>
              <label style="width:130px;float:left; text-align:center; display:inline-block;" v-if="!this.title_type">{{formData.title}}</label>
              <el-input v-if="this.title_type" v-on:blur="titleblur()" v-model="formData.title" style="float:left; width:130px;" size="mini"></el-input>
              <el-button type="primary" icon="el-icon-edit" @click="titletype()" circle style="padding:5px;margin-left: -44px;"></el-button>
            </div>
          </template>
        </el-form-item>
      </el-card>
      <el-card shadow="hover" v-if="!formData.detail[0]==''" style="margin-bottom:20px;">
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
                    <label v-if="scope.row.car_type==1">物流运输(普货)</label>
                    <label v-if="scope.row.car_type==2">危险品车辆</label>
                    <label v-if="scope.row.car_type==3">长途客运,班线车辆</label>
                    <label v-if="scope.row.car_type==4">出租车</label>
                    <label v-if="scope.row.car_type==5">私家车</label>
                    <label v-if="scope.row.car_type==6">校车</label>
                    <label v-if="scope.row.car_type==7">城市公共车辆</label>
                    <label v-if="scope.row.car_type==8">网约车</label>
                    <label v-if="scope.row.car_type==9">警务车辆</label>
                    <label v-if="scope.row.car_type==10">其他车辆</label>
                  </template>
                </el-table-column>
                <el-table-column prop="detail_type" label="终端类型">
                  <template slot-scope="scope">
                    <label v-if="scope.row.detail_type==1">定位终端</label>
                    <label v-if="scope.row.detail_type==2">视频终端</label>
                  </template>
                </el-table-column>
                <el-table-column prop="detail_name" label="收费单项">
                </el-table-column>
                <el-table-column prop="original_price" label="单价">
                </el-table-column>
                <el-table-column prop="discount_price" label="优惠金额(元)">
                  <template slot-scope="scope">
                    <label v-if="!scope.row.isEditManty">{{scope.row.discount_price}}</label>
                    <el-input v-if="scope.row.isEditManty" v-on:blur="changeCount(scope)" style="width:136px;" size="small" v-model="scope.row.discount_price"></el-input>
                    <el-button v-if="!scope.row.isEditManty" type="primary" @click="manty(scope)" icon="el-icon-edit" circle style="padding:3px; margin-left:7px; float-right;"></el-button>
                  </template>
                </el-table-column>
                <el-table-column prop="pay_type" label="付费方式">
                  <template slot-scope="scope">
                    <div style="width:100px;margin:0 auto;" v-if="!scope.row.isEditPayty">
                      <label v-if="scope.row.pay_type==1">计费</label>
                      <label v-if="scope.row.pay_type==2">充值</label>
                      <el-button type="primary" @click="payty(scope)" icon="el-icon-edit" circle style="padding:3px; margin-left:7px; "></el-button>
                    </div>
                    <select v-if="scope.row.isEditPayty" v-on:blur="changeCou(scope)" v-model="scope.row.pay_type">
                      <option value="1">计费</option>
                      <option value="2">充值</option>
                    </select>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="200">
                  <template slot-scope="scope">
                    <el-button size="small" icon="el-icon-delete" @click="delDetail(scope)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-collapse-item>
        </el-collapse>
      </el-card>
      <el-card shadow="hover" v-if="!formData.company[0]==''" style="margin-bottom:20px;">
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
                  <template slot-scope="scope">
                    {{scope.row.detail_name}}
                  </template>
                </el-table-column>
                <el-table-column prop="original_price" label="单价">
                </el-table-column>
                <el-table-column prop="discount_price" label="优惠金额(元)">
                  <template slot-scope="scope">
                    <label v-if="!scope.row.isEditManty">{{scope.row.discount_price}}</label>
                    <el-input v-if="scope.row.isEditManty" v-on:blur="changeCount(scope)" style="width:136px;" size="small" v-model="scope.row.discount_price"></el-input>
                    <el-button v-if="!scope.row.isEditManty" type="primary" @click="manty(scope)" icon="el-icon-edit" circle style="padding:3px; margin-left:7px; float-right;"></el-button>
                  </template>
                </el-table-column>
                <el-table-column prop="pay_type" label="付费方式">
                  <template slot-scope="scope">
                    <div style="width:100px;margin:0 auto;" v-if="!scope.row.isEditPayty">
                      <label v-if="scope.row.pay_type==1">计费</label>
                      <label v-if="scope.row.pay_type==2">充值</label>
                      <el-button type="primary" @click="payty(scope)" icon="el-icon-edit" circle style="padding:3px; margin-left:7px; "></el-button>
                    </div>
                    <select v-if="scope.row.isEditPayty" v-on:blur="changeCou(scope)" v-model="scope.row.pay_type">
                      <option value="1">计费</option>
                      <option value="2">充值</option>
                    </select>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="200">
                  <template slot-scope="scope">
                    <el-button size="small" icon="el-icon-delete" @click="delDetail(scope)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-collapse-item>
        </el-collapse>
      </el-card>
      <el-card shadow="hover" v-if="!formData.sim[0]==''" style="margin-bottom:20px;">
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
                <el-table-column prop="detail_name" label="运营商" width="240">
                </el-table-column>
                <el-table-column prop="count" label="使用流量">
                </el-table-column>
                <el-table-column prop="original_price" label="单价">
                </el-table-column>
                <el-table-column prop="discount_price" label="优惠金额">
                  <template slot-scope="scope">
                    <label v-if="!scope.row.isEditManty">{{scope.row.discount_price}}</label>
                    <el-input v-if="scope.row.isEditManty" v-on:blur="changeCount(scope)" style="width:136px;" size="small" v-model="scope.row.discount_price"></el-input>
                    <el-button v-if="!scope.row.isEditManty" type="primary" @click="manty(scope)" icon="el-icon-edit" circle style="padding:3px; margin-left:7px; float-right;"></el-button>
                  </template>
                </el-table-column>
                <el-table-column prop="pay_type" label="付费方式">
                  <template slot-scope="scope">
                    <div style="width:100px;margin:0 auto;" v-if="!scope.row.isEditPayty">
                      <label v-if="scope.row.pay_type==1">计费</label>
                      <label v-if="scope.row.pay_type==2">充值</label>
                      <el-button type="primary" @click="payty(scope)" icon="el-icon-edit" circle style="padding:3px; margin-left:7px; "></el-button>
                    </div>
                    <select v-if="scope.row.isEditPayty" v-on:blur="changeCou(scope)" v-model="scope.row.pay_type">
                      <option value="1">计费</option>
                      <option value="2">充值</option>
                    </select>
                  </template>
                </el-table-column>
                <el-input v-on:blur="changeSim(scope)" style="width:136px;" size="small"></el-input>
                <el-button type="primary" icon="el-icon-edit" circle style="padding:3px; margin-left:7px; float-right;"></el-button>
                <el-table-column label="操作" width="200">
                  <template slot-scope="scope">
                    <el-button size="small" icon="el-icon-delete" @click="delDetail(scope)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-collapse-item>
        </el-collapse>
      </el-card>
      <el-card shadow="hover" v-if="!formData.sms[0]==''" style="margin-bottom:20px;">
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
                <el-table-column prop="count" label="数量">
                </el-table-column>
                <el-table-column prop="original_price" label="单价">
                </el-table-column>
                <el-table-column prop="discount_price" label="优惠金额(元)">
                  <template slot-scope="scope">
                    <label v-if="!scope.row.isEditManty">{{scope.row.discount_price}}</label>
                    <el-input v-if="scope.row.isEditManty" v-on:blur="changeCount(scope)" style="width:136px;" size="small" v-model="scope.row.discount_price"></el-input>
                    <el-button v-if="!scope.row.isEditManty" type="primary" @click="manty(scope)" icon="el-icon-edit" circle style="padding:3px; margin-left:7px; float-right;"></el-button>
                  </template>
                </el-table-column>
                <el-table-column prop="pay_type" label="付费方式">
                  <template slot-scope="scope">
                    <div style="width:100px;margin:0 auto;" v-if="!scope.row.isEditPayty">
                      <label v-if="scope.row.pay_type==1">计费</label>
                      <label v-if="scope.row.pay_type==2">充值</label>
                      <el-button type="primary" @click="payty(scope)" icon="el-icon-edit" circle style="padding:3px; margin-left:7px; "></el-button>
                    </div>
                    <select v-if="scope.row.isEditPayty" v-on:blur="changeCou(scope)" v-model="scope.row.pay_type">
                      <option value="1">计费</option>
                      <option value="2">充值</option>
                    </select>
                  </template>
                </el-table-column>
                <el-table-column prop="pay_type" label="操作" width="200">
                  <template slot-scope="scope">
                    <el-button size="small" icon="el-icon-delete" @click="delDetail(scope)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-collapse-item>
        </el-collapse>
      </el-card>
      <el-form-item>
        <template slot-scope="scope">
          <el-button type="primary" @click="addFrom(scope)">添加收费项</el-button>
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
import {
  getProduct,
  getProductDetail,
  delProductDetail,
  updateProductDetail,
  updateProducts
} from "@/api/index.js";
export default {
  data() {
    return {
      button_type: true, //按钮状态
      title_type: false, //名称状态
      formData: {
        package_id: "",
        title: "",
        manytype: true,
        paytypes: true,
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
    // 计费方式修改
    payty(scope) {
      scope.row.isEditPayty = true;
    },
    // 金额修改
    manty(scope) {
      scope.row.isEditManty = true;
    },
    //修改产品名称
    titletype() {
      this.title_type = true;
    },
    titleblur() {
      this.title_type = false;
      updateProducts({
        package_id: this.formData.package_id,
        title: this.formData.title
      })
        .then(res => {
          if (res.data.code == 0) {
            this.getP();
            this.$emit("success");
            this.$notify({
              message: res.data.msg,
              title: "提示",
              type: "success"
            });
          } else {
            this.$emit("error");
            this.$notify({
              message: res.data.msg,
              title: "提示",
              type: "error"
            });
          }
        })
        .catch(() => {
          this.$alert("接口错误", "提示", {
            type: "error"
          });
          this.$emit("error");
        });
    },
    // 编辑车辆金额
    changeCount(scope) {
      scope.row.present_price =
        scope.row.original_price - scope.row.discount_price;
      updateProductDetail(scope.row)
        .then(res => {
          if (res.data.code == 0) {
            this.formData.manytype = false;
            this.detaiN();
            this.$emit("success");
            this.$notify({
              message: res.data.msg,
              title: "提示",
              type: "success"
            });
          } else {
            this.$emit("error");
            this.$notify({
              message: res.data.msg,
              title: "提示",
              type: "error"
            });
          }
        })
        .catch(() => {
          this.$alert("接口错误", "提示", {
            type: "error"
          });
          this.$emit("error");
        });
    },
    // 编辑车辆计费
    changeCou(scope) {
      updateProductDetail(scope.row)
        .then(res => {
          if (res.data.code == 0) {
            this.formData.paytypes = true;
            this.detaiN();
            this.$emit("success");
            this.$notify({
              message: res.data.msg,
              title: "提示",
              type: "success"
            });
          } else {
            this.$emit("error");
            this.$notify({
              message: res.data.msg,
              title: "提示",
              type: "error"
            });
          }
        })
        .catch(() => {
          this.$alert("接口错误", "提示", {
            type: "error"
          });
          this.$emit("error");
        });
    },
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
          this.formData.detail = [];
          this.formData.company = [];
          this.formData.sms = [];
          this.formData.sim = [];
          for (var i = 0; i < res.data.data.length; i++) {
            if (res.data.data[i].detail_type == 1) {
              // 定位终端
              this.formData.detail.push(res.data.data[i]);
              if (res.data.data[i].discount_price == 0.0) {
                this.formData.manytype = false;
              }
            } else if (res.data.data[i].detail_type == 2) {
              // 视频终端
              this.formData.detail.push(res.data.data[i]);
              if (res.data.data[i].discount_price == 0.0) {
                this.formData.manytype = false;
              }
            } else if (res.data.data[i].detail_type == 3) {
              // 厂商
              this.formData.company.push(res.data.data[i]);
              if (res.data.data[i].discount_price == 0.0) {
                this.formData.manytype = false;
              }
            } else if (res.data.data[i].detail_type == 4) {
              // 短信
              this.formData.sms.push(res.data.data[i]);
              if (res.data.data[i].discount_price == 0.0) {
                this.formData.manytype = false;
              }
            } else if (res.data.data[i].detail_type == 5) {
              // sim卡
              this.formData.sim.push(res.data.data[i]);
              if (res.data.data[i].discount_price == 0.0) {
                this.formData.manytype = false;
                console.log(1);
              }
            }
          }
        }
      });
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
    delDetail(scope) {
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