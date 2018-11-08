<template>
  <div class="admin-table-container">
    <el-form :model="speed_limit" label-width="100px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="选择车辆">
            <el-button type="primary" size="small" @click="addForm">选择车辆</el-button>
            {{license}}
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="规则名称：">
            <el-input size="small" v-model="speed_limit.rules" style="width:20%"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="线路：">
            <el-select @change="selectRoad" style="width:20%" v-model="line" size="small">
              <el-option v-for="line in lineData" :key="line.RegionId" :value="line.RegionName" :label="line.RegionName"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="24">
                    <el-form-item label="时间范围：">
                        <el-date-picker v-model="speed_limit.time" value-format="yyyy-MM-DD HH:mm:ss" style="width:20%;" size="small" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                </el-col> -->
        <el-col :span="24">
          <el-form-item style="margin:0" label="路线属性:">
            <el-checkbox v-model="according_time" style="margin-left:0px;">根据时间</el-checkbox>
            <el-checkbox v-model="enter_driver" style="margin-left:5px;">进路线报警给驾驶员</el-checkbox>
            <el-checkbox v-model="outer_driver" style="margin-left:5px;">进路线报警给平台</el-checkbox>
            <el-checkbox v-model="enter_platform" style="margin-left:0px;">出路线报警给驾驶员</el-checkbox>
            <el-checkbox v-model="outer_platform" style="margin-left:5px;">出路线报警给平台</el-checkbox>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="限速路段：">
            <el-button size="mini" type="primary" @click="addRoad" icon="el-icon-plus"></el-button>
            <el-table height="200" :data="limit_road" style="width:40%;">
              <el-table-column prop="start" label="起点位置" :formatter="(row)=>{return row.start + 1}"></el-table-column>
              <el-table-column prop="end" label="结束位置" :formatter="(row)=>{return row.end + 1}"></el-table-column>
              <el-table-column prop="MaxSpeedLimited" label="最高速度" :formatter="$utils.baseFormatter"></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button @click="deleteItem(scope.row)" type="danger" icon="el-icon-delete" size="mini" circle></el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-col>
        <el-col style="text-align:center;">
          <el-button type="primary" @click="sendInstruction" size="small">设置</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-dialog width="60%" title="分段限速" :visible.sync="itemDialog" :append-to-body="true" :close-on-click-modal="false" :close-on-press-escape="true" :center="true" class="admin-dialog">
      <area-route @down="closeInterface" @reply="storageItem" :road="roadData" :key="addKey"></area-route>
    </el-dialog>
    <el-dialog width="50%" title="选择信息" :visible.sync="addDialog" :append-to-body="true" :close-on-click-modal="false" :close-on-press-escape="false" :center="true" class="admin-dialog">
      <choose-vehicle @button="vehicleCallback" @success=" () => {this.addDialog = false;}" :key="addKey"></choose-vehicle>
    </el-dialog>
  </div>
</template>
<script>
/*eslint-disable*/
import { initMap } from "@/utils/map.js";
import moment from "moment";
import { AddRegion, GetRegionByPage, DeleteRegion } from "@/api/index.js";
import selectCityInput from "@/components/select-city-input.vue";
import areaRoute from "./area-route.vue";
import chooseVehicle from "@/components/choose-vehicle.vue";
export default {
  components: { selectCityInput, areaRoute, chooseVehicle },
  created() {
    this.getTable();
  },
  mounted() {},
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
      vehicleData: {},
      license: "",
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
        // time: "",
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
        page: 1,
        size: 999
      },
      formdata: {
        area: {},
        name: "",
        type: "",
        time: "",
        alarm_type: "",
        start_time: "",
        stop_time: ""
      },
      tableData: {
        total: 0,
        data: []
      }
    };
  },
  methods: {
    closeInterface() {
      this.itemDialog = false;
    },
    // 区域列表
    getTable() {
      GetRegionByPage(this.tableQuery).then(res => {
        if (res.data.code == 0) {
          res.data.data.map(item => {
            if (item.Type == "5") {
              this.lineData.push(item);
            }
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
    //   选择车辆
    vehicleCallback(scope) {
      this.vehicleData = scope.row;
      this.license = scope.row.license;
      this.addDialog = false;
    },
    //
    addForm() {
      this.addKey++;
      this.addDialog = true;
    },
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
    // 发送分段限速指令
    sendInstruction() {
      if (this.license == "") {
        return this.$notify({
          message: "请选择车辆!",
          title: "提示",
          type: "error"
        });
      } else if (this.speed_limit.rules == "") {
        return this.$notify({
          message: "请输入规则名称!",
          title: "提示",
          type: "error"
        });
      } else if (this.line == "") {
        return this.$notify({
          message: "请选择线路!",
          title: "提示",
          type: "error"
        });
      } else if (this.limit_road.length < 1) {
        return this.$notify({
          message: "限速规则最少一项!",
          title: "提示",
          type: "error"
        });
      }
      //   else if (this.speed_limit.time == "" || this.speed_limit.time == null) {
      //     return this.$notify({
      //       message: "请选择时间!",
      //       title: "提示",
      //       type: "error"
      //     });
      //   }
      var data = {};
      var roadNum = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      if (this.according_time) {
        roadNum[15] = 1;
      }
      if (this.enter_driver) {
        roadNum[13] = 1;
      }
      if (this.outer_driver) {
        roadNum[12] = 1;
      }
      if (this.enter_platform) {
        roadNum[11] = 1;
      }
      if (this.outer_platform) {
        roadNum[10] = 1;
      }
      var reg = new RegExp(",", "g");
      roadNum = parseInt(roadNum.toString().replace(reg, ""), 2);

      var start_time = "";
      //   start_time = this.speed_limit.time[0];
      var end_time = "";
      //   end_time = this.speed_limit.time[1];
      var sim_id = "";
      if (this.vehicleData.sim_id.length == 11) {
        sim_id = "0" + this.vehicleData.sim_id;
      } else {
        sim_id = this.vehicleData.sim_id;
      }
      var TurnPoints = [];
      this.limit_road.map(it => {
        it.point.map(item => {
          TurnPoints.push({
            RoutePointId: item.id, // 拐点ID
            RouteSegmentId: item.id, // 路段ID
            TurnPointLatitude: item.lat, // 拐点纬度
            TurnPointLongitude: item.lng, // 拐点经度
            RouteSegmentWidth: it.RouteSegmentWidth, // 路段宽度
            RouteSegmentProperty: it.RouteSegmentProperty, // 路段属性
            MaxDriveTimeLimited: it.MaxDriveTimeLimited, // 路段行驶过长阈值
            MinDriveTimeLimited: it.MinDriveTimeLimited, // 路段行驶不足阈值
            MaxSpeedLimited: it.MaxSpeedLimited, // 路段最高速度
            OverMaxSpeedLastTime: it.OverMaxSpeedLastTime // 路段超速持续时间
          });
        });
      });
      data = {
        SimID: sim_id,
        MessageID: "x8606",
        RouteId: this.roadData[0].RegionId, //路线id
        RouteProperty: roadNum, // 路线属性
        StartTime: this.roadData[0].StartTime, // 起始时间
        EndTime: this.roadData[0].EndTime, // 结束时间
        // RoutePointsCount: "", // 路线总拐点数
        TurnPoints: TurnPoints
      };
      data = JSON.stringify(data);
      this.$instruction.send(data);
    },
    // 存储返回的拐点项
    storageItem(data) {
      this.itemDialog = false;
      var arr = this.limit_road;
      data.map(item => {
        arr.push(item);
      });
      this.$set(this.$data, "limit_road", arr);
      this.roadData.copy = arr.copy;
    },
    // 查询所选择的路线
    selectRoad(name) {
      this.limit_road = [];
      var data = {};
      data = {
        page: 1,
        size: 999,
        RegionName: name
      };
      GetRegionByPage(data).then(res => {
        if (res.data.code == 0) {
          res.data.data.map(item => {
            item.copy = [];
          });
          this.$set(this.$data, "roadData", res.data.data);
        }
      });
    },
    //添加拐点项
    addRoad() {
      if (this.line == "") {
        return this.$notify({
          message: "请选择线路!",
          title: "提示",
          type: "error"
        });
      }
      this.addKey++;
      this.itemDialog = true;
    },
    // 分段限速
    speedLimit() {
      this.speedDialog = true;
      this.getLine();
    }
  }
};
</script>
