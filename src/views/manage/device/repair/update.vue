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
                        <el-form-item label="维修原因">
                            <el-input></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="返厂时间">
                            <el-input></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="物流信息">
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
</style>