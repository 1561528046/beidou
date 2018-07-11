<template>
  <div class="base-slide-bar" style="box-shadow: 0 0 4px #333; z-index:1;">
    <el-menu :default-active="$route.name" class="slide-bar" :collapse="true" background-color="#001529" text-color="rgba(255, 255, 255, 0.65)" active-text-color="#1890ff" style="border-right:0;">
      <el-submenu :index="route.name" v-for="route in routes" :key="route">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span slot="title">{{route.meta.name}}</span>
        </template>
        <el-menu-item v-for="childrenRoute in route.children" :index="childrenRoute.name" :key="childrenRoute">
          <router-link :to="{name:childrenRoute.name}">{{childrenRoute.meta.name}}</router-link>
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
export default {
  props: {
    isCollapse: [Boolean]
  },
  computed: {
    routes() {
      if (this.$route.matched.length == 0) {
        return [];
      }
      var routes = window.routerDict[this.$route.matched[0].name];
      if (routes.children) {
        return routes.children.filter(route => {
          return !route.meta.hidden;
        });
      } else {
        return [];
      }
    }
  }
};
</script>
<style scoped>
.item {
  display: block;
}
.slide-bar:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
</style>
