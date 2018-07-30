<template>
    <div class="post-form">
        <el-form label-width="200px" status-icon :rules="rules" :model="formData" size="small" ref="baseForm">
            <!-- 设备信息 -->
            <el-card shadow="hover">
                <div slot="header" class="clearfix">
                    <span>SIM卡信息 </span>
                </div>
                <el-form-item prop="sim_no" label="SIM卡号">
                    <el-input v-model="formData.sim_no"></el-input>
                </el-form-item>
                <el-form-item prop="icc_id" label="ICCID">
                    <el-input v-model="formData.icc_id"></el-input>
                </el-form-item>
                <el-form-item prop="belong" label="所属运营商">
                    <el-input v-model="formData.belong"></el-input>
                </el-form-item>
                <el-form-item prop="user_id" label="分配客户">
                    <user-select v-model="formData.user_id"></user-select>
                    <!-- <el-input v-model="formData.user_id"></el-input> -->
                </el-form-item>
                <el-form-item prop="note" label="备注">
                    <el-input v-model="formData.note"></el-input>
                </el-form-item>
            </el-card>

            <el-form-item style="text-align:center;">
                <el-button type="primary" @click="formSubmit" size="large">提交</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
    import { rules } from "@/utils/rules.js";
    import { updateSim, getSim } from "@/api/index.js";
    import userSelect from "@/components/select-user.vue";
    export default {
        data() {
            return {
                formData: {
                    sim_no: this.$route.params.sim_no,
                    icc_id: "",
                    belong: "",
                    user_id: "",
                    note: "",
                },
                rules: {
                    ...rules,
                    sim_no: [{ required: true, message: "请输入SIM卡号", trigger: "change" }].concat(rules.sim_no)

                }
            };
        },
        computed: {},
        created() {
            getSim({ id: this.formData.sim_no }).then((res) => {
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
                        postData.id = postData.sim_no
                        updateSim(postData)
                            .then(res => {
                                if (res.data.code == 0) {
                                    this.$message.success(res.data.msg);
                                    this.$router.push({ "name": "sim" })
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
        components: { userSelect }
    };
</script>
<style>
</style>