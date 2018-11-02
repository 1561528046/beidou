<template>
  <!-- 行驶速度记录 -->
  <div>
    <el-table :data="tableData.data" style="width: 100%">
      <el-table-column label="开始时间">
      </el-table-column>
      <el-table-column label="平局速度">
      </el-table-column>
      <el-table-column label="状态信号">
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