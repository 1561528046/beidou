<template>
  <div class="home">
    {{$store.user}} Hello! {{l}}

  </div>
</template>
<script>
/* eslint-disable */
export default {
  created() {
    // var list = [];
    // for (var i = 0; i < 200000; i++) {
    //   list.push({ license: "冀R" + i, lat: i, lng: i, time: i });
    // }
    // this.$set(this.$data, "list", Object.freeze(list));
    // 打开一个WebSocket:
    window.ll = [];
    var ws = new WebSocket("ws://localhost:3000/");
    ws.binaryType = "arraybuffer";
    // 响应onmessage事件:
    ws.onmessage = function(msg) {
      // console.log(msg);
      ll.push(new Int16Array(msg.data));
    };
    setInterval(() => {
      this.l = window.ll.length;
    }, 100);
  },
  data() {
    return {
      l: 0,
      list: []
    };
  },
  components: {},
  methods: {}
};
</script>