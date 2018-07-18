/**
 *
 *
 * @export
 * @param {Function} callback 地图文件加载完成回调
 */
export default function initMap(callback) {
  if (!window.AMap) {
    var url =
      "https://webapi.amap.com/maps?v=1.4.8&key=f072355e3506769b671d67d9b8287468&callback=mapOnLoad";
    var jsapi = document.createElement("script");
    jsapi.charset = "utf-8";
    jsapi.src = url;
    document.head.appendChild(jsapi);
    window.mapOnLoad = function() {
      callback && callback();
    };
  } else {
    callback && callback();
  }
}
