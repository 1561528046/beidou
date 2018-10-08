/**
 *
 *
 * @export
 * @param {Function} callback 地图文件加载完成回调
 */
var callbackList = [];
export const initMap = function(callback) {
  callbackList.push(callback);
  if (!window.AMap) {
    window.mapOnLoad = function() {
      var callbackFunc = callbackList.pop();
      callbackFunc && callbackFunc();
    };
    var url =
      "https://webapi.amap.com/maps?v=1.4.8&key=f072355e3506769b671d67d9b8287468&callback=mapOnLoad";
    var jsapi = document.createElement("script");
    jsapi.charset = "utf-8";
    jsapi.src = url;
    document.head.appendChild(jsapi);
  } else {
    var callbackFunc = callbackList.pop();
    callbackFunc && callbackFunc();
  }
};

export const createMarker = function(vehicleData, AMap) {
  var img = "/static/offine.png";
  if (vehicleData.alarmCount == "0") {
    img = "/static/alarm.png";
  }
  if (vehicleData.online) {
    img = "/static/offine.png";
  } else {
    img = "/static/online.png";
  }
  var image = new AMap.Icon({
    size: new AMap.Size(54, 54), //图标大小
    image: img,
    imageSize: new AMap.Size(40, 40)
  });
  return new AMap.Marker({
    position: new AMap.LngLat(vehicleData.lng, vehicleData.lat),
    icon: image,
    angle: vehicleData.angle || 0
  });
};

export const setMarker = function(marker, vehicleData, AMap) {
  var img = "/static/offline.png";
  if (vehicleData.alarmCount == "0") {
    img = "/static/alarm.png";
  }
  if (vehicleData.online) {
    img = "/static/online.png";
  } else {
    img = "/static/offline.png";
  }
  var image = new AMap.Icon({
    size: new AMap.Size(54, 54), //图标大小
    image: img,
    imageSize: new AMap.Size(40, 40)
  });
  marker.setAngle(vehicleData.angle);
  marker.setIcon(image);
  marker.setPosition(new AMap.LngLat(vehicleData.lng, vehicleData.lat));
};
