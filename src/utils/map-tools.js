//地理位置逆向编码（坐标转地址）
import axios from "axios";
import { dict } from "@/utils/base.js";
export const location2address = function({ data, longKey, latKey }) {
  var promiseArr = [];
  //20个坐标一组 生成promise
  for (var i = 0, len = Math.ceil(data.length / 20); i < len; i++) {
    var currentData = data.slice(i * 20, (i + 1) * 20);
    var point = [];
    currentData.map(item => {
      point.push(item[longKey] + "," + item[latKey]);
    });
    promiseArr.push(
      axios({
        url:
          "https://restapi.amap.com/v3/geocode/regeo?key=" +
          dict.AMAP_KEY +
          "&extensions=all&batch=true",
        params: {
          location: point.join("|")
        }
      })
    );
  }

  //结果保存到result返回
  var result = [];
  return new Promise(function(resolve) {
    axios.all(promiseArr).then(res => {
      res.map((item, index) => {
        if (item.data.infocode == "10000") {
          var addressArr = item.data.regeocodes;
          addressArr.map((address, addressIndex) => {
            result[index * 20 + addressIndex] =
              address.formatted_address +
              (address.roads[0]
                ? address.roads[0].direction +
                  parseInt(address.roads[0].distance) +
                  "米"
                : "");
          });
        } else {
          //   result[index * 20 + addressIndex] = "";
        }
      });
      resolve(result);
    });
  });
};

//GPS坐标转高德坐标
export const gps2amap = function({ data, longKey, latKey }) {
  var promiseArr = [];
  //40个坐标一组 生成promise
  for (var i = 0, len = Math.ceil(data.length / 40); i < len; i++) {
    var currentData = data.slice(i * 40, (i + 1) * 40);
    var point = [];
    currentData.map(item => {
      point.push(item[longKey] + "," + item[latKey]);
    });
    promiseArr.push(
      axios({
        url:
          "https://restapi.amap.com/v3/assistant/coordinate/convert?key=" +
          dict.AMAP_KEY +
          "&coordsys=gps",
        params: {
          locations: point.join("|")
        }
      })
    );
  }

  //结果保存到result返回
  var result = [];
  return new Promise(function(resolve) {
    axios.all(promiseArr).then(res => {
      res.map(item => {
        if (item.data.infocode == "10000") {
          result = result.concat(item.data.locations.split(";"));
        }
      });
      resolve(result);
    });
  });
};
// var testData = [
//   { a: "116.237956", b: "39.856638" },
//   { a: "116.414847", b: "39.872101" },
//   { a: "116.378096", b: "39.862151" },
//   { a: "116.374007", b: "39.907619" },
//   { a: "116.264677", b: "39.906542" },
//   { a: "116.374771", b: "40.10086" },
//   { a: "116.689728", b: "40.019175" },
//   { a: "116.374144", b: "39.883654" },
//   { a: "116.365874", b: "39.987327" },
//   { a: "116.58219", b: "39.751092" },
//   { a: "116.684996", b: "40.327258" },
//   { a: "116.477973", b: "39.987746" },
//   { a: "116.451918", b: "39.982646" },
//   { a: "116.40565", b: "39.962105" },
//   { a: "116.348723", b: "39.986815" },
//   { a: "116.447178", b: "39.859231" },
//   { a: "116.3151", b: "39.886732" },
//   { a: "116.181355", b: "39.817032" },
//   { a: "116.353724", b: "39.588081" },
//   { a: "116.256804", b: "40.086322" },
//   { a: "116.322173", b: "39.70021" },
//   { a: "116.554809", b: "40.025499" },
//   { a: "116.598014", b: "39.838229" },
//   { a: "116.573416", b: "39.810885" }
// ];
// gps2amap({
//     data:testData,
//     longKey:"a",
//     latKey:"b";
// })
