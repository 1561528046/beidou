<template>
  <!-- 速度状态日志 -->
  <div>
    <el-table :data="tableData.data" style="width: 100%">
      <el-table-column label="记录仪速度状态">
      </el-table-column>
      <el-table-column label="速度状态判定的开始时间">
      </el-table-column>
      <el-table-column label="速度状态判定的结束时间">
      </el-table-column>
      <el-table-column label="开始时间对应的记录速度">
      </el-table-column>
      <el-table-column label="开始时间对应的参考速度">
      </el-table-column>
      <el-table-column label="开始时间后对应的参考速度">
      </el-table-column>
      <el-table-column label="开始时间后对应的参考速度">
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