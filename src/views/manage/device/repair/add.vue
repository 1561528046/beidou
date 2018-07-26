<template>
    <div class="vehicle-form">
        <el-form label-width="200px" status-icon :rules="rules" :model="formData" size="small">
            <!-- 设备信息 -->
            <el-card shadow="hover">
                <div slot="header" class="clearfix">
                    <span>设备信息 </span>
                </div>
                <el-row :gutter="20">
                    <el-col :span="20">
                        <el-form-item label="维修原因">
                            <el-input></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="20">
                        <el-form-item label="返厂时间">
                            <el-date-picker v-model="formData.drivecard_release_date" :picker-options="pickerOptions" align="center" type="date" placeholder="选择日期"
                                style="width:100%;">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="20">
                        <el-form-item label="物流信息">
                            <el-input v-model="formData.logistics"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="20">
                        <el-form-item label="维修状态">
                            <el-select v-model="formData.state" placeholder="选择维修状态" style="width:100%;">
                                <el-option label="修复" value="1"></el-option>
                                <el-option label="已修复" value="2"></el-option>
                                <el-option label="报废" value="1"></el-option>
                                <el-option label="更换" value="2"></el-option>
                            </el-select>
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
    import { rules } from "@/utils/rules.js";
    import moment from "moment";
    import citySelect from "@/components/city-select.vue";
    export default {
        data() {
            return {
                formData: {
                    "back_time": "",
                    "reason": "",
                    "logistics": "",
                    "state": ""
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