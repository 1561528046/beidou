<template>
  <div style="width:760px; height:420px; border:1px solid #777; background-color:#fff;" class="vehicle-area">
    <!-- 地图 -->
    <div style="position:absolute;left:0;right:0;top:0;bottom:0; z-index:1;" ref="map"></div>
    <!-- 自定义区域 -->
    <el-dialog width="20%" @close="down(2)" :visible.sync="addDialog " :append-to-body="true " :close-on-click-modal="false " :close-on-press-escape="false " :center="true " class="admin-dialog">
      <el-form :model="formdata" :key="addKey">
        <el-row :gutter="30">
          <el-col :span="24">
            <el-form-item label="名称" prop="name">
              <el-input size="small" v-model="formdata.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="报警类型" prop="alarm_type">
              <el-select v-model="formdata.alarm_type" style="width:100%;">
                <el-option label="禁入" value="3">禁入</el-option>
                <el-option label="禁出" value="5">禁出</el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="时间" prop="time">
              <el-time-picker size="small" style="width:100%;" is-range v-model="formdata.time" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围">
              </el-time-picker>
            </el-form-item>
          </el-col>
          <el-col v-if="label=='marker'" :span="24">
            <el-form-item label="半径" prop="time">
              <el-input size="small" v-model="formdata.radius" style="width:100%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <div style="width:150px;margin:0 auto;">
          <el-button @click="save" type="primary">保存</el-button>
          <el-button @click="down(2)" type="primary">关闭</el-button>
        </div>
      </el-form>
    </el-dialog>
    <!-- 行政区域 -->
    <el-dialog width="20%" @close="down(1)" :visible.sync="nocustom" :append-to-body="true " :close-on-click-modal="false " :close-on-press-escape="false " :center="true " class="admin-dialog">
      <el-form :model="formdata" :key="addKey">
        <el-row :gutter="30">
          <el-col :span="24">
            <el-form-item label="名称" prop="name" style="margin-bottom:0">
              <el-input size="small" v-model="formdata.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="报警类型" prop="alarm_type" style="margin-bottom:0">
              <el-select size="small" v-model="formdata.alarm_type" style="width:100%;">
                <el-option label="禁入" value="3">禁入</el-option>
                <el-option label="禁出" value="5">禁出</el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="地区" style="margin-bottom:0">
              <!-- <el-input size="small" v-model="xingzheng" type="text"></el-input> -->
              <select-city-input :area.sync="formdata.area" :filter="filterType" clearable></select-city-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="时间" prop="time" style="margin-bottom:0">
              <el-time-picker size="small" style="width:100%;" is-range v-model="formdata.time" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围">
              </el-time-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <div style="width:150px;margin:0 auto;">
          <el-button @click="administrative" type="primary">保存</el-button>
          <el-button @click="down(1)" type="primary">关闭</el-button>
        </div>
      </el-form>
    </el-dialog>
    <!-- 区域工具 -->
    <div v-show="custom" class="input-card">
      <div class="input-item" style="margin-top:15px;">
        <el-radio @change="selectRadio" v-model="radio" label="polyline">画线</el-radio>
        <el-radio @change="selectRadio" v-model="radio" label="circle">画圆</el-radio>
        <el-radio @change="selectRadio" v-model="radio" label="rectangle">画矩形</el-radio>
        <el-radio style="margin-left:0;" @change="selectRadio" v-model="radio" label="polygon">画多边形</el-radio>
        <el-radio style="margin-left:6px;" @change="selectRadio" v-model="radio" label="marker">画点</el-radio>
      </div>
      <div class="input-item item-btn" style="margin-top:24px; width:227px;margin:0 auto;">
        <el-button @click="close" size="mini" icon="iconfont icon-tuodong"></el-button>
        <el-button class="btn" @click="down(2)" style="margin-left:95px;">关闭绘图</el-button>
      </div>
    </div>
    <!-- 列表 -->
    <div v-show="areaType" style="width:760px;height:420px; position:absolute;left:2px;right:0;top:0;bottom:0;border:1px solid #777; z-index:99;background-color:#fff; ">
      <el-form :model="tableQuery" @submit.native.prevent ref="baseForm ">
        <el-row :gutter="30 ">
          <el-col :span="10 ">
            <el-form-item label="名称 " prop="name ">
              <el-input v-model="tableQuery.RegionName" size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10 ">
            <el-form-item label="管理类型 " prop="type ">
              <el-select style="width:100%;" v-model="tableQuery.Type" clearable size="small">
                <el-option label="圆形" value="1">圆形</el-option>
                <el-option label="矩形" value="2">矩形</el-option>
                <el-option label="线路" value="5">线路</el-option>
                <el-option label="多边形" value="3">多边形</el-option>
                <el-option label="行政区域" value="4">行政区域</el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4 ">
            <el-form-item style="text-align:center;margin-top:40px; ">
              <el-button type="primary " native-type="submit" @click="getTable" size="small">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-button type="primary " @click="addForm(1)" size="small ">添加行政区域</el-button>
        <el-button type="primary " @click="addForm(2)" size="small ">添加自定义区域</el-button>
        <router-link :to="{name:'fence-platform'}">
          <el-button style="margin-left:10px;" size="small" type="primary" icon="el-icon-edit">平台</el-button>
        </router-link>
        <router-link :to="{name:'fence-vehicle'}">
          <el-button style="margin-left:10px;" size="small" type="primary" icon="el-icon-edit">车机</el-button>
        </router-link>
      </el-form>
      <el-table height="200" :data="tableData.data" size="small">
        <el-table-column prop="RegionId" label="序号 " :formatter="$utils.baseFormatter "> </el-table-column>
        <el-table-column prop="Type" label="管理类型 " :formatter="$utils.baseFormatter ">
          <template slot-scope="scope">
            <label v-if="scope.row.Type=='1'">圆形</label>
            <label v-if="scope.row.Type=='2'">矩形</label>
            <label v-if="scope.row.Type=='3'">多边形</label>
            <label v-if="scope.row.Type=='4'">行政区域</label>
            <label v-if="scope.row.Type=='5'">线路</label>
          </template>
        </el-table-column>
        <el-table-column prop="RegionName" label="名称 " :formatter="$utils.baseFormatter "> </el-table-column>
        <el-table-column prop="AreaProperty" label="报警类型 " :formatter="$utils.baseFormatter ">
          <template slot-scope="scope">
            <label v-if="scope.row.AreaProperty=='3'">禁入</label>
            <label v-if="scope.row.AreaProperty=='5'">禁出</label>
          </template>
        </el-table-column>
        <el-table-column prop="Time" width="150" label="时间" :formatter="(row)=>{return this.$utils.formatDate14(row.Time)}"> </el-table-column>
        <el-table-column width="150" label="操作 ">
          <template slot-scope="scope ">
            <el-popover placement="top" width="160" v-model="scope.row.delDialog">
              <p>确定删除吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="scope.row.delDialog = false">取消</el-button>
                <el-button @click="del(scope)" type="primary" size="mini">确定</el-button>
              </div>
              <el-button @click="delForm(scope)" size="mini" style="margin-right:3px; " slot="reference">删除</el-button>
            </el-popover>
            <el-button size="mini" @click="selceForm(scope)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="admin-table-pager ">
        <el-pagination @size-change="handleSizeChange " @current-change="handleCurrentChange " :current-page="tableQuery.page " :page-sizes="[10, 20, 50, 100] " :page-size="tableQuery.size " :total="tableData.total " layout="total, sizes, prev, pager, next, jumper " background>
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
/*eslint-disable*/
import { initMap } from "@/utils/map.js";
import moment from "moment";
import { AddRegion, GetRegionByPage, DeleteRegion } from "@/api/index.js";
import selectCityInput from "@/components/select-city-input.vue";
import areaRoute from "./area-route.vue";
export default {
  components: { selectCityInput, areaRoute },
  created() {
    this.getTable();
  },
  mounted() {
    var vm = this;
    var district,
      polygons = [];
    initMap(() => {
      var map = new AMap.Map(this.$refs.map, {
        zoom: 14
      });
      vm.$set(vm.mapData, "map", map);
      map.plugin(["AMap.MouseTool"], function() {
        var mouseTool = new AMap.MouseTool(map);
        vm.$set(vm.mapData, "mouseTool", mouseTool);
        var overlays = [];
        mouseTool.on("draw", function(e) {
          if (vm.label == "circle") {
            var Center = e.obj.getCenter();
            var Radius = e.obj.getRadius();
            overlays[0] = Center;
            overlays[1] = Radius;
          } else if (vm.label == "rectangle") {
            var Rectangle = e.obj.getOptions();
            overlays[0] = Rectangle;
          } else if (vm.label == "polygon") {
            var Polygon = e.obj.getPath();
            overlays[0] = Polygon;
          } else if (vm.label == "marker") {
            var Marker = e.obj.getPosition();
            overlays[0] = Marker;
          } else if (vm.label == "polyline") {
            var Polyline = e.obj.getPath();
            overlays[0] = Polyline;
          }
          map.remove(overlays);
          vm.addDialog = true;
        });
        vm.$set(vm.mapData, "overlays", overlays);
      });
      map.plugin(["AMap.DistrictSearch"], function() {
        var opts = {
          subdistrict: 0, //获取边界不需要返回下级行政区
          extensions: "all", //返回行政区边界坐标组等具体信息
          level: "district" //查询行政级别为 市
        };
        district = new AMap.DistrictSearch(opts);
        vm.$set(vm.mapData, "district", district);
        vm.$set(vm.mapData, "polygons", polygons);
      });
    });
  },
  data() {
    return {
      itemDialog: false,
      speedDialog: false,
      lineData: [],
      line: "",
      filterType: 0,
      RegionId: "",
      radio: false,
      label: "",
      level: "",
      roadData: [],
      limit_road: [],
      according_time: false,
      enter_driver: false,
      outer_driver: false,
      enter_platform: false,
      outer_platform: false,
      areaType: true,
      custom: false,
      nocustom: false,
      addDialog: false,
      delDialog: false,
      addKey: 0,
      speed_limit: {
        time: "",
        rules: ""
      },
      mapData: {
        map: {},
        mouseTool: {},
        district: {},
        polygons: [],
        overlays: [],
        radios: {}
      },
      tableQuery: {
        RegionName: "",
        AreaName: "",
        Type: "",
        alarm_type: "",
        page: 1,
        size: 10
      },
      formdata: {
        area: {},
        name: "",
        type: "",
        time: "",
        radius: "",
        alarm_type: "",
        start_time: "",
        stop_time: ""
      },
      tableData: {
        total: 0,
        data: [
          {
            sequence: "1",
            type: "2",
            name: "3",
            alarm_type: "4",
            time: "5"
          }
        ]
      }
    };
  },
  methods: {
    // 删除路段项
    deleteItem(data) {
      var limit = [];
      this.limit_road.map((item, index) => {
        if (item.start == data.start) {
          this.limit_road.splice(index - 1, 1);
          return false;
        }
        limit.push(item);
      });
      this.$set(this.$data, "limit_road", limit);
    },
    // 查看所画区域
    selceForm(scope) {
      if (scope.row.Type == "1") {
        this.mapData.map.clearMap();
        // 圆形
        var circle = [scope.row.CenterLongitude, scope.row.CenterLatitude];
        var Radius = scope.row.Radius;
        var circle = new AMap.Circle({
          center: circle,
          radius: Radius, //半径
          borderWeight: 3,
          strokeColor: "#FF33FF",
          strokeOpacity: 1,
          strokeWeight: 6,
          strokeOpacity: 0.2,
          fillOpacity: 0.4,
          strokeStyle: "dashed",
          strokeDasharray: [10, 10],
          // 线样式还支持 'dashed'
          fillColor: "#1791fc",
          zIndex: 50
        });
        //根据不同类型选择显示
        circle.setMap(this.mapData.map);
        // 缩放地图到合适的视野级别
        this.mapData.map.setFitView([circle]);
      } else if (scope.row.Type == "2") {
        this.mapData.map.clearMap();
        // 矩形
        var leftlng = Number(scope.row.RightBottomLongitude);
        var leftlat = Number(scope.row.LeftTopLatitude);
        var rightlng = Number(scope.row.LeftTopLongitude);
        var rightlat = Number(scope.row.RightBottomLatitude);
        var southWest = new AMap.LngLat(leftlng, leftlat);
        var northEast = new AMap.LngLat(rightlng, rightlat);
        var bounds = new AMap.Bounds(southWest, northEast);
        var rectangle = new AMap.Rectangle({
          bounds: bounds,
          strokeColor: "#FF33FF",
          strokeWeight: 6,
          strokeOpacity: 0.2,
          strokeDasharray: [30, 10],
          // strokeStyle还支持 solid
          strokeStyle: "dashed",
          fillColor: "#89c6f9",
          fillOpacity: 0.5,
          cursor: "pointer",
          zIndex: 50
        });
        //根据不同类型选择显示
        rectangle.setMap(this.mapData.map);
        // 缩放地图到合适的视野级别
        this.mapData.map.setFitView([rectangle]);
      } else if (scope.row.Type == "3") {
        this.mapData.map.clearMap();
        var latitude = scope.row.Latitude.split(",");
        var longitude = scope.row.Longitude.split(",");
        var path = [];
        latitude.map((item, index) => {
          path.push([longitude[index], item]);
        });
        var polygon = new AMap.Polygon({
          path: path,
          isOutline: true,
          borderWeight: 3,
          strokeColor: "#FF33FF",
          strokeWeight: 6,
          strokeOpacity: 0.2,
          fillOpacity: 0.4,
          // 线样式还支持 'dashed'
          fillColor: "#1791fc",
          zIndex: 50
        });
        polygon.setMap(this.mapData.map);
        this.mapData.map.setFitView([polygon]);
      } else if (scope.row.Type == "4") {
        this.mapData.map.clearMap();
        var polygons = [];
        var area = scope.row.rings.split(";");
        area.map((item, index) => {
          item = item.split(",");
          var arr = [];
          item.map(it => {
            it = it.split(" ");
            it[0] = parseFloat(it[0]);
            it[1] = parseFloat(it[1]);
            it = new AMap.LngLat(it[0], it[1]);
            arr.push(it);
          });
          var poly = new AMap.Polygon({
            path: arr,
            isOutline: true,
            borderWeight: 3,
            strokeColor: "#FF33FF",
            strokeWeight: 6,
            strokeOpacity: 0.2,
            fillOpacity: 0.4,
            // 线样式还支持 'dashed'
            fillColor: "#1791fc",
            zIndex: 50
          });
          poly.setMap(this.mapData.map);
          this.mapData.map.setFitView([poly]);
          arr = [];
        });
      } else {
        var line = [];
        var lng = "";
        var lat = "";
        this.mapData.map.clearMap();
        scope.row.TurnPoints.map(item => {
          lng = parseFloat(item.TurnPointLongitude);
          lat = parseFloat(item.TurnPointLatitude);
          line.push([lng, lat]);
        });
        var polyline = new AMap.Polyline({
          path: line,
          isOutline: true,
          outlineColor: "#ffeeff",
          borderWeight: 3,
          strokeColor: "#3366FF",
          strokeOpacity: 1,
          strokeWeight: 6,
          // 折线样式还支持 'dashed'
          strokeStyle: "solid",
          // strokeStyle是dashed时有效
          strokeDasharray: [10, 5],
          lineJoin: "round",
          lineCap: "round",
          zIndex: 50
        });
        polyline.setMap(this.mapData.map);
        this.mapData.map.setFitView([polyline]);
      }
    },
    // 删除区域
    delForm(scope) {
      this.RegionId = scope.row.RegionId;
      scope.row.delDialog = true;
    },
    del(scope) {
      DeleteRegion({ RegionId: this.RegionId }).then(res => {
        if (res.data.code == 0) {
          this.getTable();
          scope.row.delDialog = false;
          this.mapData.map.clearMap();
          return this.$notify({
            message: res.data.msg,
            title: "提示",
            type: "success"
          });
        } else {
          return this.$notify({
            message: res.data.msg,
            title: "提示",
            type: "error"
          });
        }
      });
    },
    // 区域列表
    getTable() {
      GetRegionByPage(this.tableQuery).then(res => {
        if (res.data.code == 0) {
          res.data.data.map(item => {
            item.delDialog = false;
          });
          this.$set(this.tableData, "data", res.data.data);
          this.$set(this.tableData, "total", res.data.total);
        } else {
          return this.$notify({
            message: res.data.msg,
            title: "提示",
            type: "error"
          });
        }
      });
    },
    // 行政区域
    administrative() {
      var data = {};
      if (!this.formdata.time == "") {
        this.formdata.start_time =
          "000000" + moment(this.formdata.time[0]).format("HHmmss");
        this.formdata.stop_time =
          "000000" + moment(this.formdata.time[1]).format("HHmmss");
      } else {
        return this.$notify({
          message: "请选择时间",
          title: "提示",
          type: "error"
        });
      }
      data = {
        AreaProperty: this.formdata.alarm_type,
        RegionName: this.formdata.name,
        StartTime: this.formdata.start_time,
        EndTime: this.formdata.stop_time,
        area_id: this.formdata.area.area_id,
        Type: "4"
      };
      AddRegion(data).then(res => {
        if (res.data.code == 0) {
          this.getTable();
          this.down(1);
          this.mapData.map.clearMap();
          return this.$notify({
            message: res.data.msg,
            title: "提示",
            type: "success"
          });
        } else {
          return this.$notify({
            message: res.data.msg,
            title: "提示",
            type: "error"
          });
        }
      });
    },
    // 弹出块保存发送指令
    save() {
      var data = {};
      this.formdata.start_time =
        "000000" + moment(this.formdata.time[0]).format("HHmmss");
      this.formdata.stop_time =
        "000000" + moment(this.formdata.time[1]).format("HHmmss");
      if (this.label == "circle") {
        var radius = Math.round(this.mapData.overlays[1]);
        data = {
          AreaProperty: this.formdata.alarm_type,
          RegionName: this.formdata.name,
          StartTime: this.formdata.start_time,
          EndTime: this.formdata.stop_time,
          CenterLatitude: this.mapData.overlays[0].lat,
          CenterLongitude: this.mapData.overlays[0].lng,
          Radius: radius,
          Type: "1"
        };
        AddRegion(data).then(res => {
          if (res.data.code == 0) {
            this.getTable();
            this.down();
            this.mapData.map.clearMap();
            return this.$notify({
              message: res.data.msg,
              title: "提示",
              type: "success"
            });
          } else {
            return this.$notify({
              message: res.data.msg,
              title: "提示",
              type: "error"
            });
          }
        });
      } else if (this.label == "rectangle") {
        data = {
          AreaProperty: this.formdata.alarm_type,
          RegionName: this.formdata.name,
          StartTime: this.formdata.start_time,
          EndTime: this.formdata.stop_time,
          LeftTopLatitude: this.mapData.overlays[0].path[0].lat,
          LeftTopLongitude: this.mapData.overlays[0].path[0].lng,
          RightBottomLatitude: this.mapData.overlays[0].path[2].lat,
          RightBottomLongitude: this.mapData.overlays[0].path[2].lng,
          Type: "2"
        };
        AddRegion(data).then(res => {
          if (res.data.code == 0) {
            this.getTable();
            this.down();
            this.mapData.map.clearMap();
            return this.$notify({
              message: res.data.msg,
              title: "提示",
              type: "success"
            });
          } else {
            return this.$notify({
              message: res.data.msg,
              title: "提示",
              type: "error"
            });
          }
        });
      } else if (this.label == "polygon") {
        var lat = "";
        var lng = "";
        this.mapData.overlays[0].map(item => {
          lat = lat + item.lat + ",";
          lng = lng + item.lng + ",";
        });
        lat = lat.substring(0, lat.lastIndexOf(","));
        lng = lng.substring(0, lng.lastIndexOf(","));
        data = {
          AreaProperty: this.formdata.alarm_type,
          RegionName: this.formdata.name,
          StartTime: this.formdata.start_time,
          EndTime: this.formdata.stop_time,
          Latitude: lat,
          Longitude: lng,
          Type: "3"
        };
        AddRegion(data).then(res => {
          if (res.data.code == 0) {
            this.getTable();
            this.down();
            this.mapData.map.clearMap();
            return this.$notify({
              message: res.data.msg,
              title: "提示",
              type: "success"
            });
          } else {
            return this.$notify({
              message: res.data.msg,
              title: "提示",
              type: "error"
            });
          }
        });
      } else if (this.label == "polyline") {
        var polyline = [];
        this.mapData.overlays[0].map(item => {
          polyline.push({
            TurnPointLatitude: item.lat,
            TurnPointLongitude: item.lng
          });
        });
        data = {
          AreaProperty: this.formdata.alarm_type,
          RegionName: this.formdata.name,
          StartTime: this.formdata.start_time,
          EndTime: this.formdata.stop_time,
          Type: "5",
          TurnPoints: polyline
        };
        AddRegion(data).then(res => {
          if (res.data.code == 0) {
            this.getTable();
            this.down();
            this.mapData.map.clearMap();
            return this.$notify({
              message: res.data.msg,
              title: "提示",
              type: "success"
            });
          } else {
            return this.$notify({
              message: res.data.msg,
              title: "提示",
              type: "error"
            });
          }
        });
      } else if (this.label == "marker") {
        data = {
          AreaProperty: this.formdata.alarm_type,
          RegionName: this.formdata.name,
          StartTime: this.formdata.start_time,
          EndTime: this.formdata.stop_time,
          CenterLatitude: this.mapData.overlays[0].lat,
          CenterLongitude: this.mapData.overlays[0].lng,
          Radius: this.formdata.radius,
          Type: "6"
        };
        AddRegion(data).then(res => {
          if (res.data.code == 0) {
            this.getTable();
            this.down();
            this.mapData.map.clearMap();
            return this.$notify({
              message: res.data.msg,
              title: "提示",
              type: "success"
            });
          } else {
            return this.$notify({
              message: res.data.msg,
              title: "提示",
              type: "error"
            });
          }
        });
      }
    },
    // 选择划分区域工具
    selectRadio(label) {
      this.label = label;
      this.draw(label);
    },
    // 添加自定义区域
    addForm(type) {
      this.addKey++;
      this.mapData.map.clearMap();
      this.areaType = false;
      if (type == 1) {
        this.filterType = 0;
        this.nocustom = true;
      } else {
        this.custom = true;
      }
    },
    // 关闭弹出块,关闭绘图
    down(type) {
      if (type == 1) {
        this.filterType = 1;
        this.nocustom = false;
        this.mapData.map.remove(this.mapData.polygons);
      } else if (type == 2) {
        this.custom = false;
      } else {
        this.speedDialog = false;
      }
      this.addDialog = false;
      this.areaType = true;
      this.radio = false;
      this.formdata.time = "";
      this.formdata.name = "";
      this.formdata.area = {};
      this.formdata.alarm_type = "";
      this.formdata.start_time = "";
      this.formdata.stop_time = "";
      this.mapData.mouseTool.close(true);
    },
    // 拖动
    close() {
      this.mapData.mouseTool.close(true); //关闭，并清除覆盖物
      this.radio = false;
    },
    // 根据选择(画圆,画矩形,画多边形)调用工具
    draw(type) {
      switch (type) {
        case "polyline": {
          this.mapData.mouseTool.polyline({
            strokeColor: "#3366FF",
            strokeOpacity: 1,
            strokeWeight: 6,
            // 线样式还支持 'dashed'
            strokeStyle: "solid"
            // strokeStyle是dashed时有效
            // strokeDasharray: [10, 5],
          });
          break;
        }
        case "marker": {
          this.mapData.mouseTool.marker({
            //同Marker的Option设置
          });
          break;
        }
        case "polygon": {
          this.mapData.mouseTool.polygon({
            fillColor: "#00b0ff",
            strokeColor: "#80d8ff"
            //同Polygon的Option设置
          });
          break;
        }
        case "rectangle": {
          this.mapData.mouseTool.rectangle({
            fillColor: "#00b0ff",
            strokeColor: "#80d8ff"
            //同Polygon的Option设置
          });
          break;
        }
        case "circle": {
          this.mapData.mouseTool.circle({
            fillColor: "#00b0ff",
            strokeColor: "#80d8ff"
            //同Circle的Option设置
          });
          break;
        }
      }
    },
    // 分页
    handleSizeChange(val) {
      this.tableQuery.page = 1;
      this.tableQuery.size = val;
      this.getTable();
    },
    handleCurrentChange(val) {
      this.tableQuery.page = val;
      this.getTable();
    }
  }
};
</script>
<style lang="less">
.vehicle-area {
  .btn {
    width: 72px;
    height: 26px;
    display: inline-block;
    font-weight: 400;
    font-size: 12px;
    border: 1px solid #25a5f7;
    background-color: #fff;
    color: #25a5f7;
    border-color: #25a5f7;
    padding: 0.25rem 0.5rem;
    line-height: 1.5;
    border-radius: 1rem;
    cursor: pointer;
  }
  .btn:hover {
    background-color: #25a5f7;
    color: #fff;
  }
  span {
    font-size: 12px;
  }
  .input-card {
    z-index: 88;
    width: 230px;
    height: 97px;
    border-radius: 4px;
    position: fixed;
    right: 10px;
    top: 166px;
    background-color: #fff;
    box-shadow: 0 2px 6px 0 rgba(114, 124, 245, 0.5);
    padding: 9px 15px;
  }
  .input-text {
    margin-right: 38px;
  }
  .input-item {
    margin-bottom: 15px;
    overflow: hidden;
  }
  .input-item-text {
    width: 100%;
    height: 25px;
    line-height: 25px;
    text-align: justify;
    display: inline-block;
    font-size: 12px;
    margin-bottom: 0;
    font-weight: 400;
    color: #495057;
    text-align: center;
    white-space: nowrap;
    background-color: #e9ecef;
    border: 1px solid #ced4da;
    border-radius: 0.25rem;
    border-bottom-right-radius: 0;
    border-top-right-radius: 0;
  }
}
</style>
