<template>
  <div class="shadow-box monitor-info" :class="{'small-size':smallSize}">
    <div class="_close">
      <i class="iconfont icon-window-minimize window-ctrl" v-if="!smallSize" @click="smallSize = true" style="position:relative;top:-7px;"></i>
      <i class="iconfont icon-window-maximize window-ctrl" v-if="smallSize" @click="smallSize = false"></i>
    </div>
    <el-tabs v-model="currentTab" type="border-card">
      <el-tab-pane label="提问列表" :closable="false" name="QA">
        <qa-list></qa-list>
      </el-tab-pane>
      <el-tab-pane label="电子运单" :closable="false" name="x0701">
        <list-x0701></list-x0701>
      </el-tab-pane>
      <el-tab-pane label="事件报告" :closable="false" name="x0301">
        <!-- <qa-list></qa-list> -->
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import qaList from "./list-qa.vue"; //提问列表
import listX0701 from "./list-x0701.vue"; //电子运单列表
export default {
  components: {
    qaList,
    listX0701
  },
  data() {
    return {
      smallSize: false, //最小化
      currentTab: "QA"
    };
  },
  created() {
    this.$instruction.on("x0302", evt => {
      this.$store.commit("QA/answer", JSON.parse(evt.data));
    });
  },
  methods: {}
};
</script>
<style lang="less">
@import "../../../style/var.less";
.monitor-info {
  position: absolute;
  bottom: 0;

  left: 0;
  width: calc(100% - 17% - 50px);
  z-index: 999;
  background: #fff;
  ._close {
    position: absolute;
    z-index: 2;
    right: 20px;
    top: 13px;
    .window-ctrl {
      cursor: pointer;
    }
  }
  .el-tabs__content {
    height: 300px !important;
  }
  &.small-size {
    .el-tabs__content {
      display: none;
    }
  }
}
</style>