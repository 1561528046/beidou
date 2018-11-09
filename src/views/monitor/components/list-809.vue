<template>
  <div>
    <el-table :data="list" size="mini">
      <el-table-column prop="ParentName" label="上级平台名称"></el-table-column>
      <el-table-column prop="Question" label="问题"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <template v-if="!scope.row.Answer">
            <el-input v-model="answer">
              <el-button size="mini" @click="send(scope.row)" slot="append">确定发送</el-button>
            </el-input>
          </template>
          <template v-if="scope.row.Answer">
            已答复：{{scope.row.Answer}}
          </template>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>
<script>
export default {
  data() {
    return {
      answer: "",
      showBody: false
    };
  },
  computed: {
    list: function() {
      return [
        {
          ParentName: "上级平台1",
          SimID: "014641616161",
          QuestionId: "0",
          Question: "1+1=",
          Answer: ""
        },
        {
          ParentName: "上级平台2",
          SimID: "014641616161",
          QuestionId: "0",
          Question: "2+1=",
          Answer: "3"
        }
      ];
      //return $store.getters['x809/list'];
    }
  },
  created() {},
  methods: {
    send() {},
    remove(row) {
      this.$store.commit("x0900/remove", row.id);
    }
  }
};
</script>
