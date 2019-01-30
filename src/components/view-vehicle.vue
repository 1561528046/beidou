<template>
  <div class="vehicle-form-view" v-loading="loader">
    <el-alert
      title="自动已同步完成（如果处于列队中，给操作按钮，是否同步）"
      type="success"
      show-icon
      v-if="syncMessageVisible"
    ></el-alert>
    <el-form label-width="200px" :model="formData" size="small" ref="baseForm">
      <!-- 服务商信息 -->
      <el-card shadow="hover">
        <div slot="header" class="clearfix">
          <span>服务商信息</span>
        </div>
        <el-row :gutter="30">
          <el-col :span="8">
            <el-form-item
              label="服务到期日期"
              prop="contract_date"
            >{{$utils.formatDate(formData.contract_date)}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="服务商名称">（服务端设置）</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="服务接入地址">（服务端设置）</el-form-item>
          </el-col>
        </el-row>
      </el-card>

      <!-- 车辆落户信息 -->
      <el-card shadow="hover">
        <div slot="header" class="clearfix">
          <span>车辆落户信息</span>
        </div>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="道路运输证号" prop="transport_no">{{formData.transport_no||"--"}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="行驶证发证日期"
              prop="issue_date"
            >{{$utils.formatDate(formData.issue_date)||"--"}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所属地区" prop="area">
              {{formData.province_name}} - {{formData.city_name}} - {{formData.county_name}}
              <!-- <select-city v-model="formData.area" :province_id.sync="formData.province_id" :city_id.sync="formData.city_id" :county_id.sync="formData.county_id" style="width:100%;"></select-city> -->
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="车牌号" style="margin-bottom:0;">
              <el-row>
                <el-col :span="11">
                  <el-form-item prop="license">{{formData.license||"--"}}</el-form-item>
                </el-col>
                <el-col :span="12" :offset="1">
                  <el-form-item prop="license_color">车牌颜色:
                    <template v-if="formData.license_color">
                      <span
                        style="display:inline-block;width: 15px; height: 15px;vertical-align: -3px;"
                        :style="$dict.get_license_color(formData.license_color).style"
                      ></span>
                      {{formData.license_color&&$dict.license_color[formData.license_color]?$dict.license_color[formData.license_color].name:"--"}}
                    </template>

                    <!-- <el-select v-model="formData.license_color" placeholder="请选择车牌颜色">
                      <div slot="prefix">
                        <span style="display:inline-block;width: 15px; height: 15px;vertical-align: -3px;" :style="$dict.get_license_color(formData.license_color).style">
                        </span>
                      </div>
                      <el-option :label="plateColor.name" :value="value" v-for="(plateColor,value) in license_colors" :key="plateColor.name">
                        <span style="display:inline-block;width: 15px; height: 15px;vertical-align: -3px;" :style="plateColor.style"> </span>
                        {{plateColor.name}}
                      </el-option>
                    </el-select>-->
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="$props.is_enter!=1">
            <el-form-item label="行业类别" prop="type">
              {{$dict.get_industry(formData.type)}}->{{$dict.get_industry_son(formData.type_son)}}
              <!-- <select-vehicle-type v-model="formData.type" style="width:100%;" clearable></select-vehicle-type> -->
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="燃料种类"
              prop="fuel_type"
            >{{$dict.get_fuel_type(formData.fuel_type)||"--"}}</el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="业户/车主" prop="owner">{{formData.owner||"--"}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系人" prop="linkman">{{formData.linkman||"--"}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系人手机" prop="tel">{{formData.tel||"--"}}</el-form-item>
          </el-col>
        </el-row>
      </el-card>

      <el-card shadow="hover" v-if="formData.type==1">
        <div slot="header" class="clearfix">
          <span>普通货运车辆</span>
        </div>
        <el-row :gutter="30">
          <el-col :span="8">
            <el-form-item label="车辆识别代码/车架号" prop="vin">{{formData.vin||""}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="车辆品牌" prop="vbrandCode">{{formData.vbrandName||"--"}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="车辆型号" prop="model">{{formData.model||"--"}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="车辆类型" prop="vtype">
              {{$dict.get_vtype(formData.vtype)||"--"}}
              <!-- <select-vtype v-model="formData.vtype" style="width:100%" clearable></select-vtype> -->
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="发动机号" prop="engine_no">{{formData.engine_no||"--"}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="发动机型号" prop="engine_type">{{formData.engine_type||"--"}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="总质量(kg)" prop="total_ton">{{formData.total_ton||"--"}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="核定载质量(kg)" prop="load_ton">{{formData.load_ton||"-"}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="准牵引总质量(kg)"
              prop="draw_ton"
              v-if="formData.license_color==1"
            >{{formData.draw_ton||"--"}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="外廓尺寸(mm)长" prop="length">{{formData.length||"--"}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="宽" prop="width">{{formData.width||"--"}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="高" prop="height">{{formData.height||"--"}}</el-form-item>
          </el-col>
          <template v-if="$props.type!=2">
            <el-col :span="8">
              <el-form-item label="货厢内部尺寸(mm)长" prop="box_length">{{formData.box_length||"--"}}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="宽" prop="box_width">{{formData.box_width||"--"}}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="高" prop="box_height">{{formData.box_height||"--"}}</el-form-item>
            </el-col>
          </template>
          <el-col :span="24">
            <el-form-item label="轴数" prop="axis">{{formData.axis||"--"}}</el-form-item>
          </el-col>
          <el-col
            :span="24"
            style="height:30px; border-bottom:1px dashed #ddd; margin-bottom:30px;"
          ></el-col>
          <el-col :span="6">
            <el-form-item prop="register_no1" class="vehicle-upload-img" label-width="0px">
              <div>车辆登记证1</div>
              <img
                v-if="formData.register_no1 "
                :src="$dict.BASE_URL+formData.register_no1 "
                class="avatar"
              >
              <img v-if="!formData.register_no1 " src="/static/noimg.jpg" class="avatar">
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="register_no2" class="vehicle-upload-img" label-width="0px">
              <div>车辆登记证2</div>
              <img
                v-if="formData.register_no2 "
                :src="$dict.BASE_URL+formData.register_no2 "
                class="avatar"
              >
              <img v-if="!formData.register_no2 " src="/static/noimg.jpg" class="avatar">
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="driver_no" class="vehicle-upload-img" label-width="0px">
              <div>车辆合格证/行驶证</div>
              <img
                v-if="formData.driver_no "
                :src="$dict.BASE_URL+formData.driver_no "
                class="avatar"
              >
              <img v-if="!formData.driver_no " src="/static/noimg.jpg" class="avatar">
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="img" class="vehicle-upload-img" label-width="0px">
              <div>车身照片</div>
              <img v-if="formData.img " :src="$dict.BASE_URL+formData.img" class="avatar">
              <img v-if="!formData.img " src="/static/noimg.jpg" class="avatar">
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>

      <!-- 终端信息 -->
      <el-card shadow="hover">
        <div slot="header " class="clearfix">
          <span>终端信息</span>
        </div>
        <el-row :gutter="30">
          <el-col :span="8">
            <el-form-item label="设备厂商">{{formData.company_name||"--"}}</el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="终端ID " prop="device_no">{{formData.device_no||"--"}}</el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="SIM ID " prop="sim_id">{{formData.sim_id||"--"}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="安装SIM卡号 " prop="sim_no">{{formData.sim_no||"--"}}</el-form-item>
          </el-col>
        </el-row>
      </el-card>

      <!-- 其他信息 -->
      <el-card shadow="hover">
        <div slot="header " class="clearfix">
          <span>其他信息</span>
        </div>
        <el-row :gutter="30">
          <el-col :span="8">
            <el-form-item
              label="车辆出厂时间 "
              prop="factory_date"
            >{{$utils.formatDate(formData.factory_date)}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="车身颜色 " prop="body_color">{{formData.body_color||"--"}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="经营范围 " prop="business_scope">{{formData.business_scope||"--"}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="轮胎数 " prop="tyre">{{formData.tyre||"--"}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="轮胎规格 " prop="tyre_size">{{formData.tyre_size||"--"}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="道路运输经营许可证号 "
              prop="transport_license"
            >{{formData.transport_license||"--"}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="车辆购置方式 " prop="purchase">{{formData.purchase||"--"}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="车辆保险到期时间 "
              prop="insurance_date"
            >{{$utils.formatDate(formData.insurance_date)}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="检验有效期至 "
              prop="valid_date"
            >{{$utils.formatDate(formData.valid_date)}}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="车辆保险种类 " prop="insurance_type">
              <span v-if="!formData.insurance_type.length">--</span>
              <span
                v-for="(insurance_type,index) in insurance_types"
                :key="index"
                v-if="formData.insurance_type.indexOf(index+1) !=-1"
              >{{insurance_type}}</span>
              <span
                v-if="formData.insurance_type.split(',').indexOf('7')!=-1"
              >{{formData.insurance_type_other}}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
    </el-form>
  </div>
</template>
<script>
import { getVehicle, syncVehicle } from "@/api/index.js";
export default {
  props: {
    vehicle_id: String,
    type: Number, //type 接入车辆类型：1普通货运车辆，2危险品车辆，3长途客运、班线车辆，4城市公共交通车辆，5校车，6出租车，7私家车，8警务车辆，9网约车，10其他车辆
    is_enter: Number //is_enter是否录入全国平台：1是，2否
  },
  data() {
    return {
      loader: false,
      syncMessageVisible: false,
      syncMessage: "",
      insurance_types: [
        "交强险",
        "盗抢险",
        "三者",
        "车损险",
        "车上人员险",
        "货物运输险",
        "其它"
      ],
      formData: {
        //除普货外，车辆具体型号大块中 只有车架号VIN是必填
        //只有普货用和全国平台有关联的内容，包括验证规则，车辆具体型号内容等
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
        company_name: "",
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
      }
    };
  },
  created() {
    this.loader = true;
    if (this.$props.is_enter == 1) {
      syncVehicle({
        vehicle_id: this.$props.vehicle_id
      })
        .then(() => {
          this.syncMessageVisible = true;
          this.getVehicle();
        })
        .catch(() => {
          this.syncMessageVisible = true;
          this.getVehicle();
        });
    } else {
      this.getVehicle();
    }
  },
  methods: {
    getVehicle() {
      getVehicle({ vehicle_id: this.$props.vehicle_id })
        .then(res => {
          this.loader = false;
          if (res.data.code == 0 && res.data.data.length) {
            Object.assign(this.formData, res.data.data[0]);
            this.$nextTick(() => {
              this.isInit = true;
            });
          } else {
            this.$alert("没有对应数据， 或已经删除！", {
              callback: () => {
                this.$emit("error");
              }
            });
          }
        })
        .catch(() => {
          this.loader = false;
          this.$alert("没有对应数据， 或已经删除！", {
            callback: () => {
              this.$emit("error");
            }
          });
        });
    }
  }
};
</script>
<style lang="less">
.vehicle-form-view {
  .el-card {
    .el-card__header {
      background: #fdfdff;
    }
  }
  margin: -25px -25px -30px;
  .vehicle-upload-img {
    text-align: center;
    img {
      display: inline-block;
    }
  }
}
</style>