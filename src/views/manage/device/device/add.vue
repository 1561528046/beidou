<template>
    <div class="post-form">
        <el-form label-width="200px" status-icon :rules="rules" :model="formData" size="small" ref="baseForm">
            <!-- 设备信息 -->
            <el-card shadow="hover">
                <div slot="header" class="clearfix">
                    <span>设备信息 </span>
                </div>
                <!-- 不能为NULL -->
                <el-form-item label="设备类型" prop="device_type">
                    <el-select v-model="formData.device_type" placeholder="选择设备类型" style="width:100%;">
                        <el-option label="定位终端" value="1"></el-option>
                        <el-option label="视频终端" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="存储介质" prop="save_media">
                    <el-select v-model="formData.save_media" placeholder="选择" style="width:100%;">
                        <el-option label="硬盘" value="1"></el-option>
                        <el-option label="SD卡" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="协议类型" prop="protocol_type">
                    <el-select v-model="formData.protocol_type" placeholder="选择协议类型" style="width:100%;">
                        <el-option label="808部标协议" value="1"></el-option>
                        <el-option label="1078部标协议" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态" prop="state">
                    <el-select v-model="formData.state" placeholder="选择协议类型" style="width:100%;">
                        <el-option label="正常" value="1"></el-option>
                        <el-option label="删除" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="设备序列号" prop="device_no">
                    <el-input v-model="formData.device_no"></el-input>
                </el-form-item>
                <el-form-item label="Sim Id" prop="sim_id">
                    <el-input v-model="formData.sim_id" maxlength="14"></el-input>
                </el-form-item>
                <el-form-item label="安装日期" prop="install_date">
                    <el-input v-model="formData.install_date"></el-input>
                </el-form-item>
                <el-form-item label="摄像头数量" prop="camera_num">
                    <el-input v-model="formData.camera_num"></el-input>
                </el-form-item>
                <el-form-item label="添加时间" prop="time">
                    <el-input v-model="formData.time"></el-input>
                </el-form-item>
                <el-form-item label="设备厂家Id" prop="company_id">
                    <el-input v-model="formData.company_id"></el-input>
                </el-form-item>
                <el-form-item label="设备厂商" prop="company_name">
                    <el-input v-model="formData.company_name"></el-input>
                </el-form-item>
            </el-card>

            <el-form-item style="text-align:center;">
                <el-button type="primary" @click="formSubmit" size="large">提交</el-button>
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
    // 城市
    import citySelect from "@/components/city-select.vue";
    // import { getDeviceAdd } from "@/api/index.js";
    export default {
        data() {
            return {
                formData: {
                    area: [],
                    "device_type": "",
                    "device_no": "",
                    "company_id": "",
                    "sim_id": "",
                    "protocol_type": "",
                    "install_date": "",
                    "camera_num": "",
                    "save_media": "",
                    "state": "",
                    "time": "",
                    "company_name": "",
                },
                rules: {
                    ...rules,
                    protocol_type: [
                        {
                            required: true,
                            message: "请选择协议类型",
                            trigger: "change"
                        }
                    ],
                    device_no: [
                        {
                            required: true,
                            message: "请输入设备序列号",
                            trigger: "change"
                        },
                        {}
                    ]
                }
            };
        },
        computed: {},
        created() { },
        methods: {
            formSubmit() {
                this.$refs.baseForm.validate((isVaildate, errorItem) => {
                    if (isVaildate) {
                        console.log(this.$data)
                    } else {
                        var errormsg = "";
                        for (var key in errorItem) {
                            errormsg += errorItem[key][0].message + "<br>";
                        }
                        this.$notify.error({
                            title: '错误',
                            dangerouslyUseHTMLString: true,
                            message: errormsg
                        });
                    }
                })
            }
        },
        components: { citySelect }
    };
</script>
<style>
</style>