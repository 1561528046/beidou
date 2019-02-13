<template>
  <div>
    <el-form>
      <el-row>
        <el-col :span="12">
          <el-form-item label="1">
            <div class="goup_block"></div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="2">
            <div class="goup_block"></div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="3">
            <div class="goup_block"></div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="4">
            <div class="goup_block"></div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  }
};
</script>
<style>
.goup_block {
  background-color: #464545;
}
</style>