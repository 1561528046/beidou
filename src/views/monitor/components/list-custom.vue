<template>
  <div style="padding-top:20px;" class="log-container">
    <!-- <ul class="log">
      <li v-for="log in logs" :key="log.id">
        {{log}}
      </li>
    </ul> -->
    <div class="send">
      指令类型：
      <el-select style="width:40%; margin-bottom:10px;" v-model="instruction" size="small">
        <el-option v-for="(item,index) in instruction809" :key="index" :value="index" :label="item.title"></el-option>
      </el-select>
      <el-input style="margin-bottom:10px;" type="textarea" :rows="4" placeholder="请输入内容" v-model="textarea">
      </el-input>
      <el-button style="display:block;margin:0 auto;" @click="send" type="primary" size="small">发送</el-button>
    </div>

  </div>
</template>
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
  methods: {
    send() {}
  }
};
</script>
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
  methods: {
    send() {}
  }
};
</script>