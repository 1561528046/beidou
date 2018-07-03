<template>
    <el-menu
      mode="horizontal"
      :show-timeout="200"
      :default-active="$route.path"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
    >
      <sidebar-item :routes="routes"></sidebar-item>
    </el-menu>
</template>

<script>
import SidebarItem from "@/components/nav/slide-bar.vue";
export default {
  components: { SidebarItem },
  computed: {
    routes() {
      return this.$router.options.routes
    }
  }
}
</script>