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
        <div style=" text-align: left; width: 100%;padding-top: 4px; margin-bottom: 4px;" class="clearfix">
          <span>授权车辆
            <i class="header-icon iconfont icon-car-fill"></i>
          </span>
          <el-button type="primary" size="mini" @click="addFrom(1)" style="margin-left:20px;">添加</el-button>
        </div>
        <el-form-item>
          <el-table size="mini" :data="formData.detail" class="admin-table-list" style="width: 100%; margin-top: 20px">
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
      </el-card>
      <el-card shadow="hover" v-if="!formData.company[0]==''" style="margin-bottom:20px;">
        <!-- 授权厂商 -->
        <div style=" text-align: left; width: 100%;padding-top: 4px;margin-bottom: 4px;" class="clearfix">
          <span>授权厂商
            <i class="header-icon iconfont icon-company"></i>
          </span>
          <el-button type="primary" @click="addFrom(3)" style="margin-left:20px;" size="mini">添加</el-button>
        </div>
        <el-form-item>
          <el-table size="mini" :data="formData.company" c class="admin-table-list" style="width: 100%; margin-top: 20px">
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
      </el-card>
      <el-card shadow="hover" v-if="!formData.sim[0]==''" style="margin-bottom:20px;">
        <!-- SIM卡 -->
        <div s style=" text-align: left; width: 100%;padding-top: 4px; margin-bottom: 4px;" class="clearfix">
          <span>SIM卡
            <i class="header-icon iconfont icon-sim"></i>
          </span>
          <el-button type="primary" @click="addFrom(5)" style="margin-left:41px;" size="mini">添加</el-button>
        </div>
        <el-form-item>
          <el-table size="mini" :data="formData.sim" class="admin-table-list" style="width: 100%; margin-top: 20px">
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
      </el-card>
      <el-card shadow="hover" v-if="!formData.sms[0]==''" style="margin-bottom:52px;">
        <!-- 短信 -->
        <div style=" text-align: left; width: 100%;padding-top: 4px; margin-bottom: 4px;" class="clearfix">
          <span>短信
            <i class="header-icon iconfont icon-mail-fill"></i>
          </span>
          <el-button type="primary" @click="addFrom(4)" style="margin-left:52px;" size="mini">添加</el-button>
        </div>
        <el-form-item prop="sms">
          <el-table size="mini" :data="formData.sms" class="admin-table-list" style="width: 100%; margin-top: 20px">
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
      </el-card>
      <el-form-item>
      </el-form-item>
    </el-form>
    <el-dialog width="30%" title="添加收费项" :visible.sync="addDialog" :append-to-body="true" :close-on-click-modal="false" :close-on-press-escape="false" :center="true" class="admin-dialog">
      <update-product :parent_id="parent_id" :parent_type="parent_type" @success=" () => {this.detaiN();this.addDialog = false;}" :key="addKey"></update-product>
    </el-dialog>
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
import updateProduct from "./update_product.vue";
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
      addDialog: false,
      parent_id: "",
      parent_type: "",
      addKey: 0,
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
    },
    // 添加单一收费项
    addFrom(type) {
      this.formData.detail_type = type;
      this.addKey++;
      this.addDialog = true;
      this.parent_id = this.formData.package_id;
      this.parent_type = this.formData.detail_type;
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
  components: { selectCompany, updateProduct }
};
</script>
<style>
</style>