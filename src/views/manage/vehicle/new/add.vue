<template>
  <div class="vehicle-form">
    <el-form label-width="200px" status-icon :rules="rules" :model="formData" size="small">
      <!-- 服务商信息 -->
      <el-card shadow="hover">
        <div slot="header" class="clearfix">
          <span>服务商信息 </span>
        </div>
        <el-row :gutter="30">
          <el-col :span="8">
            <el-form-item label="服务到期日期" prop="end_date">
              <el-date-picker v-model="formData.end_date" :picker-options="pickerOptions" align="center" type="date" placeholder="选择日期" style="width:100%;">
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
            <el-form-item label="道路运输证号" prop="road_transport">
              <el-input v-model="formData.road_transport"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="行驶证发证日期" prop="drivecard_release_date">
              <el-date-picker v-model="formData.drivecard_release_date" :picker-options="pickerOptions" align="center" type="date" placeholder="选择日期" style="width:100%;">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所属地区">
              <city-select v-model="formData.area" style="width:100%;"></city-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="接入车辆类型" prop="vehicle_type">
              <el-select v-model="formData.vehicle_type" placeholder="接入车辆类型" style="width:100%;">
                <el-option label="普通货运车辆" value="1"></el-option>
                <el-option label="危险品车辆" value="2"></el-option>
                <el-option label="长途客运、班线车辆" value="3"></el-option>
                <el-option label="城市公共交通车辆" value="4"></el-option>
                <el-option label="出租车" value="5"></el-option>
                <el-option label="网约车" value="6"></el-option>
                <el-option label="校车" value="7"></el-option>
                <el-option label="警务车辆" value="8"></el-option>
                <el-option label="其他车辆" value="9"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="接入车辆状态" prop="vehicle_type">
              <el-select v-model="formData.vehicle_type" placeholder="接入车辆类型" style="width:100%;">
                <el-option label="新增" value="1"></el-option>
                <el-option label="转网" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="燃料种类" prop="flue_type">
              <el-select v-model="formData.flue_type" placeholder="燃料种类" style="width:100%;">
                <el-option :label="fuleType.name" :value="value" v-for="(fuleType,value) in $dict.fule_type" :key="fuleType.name">
                  {{fuleType.name}}
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="车牌号" style="margin-bottom:0;">
              <el-row>
                <el-col :span="11">
                  <el-form-item prop="vehicle_no" :rules="rules.vehicle_no">
                    <el-input v-model="formData.vehicle_no"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12" :offset="1">
                  <el-form-item prop="plate_color">
                    <el-select v-model="formData.plate_color" placeholder="">
                      <div slot="prefix">
                        <span style="display:inline-block;width: 15px; height: 15px;vertical-align: -3px;" :style="$dict.get_plate_color(formData.plate_color).style"> </span>
                      </div>
                      <el-option :label="plateColor.name" :value="value" v-for="(plateColor,value) in plate_colors" :key="plateColor.name">
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
            <el-form-item label="业户/车主" prop="companyname">
              <el-input v-model="formData.companyname"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系人" prop="vehicle_owner_name">
              <el-input v-model="formData.vehicle_owner_name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系人手机" prop="vehicle_owner_phone">
              <el-input v-model="formData.vehicle_owner_phone"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>

      <el-card shadow="hover" v-if="formData.vehicle_type==1">
        <div slot="header" class="clearfix">
          <span>普通货运车辆 </span>
        </div>
        <el-row :gutter="30">
          <el-col :span="24">
            <div class="el-tag el-tag--warning" style="display:block;text-align:center;margin-bottom:15px; height:auto;">
              提示：请正确填写车辆信息。为了不影响车辆审核结果,请填写正确道路运输证号!<br>【核定载质量】与【准牵引总质量】两项至少填一项；
              <a href="#" style="color:blue;">下载填写要求说明</a>
            </div>
          </el-col>
          <el-col :span="8">
            <el-form-item label="车辆识别代码/车架号" prop="name">
              <el-input v-model="formData.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="车辆品牌">
              <el-input v-model="formData.vbrand_name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="车辆类型">
              <el-input v-model="formData.prod_code_text"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="发动机号">
              <el-input v-model="formData.engine_no"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="发动机型号">
              <el-input v-model="formData.prod_code_text"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="总质量(kg)">
              <el-input v-model="formData.vehicle_ton"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="核定载质量(kg)">
              <el-input v-model="formData.load_ton"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="准牵引总质量(kg)">
              <el-input v-model="formData.vehicle_draw_ton"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="外廓尺寸(mm)长">
              <el-input v-model="formData.vehicle_length"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="宽">
              <el-input v-model="formData.vehicle_width"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="高">
              <el-input v-model="formData.vehicle_height"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="货厢内部尺寸(mm)长">
              <el-input v-model="formData.box_length"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="宽">
              <el-input v-model="formData.box_width"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="高">
              <el-input v-model="formData.box_height"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="轴数">
              <el-input v-model="formData.vehicle_axis"></el-input>
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
            <el-form-item label="设备厂商" prop="name">
              <el-input v-model="formData.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备ID" prop="name">
              <el-input v-model="formData.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="SIM ID" prop="name">
              <el-input v-model="formData.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="安装SIM卡号" prop="name">
              <el-input v-model="formData.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备厂商" prop="name">
              <el-input v-model="formData.name"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
      <el-form-item style="text-align:center;">
        <el-button type="primary" @click="onSubmit" size="large">立即创建</el-button>
      </el-form-item>

      <!-- <button @click="$router.go(-1)">a</button> -->
    </el-form>
  </div>
</template>
<script>
// [
//   "普通货运车辆",
//   "危险品车辆",
//   "长途客运、班线车辆",
//   "城市公共交通车辆",
//   "出租车",
//   "网约车",
//   "校车",
//   "警务车辆",
//   "其他车辆"
// ];
import { rules } from "@/utils/rules.js";
import moment from "moment";
import citySelect from "@/components/city-select.vue";
export default {
  data() {
    return {
      formData: {
        area: [13000, 13001, 13000],
        name: "",
        end_date: "", //到期日期
        vehicle_type: "", //车辆类型
        road_transport: "", //道路运输证号
        drivecard_release_date: "", //行驶证发证日期
        fule_type: "", //燃料种类*
        vehicle_no: "", //车牌号*
        plate_color: "", //车牌颜色*
        area_code: "", //所属地区*
        city_id: "", //所属地区*
        county: "", //所属地区*
        companyname: "", //车主/业户*
        vehicle_owner_name: "", //联系人*
        vehicle_owner_phone: "", //联系人手机*
        //车辆基本信息
        vin_code: "", //车辆识别代码/车架号*
        vbrand_name: "", //车辆品牌：*
        prod_code_text: "", //车辆型号：*
        engine_no: "", //发动机号：*
        engine_type: "", //发动机型号：*
        vehicle_ton: "", //总质量(kg)：*
        load_ton: "", //核定载质量(kg)：*
        vehicle_draw_ton: "", //准牵引总质量(kg)：*
        vehicle_length: "", //外廓尺寸(mm)长：*
        vehicle_width: "", //宽：*
        vehicle_height: "", //高：*
        box_length: "", //货厢内部尺寸(mm)长：*
        box_width: "", //宽：*
        box_height: "", //高：*
        vehicle_axis: "", //轴数：*
        registration_certificate_file: "", //车辆登记证1：
        registration_certificate_file2: "", //车辆登记证2：
        driving_lic_or_cert_file: "", //车辆合格证/行驶证：
        vehicle_body_photo_file: "", //车身照片：
        //终端信息
        tmac: "", //终端_i_d：*
        commaddr: "", //_s_i_m卡卡号：*
        //其它信息
        out_factory_time: "", //车辆出厂时间：
        vehicle_color: "", //车身颜色：
        vehicle_business_scope: "", //经营范围：
        vehicle_tyre_number: "", //轮胎数：
        vehicle_tyre_size: "", //轮胎规格：
        corp_road_transport: "", //道路运输经营许可证号：
        insurance_expirate_time: "", //车辆保险到期时间：
        valid_date_check: "", //检验有效期至：
        insurance_type: "" //车辆保险种类：
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
        ...rules,
        vehicle_no: [
          {
            trigger: "blur",
            component: this,
            validator: function(rule, value, callback) {
              var fule_type = rule.component.formData.fule_type;
              var vehicleNo01, vehicleNo02, vehicleNo03;
              // 如果是电车，那么走新的判断，程超
              if (fule_type == "3") {
                vehicleNo01 = /^[\u4e00-\u9fa5]{1}[A-Za-z0-9]{7}$/;
                vehicleNo02 = /^[\u4e00-\u9fa5]{2}[A-Za-z0-9]{6}$/;
                vehicleNo03 = /^[\u4e00-\u9fa5]{1}[A-Za-z0-9]{6}[\u4e00-\u9fa5]{1}$/;
              } else {
                vehicleNo01 = /^[\u4e00-\u9fa5]{1}[A-Za-z0-9]{6}$/;
                vehicleNo02 = /^[\u4e00-\u9fa5]{2}[A-Za-z0-9]{5}$/;
                vehicleNo03 = /^[\u4e00-\u9fa5]{1}[A-Za-z0-9]{5}[\u4e00-\u9fa5]{1}$/;
              }
              var result =
                vehicleNo01.test(value) ||
                vehicleNo02.test(value) ||
                vehicleNo03.test(value);
              if (result) {
                callback();
              } else {
                callback(new Error("车牌号不正确"));
              }
            }
          }
        ]
      }
    };
  },
  computed: {
    plate_colors: function() {
      var result = Object.assign({}, this.$dict.plate_color);
      if (this.formData.flue_type == 3) {
        //如果燃油种类是电 只能选择黄绿色车牌
        delete result["1"];
        delete result["2"];
      } else {
        delete result["3"];
      }
      this.$set(this.formData, "plate_color", "");
      return result;
    }
  },
  created() {},
  methods: {},
  components: { citySelect }
};
</script>
<style scoped lang="less">
.vehicle-form {
  padding: 20px;
  .el-card {
    margin-bottom: 20px;
  }
}
</style>
