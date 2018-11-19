<template>
  <div>
    <el-table :data="$store.getters['x809In/list9302']" size="mini">
      <!-- <el-table-column prop="OBJECT_TYPE" label="下发报文对象类型" :formatter="getOBJECT_TYPE"></el-table-column> -->
      <!-- <el-table-column prop="OBJECT_ID" label="下发报文对象"></el-table-column> -->
      <el-table-column prop="INFO_ID" label="信息 ID"></el-table-column>
      <el-table-column prop="INFO_CONTENT" label="信息内容"></el-table-column>
    </el-table>

  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  computed: {},
  created() {},
  methods: {
    getOBJECT_TYPE(row) {
      return [
        "--",
        "当前连接的下级平台 ",
        "下级平台所属单一业户 ",
        "下级平台所属所有业户 "
      ][row.OBJECT_TYPE];
    }
  }
};
</script>
