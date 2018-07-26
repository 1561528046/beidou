<template>
    <div class="vehicle-form">
        <el-form label-width="200px" status-icon :rules="rules" :model="formData" size="small">
            <!-- 设备信息 -->
            <el-card shadow="hover">
                <div slot="header" class="clearfix">
                    <span>设备信息 </span>
                </div>
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
                    <el-date-picker v-model="formData.install_date" :picker-options="pickerOptions" align="center" type="date" placeholder="选择日期"
                        style="width:100%;">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="摄像头数量" prop="camera_num">
                    <el-input v-model="formData.camera_num"></el-input>
                </el-form-item>
                <el-form-item label="添加时间" prop="time">
                    <el-date-picker v-model="formData.time" :picker-options="pickerOptions" align="center" type="date" placeholder="选择日期" style="width:100%;">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="设备厂家Id" prop="company_id">
                    <el-input v-model="formData.company_id"></el-input>
                </el-form-item>
                <el-form-item label="设备厂商" prop="company_name">
                    <el-input v-model="formData.company_name"></el-input>
                </el-form-item>
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