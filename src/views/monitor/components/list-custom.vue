<template>
    <div style="padding-top:20px;">
        <div style="width:40%; height:100px;margin:0 auto;">
            <el-input style="margin-bottom:10px;" type="textarea" :rows="4" placeholder="请输入内容" v-model="textarea">
            </el-input>
            <el-button style="display:block;margin:0 auto;" @click="send" type="primary" size="small">发送</el-button>
        </div>
    </div>
</template>
<script>
export default {
  data() {
    return {
      textarea: ""
    };
  },
  methods: {
    send() {
      this.$instruction.send(this.textarea);
    }
  }
};
</script>