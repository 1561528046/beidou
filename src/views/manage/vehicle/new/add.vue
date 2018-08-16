<template>
  <div class="vehicle-form">
    <el-form label-width="200px" :rules="rules" :model="formData" size="small" ref="baseForm">
      <!-- 服务商信息 -->
      <el-card shadow="hover">
        <div slot="header" class="clearfix">
          <span>服务商信息 </span>
        </div>
        <el-row :gutter="30">
          <el-col :span="8">
            <el-form-item label="服务到期日期" prop="contract_date">
              <el-date-picker v-model="formData.contract_date" :picker-options="pickerOptions" value-format="yyyy-MM-dd" align="center" type="date" placeholder="选择日期" style="width:100%;">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="服务商名称">
              （服务端设置）
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="服务接入地址">
              （服务端设置）
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>

      <!-- 车辆落户信息 -->
      <el-card shadow="hover">
        <div slot="header" class="clearfix">
          <span>车辆落户信息 </span>
        </div>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="道路运输证号" prop="transport_no">
              <el-input v-model="formData.transport_no"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="行驶证发证日期" prop="issue_date" value-format="yyyy-MM-dd">
              <el-date-picker v-model="formData.issue_date" :picker-options="pickerOptions" align="center" type="date" placeholder="选择日期" style="width:100%;" value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所属地区" prop="area">
              <select-city v-model="formData.area" :province_id.sync="formData.province_id" :city_id.sync="formData.city_id" :county_id.sync="formData.county_id" style="width:100%;"></select-city>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="接入车辆类型" prop="type">
              <select-vehicle-type v-model="formData.type" style="width:100%;" clearable></select-vehicle-type>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="接入车辆状态" prop="source">
              <el-select v-model="formData.source" placeholder="接入车辆类型" style="width:100%;">
                <el-option label="新增" value="1"></el-option>
                <el-option label="转网" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="燃料种类" prop="flue_type">
              <select-fule-type v-model="formData.flue_type" style="width:100%;"></select-fule-type>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="车牌号" style="margin-bottom:0;" class="is-required">
              <el-row>
                <el-col :span="11">
                  <el-form-item prop="license">
                    <el-input v-model="formData.license"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12" :offset="1">
                  <el-form-item prop="license_color">
                    <el-select v-model="formData.license_color" placeholder="请选择车牌颜色">
                      <div slot="prefix">
                        <span style="display:inline-block;width: 15px; height: 15px;vertical-align: -3px;" :style="$dict.get_license_color(formData.license_color).style">
                        </span>
                      </div>
                      <el-option :label="plateColor.name" :value="value" v-for="(plateColor,value) in license_colors" :key="plateColor.name">
                        <span style="display:inline-block;width: 15px; height: 15px;vertical-align: -3px;" :style="plateColor.style"> </span>
                        {{plateColor.name}}
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="业户/车主" prop="owner">
              <el-input v-model="formData.owner"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系人" prop="linkman">
              <el-input v-model="formData.linkman"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系人手机" prop="tel">
              <el-input v-model="formData.tel"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>

      <el-card shadow="hover" v-if="formData.type==1">
        <div slot="header" class="clearfix">
          <span>普通货运车辆 </span>
        </div>
        <el-row :gutter="30">
          <el-col :span="24">
            <div class="el-tag el-tag--warning" style="display:block;text-align:center;margin-bottom:15px; height:auto;">
              提示：请正确填写车辆信息。为了不影响车辆审核结果,请填写正确道路运输证号!
              <br>【核定载质量】与【准牵引总质量】两项至少填一项；
              <a href="/static/全国道路货运公共监管与服务平台数据录入要求.pdf" download style="color:blue;">下载填写要求说明</a>
            </div>
          </el-col>
          <el-col :span="8" prop="vin">
            <el-form-item label="车辆识别代码/车架号" prop="vin">
              <el-input v-model="formData.vin"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" prop="brand_id">
            <el-form-item label="车辆品牌">
              <el-input v-model="formData.brand_id"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="车辆型号" prop="model">
              <el-input v-model="formData.model"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="车辆类型" prop="vtype">
              <select-vtype v-model="formData.vtype" style="width:100%" clearable></select-vtype>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="发动机号" prop="engine_no">
              <el-input v-model="formData.engine_no"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="发动机型号" prop="engine_type">
              <el-input v-model="formData.engine_type"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="总质量(kg)" prop="total_ton">
              <el-input v-model="formData.total_ton"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="核定载质量(kg)" prop="load_ton">
              <el-input v-model="formData.load_ton"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="准牵引总质量(kg)" prop="draw_ton">
              <el-input v-model="formData.draw_ton"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="外廓尺寸(mm)长" prop="length">
              <el-input v-model="formData.length"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="宽" prop="width">
              <el-input v-model="formData.width"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="高" prop="heigth">
              <el-input v-model="formData.heigth"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="货厢内部尺寸(mm)长" prop="box_length">
              <el-input v-model="formData.box_length"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="宽" prop="box_width">
              <el-input v-model="formData.box_width"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="高" prop="box_height">
              <el-input v-model="formData.box_height"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="轴数" prop="axis">
              <el-input v-model="formData.axis"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="车辆登记证1" prop="register_no1">
              <input type="file">
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="车辆登记证2" prop="register_no2">
              <input type="file">
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="车辆合格证/行驶证" prop="driver_no">
              <input type="file">
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="车身照片" prop="img">
              <input type="file">
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>

      <!-- 终端信息 -->
      <el-card shadow="hover">
        <div slot="header" class="clearfix">
          <span>终端信息
          </span>
        </div>
        <el-row :gutter="30">
          <el-col :span="8">
            <el-form-item label="设备厂商" prop="company_id">
              <el-input v-model="formData.company_id"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="终端ID" prop="device_id">
              <el-input v-model="formData.device_id"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="SIM卡卡号" prop="sim_id">
              <el-input v-model="formData.sim_id"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="安装SIM卡号" prop="sim_no">
              <el-input v-model="formData.sim_no"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>

      <!-- 其他信息 -->
      <el-card shadow="hover">
        <div slot="header" class="clearfix">
          <span>其他信息
          </span>
        </div>
        <el-row :gutter="30">
          <el-col :span="8">
            <el-form-item label="车辆出厂时间" prop="factory_date">
              <el-input v-model="formData.factory_date"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="车身颜色" prop="body_color">
              <el-input v-model="formData.body_color"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="经营范围" prop="business_scope">
              <el-input v-model="formData.business_scope"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="轮胎数" prop="tyre">
              <el-input v-model="formData.tyre"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="轮胎规格" prop="tyre_size">
              <el-input v-model="formData.tyre_size"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="道路运输经营许可证号" prop="transport_license">
              <el-input v-model="formData.transport_license"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="车辆购置方式" prop="purchase">
              <el-input v-model="formData.purchase"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="车辆保险到期时间" prop="insurance_date">
              <el-date-picker v-model="formData.insurance_date" :picker-options="pickerOptions" align="center" type="date" placeholder="选择日期" style="width:100%;" value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="检验有效期至" prop="valid_date">
              <el-date-picker v-model="formData.valid_date" :picker-options="pickerOptions" align="center" type="date" placeholder="选择日期" style="width:100%;" value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="车辆保险种类" prop="insurance_type">
              <el-checkbox-group v-model="checkedInsuranceTypes">
                <el-checkbox v-for="(insurance_type,index) in insurance_types" :label="index+1" :key="index+1">{{insurance_type}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item v-if="checkedInsuranceTypes.indexOf(7)!=-1">
              <el-input></el-input>
            </el-form-item>

          </el-col>

        </el-row>
      </el-card>
      <el-form-item style="text-align:center;">
        <el-button type="primary" @click="formSubmit" size="large">立即创建</el-button>
      </el-form-item>

      <!-- <button @click="$router.go(-1)">a</button> -->
    </el-form>
  </div>
</template>
<script>
import { addVehicle } from "@/api/index.js";
import moment from "moment";
import selectCity from "@/components/select-city.vue";
import selectVehicleType from "@/components/select-vehicle-type.vue";
import selectFuleType from "@/components/select-fule-type.vue";
import selectVtype from "@/components/select-vtype.vue";
import { Rules } from "./rules.js";

export default {
  components: { selectVehicleType, selectCity, selectFuleType, selectVtype },
  data() {
    return {
      insurance_types: [
        "交强险",
        "盗抢险",
        "三者",
        "车损险",
        "车上人员险",
        "货物运输险",
        "其它"
      ],
      checkedInsuranceTypes: [1],
      viewData: {
        //用于渲染的数据
      },
      formData: {
        area: [],
        //提交的数据
        sim_id: "1", //Sim Id
        sim_no: "15930616103", //真实SIM卡号
        device_id: "1", //设备Id
        license: "冀R12345", //车牌号
        contract_date: "20180808", //服务到期日期
        first_time: "", //首次定位时间
        province_id: "", //省id
        city_id: "", //市id
        county_id: "", //县id
        ip: "", //车辆接入ip
        port: "", //车辆接入端口
        issue_date: "", //行驶证签发日期
        type: "1", //接入车辆类型：1普通货运车辆，2危险品车辆，3长途客运、班线车辆，4城市公共交通车辆，5校车，6出租车，7私家车，8警务车辆，9网约车，10其他车辆
        fuel_type: "", //燃料种类：1柴油，2汽油，3电，4乙醇，5液化天然气，6压缩天然气
        license_color: "1", //车牌颜色：1黄色，2蓝色，3白色，4黑色，5其它
        owner: "111", //车主/业户
        linkman: "111", //联系人
        tel: "15930616103", //联系电话
        factory_date: "", //出厂时间
        body_color: "", //车身颜色：1黄色，2蓝色，3白色，4黑色，5其它
        business_scope: "", //经营范围
        tyre: "", //轮胎数
        tyre_size: "", //轮胎规格
        purchase: "", //购置方式：1分期，2全款
        insurance_date: "", //车辆保险到期日期
        insurance_type: "", //车辆保险种类：1交强险，2盗抢险，3三者，4车损险，5车上人员险，6货物运输险，7其它
        valid_date: "", //检验有效期至
        time: "", //记录添加时间
        vin: "121212", //车辆识别代码/vin
        brand_id: "1", //车辆品牌id
        end_time: "", //离线时间
        vid: "", //全国平台车辆ID
        source: "1", //接入车辆状态：1新增，2转网
        transport_license: "", //道路运输经营许可证
        transport_no: "", //道路运输证号
        vtype: "1", //车辆类型
        register_no1: "", //车辆登记证1
        register_no2: "", //车辆登记证2
        driver_no: "", //车辆合格证/行驶证
        img: "", //车身照片
        model: "11", //车辆型号
        engine_no: "11", //发动机号
        engine_type: "11", //发动机类型
        total_ton: "11", //总质量(kg)
        load_ton: "11", //核定载质量(kg)
        draw_ton: "11", //准牵引总质量(kg)
        length: "11", //外廓尺寸(mm)长
        width: "11", //外廓尺寸(mm)宽
        heigth: "11", //外廓尺寸(mm)高
        box_length: "11", //货厢内部尺寸(mm)长
        box_width: "11", //货厢内部尺寸(mm)宽
        box_height: "11", //货厢内部尺寸(mm)高
        axis: "11" //轴数
      },
      pickerOptions: {
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          },
          {
            text: "一年后",
            onClick(picker) {
              const date = moment(new Date()).add(1, "year");
              picker.$emit("pick", date);
            }
          },
          {
            text: "两年后",
            onClick(picker) {
              const date = moment(new Date()).add(2, "year");
              picker.$emit("pick", date);
            }
          }
        ]
      },
      rules: {
        ...new Rules(this)
      }
    };
  },
  computed: {
    license_colors: function() {
      var result = Object.assign({}, this.$dict.license_color);
      if (this.formData.flue_type == 3) {
        //如果燃油种类是电 只能选择黄绿色车牌
        delete result["1"];
        delete result["2"];
      } else {
        delete result["3"];
      }
      if (
        !result[this.formData.license_color] &&
        this.formData.license_color != ""
      ) {
        this.$set(this.formData, "license_color", "");
      }
      return result;
    }
  },
  created() {},
  methods: {
    formSubmit() {
      this.$refs.baseForm.validate((isVaildate, errorItem) => {
        if (isVaildate) {
          var postData = Object.assign({}, this.formData);
          addVehicle(postData)
            .then(res => {
              if (res.data.code == 0) {
                this.$emit("success");
                this.$notify.success({
                  title: "成功",
                  message: res.data.msg
                });
              } else {
                this.$emit("error");
                this.$notify.error({
                  title: "失败",
                  message: res.data.msg
                });
              }
            })
            .catch(() => {
              this.$notify.error({
                title: "失败",
                message: "接口错误"
              });
              this.$emit("error");
            });
        } else {
          var errormsg = "";
          for (var key in errorItem) {
            errormsg += errorItem[key][0].message + "<br>";
          }
          this.$notify.error({
            title: "错误",
            dangerouslyUseHTMLString: true,
            message: errormsg
          });
        }
      });
    }
  }
};
</script>
<style scoped lang="less">
.vehicle-form {
  padding: 20px;
}

.el-card {
  margin-bottom: 20px;
}
</style>