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
    //A B1,B2
    //A1,A2 B
    //AB,CD

    //1、处理粘包

    var RS = 0x7e; //分隔符
    var cacheList = new Uint8Array(); //缓存粘包数据
    function format(buffer) {
      // debugger;
      var result = []; //返回的消息集合
      var bufView = new Uint8Array(buffer);
      if (bufView[0] == 0x7e) {
        cacheList = new Uint8Array(); //重置cachelist
        //先找到第二个7e
        var secondRSIndex = bufView.indexOf(RS, 1); //从第二位开始找
        if (secondRSIndex == -1) {
          //如果没有找到第二个分隔符,加入cache
          cacheList = bufView;
        } else {
          //找到分隔符，判断是不是最后一位，如果是，那么就是完整数据包，如果不是，截断，剩下的放入cache
          if (secondRSIndex == bufView.length - 1) {
            result.push(bufView);
          } else {
            if (bufView[secondRSIndex + 1] == RS) {
              //如果截断剩余的数据开头不是0x7e 忽略
              cacheList = bufView.slice(secondRSIndex + 1);
            }
            result.push(bufView.slice(0, secondRSIndex + 1));
          }
        }
      } else {
        //如果开头不是0x7e,找到第一个0x7e，如果没有找到，整个放入cache
        var firstRSIndex = bufView.indexOf(RS);
        if (firstRSIndex == -1) {
          cacheList = concatBuffer(Uint8Array, cacheList, bufView);
        } else {
          result.push(
            concatBuffer(
              Uint8Array,
              cacheList,
              bufView.slice(0, firstRSIndex + 1)
            )
          );
          cacheList = new Uint8Array();
          if (bufView[firstRSIndex + 1] == RS) {
            //如果找到的第一个0x7e后面紧跟的还是0x7e，继续循环处理， 分割出所有的消息
            var bufView2 = bufView.slice(firstRSIndex + 1); //剩余的buf
            var RSIndex = 0;
            while (RSIndex != -1) {
              var RSIndexEnd = bufView2.indexOf(RS, RSIndex + 1); //找到第二个0x7e
              if (RSIndexEnd != -1) {
                result.push(bufView2.slice(RSIndex, RSIndexEnd + 1));
                bufView2 = bufView2.slice(RSIndexEnd + 1); //剩余的buf
                RSIndexEnd = 0;
              } else {
                cacheList = bufView2.slice(RSIndex);
              }
              RSIndex = RSIndexEnd;
            }
          }
        }
      }
      return transfer(result);
    }
    function transfer(buffer) {
      //处理转义
      var cache = new Uint8Array();
      var start = 0;
      var x7dIndex = buffer.indexOf(0x7d);
      if (x7dIndex == -1) {
        return buffer;
      }
      while (x7dIndex != -1) {
        x7dIndex = buffer.indexOf(0x7d, start);
        if (x7dIndex == -1) {
          cache = concatBuffer(Uint8Array, cache, buffer.slice(start));
        }
        if (buffer[x7dIndex + 1] == 0x02) {
          cache = concatBuffer(
            Uint8Array,
            cache,
            buffer.slice(start, x7dIndex),
            new Uint8Array([0x7e])
          );
          start = x7dIndex + 2;
        }
        if (buffer[x7dIndex + 1] == 0x01) {
          cache = concatBuffer(
            Uint8Array,
            cache,
            buffer.slice(start, x7dIndex),
            new Uint8Array([0x7d])
          );
          start = x7dIndex + 2;
        }
      }
      return cache;
    }
    function serialize(buffer) {
      var result = {};
      result.msgId = buffer.slice(1, 3);
      result.msgId = (result.msgId[0] << 8) + result.msgId[1];
      if (result.msgId == 0x0200) {
        Object.assign(result, x0200(buffer));
      }
      if (result.msgId == 0x0704) {
        x0704(buffer);
      }
      return result;
    }
    function x0200(buffer) {
      var result = {};
      result.sim_id = formatSim(buffer.slice(5, 11)); //终端手机号
      result.alarm = buffer.slice(13, 17); //报警标志
      result.state = buffer.slice(17, 21); //状态
      result.lat = buffer.slice(21, 25); //纬度
      result.lng = buffer.slice(25, 29); //经度
      result.altitude = buffer.slice(29, 31); //高程
      result.speed = buffer.slice(31, 33); //速度
      result.rotate = buffer.slice(33, 35); //方向
      result.time = buffer.slice(35, 41).map(item => {
        return item.toString(16);
      }); //时间
      return result;
    }
    function x0704() {}
    function formatSim(buffer) {
      var code = [];
      buffer.map(item => {
        code.push(item.toString(16));
      });
      return code.join("");
    }
    // function num2binary8421(num) {
    //   var binary = num.toString(2);
    //   binary = "0".repeat(8 - binary.length) + binary;
    //   var binarys = [binary.slice(0, 4), binary.slice(4, 8)];
    //   var result = "";
    //   binarys.map(item => {
    //     var bit = 0;
    //     item.split("").map((x, index) => {
    //       bit += x * [8, 4, 2, 1][index % 4];
    //     });
    //     result += bit.toString();
    //   });
    //   // console.log(result);
    //   return result;
    // }

    function concatBuffer(type, ...arrays) {
      //arrayBuffer拼装
      let totalLength = 0;
      for (let arr of arrays) {
        totalLength += arr.length;
      }
      let result = new type(totalLength);
      let offset = 0;
      for (let arr of arrays) {
        result.set(arr, offset);
        offset += arr.length;
      }
      return result;
    }
    // var x = transfer(format(uint8array)[0]);
    // console.log(serialize(x));
    // format(uint8array1);
    // format(uint8array2);
    // format(uint8array3);

    window.dict = {};
    window.ll = [];
    var ws = new WebSocket("ws://localhost:9999/");
    ws.binaryType = "arraybuffer";
    ws.onmessage = msg => {
      var arr = format(new Uint8Array(msg.data));
      arr.map(item => {
        var msg = serialize(item);
        if (msg.sim_id) {
          dict[msg.sim_id] = msg;
        }
        ll.push();
      });

      // if (ll.length == 2) {
      //   ws.close();
      //   this.l = window.ll.length;
      // }
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