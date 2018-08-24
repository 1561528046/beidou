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
              <el-date-picker v-model="formData.contract_date" :picker-options="pickerOptions" value-format="yyyyMMdd" align="center" type="date" placeholder="选择日期" style="width:100%;">
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
            <el-form-item label="行驶证发证日期" prop="issue_date">
              <el-date-picker v-model="formData.issue_date" :picker-options="pickerOptions" align="center" type="date" placeholder="选择日期" style="width:100%;" value-format="yyyyMMdd">
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
              <el-select v-model="formData.source" placeholder="接入车辆状态" style="width:100%;">
                <el-option label="新增" value="1"></el-option>
                <el-option label="转网" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="燃料种类" prop="fuel_type">
              <select-fuel-type v-model="formData.fuel_type" style="width:100%;"></select-fuel-type>
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
            <div class="el-tag el-tag--warning" style="display:block; padding:5px 15px;margin-bottom:15px; height:auto;">
              <i class="iconfont icon-info-circle"></i> 提示：请正确填写车辆信息。为了不影响车辆审核结果,请填写正确道路运输证号!
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
              <select-brand v-model="formData.vbrandCode" :vbrandName.sync="formData.vbrandName"></select-brand>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="车辆型号" prop="model">
              <select-type v-model="formData.model" :vbrandName="formData.vbrandName"></select-type>
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
            <el-form-item label="准牵引总质量(kg)" prop="draw_ton" v-if="formData.license_color==1">
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
            <el-form-item label="高" prop="height">
              <el-input v-model="formData.height"></el-input>
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
          <el-col :span="24">
            <el-form-item label="轴数" prop="axis">
              <el-input-number v-model.number="formData.axis" :step="1" :min="2" :max="20"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="24" style="height:30px; border-bottom:1px dashed #ddd; margin-bottom:30px;"></el-col>
          <el-col :span="24">
            <div class="el-tag el-tag--warning" style="display:block; padding:5px 15px;margin-bottom:15px; height:auto;">
              <i class="iconfont icon-info-circle"></i> 提示：所有图片小于10M，jpg、jpeg格式
              <br>车身照片上传车辆左前方45角度图片
            </div>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="register_no1" class="vehicle-upload-img" label-width="0px">
              <el-upload class="avatar-uploader" accept="image/jpeg" :action="$dict.API_URL+'/vehicle/UploadImgLocal/'" :show-file-list="false" :on-success="(res,file)=>{uploadSuccess('register_no1',res,file)}" :before-upload="uploadBefore">
                <img v-if="formData.register_no1 " :src="$dict.BASE_URL+formData.register_no1 " class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <span style="color: #f56c6c;">*</span> 车辆登记证1
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="register_no2" class="vehicle-upload-img" label-width="0px">
              <el-upload class="avatar-uploader" accept="image/jpeg" :action="$dict.API_URL+'/vehicle/UploadImgLocal/'" :show-file-list="false" :on-success="(res,file)=>{uploadSuccess('register_no2',res,file)}" :before-upload="uploadBefore">
                <img v-if="formData.register_no2 " :src="$dict.BASE_URL+formData.register_no2 " class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              车辆登记证2
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="driver_no" class="vehicle-upload-img" label-width="0px">
              <el-upload class="avatar-uploader" accept="image/jpeg" :action="$dict.API_URL+'/vehicle/UploadImgLocal/'" :show-file-list="false" :on-success="(res,file)=>{uploadSuccess('driver_no',res,file)}" :before-upload="uploadBefore">
                <img v-if="formData.driver_no " :src="$dict.BASE_URL+formData.driver_no " class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <span style="color: #f56c6c;">*</span> 车辆合格证/行驶证
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="img" class="vehicle-upload-img" label-width="0px">
              <el-upload class="avatar-uploader" accept="image/jpeg" :action="$dict.API_URL+'/vehicle/UploadImgLocal/'" :show-file-list="false" :on-success="(res,file)=>{uploadSuccess('img',res,file)}" :before-upload="uploadBefore">
                <img v-if="formData.img " :src="$dict.BASE_URL+formData.img " class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <span style="color: #f56c6c;">*</span> 车身照片
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>

      <!-- 终端信息 -->
      <el-card shadow="hover">
        <div slot="header " class="clearfix">
          <span>终端信息
          </span>
        </div>
        <el-row :gutter="30">
          <el-col :span="8">
            <el-form-item label="终端ID " prop="device_no">
              <select-device v-model="formData.device_no " :state="1 " :device_id.sync="formData.device_id " :company_name.sync="viewData.company_name"></select-device>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备厂商">
              {{viewData.company_name}}
            </el-form-item>
          </el-col>

          <el-col :span="8 " style="height:50px;">

          </el-col>
          <el-col :span="8">
            <el-form-item label="SIM卡卡号 " prop="sim_id">
              <select-sim :state="1 " v-model="formData.sim_id"></select-sim>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="安装SIM卡号 " prop="sim_no">
              <el-input v-model="formData.sim_no"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>

      <!-- 其他信息 -->
      <el-card shadow="hover">
        <div slot="header " class="clearfix">
          <span>其他信息
          </span>
        </div>
        <el-row :gutter="30">
          <el-col :span="8">
            <el-form-item label="车辆出厂时间 " prop="factory_date">
              <el-input v-model="formData.factory_date"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="车身颜色 " prop="body_color">
              <el-input v-model="formData.body_color"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="经营范围 " prop="business_scope">
              <el-input v-model="formData.business_scope"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="轮胎数 " prop="tyre">
              <el-input v-model="formData.tyre"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="轮胎规格 " prop="tyre_size">
              <el-input v-model="formData.tyre_size"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="道路运输经营许可证号 " prop="transport_license">
              <el-input v-model="formData.transport_license"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="车辆购置方式 " prop="purchase">
              <el-input v-model="formData.purchase"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="车辆保险到期时间 " prop="insurance_date">
              <el-date-picker v-model="formData.insurance_date" :picker-options="pickerOptions" value-format="yyyyMMdd" align="center" type="date" placeholder="选择日期" style="width:100%;">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="检验有效期至 " prop="valid_date">
              <el-date-picker v-model="formData.valid_date" :picker-options="pickerOptions" value-format="yyyyMMdd" align="center" type="date" placeholder="选择日期" style="width:100%;">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="车辆保险种类 " prop="insurance_type">
              <el-checkbox-group v-model="checkedInsuranceTypes">
                <el-checkbox v-for="(insurance_type,index) in insurance_types " :label="index+1 " :key="index+1">{{insurance_type}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item v-if="checkedInsuranceTypes.indexOf(7)!=-1">
              <el-input></el-input>
            </el-form-item>

          </el-col>

        </el-row>
      </el-card>
      <el-form-item style="text-align:center;">
        <el-button type="primary " @click="formSubmit " size="large">立即创建</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import {
  addVehicle,
  getVehicleDetails,
  getVehicle,
  updateVehicle
} from "@/api/index.js";
import moment from "moment";
import selectCity from "@/components/select-city.vue";
import selectVehicleType from "@/components/select-vehicle-type.vue";
import selectFuelType from "@/components/select-fuel-type.vue";
import selectVtype from "@/components/select-vtype.vue";
import selectDevice from "@/components/select-device.vue";
import selectSim from "@/components/select-sim.vue";
import selectBrand from "./select-brand.vue";
import selectType from "./select-type.vue";

import { Rules } from "./rules.js";

export default {
  components: {
    selectVehicleType,
    selectCity,
    selectFuelType,
    selectVtype,
    selectBrand,
    selectType,
    selectDevice,
    selectSim
  },
  props: {
    is_enter: Number //is_enter是否录入全国平台：1是，2否
  },
  data() {
    console.log(new Rules(this));
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
      isEdit: this.$route.name == "gghypt_vehicle_edit",
      viewData: {
        //用于渲染的数据
        disabledLicense: false, //车牌号是否可用，编辑时 如果车牌号为正确格式，则不可编辑，如果为vin大架号 则可以编辑
        vehicleDetails: {}, //车辆型号数据
        company_name: ""
      },
      groupData: {
        level: "",
        path: ""
      },
      modify_img: {
        modify_img1: 1,
        modify_img2: 1,
        modify_img3: 1,
        modify_img4: 1
      },
      formData: {
        area: ["130000", "130100", "130102"],
        is_enter: this.$props.is_enter,
        //提交的数据
        register_no1: "", //车辆登记证1
        register_no2: "", //车辆登记证2
        driver_no: "", //车辆合格证/行驶证
        img: "", //车身照片
        sim_id: "", //Sim Id
        sim_no: "", //真实SIM卡号
        device_id: "", //设备Id
        device_no: "",
        license: "", //车牌号
        contract_date: "", //服务到期日期
        first_time: "", //首次定位时间
        province_id: "", //省id
        city_id: "", //市id
        county_id: "", //县id
        ip: "", //车辆接入ip
        port: "", //车辆接入端口
        issue_date: "", //行驶证签发日期
        type: "1", //接入车辆类型：1普通货运车辆，2危险品车辆，3长途客运、班线车辆，4城市公共交通车辆，5校车，6出租车，7私家车，8警务车辆，9网约车，10其他车辆
        fuel_type: "", //燃料种类：1柴油，2汽油，3电，4乙醇，5液化天然气，6压缩天然气
        license_color: "", //车牌颜色：1黄色，2蓝色，3白色，4黑色，5其它
        owner: "", //车主/业户
        linkman: "", //联系人
        tel: "", //联系电话
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
        vin: "", //车辆识别代码/vin
        vbrandCode: "", //车辆品牌id
        vbrandName: "",
        end_time: "", //离线时间
        vid: "", //全国平台车辆ID
        source: "", //接入车辆状态：1新增，2转网
        transport_license: "", //道路运输经营许可证
        transport_no: "", //道路运输证号
        vtype: "", //车辆类型

        model: "", //车辆型号
        engine_no: "", //发动机号
        engine_type: "", //发动机类型
        total_ton: "", //总质量(kg)
        load_ton: "", //核定载质量(kg)
        draw_ton: "", //准牵引总质量(kg)
        length: "", //外廓尺寸(mm)长
        width: "", //外廓尺寸(mm)宽
        height: "", //外廓尺寸(mm)高
        box_length: "", //货厢内部尺寸(mm)长
        box_width: "", //货厢内部尺寸(mm)宽
        box_height: "", //货厢内部尺寸(mm)高
        axis: "" //轴数
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
      if (this.formData.fuel_type == 3) {
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
  watch: {
    "formData.model": function() {
      getVehicleDetails({
        brand_name: this.formData.vbrandName,
        brand_mold: this.formData.model
      }).then(res => {
        if (res.data.code == 0) {
          var data = res.data.data[0];
          for (var key in data) {
            data[key] = data[key].split("/")[0]; //只取第一个值，有些多选值按/分割了
          }
          if (!data.boxHeight && !data.boxLength && !data.boxWidth) {
            data.boxHeight = "--";
            data.boxLength = "--";
            data.boxWidth = "--";
          }
          this.formData.box_height = data.boxHeight || "--";
          this.formData.box_length = data.boxLength;
          this.formData.box_width = data.boxWidth;
          this.formData.engine_type = data.engineType;
          this.formData.load_ton = data.loadTon || "--";
          this.formData.axis = data.vehicleAxis;
          this.formData.height = data.vehicleHeight;
          this.formData.length = data.vehicleLength;
          this.formData.width = data.vehicleWidth;
          this.formData.total_ton = data.vehicleTon;
          this.formData.tyre = data.vehicleTyreNumber;
          this.formData.tyre_size = data.vehicleTyreSize;
        }
      });
    },
    "formData.box_length": function(val) {
      //货厢内部尺寸(mm)长
      if (val == "--") {
        this.setBoxVal();
      }
    },
    "formData.box_width": function(val) {
      //货厢内部尺寸(mm)宽
      if (val == "--") {
        this.setBoxVal();
      }
    },
    "formData.box_height": function(val) {
      //货厢内部尺寸(mm)高
      if (val == "--") {
        this.setBoxVal();
      }
    }
  },
  created() {
    //如果是编辑

    if (this.isEdit) {
      getVehicle({ vehicle_id: this.$route.query.vehicle_id })
        .then(res => {
          if (res.data.code == 0 && res.data.data.length) {
            Object.assign(this.formData, res.data.data[0]);
          } else {
            this.$alert("没有对应数据， 或已经删除！", {
              callback: () => {
                this.$router.go(-1);
              }
            });
          }
        })
        .catch(() => {
          this.$alert("没有对应数据， 或已经删除！", {
            callback: () => {
              this.$router.go(-1);
            }
          });
        });
    }
    var data = {
      area: ["130000", "130100", "130102"],
      is_enter: this.$props.is_enter,
      //提交的数据
      register_no1: "", //车辆登记证1
      register_no2: "", //车辆登记证2
      driver_no: "", //车辆合格证/行驶证
      img: "", //车身照片
      sim_id: "1440148331815", //Sim Id
      sim_no: "15930616103", //真实SIM卡号
      device_id: "34", //设备Id
      device_no: "1358641",
      license: "冀R12345", //车牌号
      contract_date: "20180808", //服务到期日期
      first_time: "", //首次定位时间
      province_id: "", //省id
      city_id: "", //市id
      county_id: "", //县id
      ip: "", //车辆接入ip
      port: "", //车辆接入端口
      issue_date: "20180808", //行驶证签发日期
      type: "1", //接入车辆类型：1普通货运车辆，2危险品车辆，3长途客运、班线车辆，4城市公共交通车辆，5校车，6出租车，7私家车，8警务车辆，9网约车，10其他车辆
      fuel_type: "1", //燃料种类：1柴油，2汽油，3电，4乙醇，5液化天然气，6压缩天然气
      license_color: "1", //车牌颜色：1黄色，2蓝色，3白色，4黑色，5其它
      owner: "啊啊", //车主/业户
      linkman: "啊啊", //联系人
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
      vin: "12345678", //车辆识别代码/vin
      vbrandCode: "122", //车辆品牌id
      vbrandName: "解放牌",
      end_time: "", //离线时间
      vid: "", //全国平台车辆ID
      source: "1", //接入车辆状态：1新增，2转网
      transport_license: "", //道路运输经营许可证
      transport_no: "1111", //道路运输证号
      vtype: "22", //车辆类型
      model: "CA1133PK45L3R5E1", //车辆型号
      engine_no: "123", //发动机号
      engine_type: "123", //发动机类型
      total_ton: "1111", //总质量(kg)
      load_ton: "1100", //核定载质量(kg)
      draw_ton: "1111", //准牵引总质量(kg)
      length: "1111", //外廓尺寸(mm)长
      width: "1100", //外廓尺寸(mm)宽
      height: "1100", //外廓尺寸(mm)高
      box_length: "1100", //货厢内部尺寸(mm)长
      box_width: "1000", //货厢内部尺寸(mm)宽
      box_height: "888", //货厢内部尺寸(mm)高
      axis: "11" //轴数
    };
    Object.assign(this.formData, data);
  },
  methods: {
    setBoxVal() {
      //内部尺寸长宽高其中一个为-- 都设为--
      this.formData.box_height = "--";
      this.formData.box_width = "--";
      this.formData.box_length = "--";
    },
    uploadSuccess(flied, res) {
      this.formData[flied] = res.data[0].path;
      var index = ["register_no1", "register_no2", "driver_no", "img"].indexOf(
        flied
      );
      this.modify_img["modify_img" + (parseInt(index) + 1)] = 2;
    },
    uploadBefore(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 5;
      if (!isJPG) {
        this.$message.error("必须上传 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 5MB!");
      }
      return isJPG && isLt2M;
    },
    formSubmit() {
      var postMethod = this.isEdit ? updateVehicle : addVehicle; //判断调用哪个方法
      this.$refs.baseForm.validate((isVaildate, errorItem) => {
        if (isVaildate) {
          var postData = Object.assign({}, this.formData);
          postData.is_enter = 1;
          if (this.isEdit) {
            postData = Object.assign(postData, this.modify_img);
            postData.vehicle_id = this.$route.query.vehicle_id;
          }
          postMethod(postData)
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
<style lang="less">
.vehicle-form {
  padding: 20px;
  .el-card {
    margin-bottom: 20px;
  }
}
.vehicle-upload-img {
  text-align: center;
  &.is-error .el-upload {
    border-color: #f56c6c;
  }
  .el-form-item__error {
    width: 100%;
    text-align: center;
  }
}
</style>