<template>
  <div style="height:100%">
    <el-row style="height:100%">
      <el-col class="four_height" :span="12">
        <div class="goup_block"></div>
      </el-col>
      <el-col class="four_height" :span="12">
        <div class="goup_block"></div>
      </el-col>
      <el-col class="four_height" :span="12">
        <div class="goup_block"></div>
      </el-col>
      <el-col class="four_height" :span="12">
        <div class="goup_block"></div>
      </el-col>
    </el-row>
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
.four_height {
  height: 50%;
  border: 1px solid #fff;
}
.goup_block {
  height: 100%;
  background-color: #404040;
}
</style>