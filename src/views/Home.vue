<template>
  <div class="home">
    {{$store.user}} Hello! {{l}}

  </div>
</template>
<script>
/* eslint-disable */
export default {
  created() {
    var uint8array = new Uint8Array(
      "126,2,0,0,42,0x01,0x36,0x23,0x35,0x08,0x51,81,9,0,8,0,0,0,0,0,3,2,85,9,76,6,245,3,88,0,0,2,88,0,4,24,1,3,25,21,32,1,4,0,0,0,0,2,2,0,6,3,2,0,7,158,126,126,2,1,10,42,1,49,1,1,16,18,81,9,0,8,0,0,0,0,0,3,2,85,9,76,6,245,3,88,0".split(
        ","
      )
    );
    var uint8array1 = new Uint8Array(
      "0,2,88,0,4,24,1,3,25,21,32,1,4,0,0,0,0,2,2,0,6,3,2,0,7,158,126".split(
        ","
      )
    );
    var uint8array2 = new Uint8Array(
      "126,2,0,0,42,1,49,1,1,16,18,81,9,0,8,0,0,0,0,0,3,2,85,9,76,6,245".split(
        ","
      )
    );
    var uint8array3 = new Uint8Array(
      "3,88,0,0,2,88,0,4,24,1,3,25,21,32,1,4,0,0,0,0,2,2,0,6,3,2,0,7,158,126,126,2,0,0,42,1,49,1,1,16,18,81,9,0,8,0,0,0,0,0,3,2,85,9,76,6,245,3,88,0,0,2,88,0,4,24,1,3,25,21,32,1,4,0,0,0,0,2,2,0,6,3,2,0,7,158,126,126,2,0,0,42,1,49,1,1,16,18,81,9,0,8,0".split(
        ","
      )
    );

    var request = window.indexedDB.open("BEIDOU", 1);
    var db = null;
    request.onerror = function(event) {
      // Do something with request.errorCode!
    };
    request.onsuccess = function(event) {
      db = event.target.result;
      // Do something with request.result!
    };
    request.onupgradeneeded = function(event) {
      // 更新对象存储空间和索引 ....
      var objectStore = event.currentTarget.result.createObjectStore(
        "positions",
        {
          keyPath: "sim_id"
        }
      );
      //       // 创建一个索引来通过 name 搜索客户。
      // // 可能会有重复的，因此我们不能使用 unique 索引。
      // objectStore.createIndex("name", "name", { unique: false });

      // // 创建一个索引来通过 email 搜索客户。
      // // 我们希望确保不会有两个客户使用相同的 email 地址，因此我们使用一个 unique 索引。
      // objectStore.createIndex("email", "email", { unique: true });
    };
    setTimeout(() => {
      if (db) {
        var transaction = db.transaction(["positions"], "readwrite");
        var objectStore = transaction.objectStore("positions");
        // objectStore.add({ sim_id: "123" });
        // objectStore.delete("123");
        objectStore.get("1479242538").onsuccess = event => {
          var a = event.target.result;
          a.msgId = 11111;
          objectStore.add(a);
          console.log(objectStore.openCursor());
        };
      }
    }, 100);

    window.dict = {};
    window.ll = [];
    var socketDataWorker = new Worker("/map/worker-socket.js");

    var ws = new WebSocket("ws://localhost:9999/");
    ws.binaryType = "arraybuffer";
    ws.onmessage = msg => {
      socketDataWorker.postMessage(new Uint8Array(msg.data));
    };
    socketDataWorker.postMessage(new Uint8Array(uint8array));
    socketDataWorker.postMessage(new Uint8Array(uint8array1));
    socketDataWorker.onmessage = event => {
      console.log(event.data);
      var msg = event.data;
      if (db && msg.sim_id) {
        var transaction = db.transaction(["positions"], "readwrite");
        var objectStore = transaction.objectStore("positions");
        objectStore.add(msg);
      }
      // if (msg.sim_id) {
      //   dict[msg.sim_id] = msg;
      // }
      // ll.push(msg);
    };
    setInterval(() => {
      this.l = window.ll.length;
      //ws.close();
    }, 10);
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