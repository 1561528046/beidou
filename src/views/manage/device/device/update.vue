<template>
    <div class="vehicle-form">
        <el-form label-width="200px" status-icon :rules="rules" :model="formData" size="small">
            <!-- 设备信息 -->
            <el-card shadow="hover">
                <div slot="header" class="clearfix">
                    <span>设备信息 </span>
                </div>
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="设备Id">
                            <el-input></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="设备类型">
                            <el-input></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="设备序列号">
                            <el-input></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="设备厂家Id">
                            <el-input></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="Sim Id">
                            <el-input></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="协议类型">
                            <el-input></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="安装日期">
                            <el-input></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="摄像头数量" style="margin-bottom:0;">
                            <el-input></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="存储介质">
                            <el-input></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="状态">
                            <el-input></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="添加时间">
                            <el-input></el-input>
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
</script>
<style>
    .el-select {
        width: 100%;
    }
</style>