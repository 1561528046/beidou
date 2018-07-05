<template>
  <el-menu mode="horizontal" :default-active="defaultActive" :router="true" background-color="#001529" text-color="rgba(255, 255, 255, 0.65)" active-text-color="#1890ff">
    <template v-for="route in routes">
      <!-- 只显示一级栏目 -->
      <!-- <el-submenu :index="route.path" v-if="route.children" :key="route.name">
        <template slot="title">{{route.meta.name}}</template>
        <el-menu-item :index="route.path+'/'+routeChildren.path" v-for="routeChildren in route.children" :key="routeChildren.name">{{routeChildren.meta.name}}</el-menu-item>
      </el-submenu> -->
      <el-menu-item :index="route.path" :key="route.name">{{route.meta.name||route.name}}</el-menu-item>
    </template>
  </el-menu>
</template>

<script>
export default {
  computed: {
    defaultActive() {
      if (this.$route.matched.length) {
        return this.$route.matched[0].path || "/";
      } else {
        return "";
      }
    },
    routes() {
      return this.$router.options.routes;
    }
  }
};
</script>