<template>
  <div class="QA">
    <el-table :data="$store.getters['x0701/list']" size="mini">
      <el-table-column label="车牌号" :formatter="getLicense"></el-table-column>
      <el-table-column prop="Ewaybillcontent" label="电子运单内容"></el-table-column>
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
    return {
      showBody: false
    };
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
    remove(row) {
      this.$store.commit("x0701/remove", row.id);
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