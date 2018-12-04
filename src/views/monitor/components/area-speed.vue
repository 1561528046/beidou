<template>
  <div>
    <el-form :model="speed_limit" label-width="82px" label-position="left">
      <el-row>
        <el-col v-if="attribute" :span="24">
          <el-form-item label="规则名称：">
            <el-input size="small" v-model="speed_limit.rules" style="width:50%"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="时间范围：">
            <el-time-picker v-model="time" is-range value-format="HHmmss" style="width:50%" size="small" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" placeholder="选择时间范围">
            </el-time-picker>
          </el-form-item>
        </el-col>
        <el-col v-if="attribute" :span="24">
          <el-form-item label="限速路段：">
            <el-button size="mini" type="primary" @click="addRoad" icon="el-icon-plus"></el-button>
            <el-table height="200" :data="limit_road" style="width:80%;">
              <el-table-column prop="start" label="起点位置" :formatter="(row)=>{return row.start + 1}"></el-table-column>
              <el-table-column prop="end" label="结束位置" :formatter="(row)=>{return row.end + 1}"></el-table-column>
              <el-table-column prop="MaxSpeed" label="最高速度" :formatter="$utils.baseFormatter"></el-table-column>
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
      <area-route @down="closeInterface" @reply="storageItem" :Index="roadIndex" :road="roadData" :key="addKey"></area-route>
    </el-dialog>
  </div>
</template>
<script>
/*eslint-disable*/
import { initMap } from "@/utils/map.js";
import moment from "moment";
import { AddRegion, GetRegionByPage, DeleteRegion } from "@/api/index.js";
import selectCityInput from "@/components/select-city-input.vue";
import chooseVehicle from "@/components/choose-vehicle.vue";
import areaRoute from "./area-route.vue";
export default {
  components: { selectCityInput, chooseVehicle, areaRoute },
  created() {
    this.$set(this.$data, "roadData", this.$props.line);
  },
  mounted() {},
  data() {
    return {
      time: "",
      roadIndex: [],
      itemDialog: false,
      roadData: [],
      limit_road: [],
      attribute: true,
      according_time: false,
      enter_driver: false,
      outer_driver: false,
      enter_platform: false,
      outer_platform: false,
      addKey: 0,
      speed_limit: {
        rules: ""
      },
      tableQuery: {
        page: 1,
        size: 999
      }
    };
  },
  props: { line: Array },
  watch: {},
  methods: {
    closeInterface() {
      this.itemDialog = false;
    },
    // 删除路段项
    deleteItem(data) {
      var limit = [];
      this.roadIndex.map((itam, index) => {
        if (index < data.end + 1 && index > data.start - 1) {
          this.roadIndex.splice(index, 1);
        }
      });
      this.limit_road.map((item, index) => {
        if (item.start == data.start) {
          this.limit_road.splice(index - 1, 1);
          return false;
        }
        limit.push(item);
      });
      this.$set(this.$data, "limit_road", limit);
    },
    // 添加分段限速信息
    sendInstruction() {
      var turnPoints = [];
      this.limit_road.map(item => {
        this.roadData.map((itam, index) => {
          if (index <= item.end && index >= item.start) {
            turnPoints.push({
              RoutePointId: index, //拐点id
              RouteSegmentId: item.start, //路段id
              TurnPointLatitude: itam.lat, //拐点经度
              TurnPointLongitude: itam.lng, //拐点纬度
              RouteSegmentWidth: item.RouteSegmentWidth, //路段宽度或偏移宽度
              MaxSpeedLimited: item.MaxSpeedLimited, //路段最高速度
              RouteSegmentProperty: item.RouteSegmentProperty, //路段属性
              MaxDriveTimeLimited: item.MaxDriveTimeLimited, //路段行驶过长阈值
              MinDriveTimeLimited: item.MinDriveTimeLimited, //路段行驶不足阈值
              OverMaxSpeedLastTime: item.OverMaxSpeedLastTime //路段超速持续时间
            });
          }
        });
      });
      var data = {
        RegionName: this.speed_limit.rules,
        StartTime: "000000" + this.time[0],
        EndTime: "000000" + this.time[1],
        Type: 5,
        TurnPoints: turnPoints
      };
      AddRegion(data).then(res => {
        if (res.data.code == 0) {
          this.$emit("data", res.data.data);
        } else {
          return this.$notify({
            message: res.data.msg,
            title: "提示",
            type: "error"
          });
        }
      });
    },
    // 存储返回的拐点项
    storageItem(data) {
      this.itemDialog = false;
      this.limit_road.push(data);
      this.roadData.map((item, index) => {
        if (index <= data.end) {
          this.roadIndex.push(index);
        }
      });
    },
    //添加拐点项
    addRoad() {
      this.addKey++;
      this.itemDialog = true;
    }
  }
};
</script>
