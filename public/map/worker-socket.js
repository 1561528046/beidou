//处理socket数据
//1、处理粘包
//粘包可分为以下几种 A B均为整个数据包 A1 A2...为A拆分成2个包
//A B1,B2
//A1,A2 B
//AB,CD

self.onmessage = function(e) {
  format(e.data).map(item => {
    var results = serialize(item);
    results.map(result => {
      if (result.lng < 0) {
        // result.buffer = e.data;
      }
      self.postMessage(result);
    });
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
  var results = [];
  result.map(item => {
    results.push(transfer(item));
  });
  return results;
}

function transfer(buffer) {
  self.buffer = buffer;
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
  var arr = [];
  var result = {};
  result.msgId = (buffer[1] << 8) + buffer[2]; //消息ID
  result.sim_id = formatSim(buffer.slice(5, 11)); //终端手机号
  result.serial_no = (buffer[11] << 8) + buffer[12]; //消息流水号
  switch (result.msgId) {
    case 0x0200:
      arr.push(
        Object.assign(result, x0200(buffer.slice(13, buffer.length - 1)))
      );
      break;
    case 0x0201:
      arr.push(
        Object.assign(result, x0200(buffer.slice(15, buffer.length - 1)))
      );
      break;
    case 0x0704:
      var results = x0704(buffer.slice(13, buffer.length - 1));
      results.map(item => {
        arr.push(Object.assign(result, item));
      });
      break;
  }

  return arr;
}

//ArrayBuffer转10进制
// function buffer2number(typedBuffer) {
//   var totalLength = typedBuffer.length;
//   return typedBuffer.reduceRight((total, num, index) => {
//     if (index == totalLength - 1) {
//       return num << ((totalLength - index - 1) * 8);
//     }
//     return total + (num << ((totalLength - index - 1) * 8));
//   }, 0);
// }

//0200定位数据
function x0200(buffer) {
  var result = {};
  // result.alarm = DICT.getAlarm(
  //   SHL(buffer[0], 24) + (buffer[1] << 16) + (buffer[2] << 8) + buffer[3]
  // ); //报警标志
  result.alarm =
    SHL(buffer[0], 24) + (buffer[1] << 16) + (buffer[2] << 8) + buffer[3];
  result.state =
    SHL(buffer[4], 24) + (buffer[5] << 16) + (buffer[6] << 8) + buffer[7]; //  buffer.slice(17, 21); //状态
  result.lat =
    (SHL(buffer[8], 24) + (buffer[9] << 16) + (buffer[10] << 8) + buffer[11]) /
    1000000.0; //buffer.slice(21, 25); //纬度
  result.lng =
    (SHL(buffer[12], 24) +
      (buffer[13] << 16) +
      (buffer[14] << 8) +
      buffer[15]) /
    1000000.0; //buffer.slice(25, 29); //经度
  result.altitude = (buffer[16] << 8) + buffer[17]; //buffer.slice(29, 31); //高程
  result.speed = ((buffer[18] << 8) + buffer[19]) / 10; //buffer.slice(31, 33); //速度
  if (result.speed) {
    result.speed.toFixed(2);
  }
  result.angle = (buffer[20] << 8) + buffer[21]; // buffer.slice(33, 35); //方向
  result.time = formatTime(buffer.slice(22, 28)); //时间
  if (buffer.length > 28) {
    //处理附加消息
    var len = 0;
    for (var i = 28; i < buffer.length; i = i + 2 + len) {
      var msgid = buffer[i];
      len = buffer[i + 1];
      // var start = i + 2;
      // var msg =  buffer.slice(start, start + len);
      if (msgid >= 0xe0) {
        //不处理自定义信息
        break;
      }
      switch (msgid) {
        case 0x01:
          result.mileage =
            (SHL(buffer[i + 2], 24) +
              (buffer[i + 3] << 16) +
              (buffer[i + 4] << 8) +
              buffer[i + 5]) /
            10;
          if (result.mileage) {
            result.mileage = result.mileage.toFixed(2);
          }
          break;
        case 0x02:
          result.oil = (buffer[i + 2] << 8) + buffer[i + 3];
          break;
        case 0x03:
          result.speed1 = ((buffer[i + 2] << 8) + buffer[i + 3]) / 10;
          if (result.speed1) {
            result.speed1 = result.speed1.toFixed(2);
          }
          break;
        case 0x04:
          result.alarmId = (buffer[i + 2] << 8) + buffer[i + 3];
          break;
        case 0x11:
          result.overSpeedPositionType = buffer[i + 2];
          if (result.overSpeedPositionType > 0) {
            result.overSpeedAreaId =
              SHL(buffer[i + 3], 24) +
              (buffer[i + 4] << 16) +
              (buffer[i + 5] << 8) +
              buffer[i + 6];
          }
          break;
        case 0x12:
          result.inoutAlarm = result.inoutAlarm || {};
          result.inoutAlarm = {
            type: buffer[i + 2],
            areaId:
              SHL(buffer[i + 3], 24) +
              (buffer[i + 4] << 16) +
              (buffer[i + 5] << 8) +
              buffer[i + 6],
            direction: buffer[i + 7]
          };
          break;
        case 0x13:
          result.runTimeAlarm = {
            routeID:
              SHL(buffer[i + 2], 24) +
              (buffer[i + 3] << 16) +
              (buffer[i + 4] << 8) +
              buffer[i + 5],
            time: (buffer[i + 6] << 8) + buffer[i + 7],
            type: buffer[i + 8]
          };
          if (!result.runTimeAlarm.routeID) {
            result.runTimeAlarm = {};
          }
          break;
        case 0x25:
          result.vehicleSignal =
            SHL(buffer[i + 2], 24) +
            (buffer[i + 3] << 16) +
            (buffer[i + 4] << 8) +
            buffer[i + 5];
          break;
        case 0x2a:
          result.IO = (buffer[i + 2] << 8) + buffer[i + 3];
          break;
        case 0x2b:
          result.analog =
            SHL(buffer[i + 2], 24) +
            (buffer[i + 3] << 16) +
            (buffer[i + 4] << 8) +
            buffer[i + 5];
          break;
        case 0x30:
          result.wifiSignal = buffer[i + 2];
          break;
        case 0x31:
          result.GNSSCount = buffer[i + 2];
          break;
        case 0x64: //高级驾驶辅助系统报警信息
          result.additional0X64 = {
            AlarmID: GetUintFromBytes(buffer, i + 2),
            SignStatus: buffer[i + 6],
            AlarmType: buffer[i + 7],
            AlarmLevel: buffer[i + 8],
            FrontCarSpeed: buffer[i + 9],
            FrontCarDistance: buffer[i + 10],
            DeviationType: buffer[i + 11],
            RoadSignType: buffer[i + 12],
            RoadSignNum: buffer[i + 13],
            Speed: buffer[i + 14],
            Altitude: GetUshortFromBytes(buffer, i + 15),
            Latitude: GetUintFromBytes(buffer, i + 17),
            Longitude: GetUintFromBytes(buffer, i + 21),
            DateTime: GetDateTimeFromBCD6(buffer, i + 25),
            VehicleStatus: GetUshortFromBytes(buffer, i + 31),
            AlarmSign: {
              TerminalID: byte2ascii(buffer, i + 33, 7),
              DateTime: GetDateTimeFromBCD6(buffer, i + 40),
              SerialNO: buffer[i + 46],
              AttachmentCount: buffer[i + 47]
            }
          };
          break;
        case 0x65: //驾驶员状态监测系统报警信息
          result.additional0X65 = {
            AlarmID: GetUintFromBytes(buffer, i + 2),
            SignStatus: buffer[i + 6],
            AlarmType: buffer[i + 7],
            AlarmLevel: buffer[i + 8],
            FatigueDegree: buffer[i + 9],
            //预留4位
            Speed: buffer[i + 14],
            Altitude: GetUshortFromBytes(buffer, i + 15),
            Latitude: GetUintFromBytes(buffer, i + 17),
            Longitude: GetUintFromBytes(buffer, i + 21),
            DateTime: GetDateTimeFromBCD6(buffer, i + 25),
            VehicleStatus: GetUshortFromBytes(buffer, i + 31),
            AlarmSign: {
              TerminalID: byte2ascii(buffer, i + 33, 7),
              DateTime: GetDateTimeFromBCD6(buffer, i + 40),
              SerialNO: buffer[i + 46],
              AttachmentCount: buffer[i + 47]
            }
          };

          break;
      }
    }
  }
  return result;
}

function x0704(buffer) {
  var arr = [];
  var x0200Count = (buffer[0] << 8) + buffer[1];
  // var type = buffer[2];//0：正常位置批量汇报，1：盲区补报
  var len = 0;
  for (var i = 3; i < buffer.length; i = i + 2 + len) {
    if (arr.length >= x0200Count) {
      break;
    }
    len = (buffer[i] << 8) + buffer[i + 1];
    arr.push(x0200(buffer.slice(i + 2, i + len + 2)));
  }
  return arr;
}

function formatSim(buffer) {
  var sim_id = "";
  buffer.map(item => {
    var value = item.toString(16);
    sim_id += "0".repeat(2 - value.length) + value;
  });
  return sim_id;
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
    "/" +
    date.substring(4, 6) +
    "/" +
    date.substring(6, 8) +
    " " +
    date.substring(8, 10) +
    ":" +
    date.substring(10, 12) +
    ":" +
    date.substring(12, 14)
  );
}
/**
 *js 255左移24位溢出问题
 *
 * @param {int} num 要左移的数字
 * @param {int} step 左移的位数
 */
function SHL(num, step) {
  if (!parseInt(num) || num == undefined) {
    return 0;
  }
  var result = num.toString(2);
  result = "0".repeat(8 - result.length) + result;
  result += "0".repeat(parseInt(step));
  return parseInt(result, 2);
}
// 字节数组转uint
function GetUintFromBytes(bytes, start) {
  return (
    SHL(bytes[start], 24) +
    (buffer[start + 1] << 16) +
    (buffer[start + 2] << 8) +
    buffer[start + 3]
  );
}
// 字节数组转ushort
function GetUshortFromBytes(bytes, start) {
  return (bytes[start] << 8) + bytes[start + 1];
}
// BCD[6]转时间(YYYY-MM-DD-hh-mm-ss （GMT+8 时间）)
function GetDateTimeFromBCD6(bytes, start) {
  return formatTime(bytes.slice(start, start + 6));
}
//字节数组转ascii码
function byte2ascii(bytes, start, len) {
  var str = "";
  for (var i = 0; i < len; i++) {
    str += String.fromCharCode(bytes[start + i]);
  }
  return str;
}
