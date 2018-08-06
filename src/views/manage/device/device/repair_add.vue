<template>
    <el-form status-icon :rules="rules" :model="formData" size="small" ref="baseForm" class="msg-form">
        <!-- 设备信息 -->
        <el-row :gutter="30">
            <el-col :span="12">
                <el-form-item prop="device_id" label="选择设备">
                    <!-- <select-device v-model="formData.device_id"></select-device> -->
                    <el-autocomplete style="width: 100%;" class="inline-input" v-model="formData.device_id" :fetch-suggestions="querySearch"
                        placeholder="请输入内容" :trigger-on-focus="false" @select="handleSelect">
                    </el-autocomplete>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item prop="reason" label="维修原因">
                    <el-input v-model="formData.reason"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="返厂时间">
                    <el-date-picker type="datetime" v-model="formData.back_time" align="center" placeholder="选择日期" style="width:100%;" format="yyyy-MM-dd"
                        value-format="yyyyMMdd">
                    </el-date-picker>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="物流信息">
                    <el-input v-model="formData.logistics"></el-input>
                </el-form-item>
            </el-col>
            <!-- <el-col :span="12">
                <el-form-item label="维修状态">
                    <el-input value="维修" :disabled="true"></el-input>
                </el-form-item>
            </el-col> -->
        </el-row>
        <el-form-item style="text-align:center;">
            <el-button type="primary" size="large" @click="formSubmit">提交</el-button>
        </el-form-item>
    </el-form>
</template>
<script>
    import { rules } from "@/utils/rules.js";
    import { addDeviceRepair, getDeviceAll } from "@/api/index.js";
    import selectDevice from "@/components/select-device.vue";
    export default {
        data() {
            return {
                formData: {
                    "back_time": "",
                    "reason": "",
                    "logistics": "",
                    "device_id": "",
                    "state": "1"
                },
                simss: [],
                simee: {},
                restaurants: [],
                state1: '',
                state2: '',
                rules: {
                    ...rules,
                }
            };
        },
        computed: {
        },
        created() { },
        mounted() {
            this.restaurants = this.loadAll();
        },
        methods: {
            querySearch(queryString, cb) {
                var restaurants = this.restaurants;
                var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
                // 调用 callback 返回建议列表的数据
                cb(results);
            },
            createFilter(queryString) {
                return (restaurant) => {
                    return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
                };
            },
            loadAll() {
                getDeviceAll().then(res => {
                    if (res.data.code == 0) {
                        for (var i = 0; i < res.data.data.length; i++) {
                            if (res.data.data[i].real_name !== "") {
                                this.simss.push({ value: res.data.data[i].device_id })
                            }
                        }
                    }
                })
                return this.simss
            },
            handleSelect(item) {
                this.simee = { value: item.value }
            },
            formSubmit() {
                this.$refs.baseForm.validate((isVaildate, errorItem) => {
                    if (isVaildate) {
                        if (this.formData.device_id != "") {
                            this.formData.device_id = this.formData.device_id
                        }
                        var postData = Object.assign({}, this.formData);
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