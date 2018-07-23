<template>
  <div class="home">
    <div id="container" style="width:100%;height:800px;"></div>
  </div>
</template>

<script>
  /*eslint-disable*/
  import initMap from "@/utils/map.js";
  export default {
    data() {
      return {
        maps: []
      }
    },
    created() {
      initMap(() => {
        this.$nextTick(() => {
          var map = new AMap.Map('container', {
            viewMode: '3D',
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
            { status: "4", point: [75, 38.818117] },

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
          var infoWindow = new AMap.InfoWindow({ offset: new AMap.Pixel(0, -30) });
          var pointer = 0;
          pathArr.map((point, index) => {
            createMarker(point, index);
            var pathObj = splitArr[pointer] = splitArr[pointer] || { status: "1", line: [] };
            if (pathArr[index + 1] && point.status == pathArr[index + 1].status) {
              pathObj.line.push(point.point);
              if (pathObj.status != point.status) {
                pointer++;
                pathObj = splitArr[pointer] = splitArr[pointer] || { status: point.status, line: [] };
                pathObj.line.push(point.point);
              }
            } else {
              if (pathObj.status == 1 || !pathArr[index + 1]) {
                pathObj.line.push(point.point);
              } else {
                pathObj.line.push(point.point);
                pointer++;
                pathObj = splitArr[pointer] = splitArr[pointer] || { status: "1", line: [] };
                pathObj.line.push(point.point);
              }
            }
          });


          splitArr.map((line) => {
            lineArr.push(
              new AMap.Polyline({
                path: line.line,            // 设置线覆盖物路径
                showDir: true,
                isOutline: true,
                strokeOpacity: 1,
                //dirImg: canvasDir,
                strokeColor: colorDict[line.status],   // 线颜色
                strokeWeight: 10           // 线宽
              })
            )
          })

          function createMarker(point, index) {
            var span = document.createElement("span");
            span.style.cssText = "display:inline-block;border-radius:10px;border:1px solid #000;background:" + colorDict[point.status] + ";width:10px;height:10px";
            var marker = new AMap.Marker({
              position: point.point,
              offset: { x: -5, y: -10 },
              animation: "AMAP_ANIMATION_DROP",
              content: span,
              label: { content: "123123", offset: { x: 20, y: 0 } }
            })
            marker.content = `<div class="map-infowindow">    <div><strong>车　牌：</strong>冀A56309</div>    <div><strong>联系人：</strong>--</div>    <div><strong>电　话：</strong>18603533872</div>    <div><strong>车　速：</strong>0 km/h</div>    <div><strong>里　程：</strong>48733</div>    <div><strong>报　警：</strong>--</div>    <div><strong>时　间：</strong>2018-07-19 17:30:26</div>    <div><strong>位　置：</strong>山西省晋中市榆次区西沙沟村北676米</div>    <div><strong>经 纬 度：</strong>112.72003610517334,37.80896949604063</div></div>`;
            marker.on('click', markerClick);
            marker.emit('click', { target: marker });
            markerArr.push(marker)
          }
          function markerClick(e) {
            infoWindow.setContent(e.target.content);
            infoWindow.open(map, e.target.getPosition());
          }
          overlayGroup.addOverlays(lineArr);
          overlayGroup.addOverlays(markerArr);

          map.add(overlayGroup);
          map.setFitView()

          var object3Dlayer = new AMap.Object3DLayer();
          var bounds = [
            new AMap.LngLat(116, 39),
            new AMap.LngLat(117, 39),
            new AMap.LngLat(117, 40),
            new AMap.LngLat(116, 40)
          ];
          var height = 50000;
          var color = '#0088ff';//rgba
          var prism = new AMap.Object3D.Prism({
            path: bounds,
            height: height,
            color: color
          });
          object3Dlayer.add(prism);
          map.add(object3Dlayer);

        })
      })

    },
    destroyed() {
      console.log(12);
      this.maps.map(map => {
        console.log(map.destroy);
        //map.destroy();
      })
    }
  }
</script>