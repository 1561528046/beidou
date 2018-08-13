<template>
  <div>
    <!-- 面包屑 -->
    <div class="admin-breadcurmb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item v-for="route in $route.matched" :to="route" :key="route.path">
          <i v-if="route.meta.icon" :class="route.meta.icon"></i>
          {{route.meta.name}}</el-breadcrumb-item>
        <el-button size="mini" class="admin-back" @click="$router.back()" icon="el-icon-arrow-left">返回</el-button>
      </el-breadcrumb>
    </div>

    <!-- 视图路由 -->
    <base-routeing :routes="routes" v-if="routerDict[this.$route.name].children"></base-routeing>

    <!-- 视图 -->
    <router-view></router-view>
  </div>
</template>
<script>
import baseRouteing from "@/components/base-routeing.vue";
export default {
  created: function() {},
  computed: {
    routerDict() {
      return window.routerDict;
    },
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
