<template>
  <div>
    <el-table :data="$store.getters['x809In/list9301']" size="mini">
      <!-- <el-table-column prop="OBJECT_TYPE" label="查岗对象" :formatter="getOBJECT_TYPE"></el-table-column> -->
      <el-table-column prop="INFO_CONTENT" label="问题"></el-table-column>
      <el-table-column prop="INFO_ID" label="信息 ID"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <template v-if="!scope.row.answered">
            <el-input v-model="scope.row.answer" size="mini">
              <el-button size="mini" @click="send(scope.row)" slot="append">确定发送</el-button>
            </el-input>
          </template>
          <template v-if="scope.row.answered">
            已答复：{{scope.row.answer}} &#x3000; <el-button size="mini" @click="()=>{scope.row.answered = false}">重新回答</el-button>
          </template>
        </template>
      </el-table-column>
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
    },
    send(row) {
      this.$instruction.once("x1300", evt => {
        if (JSON.parse(evt.data).code == 0) {
          this.$message.success("发送成功");
          row.answered = true;
        } else {
          this.$message.warning("发送失败");
        }
      });
      row.answered = true;
      this.$instruction.send(
        JSON.stringify({
          MSG_ID: "x1300",
          DATA_TYPE: 0x1301,
          OBJECT_TYPE: row.OBJECT_TYPE || "",
          OBJECT_ID: row.OBJECT_ID || "",
          INFO_ID: row.INFO_ID || "",
          INFO_CONTENT: row.answer || ""
        })
      );
    }
  }
};
</script>
