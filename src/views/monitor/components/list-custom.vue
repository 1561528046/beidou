<template>
  <div style="padding-top:20px;" class="log-container">
    <ul class="log">
      <li v-for="log in logs" :key="log.id">
        {{log}}
      </li>
    </ul>
    <div class="send">
      <el-input style="margin-bottom:10px;" type="textarea" :rows="4" placeholder="请输入内容" v-model="textarea">
      </el-input>
      <el-button style="display:block;margin:0 auto;" @click="send" type="primary" size="small">发送</el-button>
    </div>

  </div>
</template>
<style lang="less">
.log-container {
  .send {
    position: absolute;
    width: 45%;
    right: 5%;
  }
  .log {
    font-size: 12px;
    position: absolute;
    width: 45%;
    left: 0;
    top: 0;
    height: 100%;
    overflow: auto;
    background: #001529;
    color: #fff;
    font-family: "宋体";
  }
  li {
    border-bottom: 1px solid #ddd;
    padding-bottom: 5px;
    margin-bottom: 10px;
    word-wrap: break-word;
  }
}
</style>
<script>
import db from "@/utils/indexedDB.js";
export default {
  data() {
    return {
      textarea: "",
      logs: []
    };
  },
  created() {
    db.then(dbObj => {
      setInterval(() => {
        dbObj.readAll().then(res => {
          this.$set(this.$data, "logs", res);
        });
      }, 1000);
    });
  },
  methods: {
    send() {
      this.$instruction.send(this.textarea);
    }
  }
};
</script>