<template>
  <!-- 事故疑点记录 -->
  <div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="EndTime" label="行驶结束时间">
      </el-table-column>
      <el-table-column prop="LicenseNo" label="机动车驾驶证号码">
      </el-table-column>
      <el-table-column prop="Speed" label="行驶结束时间前的速度">
      </el-table-column>
      <el-table-column prop="StateSignal" label="行驶结束时间前的状态信号">
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
      collectData: [],
      tableData: []
    };
  },
  props: ["message"],
  watch: {
    message: {
      handler: function() {
        this.$set(this.$data, "collectData", this.$props.message);
        if (this.collectData.CommandWord == 16) {
          var AccidentRecords = JSON.parse(this.collectData.AccidentRecords);
          this.$set(this.$data, "tableData", AccidentRecords);
        }
      },
      deep: true
    }
  },
  methods: {}
};
</script>