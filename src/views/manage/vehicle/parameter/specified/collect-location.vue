<template>
  <!-- 位置信息记录 -->
  <div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="StartTime" label="开始时间"></el-table-column>
      <el-table-column prop="speed" label="平局速度"></el-table-column>
      <el-table-column prop="Longitude" label="经度"></el-table-column>
      <el-table-column prop="Latitude" label="纬度"></el-table-column>
      <el-table-column prop="Altitude" label="海拔高度"></el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  created() {},
  data() {
    return {
      tableData: [],
      collectData: {}
    };
  },
  props: ["message"],
  watch: {
    message: {
      handler: function() {
        this.$set(this.$data, "collectData", this.$props.message);
        if (this.collectData.CommandWord == 9) {
          var UnitHoursSpeeds = this.collectData.UnitHoursSpeeds;
          UnitHoursSpeeds.map(item => {
            var speed = 0;
            var Altitude = 0;
            var Latitude = 0;
            var Longitude = 0;
            item.LocationItems.map((itca, index) => {
              speed = speed + item.AverageSpeed[index];
              Altitude = Altitude + itca.Altitude;
              Latitude = Latitude + itca.Latitude;
              Longitude = Longitude + itca.Longitude;
            });
            item.speed = speed / 60;
            item.Altitude = (Altitude / 60).toFixed(2);
            item.Latitude = (Latitude / 60).toFixed(2);
            item.Longitude = (Longitude / 60).toFixed(2);
          });
          this.$set(this.$data, "tableData", UnitHoursSpeeds);
        }
      },
      deep: true
    }
  },
  methods: {}
};
</script>