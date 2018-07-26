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
                <el-form-item label="协议类型" prop="protocol_type">
                    <span v-if="!formData.device_type">--</span>
                    <span v-if="formData.device_type==1">808部标协议</span>
                    <span v-if="formData.device_type==2">1078部标协议</span>
                </el-form-item>
                <el-form-item label="存储介质" prop="save_media" v-if="formData.device_type==2">
                    <el-select v-model="formData.save_media" placeholder="选择" style="width:100%;">
                        <el-option label="硬盘" value="1"></el-option>
                        <el-option label="SD卡" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="摄像头数量" prop="camera_num" v-if="formData.device_type==2">
                    <el-radio v-model="formData.camera_num" label="4">&nbsp; 4路</el-radio>
                    <el-radio v-model="formData.camera_num" label="6">&nbsp; 6路</el-radio>
                    <el-radio v-model="formData.camera_num" label="8">&nbsp; 8路</el-radio>
                    <br>
                    <el-radio v-model="formData.camera_num" label="10">10路</el-radio>
                    <el-radio v-model="formData.camera_num" label="12">12路</el-radio>
                    <el-radio v-model="formData.camera_num" label="14">14路</el-radio>
                </el-form-item>
                <el-form-item label="设备序列号" prop="device_no">
                    <el-input v-model="formData.device_no"></el-input>
                </el-form-item>
                <el-form-item label="Sim Id" prop="sim_id">
                    <el-input v-model="formData.sim_id"></el-input>
                </el-form-item>
                <el-form-item label="设备厂商" prop="company_name">
                    <company-select v-model="formData.company_id"></company-select>
                    <!-- <el-input v-model="formData.company_name"></el-input> -->
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
    import { rules } from "@/utils/rules.js";
    import companySelect from "@/components/select-company.vue";
    import { updateDevice, getDevice } from "@/api/index.js";
    export default {
        data() {
            return {
                formData: {
                    device_id: this.$route.params.device_id,
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
                    // protocol_type: [
                    //     {
                    //         required: true,
                    //         message: "请选择协议类型",
                    //         trigger: "change"
                    //     }
                    // ],
                    device_no: [
                        {
                            required: true,
                            message: "请输入设备序列号",
                            trigger: "change"
                        },
                    ],
                    camera_num: [{ required: true, message: "请选择摄像头数量", trigger: "change" }]
                }
            };
        },
        watch: {
            "formData.device_type": function () {
                this.formData.protocol_type = this.formData.device_type
            }
        },
        created() {
            getDevice({ id: this.formData.device_id }).then((res) => {
                if (res.data.code == 0 && res.data.data.length) {
                    var mixinData = Object.assign({}, this.formData, res.data.data[0]);
                    this.$set(this.$data, "formData", mixinData);
                }
            })
        },
        methods: {
            formSubmit() {
                this.$refs.baseForm.validate((isVaildate, errorItem) => {
                    if (isVaildate) {
                        var postData = Object.assign({}, this.formData);
                        updateDevice(postData)
                            .then(res => {
                                if (res.data.code == 0) {
                                    this.$message.success(res.data.msg);
                                    this.$router.push({ "name": "device-device" })
                                } else {
                                    this.$message.error(res.data.msg);
                                }
                            })
                            .catch(() => { });
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
        components: { companySelect }
    };
</script>
<style>
</style>