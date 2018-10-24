<template>
  <el-form ref="baseForm" :model="form" label-width="80px" @submit.native.prevent>
    <el-form-item label="标志" required>
      <el-checkbox-group v-model="flag">
        <el-checkbox :label="1">紧急</el-checkbox>
        <el-checkbox :label="8">终端 TTS 播读</el-checkbox>
        <el-checkbox :label="16">广告屏显示</el-checkbox>
      </el-checkbox-group>
      <!-- <el-select v-model="form.AskFlag">
        <el-option label="紧急" value="1"></el-option>
        <el-option label="终端 TTS 播读" value="8"></el-option>
        <el-option label="广告屏显示" value="16"></el-option>
      </el-select> -->
    </el-form-item>
    <el-form-item label="问题标题" required>
      <el-input v-model="form.AskText"></el-input>
    </el-form-item>

    <ul class="anwser-list">
      <li v-for="(anwser,index) in form.CandidateAnswers" :key="index">
        <el-form-item :label="'答案'+index">
          <el-input v-model="form.CandidateAnswers[index].AnswerContent">
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
      flag: [],
      form: {
        SimID: this.$utils.formatSim(this.vehicle.sim_id),
        MessageID: "x8302",
        AskFlag: "",
        AskText: "",
        CandidateAnswers: [
          // {AnswerID:1,AnswerContent:"asf-|%12&^dasdf"},
        ]
      }
    };
  },
  watch: {
    flag: function() {
      var result = 0;
      if (this.flag.length) {
        result = this.flag.reduce((a, b) => {
          return a + b;
        });
      }
      this.form.AskFlag = result;
    }
  },
  props: ["vehicle"],
  created() {
    this.$instruction.on("x8302", this.vehicle.sim_id, evt => {
      var msg = JSON.parse(evt.data);
      if (msg.code == 0) {
        this.$message.success("执行成功！");
        console.log(this.$store);
        this.$store.commit("QA/addAsk", msg);
      } else {
        this.$message.warning("执行失败");
      }
      this.loading = false;
    });
  },
  methods: {
    add() {
      this.form.CandidateAnswers.push({
        AnswerID: this.form.CandidateAnswers.length,
        AnswerContent: ""
      });
    },
    remove(index) {
      this.form.CandidateAnswers.splice(index, 1);
    },
    messageSuccess() {
      this.$message.success("执行成功！");
    },
    formSubmit() {
      this.$instruction.send(JSON.stringify(this.form));
      // this.$refs.baseForm.validate(isVaildate => {
      //   if (isVaildate) {

      //   }
      // });
    }
  },
  beforeDestroy() {
    this.$instruction.offAll("x8302", this.$props.vehicle.sim_id);
  }
};
</script>
<style>
</style>