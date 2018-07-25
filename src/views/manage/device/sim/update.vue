<template>
    <div class="vehicle-form">
        <el-form label-width="200px" status-icon :rules="rules" :model="formData" size="small">
            <!-- 设备信息 -->
            <el-card shadow="hover">
                <div slot="header" class="clearfix">
                    <span>SIM卡信息 </span>
                </div>
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="添加时间">
                            <el-input></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="SIM卡号">
                            <el-input></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="ICCID">
                            <el-input></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="所属运营商">
                            <el-input></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="当前状态">
                            <el-input></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="分配客户">
                            <el-input></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="备注">
                            <el-input></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-card>

            <el-form-item style="text-align:center;">
                <el-button type="primary" size="large">修改</el-button>
            </el-form-item>

            <!-- <button @click="$router.go(-1)">a</button> -->
        </el-form>
    </div>
</template>
<script>
</script>
<style>
</style>