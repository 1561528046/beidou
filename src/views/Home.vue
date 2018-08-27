<template>
  <div class="home">
    {{$store.user}} Hello! {{l}}

  </div>
</template>
<script>
export default {
  created() {
    // var list = [];
    // for (var i = 0; i < 200000; i++) {
    //   list.push({ license: "冀R" + i, lat: i, lng: i, time: i });
    // }
    // this.$set(this.$data, "list", Object.freeze(list));
    // 打开一个WebSocket:
    // var ll = "";
    // var ws = new WebSocket("ws://localhost:3000/");
    // // 响应onmessage事件:
    // ws.onmessage = function(msg) {
    //   ll += msg;
    //   msg;
    //   // console.log(msg);
    // };
    // setInterval(() => {
    //   console.log(ll.length);
    // }, 1000);
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