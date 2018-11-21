<template>
    <div class="QA">
        <el-table :data="$store.getters['x0800/list']" size="mini">
            <el-table-column label="车牌号" :formatter="getLicense"></el-table-column>
            <el-table-column label="多媒体数据ID" prop="MultimediaDataID"></el-table-column>
            <el-table-column label="多媒体类型" :formatter="formatType"></el-table-column>
            <el-table-column label="多媒体格式编码" :formatter="formatCoding"></el-table-column>
            <el-table-column label="事件项编码" :formatter="formatEvent"></el-table-column>
            <el-table-column label="通道ID" prop="ChannelId"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button size="mini" @click="remove(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  created() {},
  methods: {
    getLicense(row) {
      var vehicle = window.monitor.data.get(this.$utils.unFormatSim(row.SimID));
      if (vehicle) {
        return vehicle.license;
      } else {
        return "--";
      }
    },
    formatCoding(row) {
      switch (row.MultidediaCodeFormat) {
        case 1:
          return "TIF";
        case 2:
          return "MP3";
        case 3:
          return "WAV";
        case 4:
          return "WMV";
      }
    },
    formatType(row) {
      switch (row.MultimediaType) {
        case 0:
          return "图像";
        case 1:
          return "音频";
        case 2:
          return "视频";
      }
    },
    formatEvent(row) {
      switch (row.EventCode) {
        case 0:
          return "平台下发指令";
        case 1:
          return "定时动作";
        case 2:
          return "抢劫报警触发";
        case 3:
          return "碰撞侧翻报警触发";
      }
    },

    remove(row) {
      this.$store.commit("x0800/remove", row.id);
    }
  }
};
</script>
<style lang="less" scoped>
@import "../../../style/var.less";
.QA {
  .anwser-box {
    margin: -20px -50px;
    padding: 15px 20px;
  }
  .anwser-list {
    padding: 20px;
    display: flex;
    flex-wrap: wrap;
    li {
      width: 30%;
      padding: 0;
      margin: 0;
      list-style-type: none;
      height: 30px;
      line-height: 30px;
      &.selected {
        color: @success;
        font-weight: bold;
        position: relative;
        &:before {
          content: "✔";
          position: absolute;
          left: -20px;
        }
      }
    }
  }
}
</style>