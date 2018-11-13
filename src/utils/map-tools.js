/* eslint-disable */
import axios from "axios";
import { dict } from "@/utils/base.js";
// WGS84（大地坐标系）GPS坐标
// bd09（百度坐标系）百度坐标
// GCJ02（国测局坐标系）高德坐标
export const GPS = {
  PI: 3.14159265358979324,
  x_pi: (3.14159265358979324 * 3000.0) / 180.0,
  delta: function(lat, lon) {
    // Krasovsky 1940
    //
    // a = 6378245.0, 1/f = 298.3
    // b = a * (1 - f)
    // ee = (a^2 - b^2) / a^2;
    var a = 6378245.0; //  a: 卫星椭球坐标投影到平面地图坐标系的投影因子。
    var ee = 0.00669342162296594323; //  ee: 椭球的偏心率。
    var dLat = this.transformLat(lon - 105.0, lat - 35.0);
    var dLon = this.transformLon(lon - 105.0, lat - 35.0);
    var radLat = (lat / 180.0) * this.PI;
    var magic = Math.sin(radLat);
    magic = 1 - ee * magic * magic;
    var sqrtMagic = Math.sqrt(magic);
    dLat = (dLat * 180.0) / (((a * (1 - ee)) / (magic * sqrtMagic)) * this.PI);
    dLon = (dLon * 180.0) / ((a / sqrtMagic) * Math.cos(radLat) * this.PI);
    return { lat: dLat, lon: dLon };
  },

  //WGS-84 to GCJ-02
  gcj_encrypt: function(wgsLat, wgsLon) {
    wgsLat = parseFloat(wgsLat);
    wgsLon = parseFloat(wgsLon);
    if (this.outOfChina(wgsLat, wgsLon)) return { lat: wgsLat, lon: wgsLon };

    var d = this.delta(wgsLat, wgsLon);
    return { lat: wgsLat + d.lat, lon: wgsLon + d.lon };
  },
  //GCJ-02 to WGS-84
  gcj_decrypt: function(gcjLat, gcjLon) {
    gcjLat = parseFloat(gcjLat);
    gcjLon = parseFloat(gcjLon);
    if (this.outOfChina(gcjLat, gcjLon)) return { lat: gcjLat, lon: gcjLon };

    var d = this.delta(gcjLat, gcjLon);
    return { lat: gcjLat - d.lat, lon: gcjLon - d.lon };
  },
  //GCJ-02 to WGS-84 exactly
  gcj_decrypt_exact: function(gcjLat, gcjLon) {
    gcjLat = parseFloat(gcjLat);
    gcjLon = parseFloat(gcjLon);
    var initDelta = 0.01;
    var threshold = 0.000000001;
    var dLat = initDelta,
      dLon = initDelta;
    var mLat = gcjLat - dLat,
      mLon = gcjLon - dLon;
    var pLat = gcjLat + dLat,
      pLon = gcjLon + dLon;
    var wgsLat,
      wgsLon,
      i = 0;
    while (1) {
      wgsLat = (mLat + pLat) / 2;
      wgsLon = (mLon + pLon) / 2;
      var tmp = this.gcj_encrypt(wgsLat, wgsLon);
      dLat = tmp.lat - gcjLat;
      dLon = tmp.lon - gcjLon;
      if (Math.abs(dLat) < threshold && Math.abs(dLon) < threshold) break;

      if (dLat > 0) pLat = wgsLat;
      else mLat = wgsLat;
      if (dLon > 0) pLon = wgsLon;
      else mLon = wgsLon;

      if (++i > 10000) break;
    }
    //console.log(i);
    return { lat: wgsLat, lon: wgsLon };
  },
  //GCJ-02 to BD-09
  bd_encrypt: function(gcjLat, gcjLon) {
    gcjLat = parseFloat(gcjLat);
    gcjLon = parseFloat(gcjLon);
    var x = gcjLon,
      y = gcjLat;
    var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * this.x_pi);
    var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * this.x_pi);
    bdLon = z * Math.cos(theta) + 0.0065;
    bdLat = z * Math.sin(theta) + 0.006;
    return { lat: bdLat, lon: bdLon };
  },
  //BD-09 to GCJ-02
  bd_decrypt: function(bdLat, bdLon) {
    bdLat = parseFloat(bdLat);
    bdLon = parseFloat(bdLon);
    var x = bdLon - 0.0065,
      y = bdLat - 0.006;
    var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * this.x_pi);
    var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * this.x_pi);
    var gcjLon = z * Math.cos(theta);
    var gcjLat = z * Math.sin(theta);
    return { lat: gcjLat, lon: gcjLon };
  },
  //WGS-84 to Web mercator
  //mercatorLat -> y mercatorLon -> x
  mercator_encrypt: function(wgsLat, wgsLon) {
    wgsLat = parseFloat(wgsLat);
    wgsLon = parseFloat(wgsLon);
    var x = (wgsLon * 20037508.34) / 180;
    var y =
      Math.log(Math.tan(((90 + wgsLat) * this.PI) / 360)) / (this.PI / 180);
    y = (y * 20037508.34) / 180;
    return { lat: y, lon: x };
  },
  // Web mercator to WGS-84
  // mercatorLat -> y mercatorLon -> x
  mercator_decrypt: function(mercatorLat, mercatorLon) {
    mercatorLat = parseFloat(mercatorLat);
    mercatorLon = parseFloat(mercatorLon);
    var x = (mercatorLon / 20037508.34) * 180;
    var y = (mercatorLat / 20037508.34) * 180;
    y =
      (180 / this.PI) *
      (2 * Math.atan(Math.exp((y * this.PI) / 180)) - this.PI / 2);
    return { lat: y, lon: x };
  },
  // two point's distance
  distance: function(latA, lonA, latB, lonB) {
    var earthR = 6371000;
    var x =
      Math.cos((latA * this.PI) / 180) *
      Math.cos((latB * this.PI) / 180) *
      Math.cos(((lonA - lonB) * this.PI) / 180);
    var y = Math.sin((latA * this.PI) / 180) * Math.sin((latB * this.PI) / 180);
    var s = x + y;
    if (s > 1) s = 1;
    if (s < -1) s = -1;
    var alpha = Math.acos(s);
    var distance = alpha * earthR;
    return distance;
  },
  outOfChina: function(lat, lon) {
    if (lon < 72.004 || lon > 137.8347) return true;
    if (lat < 0.8293 || lat > 55.8271) return true;
    return false;
  },
  transformLat: function(x, y) {
    var ret =
      -100.0 +
      2.0 * x +
      3.0 * y +
      0.2 * y * y +
      0.1 * x * y +
      0.2 * Math.sqrt(Math.abs(x));
    ret +=
      ((20.0 * Math.sin(6.0 * x * this.PI) +
        20.0 * Math.sin(2.0 * x * this.PI)) *
        2.0) /
      3.0;
    ret +=
      ((20.0 * Math.sin(y * this.PI) + 40.0 * Math.sin((y / 3.0) * this.PI)) *
        2.0) /
      3.0;
    ret +=
      ((160.0 * Math.sin((y / 12.0) * this.PI) +
        320 * Math.sin((y * this.PI) / 30.0)) *
        2.0) /
      3.0;
    return ret;
  },
  transformLon: function(x, y) {
    var ret =
      300.0 +
      x +
      2.0 * y +
      0.1 * x * x +
      0.1 * x * y +
      0.1 * Math.sqrt(Math.abs(x));
    ret +=
      ((20.0 * Math.sin(6.0 * x * this.PI) +
        20.0 * Math.sin(2.0 * x * this.PI)) *
        2.0) /
      3.0;
    ret +=
      ((20.0 * Math.sin(x * this.PI) + 40.0 * Math.sin((x / 3.0) * this.PI)) *
        2.0) /
      3.0;
    ret +=
      ((150.0 * Math.sin((x / 12.0) * this.PI) +
        300.0 * Math.sin((x / 30.0) * this.PI)) *
        2.0) /
      3.0;
    return ret;
  }
};

//地理位置逆向编码（坐标转地址）

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
          var addressArr = item.data.regeocodes || [];
          addressArr.map((address, addressIndex) => {
            var addressTemp = address.formatted_address;
            if (address.roadinters[0]) {
              addressTemp +=
                " " +
                address.roadinters[0].first_name +
                "/" +
                address.roadinters[0].second_name +
                " " +
                address.roadinters[0].direction +
                parseInt(address.roadinters[0].distance) +
                "米";
            } else if (address.roads[0]) {
              addressTemp +=
                " " +
                address.roads[0].name +
                " " +
                address.roads[0].direction +
                " " +
                parseInt(address.roads[0].distance) +
                "米";
            }
            result[index * 20 + addressIndex] = addressTemp;
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
  return new Promise((resolve, reject) => {
    var result = [];
    data.map(item => {
      var location = GPS.gcj_encrypt(item[latKey], item[longKey]);
      result.push(location.lon + "," + location.lat);
    });
    resolve(result);
  });
};
// export const gps2amap = function({ data, longKey, latKey }) {
//   var promiseArr = [];
//   //40个坐标一组 生成promise
//   for (var i = 0, len = Math.ceil(data.length / 40); i < len; i++) {
//     var currentData = data.slice(i * 40, (i + 1) * 40);
//     var point = [];
//     currentData.map(item => {
//       point.push(item[longKey] + "," + item[latKey]);
//     });
//     promiseArr.push(
//       axios({
//         url:
//           "https://restapi.amap.com/v3/assistant/coordinate/convert?key=" +
//           dict.AMAP_KEY +
//           "&coordsys=gps",
//         params: {
//           locations: point.join("|")
//         }
//       })
//     );
//   }

//   //结果保存到result返回
//   var result = [];
//   return new Promise(function(resolve) {
//     axios.all(promiseArr).then(res => {
//       res.map(item => {
//         if (item.data.infocode == "10000") {
//           result = result.concat(item.data.locations.split(";"));
//         }
//       });
//       resolve(result);
//     });
//   });
// };
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
