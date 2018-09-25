<template>
  <div class="vehicle-info-box shadow-box open" ref="box" :style="{left:position.left+'px',top:position.top+'px'}">
    <div class="_header">
      <strong class="_title">冀R61333</strong>
      <small class="_text">服务到期日期：2019-3-1 </small>
      <i class="_close el-icon-circle-close-outline" @click="close"></i>
    </div>
    <div class="_map">
      <!-- <a class="_map-btn">展开地图</a> -->
      <div class="_map-container"></div>
    </div>
    <div class="_body">
      <el-row>
        <el-col :span="24">
          定位时间：2018-05-05 13：22：36
        </el-col>
        <el-col :span="12">
          联系人：XXX
        </el-col>
        <el-col :span="12">
          联系方式： 13000000000
        </el-col>
        <el-col :span="12">
          时速：60/km
        </el-col>
        <el-col :span="12">
          今日里程：600/km
        </el-col>
        <el-col :span="24">
          地理位置：河北省廊坊市广阳区XXX300米
        </el-col>
      </el-row>
    </div>
    <div class="_footer">
      <i class="iconfont icon-idcard"></i>
      <i class="iconfont icon-boxplot-fill"></i>
      <i class="iconfont icon-sim"></i>
      <i class="iconfont icon-alert-fill"></i>
      <i class="iconfont icon-wifi"></i>
      <i class="iconfont icon-error-fill _error"></i>

    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      bodyWidth: "",
      bodyHeight: ""
    };
  },
  props: ["index"],
  computed: {
    position: function() {
      var maxRow = Math.floor(this.bodyHeight / 360);
      var left = Math.floor(this.index / maxRow) * 350;
      var top = (this.index % maxRow) * 360;
      return {
        left: left + Math.floor(this.index / maxRow) * 10,
        top: top + (this.index % maxRow) * 10
      };
    }
  },
  mounted() {
    this.bodyWidth = this.$el.parentElement.scrollWidth;
    this.bodyHeight = this.$el.parentElement.scrollHeight;
  },
  methods: {
    close() {
      this.$emit("close");
    }
  }
};
</script>
<style lang="less">
@import "../../../style/var.less";
.amap-logo {
  display: none !important;
}
.amap-copyright {
  display: none !important;
}
.vehicle-info-box {
  font-size: 12px;
  position: absolute;
  width: 350px;
  background: #fff;
  z-index: 10;
  &.open {
    height: 360px;
    ._map {
      height: 160px;
      background: #999;
    }
  }
  ._header {
    box-sizing: border-box;
    border-bottom: 1px solid #f0f0f0;
    padding: 0 15px;
    position: relative;
    height: 40px;
    line-height: 40px;
    ._title {
      padding-right: 1em;
      font-size: 16px;
    }
    ._text {
      font-size: 12px;
      color: #999;
    }
    ._close {
      cursor: pointer;
      right: 15px;
      top: 50%;
      transform: translate3d(0, -50%, 0);
      font-size: 20px;
      position: absolute;
    }
  }
  ._map {
    position: relative;
    min-height: 25px;
    height: 180px;
    ._map-btn {
      position: absolute;
      bottom: 0;
      font-size: 12px;
      width: 100px;
      left: 50%;
      margin-left: -50px;
      border: 1px solid #f0f0f0;
      border-top: 0;
      text-align: center;
      height: 25px;
      line-height: 25px;
      background: #fff;
    }
    ._map-container {
      height: 100%;
      width: 100%;
    }
  }
  ._body {
    height: 120px;
    box-sizing: border-box;
    padding: 15px;
    line-height: 1.8;
  }
  ._footer {
    height: 40px;
    line-height: 40px;
    border-top: 1px solid #f0f0f0;
    ._error {
      position: absolute;
      right: 15px;
      color: #ff8d00;
    }
    i {
      font-size: 25px;
      display: inline-block;
      width: 40px;
      cursor: pointer;
      text-align: center;
    }
  }
}
</style>