<template>
  <div class="home">
    {{$store.user}} Hello! {{l}}

  </div>
</template>
<script>
export default {
  created() {
    // window.ll = [];
    // var ws = new WebSocket("ws://localhost:9999/");
    // ws.binaryType = "arraybuffer";

    // ws.onmessage = msg => {
    //   ll.push(msg);
    //   if (ll.length == 2) {
    //     ws.close();
    //     this.l = window.ll.length;
    //   }
    // };

    // // setTimeout(() => {
    // //   this.l = window.ll.length;
    // //   ws.close();
    // // }, 2000);
    var uint8array = new Uint8Array(
      "126,2,0,0,42,1,49,1,1,16,18,81,9,0,8,0,0,0,0,0,3,2,85,9,76,6,245,3,88,0,0,2,88,0,4,24,1,3,25,21,32,1,4,0,0,0,0,2,2,0,6,3,2,0,7,158,126".split(
        ","
      )
    );

    function format(buffer) {}
    format(uint8array);
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