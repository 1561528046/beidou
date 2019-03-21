<template>
  <div class="admin-table-container">
    <el-form status-icon :rules="rules" :model="formData" ref="baseForm">
      <el-card shadow="hover" style="margin-bottom:20px; height: 72px;">
        <el-form-item prop="title" style="padding:0;">
          <template>
            <div style="width:280px; line-height:33px;">
              <label style="font-size:16px; float:left;">产品名称：</label>
              <label
                style="width:130px;float:left; text-align:center; display:inline-block;"
                v-if="!this.title_type"
              >{{formData.title}}</label>
              <el-input
                :ref="'editTitle'"
                v-if="this.title_type"
                v-on:blur="titleblur()"
                v-model="formData.title"
                style="float:left; width:130px;"
                size="mini"
              ></el-input>
              <el-button
                type="primary"
                icon="el-icon-edit"
                @click="titletype()"
                circle
                style="padding:5px;"
              ></el-button>
            </div>
          </template>
        </el-form-item>
      </el-card>
      <el-card shadow="hover" style="margin-bottom:20px;">
        <!-- 授权车辆 -->
        <div
          style="cursor:pointer; text-align: left; width: 100%;padding-top: 4px; margin-bottom: 4px;"
          class="clearfix"
          @click="Collapse(1)"
        >
          <i v-show="!vehicleShow" class="el-icon-arrow-right" style="float:right;"></i>
          <i v-show="vehicleShow" class="el-icon-arrow-down" style="float:right;"></i>
          <span>
            授权车辆
            <i class="header-icon iconfont icon-car-fill"></i>
          </span>
          <el-button type="primary" size="mini" @click="addFrom(1)" style="margin-left:20px;">添加</el-button>
        </div>
        <el-form-item>
          <el-table
            v-show="vehicleShow"
            size="mini"
            :data="formData.detail"
            class="admin-table-list"
            style="width: 100%; margin-top: 20px"
            v-loading="tableLoading"
          >
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
                <label v-if="scope.row.device_type==1">定位终端</label>
                <label v-if="scope.row.device_type==2">视频终端</label>
              </template>
            </el-table-column>
            <el-table-column prop="detail_name" label="收费单项"></el-table-column>
            <el-table-column prop="original_price" label="单价"></el-table-column>
            <el-table-column prop="discount_price" label="优惠金额(元)">
              <template slot-scope="scope">
                <label v-show="!scope.row.isEditManty">{{scope.row.discount_price}}</label>
                <el-button
                  v-show="!scope.row.isEditManty"
                  type="primary"
                  @click="manty(scope)"
                  icon="el-icon-edit"
                  circle
                  style="padding:3px; margin-left:7px; float-right;"
                ></el-button>
                <el-input
                  v-show="scope.row.isEditManty"
                  :ref="'editInput'+scope.row.detail_id"
                  @blur="changeCount(scope)"
                  style="width:136px;"
                  size="small"
                  v-model="scope.row.discount_price"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="pay_type" label="付费方式">
              <template slot-scope="scope">
                <div style="width:80px;" v-show="!scope.row.isEditPayty">
                  <label v-show="scope.row.pay_type==1">计费</label>
                  <label v-show="scope.row.pay_type==2">充值</label>
                  <!-- <el-button type="primary" @click="payty(scope)" icon="el-icon-edit" circle style="padding:3px; margin-left:7px;"></el-button> -->
                </div>
                <select
                  v-show="scope.row.isEditPayty"
                  :ref="'editSelect'+scope.row.detail_id"
                  @blur="changeCou(scope)"
                  v-model="scope.row.pay_type"
                >
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
      <el-card shadow="hover" style="margin-bottom:20px;">
        <!-- 授权厂商 -->
        <div
          style="cursor:pointer;  text-align: left; width: 100%;padding-top: 4px;margin-bottom: 4px;"
          class="clearfix"
          @click="Collapse(2)"
        >
          <i v-show="!companyShow" class="el-icon-arrow-right" style="float:right;"></i>
          <i v-show="companyShow" class="el-icon-arrow-down" style="float:right;"></i>
          <span>
            授权厂商
            <i class="header-icon iconfont icon-company"></i>
          </span>
          <el-button type="primary" @click="addFrom(2)" style="margin-left:20px;" size="mini">添加</el-button>
        </div>
        <el-form-item>
          <el-table
            v-show="companyShow"
            size="mini"
            :data="formData.company"
            c
            class="admin-table-list"
            style="width: 100%; margin-top: 20px"
          >
            <el-table-column prop="company_id" label="终端厂商">
              <template slot-scope="scope">{{scope.row.company_name}}</template>
            </el-table-column>
            <el-table-column prop="detail_name" label="收费单项">
              <template slot-scope="scope">{{scope.row.detail_name}}</template>
            </el-table-column>
            <el-table-column prop="original_price" label="单价"></el-table-column>
            <el-table-column prop="discount_price" label="优惠金额(元)">
              <template slot-scope="scope">
                <label v-show="!scope.row.isEditManty">{{scope.row.discount_price}}</label>
                <el-button
                  v-show="!scope.row.isEditManty"
                  type="primary"
                  @click="manty(scope)"
                  icon="el-icon-edit"
                  circle
                  style="padding:3px; margin-left:7px; float-right;"
                ></el-button>
                <el-input
                  v-show="scope.row.isEditManty"
                  :ref="'editInput'+scope.row.detail_id"
                  @blur="changeCount(scope)"
                  style="width:136px;"
                  size="small"
                  v-model="scope.row.discount_price"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="pay_type" label="付费方式">
              <template slot-scope="scope">
                <div style="width:80px;" v-show="!scope.row.isEditPayty">
                  <label v-show="scope.row.pay_type==1">计费</label>
                  <label v-show="scope.row.pay_type==2">充值</label>
                  <el-button
                    type="primary"
                    @click="payty(scope)"
                    icon="el-icon-edit"
                    circle
                    style="padding:3px; margin-left:7px;"
                  ></el-button>
                </div>
                <select
                  v-show="scope.row.isEditPayty"
                  :ref="'editSelect'+scope.row.detail_id"
                  @blur="changeCou(scope)"
                  v-model="scope.row.pay_type"
                >
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
      <el-card shadow="hover" style="margin-bottom:20px;">
        <!-- SIM卡 -->
        <div
          style="cursor:pointer;  text-align: left; width: 100%;padding-top: 4px; margin-bottom: 4px;"
          class="clearfix"
          @click="Collapse(3)"
        >
          <i v-show="!simShow" class="el-icon-arrow-right" style="float:right;"></i>
          <i v-show="simShow" class="el-icon-arrow-down" style="float:right;"></i>
          <span>
            SIM卡
            <i class="header-icon iconfont icon-sim"></i>
          </span>
          <el-button type="primary" @click="addFrom(4)" style="margin-left:41px;" size="mini">添加</el-button>
        </div>
        <el-form-item>
          <el-table
            v-show="simShow"
            size="mini"
            :data="formData.sim"
            class="admin-table-list"
            style="width: 100%; margin-top: 20px"
          >
            <el-table-column prop="detail_name" label="运营商" width="240"></el-table-column>
            <el-table-column prop="count" label="使用流量"></el-table-column>
            <el-table-column prop="original_price" label="单价"></el-table-column>
            <el-table-column prop="discount_price" label="优惠金额">
              <template slot-scope="scope">
                <label v-show="!scope.row.isEditManty">{{scope.row.discount_price}}</label>
                <el-button
                  v-show="!scope.row.isEditManty"
                  type="primary"
                  @click="manty(scope)"
                  icon="el-icon-edit"
                  circle
                  style="padding:3px; margin-left:7px; float-right;"
                ></el-button>
                <el-input
                  v-show="scope.row.isEditManty"
                  :ref="'editInput'+scope.row.detail_id"
                  @blur="changeCount(scope)"
                  style="width:136px;"
                  size="small"
                  v-model="scope.row.discount_price"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="pay_type" label="付费方式">
              <template slot-scope="scope">
                <div style="width:80px;" v-show="!scope.row.isEditPayty">
                  <label v-show="scope.row.pay_type==1">计费</label>
                  <label v-show="scope.row.pay_type==2">充值</label>
                  <el-button
                    type="primary"
                    @click="payty(scope)"
                    icon="el-icon-edit"
                    circle
                    style="padding:3px; margin-left:7px;"
                  ></el-button>
                </div>
                <select
                  v-show="scope.row.isEditPayty"
                  :ref="'editSelect'+scope.row.detail_id"
                  @blur="changeCou(scope)"
                  v-model="scope.row.pay_type"
                >
                  <option value="1">计费</option>
                  <option value="2">充值</option>
                </select>
              </template>
            </el-table-column>
            <el-input v-on:blur="changeSim(scope)" style="width:136px;" size="small"></el-input>
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              style="padding:3px; margin-left:7px; float-right;"
            ></el-button>
            <el-table-column label="操作" width="200">
              <template slot-scope="scope">
                <el-button size="small" icon="el-icon-delete" @click="delDetail(scope)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-card>
      <el-card shadow="hover" style="margin-bottom:52px;">
        <!-- 短信 -->
        <div
          style="cursor:pointer;  text-align: left; width: 100%;padding-top: 4px; margin-bottom: 4px;"
          class="clearfix"
          @click="Collapse(4)"
        >
          <i v-show="!smsShow" class="el-icon-arrow-right" style="float:right;"></i>
          <i v-show="smsShow" class="el-icon-arrow-down" style="float:right;"></i>
          <span>
            短信
            <i class="header-icon iconfont icon-mail-fill"></i>
          </span>
          <el-button type="primary" @click="addFrom(3)" style="margin-left:52px;" size="mini">添加</el-button>
        </div>
        <el-form-item prop="sms">
          <el-table
            v-show="smsShow"
            size="mini"
            :data="formData.sms"
            class="admin-table-list"
            style="width: 100%; margin-top: 20px"
          >
            <el-table-column prop="count" label="数量"></el-table-column>
            <el-table-column prop="original_price" label="单价"></el-table-column>
            <el-table-column prop="discount_price" label="优惠金额(元)">
              <template slot-scope="scope">
                <label v-show="!scope.row.isEditManty">{{scope.row.discount_price}}</label>
                <el-button
                  v-show="!scope.row.isEditManty"
                  type="primary"
                  @click="manty(scope)"
                  icon="el-icon-edit"
                  circle
                  style="padding:3px; margin-left:7px; float-right;"
                ></el-button>
                <el-input
                  v-show="scope.row.isEditManty"
                  :ref="'editInput'+scope.row.detail_id"
                  @blur="changeCount(scope)"
                  style="width:136px;"
                  size="small"
                  v-model="scope.row.discount_price"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="pay_type" label="付费方式">
              <template slot-scope="scope">
                <div style="width:80px;" v-show="!scope.row.isEditPayty">
                  <label v-show="scope.row.pay_type==1">计费</label>
                  <label v-show="scope.row.pay_type==2">充值</label>
                  <el-button
                    type="primary"
                    @click="payty(scope)"
                    icon="el-icon-edit"
                    circle
                    style="padding:3px; margin-left:7px;"
                  ></el-button>
                </div>
                <select
                  v-show="scope.row.isEditPayty"
                  :ref="'editSelect'+scope.row.detail_id"
                  @blur="changeCou(scope)"
                  v-model="scope.row.pay_type"
                >
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
    </el-form>
    <el-dialog
      width="30%"
      title="添加收费项"
      :visible.sync="addDialog"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :center="true"
      class="admin-dialog"
    >
      <update-product
        :parent_id="parent_id"
        :parent_type="parent_type"
        @success=" () => {this.detaiN();this.addDialog = false;}"
        :key="addKey"
      ></update-product>
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
  components: { selectCompany, updateProduct },
  data() {
    return {
      vehicleShow: false,
      companyShow: false,
      simShow: false,
      smsShow: false,
      tableLoading: false,
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
      this.$set(scope.row, "isEditPayty", true);
      this.$nextTick(() => {
        this.$refs["editSelect" + scope.row.detail_id].focus();
      });
    },
    // 金额修改
    manty(scope) {
      this.$set(scope.row, "isEditManty", true);
      this.$nextTick(() => {
        this.$refs["editInput" + scope.row.detail_id].focus();
      });
    },
    //修改产品名称
    titletype() {
      this.$set(this.$data, "title_type", true);
      this.$nextTick(() => {
        this.$refs["editTitle"].focus();
      });
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
    // 编辑金额
    changeCount(scope) {
      this.tableLoading = true;
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
    // 编辑计费
    changeCou(scope) {
      this.tableLoading = true;
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
      this.tableLoading = true;
      getProductDetail({ package_id: this.formData.package_id })
        .then(res => {
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
                // 厂商
                this.formData.company.push(res.data.data[i]);
              } else if (res.data.data[i].detail_type == 3) {
                // 短信
                this.formData.sms.push(res.data.data[i]);
              } else if (res.data.data[i].detail_type == 4) {
                // sim卡
                this.formData.sim.push(res.data.data[i]);
              }
            }
          }
          this.tableLoading = false;
        })
        .catch(() => {
          this.tableLoading = false;
        });
    },
    // 添加单一收费项
    addFrom(type) {
      this.addKey++;
      this.addDialog = true;
      this.parent_id = this.formData.package_id;
      this.parent_type = type;
      if (type == 1) {
        this.vehicleShow = false;
      } else if (type == 2) {
        this.companyShow = false;
      } else if (type == 3) {
        this.simShow = false;
      } else if (type == 4) {
        this.smsShow = false;
      }
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
    },
    Collapse(state) {
      if (state == 1) {
        if (this.vehicleShow) {
          this.vehicleShow = false;
        } else {
          this.vehicleShow = true;
        }
        this.companyShow = false;
        this.simShow = false;
        this.smsShow = false;
      } else if (state == 2) {
        if (this.companyShow) {
          this.companyShow = false;
        } else {
          this.companyShow = true;
        }
        this.vehicleShow = false;
        this.simShow = false;
        this.smsShow = false;
      } else if (state == 3) {
        if (this.simShow) {
          this.simShow = false;
        } else {
          this.simShow = true;
        }
        this.vehicleShow = false;
        this.companyShow = false;
        this.smsShow = false;
      } else if (state == 4) {
        if (this.smsShow) {
          this.smsShow = false;
        } else {
          this.smsShow = true;
        }
        this.vehicleShow = false;
        this.companyShow = false;
        this.simShow = false;
      }
    }
  }
};
</script>