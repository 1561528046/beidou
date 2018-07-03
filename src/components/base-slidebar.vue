<template>
    <div class="base-slide-bar">
<el-menu default-active="$route.path" :collapse="isCollapse">
  11{{routes}}22
  <!-- <template v-for="route in routes">
    <el-submenu index="1">
    <template slot="title">
      <i class="el-icon-location"></i>
      <span slot="title">导航一</span>
    </template>
    <el-menu-item-group>
      <span slot="title">分组一</span>
      <el-menu-item index="1-1">选项1</el-menu-item>
      <el-menu-item index="1-2">选项2</el-menu-item>
    </el-menu-item-group>
    <el-menu-item-group title="分组2">
      <el-menu-item index="1-3">选项3</el-menu-item>
    </el-menu-item-group>
    <el-submenu index="1-4">
      <span slot="title">选项4</span>
      <el-menu-item index="1-4-1">选项1</el-menu-item>
    </el-submenu>
  </el-submenu>    
  </template>
   -->
</el-menu>
    </div>
</template>

<script>
export default {
  props:{
    isCollapse:[Boolean]
  },
  computed: {
    routes() {
      window.a = this;
      // return this.$router.options.routes
      if(this.$route.matched[0]){
        return this.$router.options.routes.filter((parentRoute)=>{
          return parentRoute.path == this.$route.matched[0].path;
        })
      }else{
        return [];
      }
    }
  }
}
</script>