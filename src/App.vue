<template>
  <div id="app">
    <base-nav></base-nav>
    <base-slidebar></base-slidebar>
    <router-view/>
  </div>
</template>

<style lang="less">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
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
}
</script>