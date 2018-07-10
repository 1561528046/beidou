<template>
  <div class="routeing">
    <router-link class="routeing-item" :to="{name:route.name}" v-for="route in routes" :key="route.path">
      <span class="icon" :class="route.meta.icon"></span>
      <span class="name">{{route.meta.name}}</span>
    </router-link>
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
  flex-wrap: wrap;
  justify-content: center;
  padding-top: 30px;
}
.routeing-item {
  width: 200px;
  height: 200px;
  margin: 15px;
  background: #fff;
  border: 1px solid #ddd;
  text-align: center;
  display: block;
  position: relative;
  .icon {
    display: block;
    height: 150px;
    line-height: 150px;
    background: #1890ff;
    font-size: 50px;
    color: #fff;
  }
  .name {
    height: 50px;
    line-height: 50px;
  }
}
</style>

