<template>
  <div class="base-slide-bar">
    <el-menu :default-active="$route.name" :collapse="isCollapse" v-if="routes[0]">
      <template v-for="route in routes[0].children">
        <el-menu-item :index="route.name" :key="route.name">
          <router-link :to="route" class="item">{{route.meta.name}}</router-link>
        </el-menu-item>
      </template>

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
      // return this.$router.options.routes
      window.a = this;
      if (this.$route.matched.length) {
        return this.$router.options.routes.filter(parentRoute => {
          return parentRoute.path == this.$route.matched[0].path;
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
</style>
