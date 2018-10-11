<template>
  <!-- 地图 -->
  <div>
    <div style="position:absolute;left:0;right:0;top:0;bottom:0; z-index:1;" ref="map"></div>
    <div style="width:482px; height:32px; position:absolute;left:10px;right:0;top:10px;bottom:0;box-shadow: 2px 2px 5px #ddd; border-radius: 5px; padding:10px; z-index:99;background-color:#fff;">
      <el-input size="small" placeholder="请输入车牌号/终端ID">
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
    </div>
    <div style="padding:10px;width:480px;height:200px; position:absolute;left:10px;right:0;top:66px;bottom:0;border:1px solid #777; z-index:99;background-color:#fff; ">
      <div style="margin-top:45px;">
        <el-date-picker size="small" value-format="yyyyMMdd" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker>
        <el-button type="primary" @click="selectForm" style="margin-left:68px;" size="small">查询</el-button>
        <label style="position:absolute;left:230px;top:15px">车牌号</label>
        <i class="el-icon-circle-close-outline" style="font-size:20px;position:absolute;right:15px;top:10px;margin-top:5px;"></i>
        <div style="margin-top:10px;">
          <el-checkbox>过滤无效数据</el-checkbox>
          <el-checkbox>过滤无效定位</el-checkbox>
        </div>
        <div style="position: relative;padding-top:26px;">
          <el-button size="small" style="position:absolute;top:30px;">加速</el-button>
          <el-button size="small" style="position:absolute;top:30px;left:58px;">减速</el-button>
          <div style="width:36px;margin:0 auto;">
            <i v-if="!playState" @click="playState=true" style="display: block;width: 36px;height: 36px;border-radius: 50%;border: solid 1px;line-height: 36px;text-align: center;" class="iconfont icon-bofangqibofang"></i>
            <i v-if="playState" @click="playState=false" style="display: block; width: 36px;height: 36px;border-radius: 50%;border: solid 1px;line-height: 36px;text-align: center;" class="iconfont icon-bofangqi-zanting"></i>
          </div>
        </div>
        <el-slider v-model="value1"></el-slider>
      </div>
    </div>
    <div v-if="dialogVisible" style="width:1000px; height:200px;background-color:#fff;position:absolute;right:0; z-index:99;margin-top:10px;">
      <el-table height="200" border style="width: 100%">
        <el-table-column label="序号">
        </el-table-column>
        <el-table-column label="时间">
        </el-table-column>
        <el-table-column label="速度">
        </el-table-column>
        <el-table-column label="当日里程">
        </el-table-column>
        <el-table-column label="位置">
        </el-table-column>
      </el-table>
    </div>
  </div>

</template>
<script>
/*eslint-disable*/
import { initMap } from "@/utils/map.js";
export default {
  data() {
    return {
      dialogVisible: false,
      playState: false
    };
  },
  mounted() {
    var vm = this;
    initMap(() => {
      var map = new AMap.Map(this.$refs.map, {
        zoom: 14
      });
      //   vm.$set()
    });
    var path = [
      [116.405289, 39.904987],
      [113.964458, 40.54664],
      [111.47836, 41.135964],
      [108.949297, 41.670904],
      [106.380111, 42.149509],
      [103.774185, 42.56996],
      [101.135432, 42.930601],
      [98.46826, 43.229964],
      [95.777529, 43.466798],
      [93.068486, 43.64009],
      [90.34669, 43.749086],
      [87.61792, 43.793308]
    ];
  },
  methods: {
    selectForm() {
      this.dialogVisible = true;
    }
  }
};
</script>