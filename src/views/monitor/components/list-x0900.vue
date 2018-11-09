<template>
  <div>
    <el-table :data="$store.getters['x0900/list']" size="mini">
      <el-table-column label="车牌号" :formatter="getLicense"></el-table-column>
      <el-table-column prop="TransportType" label="透传消息类型"></el-table-column>
      <el-table-column prop="TransportContent" label="透传内容"></el-table-column>
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
      var vehicle = window.monitor.data.get(
        this.$utils.unFormatSim(row.sim_id)
      );
      if (vehicle) {
        return vehicle.license;
      } else {
        return "--";
      }
    },
    remove(row) {
      this.$store.commit("x0900/remove", row.id);
    }
  }
};
</script>
