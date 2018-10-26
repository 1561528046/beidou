<template>
  <div class="QA">
    <el-table :data="$store.getters['alarm/list']" size="mini">
      <el-table-column prop="sim_id" label="sim id"></el-table-column>
      <el-table-column prop="alarmText" label="报警信息"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-dropdown trigger="click" @command="(command)=>{clearAlarm(command,scope.row)}">
            <span class="el-dropdown-link">
              确认报警<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="1" v-if="scope.row.alarmKeys.includes('1')">确认紧急报警</el-dropdown-item>
              <el-dropdown-item command="8" v-if="scope.row.alarmKeys.includes('8')">确认危险预警</el-dropdown-item>
              <el-dropdown-item command="1048576" v-if="scope.row.alarmKeys.includes('1048576')">确认进出区域报警</el-dropdown-item>
              <el-dropdown-item command="2097152" v-if="scope.row.alarmKeys.includes('2097152')">确认进出路线报警</el-dropdown-item>
              <el-dropdown-item command="4194304" v-if="scope.row.alarmKeys.includes('4194304')">确认路段行驶时间不足/过长报警</el-dropdown-item>
              <el-dropdown-item command="134217728" v-if="scope.row.alarmKeys.includes('134217728')">确认车辆非法点火报警</el-dropdown-item>
              <el-dropdown-item command="268435456" v-if="scope.row.alarmKeys.includes('268435456')">确认车辆非法位移报警</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>
<script>
export default {
  data() {
    return {
      showBody: false
    };
  },
  created() {
    this.$instruction.on("x8203", evt => {
      var data = JSON.parse(evt.data);
      if (data.code == 0) {
        this.$message.success("发送指令成功");
        this.$store.commit("alarm/remove", data);
      } else {
        this.$message.warning("发送指令失败");
      }
    });
  },
  methods: {
    clearAlarm(command, row) {
      this.$instruction.send(
        JSON.stringify({
          MessageID: "x8203",
          SimID: this.$utils.formatSim(row.sim_id),
          ConfirmMessageSerialNo: row.serial_no,
          AlarmFlag: command
        })
      );
    },
    formatEvent(row) {
      return this.$dict.get_special(row.EventID) || "";
    },
    remove(row) {
      this.$store.commit("alarm/remove", row.id);
    }
  }
};
</script>
<style lang="less" scoped>
@import "../../../style/var.less";
.QA {
  .body {
  }
  .anwser-box {
    margin: -20px -50px;
    padding: 15px 20px;
  }
  .anwser-list {
    padding: 20px;
    display: flex;
    flex-wrap: wrap;
    li {
      width: 30%;
      padding: 0;
      margin: 0;
      list-style-type: none;
      height: 30px;
      line-height: 30px;
      &.selected {
        color: @success;
        font-weight: bold;
        position: relative;
        &:before {
          content: "✔";
          position: absolute;
          left: -20px;
        }
      }
    }
  }
}
</style>