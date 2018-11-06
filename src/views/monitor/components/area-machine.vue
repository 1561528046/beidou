<template>
  <div class="admin-table-container" style="position: absolute;left:0;right:0;bottom:0;top:107px;">
    <router-link :to="{name:'map'}">
      <el-button style="position:absolute;top:-30px;right:31px;" size="small" icon="el-icon-arrow-left">
        <span>返回</span>
      </el-button>
    </router-link>
    <div class="bind-box" style="height:100%;">
      <el-tabs style=" width: 100%;position: relative; background-color:#fff;" type="border-card" v-model="activeName">
        <el-tab-pane label="设置区域" name="area">
          <area-vehicle></area-vehicle>
        </el-tab-pane>
        <el-tab-pane label="设置路线" name="machine">
          <area-limit></area-limit>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import areaVehicle from "./area-vehicle.vue";
import areaRoute from "./area-route.vue";
import areaLimit from "./area-limit.vue";
export default {
  components: { areaVehicle, areaRoute, areaLimit },
  data() {
    return {
      activeName: "area"
    };
  }
};
</script>
