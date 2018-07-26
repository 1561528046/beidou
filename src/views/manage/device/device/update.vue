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
                <el-button type="primary" @click="onSubmit" size="large">修改</el-button>
            </el-form-item>

            <!-- <button @click="$router.go(-1)">a</button> -->
        </el-form>
    </div>
</template>
<script>
    import { rules } from "@/utils/rules.js";
    // import citySelect from "@/components/city-select.vue";
    // import { addUser, getUser } from "@/api/index.js";
    export default {
        data() {
            return {
                formData: {
                    user_id: this.$route.params.user_id,
                    area: [],
                    "device_type": "",
                    "sim_id": "",
                    "protocol_type": "",
                    "company_name": "",
                    "device_no": "",
                    "camera_num": "",
                    "save_media": "",
                    "state": ""
                },
                rules: {
                    ...rules,
                }
            };
        },
    } 
</script>
<style>
    .el-select {
        width: 100%;
    }
</style>