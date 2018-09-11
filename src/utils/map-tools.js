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
          dict.MAP_KEY +
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
          dict.MAP_KEY +
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
          result = item.data.locations.split(";");
        }
      });
      resolve(result);
    });
  });
};
