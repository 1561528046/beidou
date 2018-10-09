<template>
  <div class="vehicle-single">
    <div class="vehicle-single-map" ref="vehicle_map"></div>
    <vehicle-monitor class="list-complete-item" :single="true" :vehicle="vehicle" :index="index" :key="'single'+vehicle.vehicle_id"></vehicle-monitor>
  </div>

</template>
<script>
import vehicleMonitor from "./vehicle-monitor.vue";
export default {
  components: { vehicleMonitor },
  data() {
    return {
      mapData: {}
    };
  },
  props: ["index", "vehicle"],
  watch: {},
  computed: {},
  mounted() {},
  methods: {},
  destroyed() {
    // this.mapData.map.destroy();
  }
};
</script>
<style lang="less">
@import "../../../style/var.less";
.vehicle-single-map {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}
</style>