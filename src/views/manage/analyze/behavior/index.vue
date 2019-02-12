<template>
  <div class="admin-table-container">
    <el-card shadow="always" class="admin-table-search">
      <el-form size="small" label-width="80px">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="时间"></el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="车辆"></el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="报警时长"></el-form-item>
          </el-col>
          <el-col :span="24" style="text-align:right">
            <el-form-item label-width="0">
              <el-button type="primary">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card shadow="always" class="admin-table-search"></el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  }
};
</script>