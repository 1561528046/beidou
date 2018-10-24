<template>
  <div class="QA">
    <el-table :data="$store.getters['QA/askList']" size="mini">
      <el-table-column type="expand">
        <template slot-scope="props">
          <div class="anwser-box">
            <h4>答案列表</h4>
            <ul class="anwser-list">
              <li v-for="answer in props.row.CandidateAnswers" :key="answer.AnswerID" :class="{selected:props.row.answer.AnswerID == answer.AnswerID}">
                答案{{answer.AnswerID}} - {{answer.AnswerContent}}
              </li>
            </ul>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="SimID" label="sim id"></el-table-column>
      <el-table-column prop="AskText" label="问题"></el-table-column>
      <el-table-column prop="AskFlag" label="问题标志" :formatter="formatAskFlag"></el-table-column>
      <el-table-column label="状态" :formatter="formatState"></el-table-column>
      <el-table-column prop="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="remove(scope.row)">删除</el-button>
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
    this.$instruction.on("x0302", evt => {
      this.$store.commit("QA/answer", JSON.parse(evt.data));
    });
  },
  methods: {
    remove(row) {
      this.$store.commit("QA/remove", row.SimID);
    },
    formatState(row) {
      var result = "未答复";
      if (row.answer) {
        result = "已答复";
      }
      return result;
    },
    formatAskFlag(row) {
      var dict = {
        "1": "紧急",
        "8": "终端 TTS 播读",
        "16": "广告屏显示"
      };
      var result = [];
      for (var key in dict) {
        if ((row.AskFlag & key) == key) {
          result.push(dict[key]);
        }
      }
      return result.join(",") || "--";
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