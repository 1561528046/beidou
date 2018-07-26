<template>
    <div class="vehicle-form">
        <el-form label-width="200px" status-icon :rules="rules" :model="formData" size="small" ref="baseForm">
            <!-- 设备信息 -->
            <el-card shadow="hover">
                <div slot="header" class="clearfix">
                    <span>终端信息 </span>
                </div>
                <el-form-item label="设备厂商id" prop="company_id">
                    <el-input v-model="formData.company_id"></el-input>
                </el-form-item>
                <el-form-item label="设备厂商名称" prop="company_name">
                    <el-input v-model="formData.company_name"></el-input>
                </el-form-item>
                <el-form-item label="设备厂商类型" prop="company_type">
                    <el-select v-model="formData.company_type" placeholder="选择设备厂商类型" style="width:100%;">
                        <el-option label="前装厂商" value="1"></el-option>
                        <el-option label="后装厂商" value="2"></el-option>
                    </el-select>
                </el-form-item>
            </el-card>

            <el-form-item style="text-align:center;">
                <el-button type="primary" @click="formSubmit" size="large">修改</el-button>
            </el-form-item>

            <!-- <button @click="$router.go(-1)">a</button> -->
        </el-form>
    </div>
</template>
<script>
    import { rules } from "@/utils/rules.js";
    import citySelect from "@/components/city-select.vue";
    import { updateCompany, getDeviceCompany } from "@/api/index.js";
    export default {
        data() {
            return {
                device_total_turn: true,
                formData: {
                    company_id: this.$route.params.company_id,//设备厂商id
                    area: [],
                    "company_name": "",//设备厂商名称
                    "company_type": ""//设备厂商类型：1前装厂商，2后装厂商
                },
                rules: {
                    ...rules,
                    company_name: [
                        {
                            required: true,
                            message: "请输入厂商名称",
                            trigger: "change"
                        }
                    ],
                    company_type: [
                        {
                            required: true,
                            message: "请选择厂商类型",
                            trigger: "change"
                        }
                    ],
                }
            };
        },
        watch: {
            "device_total_turn": function () {
                this.formData.device_total = "";
            }
        },
        computed: {
        },
        created() {
            getDeviceCompany({ company_id: this.formData.company_id }).then((res) => {
                console.log(res)
                if (res.data.code == 0 && res.data.data.length) {
                    var mixinData = Object.assign({}, this.formData, res.data.data[0]);
                    this.$set(this.$data, "formData", mixinData);
                }
            })

        },
        methods: {

            formSubmit() {
                console.log(this.$data)
                this.$refs.baseForm.validate((isVaildate, errorItem) => {
                    if (isVaildate) {
                        var areaObj = this.$utils.formatArea(this.formData.area);
                        var postData = Object.assign({}, this.formData, areaObj);
                        updateCompany(postData)
                            .then(res => {
                                if (res.data.code == 0) {
                                    this.$message.success(res.data.msg);
                                    if (this.$props.user_type == 1) {
                                        this.$router.push({ "name": "user_person" })
                                    } else {
                                        this.$router.push({ "name": "user_company" })
                                    }
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
        components: { citySelect }
    };
</script>
<style>
</style>