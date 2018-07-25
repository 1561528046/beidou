<template>
    <div class="vehicle-form">
        <el-form label-width="200px" status-icon :rules="rules" :model="formData" size="small">
            <!-- 设备信息 -->
            <el-card shadow="hover">
                <div slot="header" class="clearfix">
                    <span>设备信息 </span>
                </div>
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="设备类型">
                            <el-input></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="设备Id">
                            <el-input></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="Sim Id">
                            <el-input></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="协议类型">
                            <el-input></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="设备厂家">
                            <el-input></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="设备序列号">
                            <el-input></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="摄像头数量" style="margin-bottom:0;">
                            <el-input></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="存储介质">
                            <el-input></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-card>

            <el-form-item style="text-align:center;">
                <el-button type="primary" size="large">添加</el-button>
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
                            validator: function (rule, value, callback) {
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
            plate_colors: function () {
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
        created() { },
        methods: {},
        components: { citySelect }
    };
</script>
<style>
</style>