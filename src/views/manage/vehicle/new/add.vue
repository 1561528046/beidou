<template>
  <div>
    <el-collapse v-model="activeNames">
      <el-card shadow="hover">
        <div slot="header" class="clearfix">
          <span>卡片名称1</span>
          <el-button style="float: right; padding: 3px 0" type="text">操作按钮0</el-button>
        </div>
        asdasdasd
      </el-card>
      <!-- <button @click="$router.go(-1)">a</button> -->
    </el-collapse>
  </div>
</template>
<script>
export default {
  data() {
    return {
      activeNames: 1
    };
  },
  computed: {
    step: function() {
      return parseInt(this.activeNames);
    }
  }
};
</script>
