<template>
  <div class="shadow-box monitor-info" :class="{'small-size':smallSize}">
    <div class="_close">
      <i class="iconfont icon-window-minimize window-ctrl" v-if="!smallSize" @click="smallSize = true" style="position:relative;top:-7px;"></i>
      <i class="iconfont icon-window-maximize window-ctrl" v-if="smallSize" @click="smallSize = false"></i>
    </div>
    <el-tabs v-model="currentTab" type="border-card" @tab-click="smallSize = false">
      <el-tab-pane :closable="false" name="QA">
        <span slot="label"> 提问列表<el-badge :value="$store.getters['QA/askList'].length" :max="99" class="monitor-badge"> </el-badge> </span>
        <qa-list></qa-list>
      </el-tab-pane>
      <el-tab-pane :closable="false" name="x0701">
        <span slot="label"> 电子运单<el-badge :value="$store.getters['x0701/list'].length" :max="99" class="monitor-badge"> </el-badge></span>
        <list-x0701></list-x0701>
      </el-tab-pane>
      <el-tab-pane :closable="false" name="x0301">
        <span slot="label"> 事件报告<el-badge :value="$store.getters['x0301/list'].length" :max="99" class="monitor-badge"> </el-badge></span>
        <list-x0301></list-x0301>
      </el-tab-pane>
      <el-tab-pane :closable="false" name="x8203">
        <span slot="label"> 报警消息<el-badge :value="$store.getters['alarm/list'].length" :max="99" class="monitor-badge"> </el-badge></span>
        <list-x8203></list-x8203>
      </el-tab-pane>
      <el-tab-pane :closable="false" name="x0900">
        <span slot="label"> 上行透传<el-badge :value="$store.getters['x0900/list'].length" :max="99" class="monitor-badge"> </el-badge></span>
        <list-x0900></list-x0900>
      </el-tab-pane>
      <el-tab-pane :closable="false" name="x0901">
        <span slot="label"> 数据压缩上报<el-badge :value="$store.getters['x0901/list'].length" :max="99" class="monitor-badge"> </el-badge></span>
        <list-x0901></list-x0901>
      </el-tab-pane>
      <el-tab-pane :closable="false" name="list809">
        <span slot="label"> 查岗<el-badge :value="$store.getters['x809/list'].length" :max="99" class="monitor-badge"> </el-badge></span>
        <list809></list809>
      </el-tab-pane>
      <el-tab-pane :closable="false" name="list809in">
        <span slot="label"> 890数据交换<el-badge :value="$store.getters['x809In/list'].length" :max="99" class="monitor-badge"> </el-badge></span>
        <list809-in></list809-in>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import qaList from "./list-qa.vue"; //提问列表
import listX0701 from "./list-x0701.vue"; //电子运单列表
import listX0301 from "./list-x0301.vue"; //事件报告
import listX8203 from "./list-x8203.vue"; //报警
import listX0900 from "./list-x0900.vue"; //数据上行透传
import listX0901 from "./list-x0901.vue"; //数据压缩上报
import list809 from "./list-809.vue"; //809查岗
import list809In from "./list-809-in.vue"; //809查岗
export default {
  components: {
    qaList,
    listX0701,
    listX0301,
    listX8203,
    listX0900,
    listX0901,
    list809,
    list809In
  },
  data() {
    return {
      tabCounts: {
        QA: 0
      },
      smallSize: true, //最小化
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
  .monitor-badge {
    left: 3px;
    top: 4px;
  }
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