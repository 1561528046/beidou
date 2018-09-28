<template slot-scope="scope">
  <div style="width:760px; height:420px; border:1px solid #777; background-color:#fff;">
    <!-- 地图 -->
    <div style="position:absolute;left:0;right:0;top:0;bottom:0; z-index:1;" ref="map"></div>
    <!-- 自定义区域 -->
    <el-dialog width="20%" @close="down(2)" :visible.sync="addDialog " :append-to-body="true " :close-on-click-modal="false " :close-on-press-escape="false " :center="true " class="admin-dialog">
      <el-form :model="formdata">
        <el-row :gutter="30">
          <el-col :span="24">
            <el-form-item label="名称" prop="name">
              <el-input size="small" v-model="formdata.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="报警类型" prop="alarm_type">
              <el-select size="small" v-model="formdata.alarm_type" style="width:100%;">
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
        </el-row>
        <div style="width:150px;margin:0 auto;">
          <el-button @click="save" type="primary">保存</el-button>
          <el-button @click="down(2)" type="primary">关闭</el-button>
        </div>
      </el-form>
    </el-dialog>
    <!-- 行政区域 -->
    <el-dialog width="20%" @close="down(1)" :visible.sync="nocustom" :append-to-body="true " :close-on-click-modal="false " :close-on-press-escape="false " :center="true " class="admin-dialog">
      <el-form :model="formdata">
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
              <el-input size="small" v-model="xingzheng" type="text"></el-input>
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
        <el-radio style="margin-left:0;padding-left:0" @change="selectRadio" v-model="radio" label="circle">画圆</el-radio>
        <el-radio style="margin-left:15px;padding-left:0" @change="selectRadio" v-model="radio" label="rectangle">画矩形</el-radio>
        <el-radio style="margin-left:15px;padding-left:0" @change="selectRadio" v-model="radio" label="polygon">画多边形</el-radio>
      </div>
      <div class="input-item item-btn" style="margin-top:24px; width:227px;margin:0 auto;">
        <el-button @click="close" size="mini" icon="iconfont icon-tuodong"></el-button>
        <el-button class="btn" @click="down(2)" style="margin-left:95px;">关闭绘图</el-button>
      </div>
    </div>
    <!-- 列表 -->
    <div v-show="areaType" style="width:760px;height:420px; position:absolute;left:0;right:0;top:0;bottom:0;border:1px solid #777; z-index:99;background-color:#fff; ">
      <el-form :model="tableQuery " ref="baseForm ">
        <el-row :gutter="30 ">
          <el-col :span="10 ">
            <el-form-item label="名称 " prop="name ">
              <el-input v-model="tableQuery.AreaName " size="small "></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10 ">
            <el-form-item label="管理类型 " prop="type ">
              <el-input v-model="tableQuery.type " size="small "></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4 ">
            <el-form-item style="text-align:center;margin-top:40px; ">
              <el-button type="primary " @click="selectForm " size="small ">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-button type="primary " @click="addForm(1)" size="small ">添加行政区域</el-button>
        <el-button type="primary " @click="addForm(2)" size="small ">添加自定义区域</el-button>
      </el-form>
      <el-table :data="tableData.data" size="small">
        <el-table-column prop="AreaId" label="序号 " :formatter="$utils.baseFormatter "> </el-table-column>
        <el-table-column prop="type" label="管理类型 " :formatter="$utils.baseFormatter "> </el-table-column>
        <el-table-column prop="AreaName" label="名称 " :formatter="$utils.baseFormatter "> </el-table-column>
        <el-table-column prop="AreaProperty" label="报警类型 " :formatter="$utils.baseFormatter "> </el-table-column>
        <el-table-column prop="time" label="时间 " :formatter="$utils.baseFormatter "> </el-table-column>
        <el-table-column width="150" label="操作 ">
          <template slot-scope="scope ">
            <label style="margin-right:3px; ">添加车辆</label>
            <label @click="delForm(scope)" style="margin-right:3px; ">删除</label>
            <el-dialog width="15%" :visible.sync="delDialog" :append-to-body="true " :close-on-click-modal="false " :close-on-press-escape="false " :center="true " class="admin-dialog">
              <div style="width:142px;margin:0 auto;margin-top:-25px;">
                <el-button @click="del" type="primary">确定</el-button>
                <el-button @click="delDialog=false" type="primary">取消</el-button>
              </div>
            </el-dialog>
            <label @click="selceForm(scope)">查看</label>
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
import {initMap} from "@/utils/map.js";
import moment from "moment";
import { AddRegion, GetRegionByPage, DeleteRegion } from "@/api/index.js";
export default {
  created() {
    this.getTable();
    this.socket = new WebSocket("ws://127.0.0.1:5000");
  },
  mounted() {
    var vm = this;
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
          }
          map.remove(overlays);
          vm.addDialog = true;
        });
        vm.$set(vm.mapData, "overlays", overlays);
      });
      var district,
        polygons = [];
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
      // 绘制圆
      var circle = new AMap.Circle({
        center: [116.433322, 39.900255],
        radius: 1000, //半径
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
      vm.$set(vm.mapData, "circle", circle);
      // 绘制矩形
      var southWest = new AMap.LngLat(116.356449, 39.859008);
      var northEast = new AMap.LngLat(116.417901, 39.893797);
      var bounds = new AMap.Bounds(southWest, northEast);
      var rectangle = new AMap.Rectangle({
        bounds: bounds,
        strokeColor: "red",
        strokeWeight: 6,
        strokeOpacity: 0.5,
        strokeDasharray: [30, 10],
        // strokeStyle还支持 solid
        strokeStyle: "dashed",
        fillColor: "blue",
        fillOpacity: 0.5,
        cursor: "pointer",
        zIndex: 50
      });
      vm.$set(vm.mapData, "rectangle", rectangle);
    });
  },
  data() {
    return {
      AreaId: "",
      radio: false,
      label: "",
      level: "",
      areaType: true,
      custom: false,
      nocustom: false,
      xingzheng: "",
      addDialog: false,
      delDialog: false,
      addKey: 0,
      mapData: {
        map: {},
        mouseTool: {},
        district: {},
        circle: {},
        rectangle:{},
        polygons: [],
        overlays: [],
        radios: {}
      },
      tableQuery: {
        AreaName: "",
        type: "",
        alarm_type: "",
        page: 1,
        size: 10
      },
      formdata: {
        name: "",
        type: "",
        time: "",
        start_time: "",
        stop_time: ""
      },
      tableData: {
        total: 1,
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
    selceForm(scope) {
      console.log(scope);
      this.mapData.circle.setMap(this.mapData.map);
      // 缩放地图到合适的视野级别
      this.mapData.map.setFitView([this.mapData.circle]);
    },
    delForm(scope) {
      this.AreaId = scope.row.AreaId;
      this.delDialog = true;
    },
    del() {
      DeleteRegion({ AreaId: this.AreaId }).then(res => {
        if (res.data.code == 0) {
          this.getTable();
          this.delDialog = false;
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
          this.$set(this.tableData, "data", res.data.data);
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
      this.mapData.district.setLevel(this.xingzheng);
      var vs = this;
      var data = {};
      var type = "3";
      this.mapData.district.search(this.xingzheng, function(status, result) {
        if (result.districtList[0].boundaries.length > 1) {
          type = "4";
        }
        result.districtList[0].boundaries.map(item => {
          item.map(my => {});
        });
        vs.mapData.map.remove(vs.mapData.polygons); //清除上次结果
        vs.mapData.polygons = [];
        var bounds = result.districtList[0].boundaries;
        if (bounds) {
          for (var i = 0, l = bounds.length; i < l; i++) {
            //生成行政区划polygon
            var polygon = new AMap.Polygon({
              strokeWeight: 1,
              path: bounds[i],
              fillOpacity: 0.4,
              fillColor: "#80d8ff",
              strokeColor: "#0091ea"
            });
            vs.mapData.polygons.push(polygon);
          }
        }
        vs.mapData.map.add(vs.mapData.polygons);
        vs.mapData.map.setFitView(vs.mapData.polygons); //视口自适应
      });
      this.formdata.start_time =
        "000000" + moment(this.formdata.time[0]).format("HHmmss");
      this.formdata.stop_time =
        "000000" + moment(this.formdata.time[1]).format("HHmmss");
      data = {
        AreaProperty: this.formdata.alarm_type,
        AreaName: this.formdata.name,
        StartTime: this.formdata.start_time,
        EndTime: this.formdata.stop_time,
        type: type
      };
      AddRegion(data).then(res => {
        if (res.data.code == 0) {
          this.getTable();
          this.down();
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
        data = {
          AreaProperty: this.formdata.alarm_type,
          AreaName: this.formdata.name,
          StartTime: this.formdata.start_time,
          EndTime: this.formdata.stop_time,
          CenterLatitude: this.mapData.overlays[0].lat,
          CenterLongitude: this.mapData.overlays[0].lng,
          Radius: this.mapData.overlays[1],
          type: "1"
        };
        AddRegion(data).then(res => {
          if (res.data.code == 0) {
            this.getTable();
            this.down();
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
          AreaName: this.formdata.name,
          StartTime: this.formdata.start_time,
          EndTime: this.formdata.stop_time,
          LeftTopLatitude: this.mapData.overlays[0].path[0].lat,
          LeftTopLongitude: this.mapData.overlays[0].path[0].lng,
          RightBottomLatitude: this.mapData.overlays[0].path[3].lat,
          RightBottomLongitude: this.mapData.overlays[0].path[3].lng,
          type: "2"
        };
        AddRegion(data).then(res => {
          if (res.data.code == 0) {
            this.getTable();
            this.down();
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
          lng = lng + item.lng + ";";
        });
        lat = lat.substring(0, lat.lastIndexOf(","));
        lng = lng.substring(0, lng.lastIndexOf(","));
        data = {
          AreaProperty: this.formdata.alarm_type,
          AreaName: this.formdata.name,
          StartTime: this.formdata.start_time,
          EndTime: this.formdata.stop_time,
          Latitude: lat,
          Longitude: lng,
          type: "3"
        };
        AddRegion(data).then(res => {
          if (res.data.code == 0) {
            this.getTable();
            this.down();
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
      this.areaType = false;
      if (type == 1) {
        this.nocustom = true;
      } else {
        this.custom = true;
      }
    },
    // 关闭弹出块,关闭绘图
    down(type) {
      if (type == 1) {
        this.nocustom = false;
        this.mapData.map.remove(this.mapData.polygons);
      } else {
        this.custom = false;
      }
      this.addDialog = false;
      this.areaType = true;
      this.radio = false;
      this.formdata.time = "";
      this.formdata.name = "";
      this.formdata.alarm_type = "";
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
    // 列表查询
    selectForm() {},
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
<style>
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
  bottom: 10px;
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
</style>
