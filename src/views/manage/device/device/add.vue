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
                        <el-form-item label="设备类型">
                            <el-select v-model="formData.device_type" placeholder="选择设备类型" style="width:100%;">
                                <el-option label="定位终端" value="1"></el-option>
                                <el-option label="视频终端" value="2"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="20">
                        <el-form-item label="设备Id">
                            <el-input v-model="formData.device_id"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="20">
                        <el-form-item label="Sim Id">
                            <el-input v-model="formData.sim_id"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="20">
                        <el-form-item label="协议类型">
                            <el-select v-model="formData.protocol_type" placeholder="选择协议类型" style="width:100%;">
                                <el-option label="808部标协议" value="1"></el-option>
                                <el-option label="1078部标协议" value="2"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="20">
                        <el-form-item label="设备厂商">
                            <el-input v-model="formData.company_name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="20">
                        <el-form-item label="设备序列号">
                            <el-input v-model="formData.device_no"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="20">
                        <el-form-item label="摄像头数量">
                            <el-input v-model="formData.camera_num"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="20">
                        <el-form-item label="存储介质">
                            <el-input v-model="formData.save_media"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="20">
                        <el-form-item label="状态">
                            <el-select v-model="formData.state" placeholder="选择状态" style="width:100%;">
                                <el-option label="正常" value="1"></el-option>
                                <el-option label="删除" value="2"></el-option>
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
    // [
    //   "设备id"",
    //   "设备类型",
    //   "设备序列号",
    //   "设备厂家id",
    //   "sim id",
    //   "协议类型",
    //   "安装日期",
    //   "摄像头数量",
    //   "存储介质"
    //   "状态"
    //   "添加时间"
    // ];
    import { rules } from "@/utils/rules.js";
    import moment from "moment";
    // import { getDeviceAdd } from "@/api/index.js";
    // 城市
    import citySelect from "@/components/city-select.vue";
    export default {
        data() {
            return {
                formData: {
                    "device_type": "",
                    "device_id": "",
                    "sim_id": "",
                    "protocol_type": "",
                    "company_name": "",
                    "device_no": "",
                    "camera_num": "",
                    "save_media": "",
                    "state": ""
                },
                // 时间
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
                }
            };
        },
        computed: {
        },
        created() { },
        methods: {},
        components: { citySelect }
    };
</script>
<style>
</style>