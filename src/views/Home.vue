<template>
  <div class="home">
    {{$store.user}} Hello! {{l}} {{online.length}} {{offline.length}} {{alarm.length}}

  </div>
</template>
<script>
/* eslint-disable */
export default {
  created() {
    var that = this;
    // var x = new Uint8Array(
    //   "126, 2, 0, 0, 59, 1, 0, 0, 5, 130, 152, 20, 117, 0, 0, 0, 0, 0, 12, 0, 3, 2, 80, 69, 192, 6, 247, 105, 65, 0, 0, 1, 104, 0, 88, 24, 16, 1, 1, 4, 32, 1, 4, 0, 9, 4, 131, 2, 2, 0, 150, 3, 2, 1, 94, 37, 4, 0, 0, 0, 0, 42, 2, 0, 0, 48, 1, 31, 225, 2, 10, 214, 1, 126".split(
    //     ","
    //   )
    // );
    // var x0704 = new Uint8Array(
    //   JSON.parse(
    //     "[126,7,4,1,57,1,68,1,72,65,130,1,2,0,5,1,0,60,0,0,0,0,0,12,0,195,2,91,32,236,6,244,196,16,0,81,0,0,0,245,24,8,41,21,17,50,1,4,1,19,235,151,2,2,0,0,3,2,0,0,37,4,0,0,0,0,43,4,0,0,0,0,48,1,31,49,1,17,0,60,0,0,0,0,0,12,0,195,2,91,32,236,6,244,196,16,0,81,0,0,0,245,24,8,41,21,18,3,1,4,1,19,235,151,2,2,0,0,3,2,0,0,37,4,0,0,0,0,43,4,0,0,0,0,48,1,31,49,1,18,0,60,0,0,0,0,0,12,0,195,2,91,32,236,6,244,196,16,0,81,0,0,0,245,24,8,41,21,18,50,1,4,1,19,235,151,2,2,0,0,3,2,0,0,37,4,0,0,0,0,43,4,0,0,0,0,48,1,31,49,1,15,0,60,0,0,0,0,0,12,0,195,2,91,32,236,6,244,196,16,0,81,0,0,0,245,24,8,41,21,19,3,1,4,1,19,235,151,2,2,0,0,3,2,0,0,37,4,0,0,0,0,43,4,0,0,0,0,48,1,31,49,1,15,0,60,0,0,0,0,0,12,0,195,2,91,32,236,6,244,196,16,0,81,0,0,0,245,24,8,41,21,19,50,1,4,1,19,235,151,2,2,0,0,3,2,0,0,37,4,0,0,0,0,43,4,0,0,0,0,48,1,31,49,1,15,110,126]"
    //   )
    // );
    // var uint8array = new Uint8Array(
    //   "126,2,0,0,42,0x01,0x36,0x23,0x35,0x08,0x51,81,9,0,8,0,0,0,0,0,3,2,85,9,76,6,245,3,88,0,0,2,88,0,4,24,1,3,25,21,32,1,4,0,0,0,0,2,2,0,6,3,2,0,7,158,126,126,2,0,10,42,1,49,1,1,16,18,81,9,0,8,0,0,0,0,0,3,2,85,9,76,6,245,3,88,0".split(
    //     ","
    //   )
    // );
    // var uint8array1 = new Uint8Array(
    //   "0,2,88,0,4,24,1,3,25,21,32,1,4,0,0,0,0,2,2,0,6,3,2,0,7,158,126".split(
    //     ","
    //   )
    // );
    // var uint8array2 = new Uint8Array(
    //   "126,2,0,0,42,1,49,1,1,16,18,81,9,0,8,0,0,0,0,0,3,2,85,9,76,6,245".split(
    //     ","
    //   )
    // );
    // var uint8array3 = new Uint8Array(
    //   "3,88,0,0,2,88,0,4,24,1,3,25,21,32,1,4,0,0,0,0,2,2,0,6,3,2,0,7,158,126,126,2,0,0,42,1,49,1,1,16,18,81,9,0,8,0,0,0,0,0,3,2,85,9,76,6,245,3,88,0,0,2,88,0,4,24,1,3,25,21,32,1,4,0,0,0,0,2,2,0,6,3,2,0,7,158,126,126,2,0,0,42,1,49,1,1,16,18,81,9,0,8,0".split(
    //     ","
    //   )
    // );
    // var dict = {};
    // for (var i = 0; i < 200000; i++) {
    //   dict[i] = {
    //     a: i,
    //     b: i.toString().repeat(10),
    //     lang: 39.3,
    //     long: 116.5
    //   };
    // }
    // var online = [];
    // var offline = [];
    // var alarm = [];
    // function t() {
    //   online = [];
    //   offline = [];
    //   alarm = [];
    //   for (var key in dict) {
    //     var random = parseInt(Math.random() * 10);
    //     if (random < 3) {
    //       online.push(key);
    //       continue;
    //     }
    //     if (random < 5) {
    //       offline.push(key);
    //       continue;
    //     }
    //     if (random < 10) {
    //       alarm.push(key);
    //       continue;
    //     }
    //   }
    // }
    // setInterval(() => {
    //   t();
    //   // console.log(online.length);
    //   // console.log(offline.length);
    //   // console.log(alarm.length);
    //   this.$set(this.$data, "online", online);
    //   this.$set(this.$data, "offline", online);
    //   this.$set(this.$data, "alarm", online);
    // }, 1000);

    // var socketDataWorker = new Worker("/map/worker-socket.js");
    // socketDataWorker.postMessage(new Uint8Array(uint8array));
    // socketDataWorker.postMessage(new Uint8Array(uint8array1));
    // socketDataWorker.postMessage(new Uint8Array(x));
    // socketDataWorker.postMessage(x0704);

    // socketDataWorker.onmessage = event => {
    //   console.log(event.data);
    // };

    // var request = window.indexedDB.open("BEIDOU", 1);
    // var db = null;
    // request.onerror = function(event) {
    //   // Do something with request.errorCode!
    // };
    // request.onsuccess = function(event) {
    //   db = event.target.result;
    //   // Do something with request.result!
    //   dbSuccess();
    // };
    // request.onupgradeneeded = function(event) {
    //   // 更新对象存储空间和索引 ....
    //   var objectStore = event.currentTarget.result.createObjectStore(
    //     "positions",
    //     {
    //       keyPath: "sim_id"
    //     }
    //   );
    //   //       // 创建一个索引来通过 name 搜索客户。
    //   // // 可能会有重复的，因此我们不能使用 unique 索引。
    //   // objectStore.createIndex("name", "name", { unique: false });

    //   // // 创建一个索引来通过 email 搜索客户。
    //   // // 我们希望确保不会有两个客户使用相同的 email 地址，因此我们使用一个 unique 索引。
    //   // objectStore.createIndex("email", "email", { unique: true });
    // };
    // function dbSuccess() {
    //   if (db) {
    //     var keyRangeValue = IDBKeyRange.bound("13000000", "1");
    //     var transaction = db.transaction(["positions"], "readwrite");
    //     var objectStore = transaction.objectStore("positions");
    //     // objectStore.add({ sim_id: "123" });
    //     // objectStore.delete("123");
    //     // objectStore.get("1479242538").onsuccess = event => {
    //     //   var a = event.target.result;
    //     //   a.msgId = 11111;
    //     //   objectStore.add(a);
    //     //   console.log(objectStore.openCursor());
    //     // };

    //     objectStore.openCursor(keyRangeValue).onsuccess = function(event) {
    //       console.log(event);
    //     };
    //   }
    // }

    // window.dict = {};
    // window.ll = [];
    // var socketDataWorker = new Worker("/map/worker-socket.js");

    var ws = new WebSocket("ws://localhost:9999/");
    ws.binaryType = "arraybuffer";
    var socketDataWorker = new Worker("/map/worker-socket.js");
    ws.onmessage = msg => {
      socketDataWorker.postMessage(new Uint8Array(msg.data));
    };
    // socketDataWorker.postMessage(new Uint8Array(uint8array));
    // socketDataWorker.postMessage(new Uint8Array(uint8array1));
    // socketDataWorker.onmessage = event => {
    //   console.log(event.data);
    //   var msg = event.data;
    //   if (db && msg.sim_id) {
    //     var transaction = db.transaction(["positions"], "readwrite");
    //     var objectStore = transaction.objectStore("positions");
    //     objectStore.add(msg);
    //   }
    //   // if (msg.sim_id) {
    //   //   dict[msg.sim_id] = msg;
    //   // }
    //   // ll.push(msg);
    // };
    // setInterval(() => {
    //   this.l = window.ll.length;
    //   //ws.close();
    // }, 10);
  },
  data() {
    return {
      online: [],
      offline: [],
      alarm: [],
      l: 0,
      list: []
    };
  },
  components: {},
  methods: {}
};
</script>