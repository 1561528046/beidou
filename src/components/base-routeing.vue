<template>
  <div class="routeing">
    <router-link class="routeing-item" :to="{name:route.name}" v-for="route in routes" :key="route.path">{{route.meta.name}}</router-link>
  </div>
</template>
<script>
export default {
  props: {
    routes: Array
  }
};
</script>
<style lang="less" scpoed>
.routeing {
  display: flex;
}
.routeing-item {
  width: 200px;
  height: 200px;
  margin: 15px;
  border: 1px solid #ddd;
  line-height: 200px;
  text-align: center;
  display: block;
}
</style>

