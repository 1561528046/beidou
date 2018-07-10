<template>
  <div>
    <!-- 面包屑 -->
    <div class="admin-breadcurmb" style="position:relative;padding-left:80px;">
      <i class="iconfont icon-arrowleft" @click="()=>{$router.go(-1);}" style="position:absolute;left:20px;font-size:30px;top:20px; color:blue;"></i>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item v-for="route in $route.matched" :to="route" :key="route.path">{{route.meta.name}}</el-breadcrumb-item>
      </el-breadcrumb>
      <h2 style="text-align:left; font-weight:normal; font-size:20px;padding-top:10px;">{{$route.meta.name}}</h2>
    </div>

    <!-- 视图路由 -->
    <base-routeing :routes="routes"></base-routeing>

    <!-- 视图 -->
    <router-view></router-view>
  </div>
</template>
<script>
import baseRouteing from "@/components/base-routeing.vue";
export default {
  created: function() {},
  computed: {
    routes() {
      var routes = window.routerDict[this.$route.name];
      if (routes.children) {
        return routes.children.filter(route => {
          return !route.meta.hidden;
        });
      } else {
        return [];
      }
    }
  },
  components: { baseRouteing }
};
</script>
