<template>
  <!-- 外部供电记录 -->
  <div>
    <el-table :data="tableData.data" style="width: 100%">
      <el-table-column label="事件发生时间">
      </el-table-column>
      <el-table-column label="事件类型">
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