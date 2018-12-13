<template>
  <div class="admin-table-container">
    <el-form label-width="120px" @submit.native.prevent ref="baseForm ">
      <el-row :gutter="30 ">
        <el-col :span="24">
          <el-form-item label="选择车辆">
            <el-button type="primary" size="small" @click="addForm">选择车辆</el-button>
            {{license}}
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="选择事件">
            <el-radio v-model="tableQuery.area" label="0">更新区域</el-radio>
            <el-radio style="margin-left:12px;" v-model="tableQuery.area" label="1">追加区域</el-radio>
            <el-radio style="margin-left:12px;" v-model="tableQuery.area" label="2">修改区域</el-radio>
            <el-radio style="margin-left:12px;" v-model="tableQuery.area" label="3">删除区域</el-radio>
            <el-radio style="margin-left:12px;" v-model="tableQuery.area" label="4">删除全部区域</el-radio>
          </el-form-item>
        </el-col>
        <el-col v-if="!delType" :span="24">
          <el-form-item label="选择区域">
            <el-select style="width:20%;" v-model="areaName" size="small" clearable>
              <el-option
                v-for="fence in fenceData"
                :key="fence.RegionId"
                :value="fence.RegionName"
                :label="fence.RegionName"
              >{{fence.RegionName}}</el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col v-if="delType" :span="24">
          <el-form-item label="选择区域类型">
            <el-select style="width:20%;" v-model="areaValue" size="small" clearable>
              <el-option value="1" label="圆形">圆形</el-option>
              <el-option value="2" label="矩形">矩形</el-option>
              <el-option value="3" label="多边形">多边形</el-option>
              <el-option value="5" label="分段限速">分段限速</el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col v-if="lineType" :span="24">
          <el-form-item style="margin:0" label="路线属性:">
            <el-checkbox v-model="route.according_time">根据时间</el-checkbox>
            <el-checkbox v-model="route.enter_driver">进路线报警给驾驶员</el-checkbox>
            <el-checkbox v-model="route.outer_driver">进路线报警给平台</el-checkbox>
            <el-checkbox v-model="route.enter_platform">出路线报警给驾驶员</el-checkbox>
            <el-checkbox v-model="route.outer_platform">出路线报警给平台</el-checkbox>
          </el-form-item>
        </el-col>
        <el-col v-if="areaType" :span="24">
          <el-form-item label="区域属性">
            <el-checkbox v-model="area_attribute.according_time">根据时间</el-checkbox>
            <el-checkbox v-model="area_attribute.speed_limit">限速</el-checkbox>
            <el-checkbox v-model="area_attribute.enter_driver">进区域报警给驾驶员</el-checkbox>;
            <el-checkbox v-model="area_attribute.out_driver">出区域报警给驾驶员</el-checkbox>
            <el-checkbox v-model="area_attribute.enter_platform">进区域报警给平台</el-checkbox>
            <el-checkbox v-model="area_attribute.out_platform">出区域报警给平台</el-checkbox>
            <br>
            <el-radio v-model="area_attribute.latitude" label="1">北纬</el-radio>
            <el-radio v-model="area_attribute.latitude" label="2">南纬</el-radio>
            <el-radio v-model="area_attribute.longitude" label="1">东经</el-radio>
            <el-radio v-model="area_attribute.longitude" label="2">西经</el-radio>
            <el-radio v-model="area_attribute.open_door" label="1">允许开门</el-radio>
            <el-radio v-model="area_attribute.open_door" label="2">禁止开门</el-radio>
            <el-radio v-model="area_attribute.communication_module" label="1">进区域开启通信模块</el-radio>
            <el-radio v-model="area_attribute.communication_module" label="2">进区域关闭通信模块</el-radio>
            <el-radio v-model="area_attribute.GNSS_data" label="1">进区域不采集GNSS详细定位数据</el-radio>
            <el-radio v-model="area_attribute.GNSS_data" label="2">进区域采集GNSS详细定位数据</el-radio>
          </el-form-item>
        </el-col>
        <el-col v-if="areaType" :span="24">
          <el-form-item v-if="limit_type" label="最高速度(km/h)">
            <el-input v-model="tableQuery.MaxSpeed" style="width:20%;" size="small"></el-input>
          </el-form-item>
        </el-col>
        <el-col v-if="areaType" :span="24">
          <el-form-item v-if="limit_type" label="超速持续时间(秒)">
            <el-input v-model="tableQuery.OverSpeedLastTime" style="width:20%;" size="small"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-button
            @click="setting"
            style="display:block; margin:0 auto;"
            size="small"
            type="primary"
          >设置</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-dialog
      width="50%"
      title="选择信息"
      :visible.sync="addDialog"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :center="true"
      class="admin-dialog"
    >
      <choose-vehicle
        @button="vehicleCallback"
        @success=" () => {this.addDialog = false;}"
        :key="addKey"
      ></choose-vehicle>
    </el-dialog>
  </div>
</template>

<script>
/* eslint-disable */
import { GetRegionByPage } from "@/api/index.js";
import chooseVehicle from "@/components/choose-vehicle.vue";
export default {
  components: { chooseVehicle },
  created() {
    this.selectFence();
    this.$instruction.on("x8600", eve => {
      var data = JSON.parse(eve.data);
      if (data.code == "0") {
        return this.$notify({
          message: "指令发送成功",
          title: "提示",
          type: "success"
        });
      }
    });
    this.$instruction.on("x8601", eve => {
      var data = JSON.parse(eve.data);
      if (data.code == "0") {
        return this.$notify({
          message: "指令发送成功",
          title: "提示",
          type: "success"
        });
      }
    });
    this.$instruction.on("x8602", eve => {
      var data = JSON.parse(eve.data);
      if (data.code == "0") {
        return this.$notify({
          message: "指令发送成功",
          title: "提示",
          type: "success"
        });
      }
    });
    this.$instruction.on("x8603", eve => {
      var data = JSON.parse(eve.data);
      if (data.code == "0") {
        return this.$notify({
          message: "指令发送成功",
          title: "提示",
          type: "success"
        });
      }
    });
    this.$instruction.on("x8604", eve => {
      var data = JSON.parse(eve.data);
      if (data.code == "0") {
        return this.$notify({
          message: "指令发送成功",
          title: "提示",
          type: "success"
        });
      }
    });
    this.$instruction.on("x8605", eve => {
      var data = JSON.parse(eve.data);
      if (data.code == "0") {
        return this.$notify({
          message: "指令发送成功",
          title: "提示",
          type: "success"
        });
      }
    });
    this.$instruction.on("x8606", eve => {
      var data = JSON.parse(eve.data);
      if (data.code == "0") {
        return this.$notify({
          message: "指令发送成功",
          title: "提示",
          type: "success"
        });
      }
    });
    this.$instruction.on("x8607", eve => {
      var data = JSON.parse(eve.data);
      if (data.code == "0") {
        return this.$notify({
          message: "指令发送成功",
          title: "提示",
          type: "success"
        });
      }
    });
  },
  computed: {},
  data() {
    return {
      limit_type: false,
      area_attribute: {
        according_time: false, //根据时间
        speed_limit: false, //限速
        enter_driver: false, //进区域报警给驾驶员
        out_driver: false, //出区域报警给驾驶员
        enter_platform: false, //进区域报警给平台
        out_platform: false, //出区域报警给平台
        latitude: "1", //纬度
        longitude: "1", //经度
        open_door: "1", //是否允许开门
        communication_module: "1", //进区域是否开启通信模块
        GNSS_data: "1" //进区域是否采集GNSS详细定位数据
      },
      route: {
        according_time: false,
        enter_driver: false,
        outer_driver: false,
        enter_platform: false,
        outer_platform: false
      },
      tableQuery: {
        MaxSpeed: "", //最高速度
        OverSpeedLastTime: "", //超速持续时间
        vehicleData: {}, //车辆信息
        area: false, //事件
        areaData: {}
      },
      formData: {
        page: 1,
        size: 9999,
        RegionName: "",
        Type: ""
      },
      lineType: false,
      areaType: false,
      areaValue: "",
      update_state: true,
      modify_state: true,
      addKey: 0,
      addDialog: false,
      license: "",
      areaName: "",
      delType: false,
      fenceData: []
    };
  },
  watch: {
    tableQuery: {
      handler: function() {
        if (this.tableQuery.area == "3") {
          this.delType = false;
          this.lineType = false;
          this.areaType = false;
        } else if (this.tableQuery.area == "4") {
          this.delType = true;
          this.lineType = false;
          this.areaType = false;
        } else {
          this.delType = false;
        }
      },
      deep: true
    },
    area_attribute: {
      handler: function() {
        if (this.area_attribute.speed_limit) {
          this.limit_type = true;
        } else {
          this.limit_type = false;
        }
      },
      deep: true
    },
    areaName: function() {
      this.formData.RegionName = this.areaName;
      GetRegionByPage(this.formData).then(res => {
        if (res.data.code == 0) {
          this.$set(this.tableQuery, "areaData", res.data.data[0]);
        }
        if (this.tableQuery.area == "3" || this.tableQuery.area == "4") {
          this.lineType = false;
          this.areaType = false;
        } else {
          if (this.tableQuery.areaData.Type == "5") {
            this.lineType = true;
            this.areaType = false;
          } else {
            this.lineType = false;
            this.areaType = true;
          }
        }
      });
    }
  },
  methods: {
    setting() {
      area_attribute.speed_limit;
      var num = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      if (this.area_attribute.according_time) {
        num[15] = 1;
      }
      if (this.area_attribute.speed_limit) {
        num[14] = 1;
      }
      if (this.area_attribute.enter_driver) {
        num[13] = 1;
      }
      if (this.area_attribute.enter_platform) {
        num[12] = 1;
      }
      if (this.area_attribute.out_driver) {
        num[11] = 1;
      }
      if (this.area_attribute.out_platform) {
        num[10] = 1;
      }
      if (this.area_attribute.latitude == "1") {
        num[9] = 0;
      } else if ((this.area_attribute.latitude = "2")) {
        num[9] = 1;
      }
      if (this.area_attribute.longitude == "1") {
        num[8] = 0;
      } else if (this.area_attribute.longitude == "2") {
        num[8] = 1;
      }
      if (this.area_attribute.open_door == "1") {
        num[7] = 0;
      } else if (this.area_attribute.open_door == "2") {
        num[7] = 1;
      }
      if (this.area_attribute.communication_module == "1") {
        num[1] = 0;
      } else if (this.area_attribute.communication_module == "2") {
        num[1] = 1;
      }
      if (this.area_attribute.communication_module == "1") {
        num[0] = 0;
      } else if (this.area_attribute.communication_module == "2") {
        num[0] = 1;
      }
      var reg = new RegExp(",", "g");
      num = parseInt(num.toString().replace(reg, ""), 2);
      var roadNum = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      if (this.route.according_time) {
        roadNum[15] = 1;
      }
      if (this.route.enter_driver) {
        roadNum[13] = 1;
      }
      if (this.route.outer_driver) {
        roadNum[12] = 1;
      }
      if (this.route.enter_platform) {
        roadNum[11] = 1;
      }
      if (this.route.outer_platform) {
        roadNum[10] = 1;
      }
      var ref = new RegExp(",", "g");
      roadNum = parseInt(roadNum.toString().replace(ref, ""), 2);
      if (this.license == "") {
        return this.$notify({
          message: "请选择车辆!",
          title: "提示",
          type: "error"
        });
      } else if (this.areaName == "" && this.areaValue == "") {
        return this.$notify({
          message: "请选择区域!",
          title: "提示",
          type: "error"
        });
      } else if (!this.tableQuery.area) {
        return this.$notify({
          message: "请选择事件!",
          title: "提示",
          type: "error"
        });
      } else if (this.area_attribute.speed_limit) {
        if (this.tableQuery.MaxSpeed == "") {
          return this.$notify({
            message: "请输入最高速度!",
            title: "提示",
            type: "error"
          });
        } else if (this.tableQuery.OverSpeedLastTime == "") {
          return this.$notify({
            message: "请输入超速持续时间!",
            title: "提示",
            type: "error"
          });
        }
      }

      //圆形区域
      var instruction = {};
      if (this.tableQuery.vehicleData.sim_id.length == 11) {
        this.tableQuery.vehicleData.sim_id =
          "0" + this.tableQuery.vehicleData.sim_id;
      }
      if (this.tableQuery.area == "4") {
        if (this.areaValue == "1") {
          instruction = {
            SimID: this.tableQuery.vehicleData.sim_id,
            MessageID: "x8601",
            CircleAreasCount: "0"
          };
          instruction = JSON.stringify(instruction);
          this.$instruction.send(instruction);
          return;
        } else if (this.areaValue == "2") {
          instruction = {
            SimID: this.tableQuery.vehicleData.sim_id,
            MessageID: "x8603",
            RectangleAreasCount: "0"
          };
          instruction = JSON.stringify(instruction);
          this.$instruction.send(instruction);
          return;
        } else if (this.areaValue == "3") {
          instruction = {
            SimID: this.tableQuery.vehicleData.sim_id,
            MessageID: "x8605",
            PolygonAreasCount: "0"
          };
          instruction = JSON.stringify(instruction);
          this.$instruction.send(instruction);
          return;
        } else if (this.areaValue == "5") {
          instruction = {
            SimID: this.tableQuery.vehicleData.sim_id,
            MessageID: "x8607",
            RoutesCount: "0"
          };
          instruction = JSON.stringify(instruction);
          this.$instruction.send(instruction);
          return;
        }
      }
      //{SimID:"",MessageID:", 设置属性 SetProperty,区域项 CircleAreas:[{区域id CircleAreaId,区域属性 CircleAreaProperty,中心点纬度 CenterLatitude,中心点经度 CenterLongitude,半径 Radius,起始时间 StartTime,结束时间 EndTime,最高速度 MaxSpeed,超速持续时间 OverSpeedLastTime}]}
      if (this.tableQuery.areaData.Type == "1") {
        if (this.tableQuery.area == "3") {
          instruction = {
            SimID: this.tableQuery.vehicleData.sim_id,
            MessageID: "x8601",
            CircleAreaIDs: this.tableQuery.areaData.RegionId
          };
          instruction = JSON.stringify(instruction);
          this.$instruction.send(instruction);
          // 删除
        } else {
          // 更新 追加 修改
          instruction = {
            SimID: this.tableQuery.vehicleData.sim_id,
            MessageID: "x8600",
            SetProperty: this.tableQuery.area,
            CircleAreaId: this.tableQuery.areaData.RegionId,
            CircleAreaProperty: num,
            CenterLatitude: this.tableQuery.areaData.CenterLatitude,
            CenterLongitude: this.tableQuery.areaData.CenterLongitude,
            Radius: this.tableQuery.areaData.Radius,
            StartTime: this.tableQuery.areaData.StartTime,
            EndTime: this.tableQuery.areaData.EndTime,
            MaxSpeed: this.tableQuery.MaxSpeed,
            OverSpeedLastTime: this.tableQuery.OverSpeedLastTime
          };
          instruction = JSON.stringify(instruction);
          this.$instruction.send(instruction);
        }
      } else if (this.tableQuery.areaData.Type == "2") {
        if (this.tableQuery.area == "3") {
          // 删除
          instruction = {
            SimID: this.tableQuery.vehicleData.sim_id,
            MessageID: "x8603",
            RectangleAreaIDs: this.tableQuery.areaData.RegionId
          };
          instruction = JSON.stringify(instruction);
          this.$instruction.send(instruction);
        } else {
          instruction = {
            SimID: this.tableQuery.vehicleData.sim_id,
            MessageID: "x8602",
            SetProperty: this.tableQuery.area,
            RectangleAreaId: this.tableQuery.areaData.RegionId,
            RectangleAreaProperty: num,
            LeftTopLatitude: this.tableQuery.areaData.LeftTopLatitude,
            LeftTopLongitude: this.tableQuery.areaData.LeftTopLongitude,
            RightBottomLatitude: this.tableQuery.areaData.RightBottomLatitude,
            RightBottomLongitude: this.tableQuery.areaData.RightBottomLongitude,
            StartTime: this.tableQuery.areaData.StartTime,
            EndTime: this.tableQuery.areaData.EndTime,
            MaxSpeed: this.tableQuery.MaxSpeed,
            OverSpeedLastTime: this.tableQuery.OverSpeedLastTime
          };
          instruction = JSON.stringify(instruction);
          this.$instruction.send(instruction);
        }
      } else if (this.tableQuery.areaData.Type == "3") {
        if (this.tableQuery.area == "3") {
          // 删除
          instruction = {
            SimID: this.tableQuery.vehicleData.sim_id,
            MessageID: "x8605",
            PolygonAreaIDs: this.tableQuery.areaData.RegionId
          };
          instruction = JSON.stringify(instruction);
          this.$instruction.send(instruction);
        } else {
          var location = [];
          var lat = this.tableQuery.areaData.Latitude.split(",");
          var lng = this.tableQuery.areaData.Longitude.split(",");
          lng.map((item, index) => {
            location.push({ Latitude: lat[index], Longitude: item });
          });
          instruction = {
            SimID: this.tableQuery.vehicleData.sim_id,
            MessageID: "x8604",
            PolygonAreaId: this.tableQuery.areaData.RegionId,
            PolygonAreaProperty: num,
            StartTime: this.tableQuery.areaData.StartTime,
            EndTime: this.tableQuery.areaData.EndTime,
            MaxSpeed: this.tableQuery.MaxSpeed,
            OverSpeedLastTime: this.tableQuery.OverSpeedLastTime,
            Nodes: location
          };
          instruction = JSON.stringify(instruction);
          this.$instruction.send(instruction);
        }
      } else if (this.tableQuery.areaData.Type == "5") {
        console.log(1);
        if (this.tableQuery.area == "3") {
          instruction = {
            SimID: this.tableQuery.vehicleData.sim_id,
            MessageID: "x8607",
            RouteIDs: this.tableQuery.areaData.RegionId
          };
          instruction = JSON.stringify(instruction);
          this.$instruction.send(instruction);
          return;
        } else {
          instruction = {
            SimID: this.tableQuery.vehicleData.sim_id,
            MessageID: "x8606",
            RouteId: this.tableQuery.areaData.RegionId,
            RouteProperty: roadNum,
            StartTime: this.tableQuery.areaData.StartTime,
            EndTime: this.tableQuery.areaData.EndTime,
            TurnPoints: this.tableQuery.areaData.TurnPoints
          };
          instruction = JSON.stringify(instruction);
          this.$instruction.send(instruction);
        }
      }
    },
    addForm() {
      this.addKey++;
      this.addDialog = true;
    },
    selectFence() {
      GetRegionByPage(this.formData).then(res => {
        if (res.data.code == 0) {
          var arr = [];
          res.data.data.map(item => {
            if (item.Type == "4" || item.Type == "7" || item.Type == "6") {
              return;
            }
            arr.push(item);
          });
          this.$set(this.$data, "fenceData", arr);
        } else {
          return this.$notify({
            message: res.data.msg,
            title: "提示",
            type: "error"
          });
        }
      });
    },
    vehicleCallback(scope) {
      this.tableQuery.vehicleData = scope.row;
      this.license = scope.row.license;
      this.addDialog = false;
    }
  }
};
</script>
<style lang="less">
</style>