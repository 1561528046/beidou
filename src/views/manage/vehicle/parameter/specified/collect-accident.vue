<template>
  <!-- 事故疑点记录 -->
  <div>
    <el-table :data="tableData.data" style="width: 100%">
      <el-table-column label="行驶结束时间">
      </el-table-column>
      <el-table-column label="机动车驾驶证号码">
      </el-table-column>
      <el-table-column label="行驶结束时的速度">
      </el-table-column>
      <el-table-column label="行驶结束时间前的速度">
      </el-table-column>
      <el-table-column label="行驶结束时间前的状态信号">
      </el-table-column>
      <el-table-column label="经度">
      </el-table-column>
      <el-table-column label="纬度">
      </el-table-column>
      <el-table-column label="海拔高度">
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
      collectData: {},
      type: ""
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