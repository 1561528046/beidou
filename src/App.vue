<template>
  <div id="app">

    <el-container>
      <el-header style="padding:0;">
        <base-nav></base-nav>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <base-slidebar></base-slidebar>
        </el-aside>
        <el-main>
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
  height: 100%;
  overflow-y: auto;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
<script>
import baseNav from "@/components/base-nav.vue";
import baseSlidebar from "@/components/base-slidebar.vue";
export default {
  components: {
    baseNav,
    baseSlidebar
  }
};
</script>