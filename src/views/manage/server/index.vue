<template>
  <div class="admin-table-container">
    <el-card shadow="always" class="admin-table-search">
      <el-table :data="tableData.data" style="width: 100%">
        <el-table-column prop="online" label="在线状态" width="180">
          <template slot-scope="scope">
            <label v-if="scope.row.online=='0'">离线</label>
            <label v-if="scope.row.online=='1'">在线</label>
          </template>
        </el-table-column>
        <el-table-column prop="position" label="名称" width="180">
          <template slot-scope="scope">
            <label v-if="scope.row.position=='1'">服务端</label>
            <label v-if="scope.row.position=='2'">808网关</label>
            <label v-if="scope.row.position=='3'">809网关</label>
            <label v-if="scope.row.position=='4'">存储端</label>
          </template>
        </el-table-column>
        <el-table-column prop="CPU" label="CPU利用率"></el-table-column>
        <el-table-column prop="memory" label="内存利用率"></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
import { GetDaemon } from "@/api/index.js";
export default {
  created() {
    this.getDaemon();
    this.timer = setInterval(() => {
      this.getDaemon();
    }, 30000);
  },
  destroyed() {
    clearInterval(this.timer);
  },
  data() {
    return {
      timer: {},
      tableQuery: {
        type: ""
      },
      tableData: {
        data: [],
        total: 0
      }
    };
  },
  methods: {
    getDaemon() {
      GetDaemon().then(res => {
        if (res.data.code == 0) {
          this.$set(this.tableData, "data", res.data.data);
        } else {
          return this.$notify({
            message: res.data.msg,
            title: "提示",
            type: "error"
          });
        }
      });
    }
  }
};
</script>
