<template>
    <el-form status-icon :rules="rules" :model="formData" size="small" ref="baseForm" class="msg-form">
        <!-- 设备信息 -->
        <el-row :gutter="30">
            <el-col :span="12">
                <el-form-item prop="device_id" label="选择设备">
                    <select-device v-model="formData.device_id"></select-device>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item prop="reason" label="维修原因">
                    <el-input v-model="formData.reason"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="返厂时间">
                    <el-date-picker type="datetime" v-model="formData.back_time" align="center" placeholder="选择日期" style="width:100%;" value-format="yyyyMMddHHmmss">
                    </el-date-picker>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="物流信息">
                    <el-input v-model="formData.logistics"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="维修状态">
                    <el-input value="维修" :disabled="true"></el-input>
                </el-form-item>
            </el-col>
        </el-row>
        <el-form-item style="text-align:center;">
            <el-button type="primary" size="large" @click="formSubmit">提交</el-button>
        </el-form-item>
    </el-form>
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
                    "state": "1"
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
                        console.log(postData)
                        addDeviceRepair(postData)
                            .then(res => {
                                if (res.data.code == 0) {
                                    this.$emit("success");
                                    this.$message.success(res.data.msg);
                                } else {
                                    this.$emit("error");
                                    this.$message.error(res.data.msg);
                                }
                            })
                            .catch(() => {
                                this.$message.error("接口错误");
                                this.$emit("error");
                            });
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