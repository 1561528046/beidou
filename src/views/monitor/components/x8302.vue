<template>
  <el-form ref="form" :model="form" label-width="80px" @submit.native.prevent>
    <el-form-item label="标志" required>
      <el-select v-model="form.Body.AskFlag">
        <el-option label="紧急" value="1"></el-option>
        <el-option label="终端 TTS 播读" value="8"></el-option>
        <el-option label="广告屏显示" value="16"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="问题标题">
      <el-input v-model="form.Body.AskText"></el-input>
    </el-form-item>

    <ul class="anwser-list">
      <li v-for="(anwser,index) in form.Body.CandidateAnswers" :key="index">
        <el-form-item :label="'答案'+index">
          <el-input v-model="form.Body.CandidateAnswers[index].AnswerContent">
            <el-button slot="append" icon="el-icon-close" @click="remove(index)"></el-button>
          </el-input>
        </el-form-item>
      </li>
      <li class="add">
        <el-button @click="add"><i class="el-icon-plus"></i>添加答案</el-button>
      </li>
    </ul>

    <el-form-item>
      <el-button type="primary" native-type="submit" @click="formSubmit">立即创建</el-button>
    </el-form-item>
  </el-form>
</template>
<style lang="less" scoped>
.anwser-list {
  li {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }
  .add {
    text-align: center;
  }
}
</style>
<script>
export default {
  data() {
    return {
      form: {
        MessageId: "x8302",
        Body: {
          AskFlag: "1",
          AskText: "123123",
          CandidateAnswers: [
            // {AnswerID:1,AnswerContent:"asf-|%12&^dasdf"},
          ]
        }
      }
    };
  },
  props: ["vehicle"],
  created() {
    this.$instruction.on("x0302", this.vehicle.sim_id, msg => {
      console.log(msg);
    });
  },
  methods: {
    add() {
      this.form.Body.CandidateAnswers.push({
        AnswerID: this.form.Body.CandidateAnswers.length,
        AnswerContent: ""
      });
    },
    remove(index) {
      this.form.Body.CandidateAnswers.splice(index, 1);
    },
    messageSuccess() {
      this.$message.success("执行成功！");
    },
    formSubmit() {
      //"x8302|1|afdasdfasfd|1,asdfasdfa;$"
      // var sim_id = this.$utils.formatSim(this.vehicle.sim_id);
      // var arr = [
      //   "^x8302",
      //   this.form.type,
      //   this.form.Q,
      //   this.formatAnwser(),
      //   sim_id
      // ];
      // this.$instruction.send(arr.join("|") + "$");
      this.$instruction.send(JSON.stringify(this.form));
    }
  },
  beforeDestroy() {
    this.$instruction.offAll("x8202", this.$props.vehicle.sim_id);
  }
};
</script>
<style>
</style>