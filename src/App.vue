<template>
  <div id="app">
    <link rel="stylesheet" href="//at.alicdn.com/t/font_770472_ijyzzxcyip.css">
    <el-container>
      <el-header style="padding:0;" v-if="!$route.meta.fullscreen">
        <base-nav></base-nav>
      </el-header>
      <el-container>
        <!-- <base-slidebar></base-slidebar> -->
        <el-main style="padding:0;">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>

  </div>
</template>

<style lang="less">
html,
body,
#app,
.el-container,
.el-menu,
.base-slide-bar {
  height: 100%; // overflow-y: auto;
}
</style>
<script>
import baseNav from "@/components/base-nav.vue";
import baseSlidebar from "@/components/base-slidebar.vue";
export default {
  components: {
    baseNav,
    baseSlidebar
  },
  methods: {}
};
</script>