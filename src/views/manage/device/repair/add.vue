<template>
    <div class="post-form">
        <el-form label-width="200px" status-icon :rules="rules" :model="formData" size="small" ref="baseForm">
            <!-- 设备信息 -->
            <el-card shadow="hover">
                <div slot="header" class="clearfix">
                    <span>设备信息 </span>
                </div>
                <el-form-item prop="device_id" label="选择设备">
                    <select-device v-model="formData.device_id"></select-device>
                </el-form-item>
                <el-form-item prop="reason" label="维修原因">
                    <el-input v-model="formData.reason"></el-input>
                </el-form-item>
                <el-form-item label="返厂时间">
                    <el-date-picker type="datetime" v-model="formData.back_time" align="center" placeholder="选择日期" style="width:100%;" value-format="yyyyMMddHHmmss">
                    </el-date-picker>
                </el-form-item>

                <el-form-item label="物流信息">
                    <el-input v-model="formData.logistics"></el-input>
                </el-form-item>
                <el-form-item label="维修状态">
                    <el-select v-model="formData.state" placeholder="选择维修状态" style="width:100%;">
                        <el-option label="修复" value="1"></el-option>
                        <el-option label="已修复" value="2"></el-option>
                        <el-option label="报废" value="3"></el-option>
                        <el-option label="更换" value="4"></el-option>
                    </el-select>
                </el-form-item>
            </el-card>

            <el-form-item style="text-align:center;">
                <el-button type="primary" size="large" @click="formSubmit">提交</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
    import { rules } from "@/utils/rules.js";
    import { addDeviceRepair } from "@/api/index.js";
    import selectDevice from "@/components/select-device.vue";
    export default {
        data() {
            return {
                formData: {
                    "back_time": "",
                    "reason": "",
                    "logistics": "",
                    "state": ""
                },
                rules: {
                    ...rules,
                }
            };
        },
        computed: {
        },
        created() { },
        methods: {
            formSubmit() {
                this.$refs.baseForm.validate((isVaildate, errorItem) => {
                    if (isVaildate) {
                        var postData = Object.assign({}, this.formData);
                        addDeviceRepair(postData)
                            .then(res => {
                                if (res.data.code == 0) {
                                    this.$message.success(res.data.msg);
                                    this.$router.push({ "name": "device-repair" })
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
        components: { selectDevice }
    };
</script>
<style>
</style>