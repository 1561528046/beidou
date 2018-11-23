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
<<<<<<< HEAD
<script>
import { instruction809 } from "@/utils/809.js";
export default {
  created() {
    this.$set(this.$data, "instruction809", instruction809);
  },
  data() {
    return {
      textarea: "",
      instruction: "",
      instruction809: []
    };
  },
  watch: {
    instruction: function() {
      this.$set(
        this.$data,
        "textarea",
        JSON.stringify(this.instruction809[this.instruction].body)
      );
    }
  },
  methods: {
    send() {
      this.$instruction.send(this.textarea);
    }
  }
};
</script>
=======
>>>>>>> f1a7c649d693cd344e4725514549285e72197983
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
<<<<<<< HEAD
</style>
=======
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
        dbObj
          .readAll()
          .then(res => {
            this.$set(this.$data, "logs", res);
          })
          .catch(err => {
            console.log(err);
          });
      }, 1000);
    }).catch(err => {
      console.log(err);
    });
  },
  methods: {
    send() {
      this.$instruction.send(this.textarea);
    }
  }
};
</script>
>>>>>>> f1a7c649d693cd344e4725514549285e72197983
