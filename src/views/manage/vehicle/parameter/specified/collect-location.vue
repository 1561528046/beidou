<template>
  <!-- 位置信息记录 -->
  <div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="StartTime" label="开始时间">
      </el-table-column>
      <el-table-column prop="AverageSpeed" label="平局速度">
      </el-table-column>
      <el-table-column prop="Longitude" label="经度">
      </el-table-column>
      <el-table-column prop="Latitude" label="纬度">
      </el-table-column>
      <el-table-column prop="Altitude" label="海拔高度">
      </el-table-column>
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
          var UnitHoursSpeeds = JSON.parse(this.collectData.UnitHoursSpeeds);
          this.$set(this.$data, "tableData", UnitHoursSpeeds);
        }
      },
      deep: true
    }
  },
  methods: {}
};
</script>