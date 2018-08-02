<template>
    <div class="post-form" style="width: 500px;">
        <el-form label-position="top" status-icon :rules="rules" :model="formData" size="small" ref="baseForm">
            <el-row :gutter="30">
                <el-col :span="12">
                    <el-form-item prop="sim_no" label="SIM卡号">
                        <el-input v-model="formData.sim_no"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item prop="icc_id" label="ICCID">
                        <el-input v-model="formData.icc_id"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item prop="belong" label="所属运营商">
                        <el-select v-model="belong" style="width: 100%;">
                            <el-option v-for="belongItem in belongSelect" :key="belongItem" :label="belongItem" :value="belongItem"></el-option>
                        </el-select>
                        <el-col style="margin-right:-20px;">
                            <el-input v-model="formData.belong" v-if="belong == '其他'" placeholder="填写运营商"></el-input>
                        </el-col>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item prop="note" label="备注">
                        <el-input v-model="formData.note"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>


            <el-form-item style="text-align:center;">
                <el-button type="primary" @click="formSubmit" size="large">提交</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
    import { rules } from "@/utils/rules.js";
    import { addSim } from "@/api/index.js";
    // import userSelect from "@/components/select-user.vue";
    export default {
        data() {
            return {
                belongSelect: [
                    "中国移动",
                    "中国联通",
                    "中国电信",
                    "其他",
                ],
                belong: "",
                formData: {
                    sim_no: "",
                    icc_id: "",
                    belong: "",
                    user_id: "",
                    note: "",
                },
                rules: {
                    ...rules,
                    sim_no: [
                        { required: true, message: "请输入SIM卡号", trigger: "change" },
                        {
                            min: 11,
                            max: 14,
                            message: "长度在 11 到 14 个字符",
                            trigger: "change"
                        }]
                }
            };
        },
        watch: {
            belong: function () {
                if (this.belong == "其他") {
                    this.formData.belong = "";
                } else {
                    this.formData.belong = this.belong;
                }
            }
        },
        created() { },
        methods: {
            formSubmit() {
                this.$refs.baseForm.validate((isVaildate, errorItem) => {
                    if (isVaildate) {
                        var postData = Object.assign({}, this.formData);
                        addSim(postData)
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
        // components: { userSelect }
    };
</script>
<style>
</style>