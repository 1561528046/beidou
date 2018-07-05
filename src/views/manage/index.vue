<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item v-for="route in $route.matched" :to="route" :key="route.path">{{route.meta.name}}</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 视图路由 -->
    <base-routeing :routes="routes"></base-routeing>

    <!-- 视图 -->
    <router-view></router-view>
  </div>
</template>
<script>
import baseRouteing from "@/components/base-routeing.vue";
export default {
  computed: {
    routes() {
      //根据matched找到当前路由的同级路由
      var router = this.$router.options.routes;
      if (this.$route.matched.length) {
        this.$route.matched.map(matchedRoute => {
          router = router.filter(route => {
            return matchedRoute.name == route.name;
          })[0].children;
        });
        return router;
      } else {
        return [];
      }
    }
  },
  components: { baseRouteing }
};
</script>
