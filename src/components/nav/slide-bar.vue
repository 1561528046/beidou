<template>
  <div>
    <template v-for="route in routes" >
      <el-submenu index="2" v-if="route.children" :key="route.name">
        <template slot="title">{{route.name}}1</template>
        <SidebarItem :routes="route.children"></SidebarItem>
      </el-submenu>
      <el-menu-item index="3" v-if="!route.children" :key="route.name">{{route.name}}</el-menu-item>
    </template>
  </div>
</template>

<script>
export default {
  name: 'SidebarItem',
  props: {
    routes: {
      type: Array
    },
    isNest: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    hasOneShowingChildren(children) {
      const showingChildren = children.filter(item => {
        return !item.hidden
      })
      if (showingChildren.length === 1) {
        return true
      }
      return false
    }
  }
}
</script>