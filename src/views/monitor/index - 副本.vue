<template>
  <div class="home">
    <div id="container" style="width:100%;height:800px;"></div>
  </div>
</template>

<script>
/*eslint-disable*/
import { initMap } from "@/utils/map.js";
export default {
  data() {
    return {
      maps: []
    };
  },
  created() {
    initMap(() => {
      this.$nextTick(() => {
        var map = new AMap.Map("container", {
          viewMode: "3D",
          pitch: 55,
          rotation: -45
        });
        var pathArr = [
          { status: "4", point: [75, 38.118117] },
          { status: "2", point: [75, 38.218117] },
          { status: "2", point: [75, 38.318117] },
          { status: "3", point: [75, 38.418117] },
          { status: "4", point: [75, 38.518117] },
          { status: "4", point: [75, 38.618117] },
          { status: "4", point: [75, 38.718117] },
          { status: "4", point: [75, 38.818117] }
        ];
        //1正常（绿色）
        //2异常（黄色）
        //3离线 （灰色）
        //4报警 （红色）
        var markerArr = [];
        var lineArr = [];
        var colorDict = {
          "1": "green",
          "2": "yellow",
          "3": "green",
          "4": "red"
        };
        var overlayGroup = new AMap.OverlayGroup();
        var splitArr = [
          // {
          //   status:"4",
          //   line:[[75,38],...]
          // }
        ];
        var infoWindow = new AMap.InfoWindow({
          offset: new AMap.Pixel(0, -30)
        });
        var pointer = 0;
        pathArr.map((point, index) => {
          createMarker(point, index);
          var pathObj = (splitArr[pointer] = splitArr[pointer] || {
            status: "1",
            line: []
          });
          if (pathArr[index + 1] && point.status == pathArr[index + 1].status) {
            pathObj.line.push(point.point);
            if (pathObj.status != point.status) {
              pointer++;
              pathObj = splitArr[pointer] = splitArr[pointer] || {
                status: point.status,
                line: []
              };
              pathObj.line.push(point.point);
            }
          } else {
            if (pathObj.status == 1 || !pathArr[index + 1]) {
              pathObj.line.push(point.point);
            } else {
              pathObj.line.push(point.point);
              pointer++;
              pathObj = splitArr[pointer] = splitArr[pointer] || {
                status: "1",
                line: []
              };
              pathObj.line.push(point.point);
            }
          }
        });

        splitArr.map(line => {
          lineArr.push(
            new AMap.Polyline({
              path: line.line, // 设置线覆盖物路径
              showDir: true,
              isOutline: true,
              strokeOpacity: 1,
              //dirImg: canvasDir,
              strokeColor: colorDict[line.status], // 线颜色
              strokeWeight: 10 // 线宽
            })
          );
        });

        function createMarker(point, index) {
          var span = document.createElement("span");
          span.style.cssText =
            "display:inline-block;border-radius:10px;border:1px solid #000;background:" +
            colorDict[point.status] +
            ";width:10px;height:10px";
          var marker = new AMap.Marker({
            position: point.point,
            offset: { x: -5, y: -10 },
            animation: "AMAP_ANIMATION_DROP",
            content: span,
            label: { content: "123123", offset: { x: 20, y: 0 } }
          });
          marker.content = `<div class="map-infowindow">    <div><strong>车　牌：</strong>冀A56309</div>    <div><strong>联系人：</strong>--</div>    <div><strong>电　话：</strong>18603533872</div>    <div><strong>车　速：</strong>0 km/h</div>    <div><strong>里　程：</strong>48733</div>    <div><strong>报　警：</strong>--</div>    <div><strong>时　间：</strong>2018-07-19 17:30:26</div>    <div><strong>位　置：</strong>山西省晋中市榆次区西沙沟村北676米</div>    <div><strong>经 纬 度：</strong>112.72003610517334,37.80896949604063</div></div>`;
          marker.on("click", markerClick);
          marker.emit("click", { target: marker });
          markerArr.push(marker);
        }
        function markerClick(e) {
          infoWindow.setContent(e.target.content);
          infoWindow.open(map, e.target.getPosition());
        }
        overlayGroup.addOverlays(lineArr);
        overlayGroup.addOverlays(markerArr);

        map.add(overlayGroup);
        map.setFitView();

        var object3Dlayer = new AMap.Object3DLayer();
        var bounds = [
          new AMap.LngLat(116, 39),
          new AMap.LngLat(117, 39),
          new AMap.LngLat(117, 40),
          new AMap.LngLat(116, 40)
        ];
        var height = 50000;
        var color = "#0088ff"; //rgba
        var prism = new AMap.Object3D.Prism({
          path: bounds,
          height: height,
          color: color
        });
        object3Dlayer.add(prism);
        map.add(object3Dlayer);

        //测试

        var cluster,
          markers = [];
        for (var i = 0; i < points.length; i += 1) {
          markers.push(
            new AMap.Marker({
              position: points[i]["lnglat"],
              content:
                '<div style="background-color: hsla(180, 100%, 50%, 0.7); height: 24px; width: 24px; border: 1px solid hsl(180, 100%, 40%); border-radius: 12px; box-shadow: hsl(180, 100%, 50%) 0px 0px 1px;"></div>',
              offset: new AMap.Pixel(-15, -15)
            })
          );
        }
        var count = markers.length;
        var _renderCluserMarker = function(context) {
          var factor = Math.pow(context.count / count, 1 / 18);
          var div = document.createElement("div");
          var Hue = 180 - factor * 180;
          var bgColor = "hsla(" + Hue + ",100%,50%,0.7)";
          var fontColor = "hsla(" + Hue + ",100%,20%,1)";
          var borderColor = "hsla(" + Hue + ",100%,40%,1)";
          var shadowColor = "hsla(" + Hue + ",100%,50%,1)";
          div.style.backgroundColor = bgColor;
          var size = Math.round(
            30 + Math.pow(context.count / count, 1 / 5) * 20
          );
          div.style.width = div.style.height = size + "px";
          div.style.border = "solid 1px " + borderColor;
          div.style.borderRadius = size / 2 + "px";
          div.style.boxShadow = "0 0 1px " + shadowColor;
          div.innerHTML = context.count;
          div.style.lineHeight = size + "px";
          div.style.color = fontColor;
          div.style.fontSize = "14px";
          div.style.textAlign = "center";
          context.marker.setOffset(new AMap.Pixel(-size / 2, -size / 2));
          context.marker.setContent(div);
        };
        addCluster(2);

        function addCluster(tag) {
          if (cluster) {
            cluster.setMap(null);
          }
          if (tag == 2) {
            //完全自定义
            cluster = new AMap.MarkerClusterer(map, markers, {
              gridSize: 80,
              renderCluserMarker: _renderCluserMarker
            });
          } else if (tag == 1) {
            //自定义图标
            var sts = [
              {
                url: "https://a.amap.com/jsapi_demos/static/images/blue.png",
                size: new AMap.Size(32, 32),
                offset: new AMap.Pixel(-16, -16)
              },
              {
                url: "https://a.amap.com/jsapi_demos/static/images/green.png",
                size: new AMap.Size(32, 32),
                offset: new AMap.Pixel(-16, -16)
              },
              {
                url: "https://a.amap.com/jsapi_demos/static/images/orange.png",
                size: new AMap.Size(36, 36),
                offset: new AMap.Pixel(-18, -18)
              },
              {
                url: "https://a.amap.com/jsapi_demos/static/images/red.png",
                size: new AMap.Size(48, 48),
                offset: new AMap.Pixel(-24, -24)
              },
              {
                url: "https://a.amap.com/jsapi_demos/static/images/darkRed.png",
                size: new AMap.Size(48, 48),
                offset: new AMap.Pixel(-24, -24)
              }
            ];
            cluster = new AMap.MarkerClusterer(map, markers, {
              styles: sts,
              gridSize: 80
            });
          } else {
            //默认样式
            cluster = new AMap.MarkerClusterer(map, markers, { gridSize: 80 });
          }
        }
      });
    });
  },
  destroyed() {
    console.log(12);
    this.maps.map(map => {
      console.log(map.destroy);
      //map.destroy();
    });
  }
};
</script>