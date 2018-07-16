<template>
  <div class="vehicle-form">
    <el-form label-width="200px" status-icon :rules="rules" :model="formData" size="small">
      <el-card shadow="hover">
        <div slot="header" class="clearfix">
          <span>服务商信息 </span>
        </div>
        <el-row :gutter="30">
          <el-col :span="8">
            <el-form-item label="服务到期日期" prop="end_date">
              <el-input v-model="formData.end_date"></el-input>
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
      <el-card shadow="hover">
        <div slot="header" class="clearfix">
          <span>车辆落户信息 </span>
        </div>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="服务接入地址">
              <el-cascader :options="options2" @active-item-change="handleItemChange" :props="props"></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="接入车辆类型" prop="vehicle_type">
              <el-select v-model="formData.vehicle_type" placeholder="接入车辆类型">
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
              <el-select v-model="formData.vehicle_type" placeholder="接入车辆类型">
                <el-option label="新增" value="1"></el-option>
                <el-option label="转网" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="车牌号">
              <el-row>
                <el-col :span="11">
                  <el-form-item prop="vehicle_no" :rules="rules.vehicle_no">
                    <el-input v-model="formData.vehicle_no"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="11" :offset="1">
                  <el-form-item prop="date2">
                    <el-select v-model="formData.plate_color" placeholder="">
                      <div slot="prefix">
                        <span style="display:inline-block;width: 15px; height: 15px;vertical-align: -3px;" :style="$dict.plate_color(formData.plate_color)"> </span>
                      </div>
                      <el-option label="黄色" value="1">
                        <span style="display:inline-block;width: 15px; height: 15px;vertical-align: -3px;" :style="$dict.plate_color(1)"> </span>
                        黄色
                      </el-option>
                      <el-option label="蓝色" value="2">
                        <span style="display:inline-block;width: 15px; height: 15px;vertical-align: -3px;" :style="$dict.plate_color(1)"> </span>
                        蓝色
                      </el-option>
                      <el-option label="绿色" value="3">
                        <span style="display:inline-block;width: 15px; height: 15px;vertical-align: -3px;" :style="$dict.plate_color(3)"> </span>
                        绿色
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>

      <el-card shadow="hover" v-if="formData.vehicle_type==1">
        <div slot="header" class="clearfix">
          <span>普通货运车辆 </span>
        </div>
        <el-row :gutter="30">
          <el-col :span="8">
            <el-form-item label="车辆识别代码/车架号" prop="name">
              <el-input v-model="formData.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="车辆品牌">
              <el-input v-model="formData.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="车辆型号">
              <el-input v-model="formData.name"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
      <el-card shadow="hover" v-if="formData.vehicle_type==2">
        <div slot="header" class="clearfix">
          <span>危险品车辆 </span>
        </div>
        <el-row :gutter="30">
          <el-col :span="8">
            <el-form-item label="车辆识别代码/车架号" prop="name">
              <el-input v-model="formData.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="车辆品牌">
              <el-input v-model="formData.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="车辆型号">
              <el-input v-model="formData.name"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>

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
export default {
  data() {
    return {
      formData: {
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
      options2: [
        {
          label: "江苏",
          cities: []
        },
        {
          label: "浙江",
          cities: []
        }
      ],
      props: {
        value: "label",
        children: "cities"
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
  methods: {
    handleItemChange(val) {
      setTimeout(() => {
        if (val.indexOf("江苏") > -1 && !this.options2[0].cities.length) {
          this.options2[0].cities = [
            {
              label: "南京"
            }
          ];
        } else if (
          val.indexOf("浙江") > -1 &&
          !this.options2[1].cities.length
        ) {
          this.options2[1].cities = [
            {
              label: "杭州"
            }
          ];
        }
      }, 300);
    }
  }
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
