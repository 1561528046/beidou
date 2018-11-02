<template>
  <!-- 超时驾驶记录 -->
  <div>
    <el-table :data="tableData.data" style="width: 100%">
      <el-table-column label="机动车驾驶证号码">
      </el-table-column>
      <el-table-column label="连续驾驶开始时间">
      </el-table-column>
      <el-table-column label="连续驾驶结束时间">
      </el-table-column>
      <el-table-column label="连续驾驶开始时间所在的最近一次有效经度">
      </el-table-column>
      <el-table-column label="连续驾驶开始时间所在的最近一次有效纬度">
      </el-table-column>
      <el-table-column label="连续驾驶开始时间所在的最近一次有效海拔高度">
      </el-table-column>
      <el-table-column label="连续驾驶结束时间所在的最近一次有效经度">
      </el-table-column>
      <el-table-column label="连续驾驶结束时间所在的最近一次有效纬度">
      </el-table-column>
      <el-table-column label="连续驾驶开始时间所在的最近一次有效海拔高度">
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  created() {
    this.getTable();
  },
  data() {
    return {
      tableData: {
        data: []
      },
      collectData: {}
    };
  },
  props: ["message"],
  methods: {
    getTable() {
      this.$set(this.$data, "collectData", this.$props.message);
    }
  }
};
</script>