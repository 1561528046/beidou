//处理socket数据
//1、处理粘包
//粘包可分为以下几种 A B均为整个数据包 A1 A2...为A拆分成2个包
//A B1,B2
//A1,A2 B
//AB,CD
var DICT = {
  ALARM: {
    "1": "紧急报警",
    "2": "超速报警",
    "4": "疲劳驾驶",
    "8": "危险预警",
    "16": "GNSS 模块发生故障",
    "32": "GNSS 天线未接或被剪断",
    "64": "GNSS 天线短路",
    "128": "终端主电源欠压",
    "256": "终端主电源掉电",
    "512": "终端 LCD 或显示器故障",
    "1024": "TTS 模块故障",
    "2048": "摄像头故障",
    "4096": "IC 卡模块故障",
    "8192": "超速预警",
    "16384": "疲劳驾驶预警",
    "262144": "当天累计驾驶超时",
    "524288": "超时停车",
    "1048576": "进出区域",
    "2097152": "进出路线",
    "4194304": "路段行驶时间不足/过长",
    "8388608": "路线偏离报警",
    "16777216": "车辆 VSS 故障",
    "33554432": "车辆油量异常",
    "67108864": "车辆被盗",
    "134217728": "车辆非法点火",
    "268435456": "车辆非法位移",
    "536870912": "碰撞预警",
    "1073741824": "侧翻预警",
    "2147483648": "非法开门报警"
  },
  getx30: function(sign) {
    var xh = "弱";
    if (sign > 10 && sign < 21) {
      xh = "中";
    }
    if (sign > 20) {
      xh = "强";
    }
    return xh;
  },
  getAlarm: function(codes) {
    var num = buffer2number(codes);
    // console.log(num);
    var str = [];
    for (var key in DICT.ALARM) {
      if ((num & key) == key) {
        str.push(DICT.ALARM[key]);
      }
    }
    return str.join(",");
  }
};

self.onmessage = function(e) {
  format(e.data).map(item => {
    self.postMessage(serialize(item));
  });
};
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
        concatBuffer(Uint8Array, cacheList, bufView.slice(0, firstRSIndex + 1))
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

//ArrayBuffer转10进制
function buffer2number(typedBuffer) {
  var totalLength = typedBuffer.length;
  return typedBuffer.reduceRight((total, num, index) => {
    if (index == totalLength - 1) {
      return num << ((totalLength - index - 1) * 8);
    }
    return total + (num << ((totalLength - index - 1) * 8));
  }, 0);
}
//0200定位数据
function x0200(buffer) {
  var result = {};
  result.sim_id = formatSim(buffer.slice(5, 11)); //终端手机号
  result.alarm = DICT.getAlarm(buffer.slice(13, 17)); //报警标志
  result.state =
    (buffer[17] << 24) + (buffer[14] << 16) + (buffer[15] << 8) + buffer[16]; //  buffer.slice(17, 21); //状态
  result.lat =
    ((buffer[21] << 24) + (buffer[22] << 16) + (buffer[23] << 8) + buffer[24]) /
    1000000.0; //buffer.slice(21, 25); //纬度
  result.lng =
    ((buffer[25] << 24) + (buffer[26] << 16) + (buffer[27] << 8) + buffer[28]) /
    1000000.0; //buffer.slice(25, 29); //经度
  if (result.lng < result.lat) {
    [result.lng, result.lat] = [result.lat, result.lng];
  }
  result.altitude = (buffer[29] << 8) + buffer[30]; //buffer.slice(29, 31); //高程
  result.speed = (buffer[31] << 32) + buffer[30]; //buffer.slice(31, 33); //速度
  result.rotate = (buffer[33] << 8) + buffer[34]; // buffer.slice(33, 35); //方向
  result.time = formatTime(buffer.slice(35, 41)); //时间
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
function formatTime(buffer) {
  var code = [];
  buffer.map(item => {
    var _item = item.toString(16);
    _item = "0".repeat(2 - _item.length) + _item;
    code.push(_item);
  });
  var date = "20" + code.join("");
  return (
    date.substring(0, 4) +
    "-" +
    date.substring(4, 6) +
    "-" +
    date.substring(6, 8) +
    " " +
    date.substring(8, 10) +
    ":" +
    date.substring(10, 12) +
    ":" +
    date.substring(12, 14)
  );
}
