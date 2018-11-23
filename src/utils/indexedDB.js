export default new Promise(function(resolve, reject) {
  var request = indexedDB.open("BEIDOU");
  var dbObj = {
    db: null,
    add: function(data) {
      var request = this.db
        .transaction(["log"], "readwrite")
        .objectStore("log")
        .add(data);

      request.onsuccess = function() {
        // console.log("数据写入成功");
      };

      request.onerror = function() {
        // console.log("数据写入失败");
      };
    },
    readAll: function(MessageID) {
      return new Promise(resolve => {
        var objectStore = this.db.transaction("log").objectStore("log");
        var results = [];
        if (MessageID) {
          objectStore = objectStore.index("MessageID");
        }
        var range = MessageID ? IDBKeyRange.only(MessageID) : null;
        var cursors = objectStore.openCursor(range, "prev");
        cursors.onsuccess = function(event) {
          var cursor = event.target.result;
          if (cursor) {
            results.push(cursor.value);
            cursor.continue();
          } else {
            resolve(results);
          }
        };
        cursors.onerror = function(err) {
          reject(err);
        };
      });
    }
  };
  request.onupgradeneeded = function(event) {
    var db = event.target.result;
    var objectStore;
    if (!db.objectStoreNames.contains("log")) {
      objectStore = db.createObjectStore("log", {
        keyPath: "id",
        autoIncrement: true
      });
      objectStore.createIndex("MessageID", "MessageID", {
        unique: false
      });
    }
  };

  request.onsuccess = function() {
    dbObj.db = request.result;
    resolve(dbObj);
  };
  request.onerror = function(err) {
    // reject(err);
    console.log(err);
  };
});
