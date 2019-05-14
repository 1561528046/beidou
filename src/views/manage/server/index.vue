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
        <el-table-column prop="timeout" label="运行时长" width="180"></el-table-column>
        <el-table-column prop="running_state" label="运行状态" width="180">
          <template slot-scope="scope">
            <label v-if="scope.row.running_state=='2'">异常</label>
            <label v-else>正常</label>
          </template>
        </el-table-column>
        <el-table-column
          prop="desk_free_space"
          label="剩余容量"
          :formatter="(row)=>{return row.desk_free_space+'G'}"
        ></el-table-column>
        <el-table-column
          prop="desk_size"
          label="总容量"
          :formatter="(row)=>{return row.desk_size+'G'}"
        ></el-table-column>
        <el-table-column prop="running_fault" label="故障告警" width="180"></el-table-column>
        <el-table-column prop="CPU" label="CPU利用率" :formatter="(row)=>{return row.CPU+'%'}"></el-table-column>
        <el-table-column prop="memory" label="内存利用率" :formatter="(row)=>{return row.memory+'%'}"></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
import { GetDaemon } from "@/api/index.js";
// import moment from "moment";
export default {
  created() {
    this.getDaemon();
    this.timer = setInterval(() => {
      this.getDaemon();
    }, 3000);
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
          var data = res.data.data;
          data.map(item => {
            var m1 = new Date().getTime();
            var m2 = new Date(
              this.$utils.formatDate14(JSON.stringify(Number(item.begin_time)))
            ).getTime();
            var date = m1 - m2;
            item.timeout = this.$utils.DateTime(date, true);
          });

          this.$set(this.tableData, "data", data);
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
