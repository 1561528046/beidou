<template>
  <div style="padding-top:20px;" class="log-container">
    <div class="log">
      <ul>
        <li v-for="log in logs" :key="log.id">
          {{log}}
        </li>
      </ul>
      <el-button @click="clearDB" size="mini" class="remove">清空</el-button>
    </div>

    <div class="send">
      指令类型：
      <el-select style="width:40%; margin-bottom:10px;" v-model="instruction" size="small">
        <el-option v-for="(item,index) in instruction809" :key="index" :value="index" :label="item.title"></el-option>
      </el-select>
      <el-input style="margin-bottom:10px;" type="textarea" :rows="4" placeholder="请输入内容" v-model="textarea">
      </el-input>
      <pre>
          {{desc}}
        </pre>
      <el-button style="display:block;margin:0 auto;" @click="send" type="primary" size="small">发送</el-button>
    </div>

  </div>
</template>
<style lang="less">
.log-container {
  .remove {
    position: absolute;
    z-index: 2;
    right: 30px;
    bottom: 10px;
  }
  .send {
    position: absolute;
    width: 45%;
    right: 5%;
  }
  .log {
    font-size: 13px;
    position: absolute;
    width: 45%;
    left: 0;
    top: 0;
    height: 100%;
    background: #000;
    color: rgb(192, 192, 192);
  }
  ul {
    height: 100%;
    overflow: auto;
    font-family: "点阵字体";
    padding: 10px 0;
    box-sizing: border-box;
  }
  li {
    border-bottom: 1px solid #888;
    word-wrap: break-word;
    padding: 8px 10px;
  }
  pre {
    font-size: 12px;
  }
}
</style>
<script>
import db from "@/utils/indexedDB.js";
var dbObject = null;
import { instruction809 } from "@/utils/809.js";
export default {
  data() {
    return {
      textarea: "",
      desc: "",
      logs: [],
      instruction: "",
      instruction809: []
    };
  },
  created() {
    db.then(dbObj => {
      setInterval(() => {
        dbObject = dbObj;
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
    this.$set(this.$data, "instruction809", instruction809);
  },
  watch: {
    instruction: function() {
      this.$set(
        this.$data,
        "textarea",
        JSON.stringify(this.instruction809[this.instruction].body, null, 4)
      );
      this.$set(this.$data, "desc", this.instruction809[this.instruction].desc);
    }
  },
  methods: {
    clearDB() {
      dbObject.removeAll();
    },
    send() {
      this.$instruction.send(this.textarea);
    }
  }
};
</script>
