<template>
    <div style="width:760px; height:720px;">
        <div style="position:absolute;left:0;right:0;top:0;bottom:0; z-index:1; width:100%;height:100%;" ref="map"></div>
        <el-button v-if="machine_type" style="position:absolute;left:10px;z-index:88;" @click="setMachine" type="primary">设置路线</el-button>
        <div v-if="route_type" style="position:absolute;left:0; z-index:99" class="admin-dialog">
            <div style="width:740px;height:420px;background-color:#fff;border:1px solid #777;padding:20px;">
                <el-form v-model="formData" ref="baseForm">
                    <el-row :gutter="30 ">
                        <el-col :span="24">
                            <el-button type="primary" @click="addForm" size="small">选择车辆</el-button>
                            {{formData.license}}
                        </el-col>
                        <el-col>
                            <el-form-item style="margin:0" label="路线列表:">
                                <el-select size="small">
                                    <el-option></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item style="margin:0" label="事件类型:">
                                <el-radio v-model="formData.type" label="1">追加</el-radio>
                                <el-radio v-model="formData.type" label="2">删除单项</el-radio>
                                <el-radio v-model="formData.type" label="3">删除全部</el-radio>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item style="margin:0" label="路线属性:">
                                <el-checkbox v-model="formData.according_time" style="margin-left:0px;">根据时间</el-checkbox>
                                <el-checkbox v-model="formData.enter_driver" style="margin-left:0px;">进路线报警给驾驶员</el-checkbox>
                                <el-checkbox v-model="formData.out_driver" style="margin-left:0px;">进路线报警给平台</el-checkbox>
                                <el-checkbox v-model="formData.enter_platform" style="margin-left:0px;">出路线报警给驾驶员</el-checkbox>
                                <el-checkbox v-model="formData.out_platform" style="margin-left:0px;">出路线报警给平台</el-checkbox>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item style="margin:0" label="路段属性:">
                                <el-checkbox v-model="formData.travel_time">行驶时间</el-checkbox>
                                <el-checkbox v-model="formData.speed_limit" style="margin-left:20px;">限速</el-checkbox>
                                <el-radio v-model="formData.latitude" label="1" style="margin-left:20px;">北纬</el-radio>
                                <el-radio v-model="formData.latitude" label="2">南纬</el-radio>
                                <el-radio v-model="formData.longitude" label="1">东经</el-radio>
                                <el-radio v-model="formData.longitude" label="2">西经</el-radio>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item style="margin:0" label="时间:">
                                <el-time-picker v-model="formData.time" size="small" style="width:100%;" is-range range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围">
                                </el-time-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item style="margin:0" prop="road_width" label="路段宽度:">
                                <el-input v-model="formData.road_width" size="small"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col v-if="formData.travel_time" :span="12">
                            <el-form-item style="margin:0" label="路段行驶过长阈值:">
                                <el-input v-model="formData.long_threshold" size="small"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col v-if="formData.travel_time" :span="12">
                            <el-form-item style="margin:0" label="路段行驶不足阈值:">
                                <el-input v-model="formData.lack_threshold" size="small"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col v-if="formData.speed_limit" :span="12">
                            <el-form-item style="margin:0" label="路段最高速度:">
                                <el-input v-model="formData.MaxSpeed" size="small"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col v-if="formData.speed_limit" :span="12">
                            <el-form-item style="margin:0;margin-bottom:10px;" label="路段超速持续时间:">
                                <el-input v-model="formData.OverMaxSpeedLastTime" size="small"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-button type="primary" @click="setAttribute" style="display:block;margin:0 auto;" size="small">设置</el-button>
                    </el-row>
                </el-form>
            </div>
            <el-dialog width="50%" title="选择信息" :visible.sync="addDialog" :append-to-body="true" :close-on-click-modal="false" :close-on-press-escape="false" :center="true" class="admin-dialog">
                <choose-vehicle @button="vehicleCallback" @success=" () => {this.addDialog = false;}" :key="addKey"></choose-vehicle>
            </el-dialog>
        </div>
    </div>
</template>
<script>
/*eslint-disable*/
import moment from "moment";
import { initMap } from "@/utils/map.js";
import chooseVehicle from "@/components/choose-vehicle.vue";
export default {
  components: { chooseVehicle },
  data() {
    return {
      machine_type: true,
      route_type: false,
      label: "",
      addKey: 0,
      addDialog: false,
      vehicleData: {},
      mapData: {
        map: {},
        mouseTool: {},
        path: []
      },
      formData: {
        time: "",
        start_time: "",
        end_time: "",
        type: "1",
        license: "",
        according_time: false,
        enter_driver: false,
        outer_driver: false,
        enter_platform: false,
        out_platform: false,
        travel_time: false,
        speed_limit: false,
        latitude: "1",
        longitude: "1",
        road_width: "",
        long_threshold: "",
        lack_threshold: "",
        MaxSpeed: "", //最高速度
        OverMaxSpeedLastTime: "" //超速持续时间
      }
    };
  },
  watch: {
    //       formData:{
    //           handler:function(){
    // if(this.formData)
    //           },
    //           deep:true
    //       }
  },
  mounted() {
    var that = this;
    initMap(() => {
      var map = new AMap.Map(this.$refs.map, {
        zoom: 14
      });
      that.$set(that.mapData, "map", map);
      map.plugin(["AMap.MouseTool"], function() {
        var mouseTool = new AMap.MouseTool(map);
        that.$set(that.mapData, "mouseTool", mouseTool);
        mouseTool.on("draw", function(e) {
          var path = e.obj.getPath();
          that.$set(that.mapData, "path", path);
          that.setRoute();
        });
      });
    });
  },
  methods: {
    addForm() {
      this.addKey++;
      this.addDialog = true;
    },
    vehicleCallback(scope) {
      this.vehicleData = scope.row;
      this.formData.license = scope.row.license;
      this.addDialog = false;
    },
    setMachine() {
      this.machine_type = false;
      this.mapData.mouseTool.polyline({
        strokeColor: "#3366FF",
        strokeOpacity: 1,
        strokeWeight: 6,
        // 线样式还支持 'dashed'
        strokeStyle: "solid"
        // strokeStyle是dashed时有效
        // strokeDasharray: [10, 5],
      });
    },
    setRoute() {
      this.mapData.map.clearMap();
      this.route_type = true;
    },
    setAttribute() {
      if (this.license == "") {
        return this.$notify({
          message: "请选择车辆!",
          title: "提示",
          type: "error"
        });
      } else if (this.formData.time == "") {
        return this.$notify({
          message: "请选择时间!",
          title: "提示",
          type: "error"
        });
      } else if (this.formData.road_width == "") {
        return this.$notify({
          message: "请输入路段宽度!",
          title: "提示",
          type: "error"
        });
      }
      this.route_type = false;
      this.machine_type = true;
      var luduan, luxian;
      luxian = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      luduan = [0, 0, 0, 0, 0, 0, 0, 0];
      if (this.formData.according_time) {
        luxian[15] = 1;
      }
      if (this.formData.enter_driver) {
        luxian[13] = 1;
      }
      if (this.formData.enter_platform) {
        luxian[12] = 1;
      }
      if (this.formData.enter_driver) {
        luxian[11] = 1;
      }
      if (this.formData.out_platform) {
        luxian[10] = 1;
      }
      if (this.formData.travel_time) {
        luduan[7] = 1;
      }
      if (this.formData.speed_limit) {
        luduan[6] = 1;
      }
      if (this.formData.latitude == "1") {
        luduan[5] = 0;
      } else if (this.formData.latitude == "2") {
        luduan[5] = 1;
      }
      if (this.formData.longitude == "1") {
        luduan[4] = 0;
      } else if (this.formData.longitude == "2") {
        luduan[4] = 1;
      }
      var reg = new RegExp(",", "g");
      luxian = parseInt(luxian.toString().replace(reg, ""), 2);
      luduan = parseInt(luduan.toString().replace(reg, ""), 2);
      this.formData.start_time = moment(this.formData.time[0]).format(
        "YYYYMMDDHHmmss"
      );
      this.formData.end_time = moment(this.formData.time[1]).format(
        "YYYYMMDDHHmmss"
      );
      var data = {};
      data = {
        SimID: this.vehicleData.sim_id,
        MessageID: "x8606",
        RouteProperty: luxian, //路线属性
        StartTime: this.formData.start_time, //开始时间
        EndTime: this.formData.end_time, //结束时间
        TurnPoints: []
      };
      this.mapData.path.map((item, index) => {
        data.TurnPoints.push({
          RoutePointId: index, //拐点id
          RouteSegmentId: index, //路段id
          TurnPointLatitude: item.lat, //拐点纬度
          TurnPointLongitude: item.lng, //拐点经度
          RouteSegmentWidth: this.formData.road_width, //路段宽度
          RouteSegmentProperty: luduan, //路段属性
          MaxDriveTimeLimited: this.formData.long_threshold, //路段行驶过长阈值
          MinDriveTimeLimited: this.formData.lack_threshold, //路段行驶不足阈值
          MaxSpeedLimited: this.formData.MaxSpeed, //路段最高速度
          OverMaxSpeedLastTime: this.formData.OverMaxSpeedLastTime //路段超速持续时间
        });
      });
      data = JSON.stringify(data);
      this.$instruction.send(data);
    }
  }
};
</script>