<template>
  <div style="height:100%;position:relative;">
    <div class="monitor-nav">
      <i class="iconfont icon-unorderedlist _header"></i>
      <div class="_list">
        <a href="#">
          <i class="iconfont icon-guiji"></i>
          <span>轨迹回放</span>
        </a>
        <a href="#">
          <i class="iconfont icon-weilan"></i>
          <span>围栏管理</span>
        </a>
      </div>
    </div>
    <el-tabs v-model="currentTab" style="height:100%;" class="monitor-tabs" @tab-remove="tabRemove">
      <el-tab-pane label="监控" :closable="false" name="index">
        <div class="monitor">
          <div id="container" style="width:100%;height:100%;"></div>
          <div class="vehicle-search shadow-box">
            <el-autocomplete v-model="searchVehicle" :fetch-suggestions="vehicleSearch" placeholder="搜索车辆（车牌号、终端ID）" @select="vehicleSelected" size="small" prefix-icon="el-icon-search" style="width:100%;">
            </el-autocomplete>
          </div>
          <transition-group name="list-complete" tag="div" class="current-vehicle-container">
            <vehicle-monitor class="list-complete-item" :closeable="true" @close="removeCurrentVehicle(vehicle.sim_id)" v-for="(vehicle,index) in currentVehicles" :vehicle="vehicle" :index="index" :key="vehicle.vehicle_id"></vehicle-monitor>
          </transition-group>

          <el-collapse accordion class="status-container shadow-box" @change="toggleUserList">
            <el-collapse-item class="group-container">
              <template slot="title">
                <div class="_header">
                  <span class="_global-status" @click.stop="showVehicleAll('total')">平台车辆总数：
                    <strong>{{vehicleCount.online + vehicleCount.offline}}</strong>
                  </span>
                  <span class="_global-status _online" @click.stop="showVehicleAll('online')">在线车辆：
                    <strong>{{vehicleCount.online}}</strong>
                  </span>
                  <span class="_global-status _alarm" @click.stop="showVehicleAll('alarm')">报警车辆：
                    <strong>{{vehicleCount.alarm}}</strong>
                  </span>
                  <span class="_global-status _error" @click.stop="showVehicleAll('error')">异常车辆：
                    <strong>{{vehicleCount.error}}</strong>
                  </span>
                  <span class="_global-status _offline" @click.stop="showVehicleAll('offline')">离线车辆：
                    <strong>{{vehicleCount.offline}}</strong>
                  </span>
                </div>
                <div>
                  <!-- <select-sim></select-sim> -->
                  <!-- <select-device></select-device> -->
                </div>
              </template>
              <div class="_body">
                <el-form :inline="true" size="mini" class="_search" @submit.native.prevent>
                  <el-form-item label="企业名称">
                    <el-input placeholder="企业名称" v-model="userListQuery.real_name"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" native-type="submit" @click="searchUserList">查询</el-button>
                  </el-form-item>
                </el-form>
                <div class="_table">
                  <el-table :data="userList" size="small" style="width: 100%" @cell-click="showVehicleWithGroup" key="user-table">
                    <el-table-column prop="user_name" label="用户名称" width="180">
                    </el-table-column>
                    <el-table-column prop="total" label="车辆总数">
                      <template slot-scope="scope">
                        {{scope.row.online + scope.row.offline}}
                      </template>
                    </el-table-column>
                    <el-table-column prop="online" label="在线车辆 ">
                    </el-table-column>
                    <el-table-column prop="alarm" label="报警车辆  ">
                    </el-table-column>
                    <el-table-column prop="error" label="异常车辆  ">
                    </el-table-column>
                    <el-table-column prop="offline" label="离线车辆 ">
                    </el-table-column>
                  </el-table>

                </div>
                <div class="_pager">
                  <el-pagination background layout="prev, pager, next" :total="userListQuery.total" @current-change="userListCurrentChange" :page-size="userListQuery.size">
                  </el-pagination>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
          <transition name="fade" enter-active-class="fadeInLeft" leave-active-class="fadeOutLeft">
            <vehicle-details @close="closeShowVehicle" @open-single="addSingleVehicle" :vehicle="currentGroup" :show-vehicle="showVehicle"></vehicle-details>
          </transition>
        </div>
      </el-tab-pane>
      <el-tab-pane label="冀R12345" :closable="true" name="x">
        <vehicle-area></vehicle-area>
      </el-tab-pane>
      <el-tab-pane label="冀R12345" :closable="true" v-for="vehicle in singleVehicle" :name="'single-'+vehicle.sim_id" :key="'single-'+vehicle.sim_id">
        <vehicle-single :vehicle="vehicle"></vehicle-single>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>



<script>
/*eslint-disable*/
import {
  getInitVehicle,
  getUserList,
  getGroupByUser,
  getUser
} from "@/api/index.js";
import { initMap } from "@/utils/map.js";
import { GPS } from "@/utils/map-tools.js";
import vehicleMonitor from "./components/vehicle-monitor.vue";
import vehicleDetails from "./components/vehicle-details.vue";
import vehicleSingle from "./components/vehicle-single.vue";
import vehicleArea from "./components/vehicle-area.vue";
import vehiclePlayback from "./components/vehicle-playback.vue";
import vehicleAlarm from "./components/vehicle-alarm.vue";
import selectDevice from "./components/select-device.vue";
import selectSim from "./components/select-sim.vue";
window.monitor = {};
export default {
  name: "monitor",
  components: { vehicleMonitor, vehicleDetails, vehicleArea, vehicleSingle },
  data() {
    return {
      searchVehicle: "",
      initLoader: {},
      currentGroup: {},
      showVehicle: {
        group_id: "",
        isShow: false,
        isShowAll: false,
        type: "",
        sub_title: ""
      },
      currentVehiclesSet: new Set(), //小地图查看的车去重SET
      currentVehicles: [], //小地图查看的车
      currentTab: "index",
      maps: [],
      alarmList: {},
      errorList: {},
      onlineList: {},
      offlineList: {},
      vehicleCount: {
        alarm: 0,
        online: 0,
        offline: 0,
        error: 0
      },
      userList: [],
      userListQuery: {
        real_name: "",
        size: 10,
        page: 1,
        total: 0
      },
      singleVehicle: [], //单车监控车辆
      singleVehicleSet: new Set() //单车监控去重Set
    };
  },
  watch: {
    userList: function() {}
  },
  created() {
    // this.init();
    var vm = this;
    window.monitor = {
      data: new Map(), //所有数据
      dict: {
        //字典
        alarm: new Set(), //报警
        online: new Set(), //在线
        offline: new Set(), //离线
        error: new Set(), //异常
        groups: new Map() //group_id为key value为一个Map对象，包括alarm online offline error4个Set对象以及一个普通对象data 存放group原有信息
      },
      init(data, groups) {
        vm.initLoader.setText("建立数据字典");
        //建立分组字典
        this.initGroupDict(groups);
        //初始化车辆
        //1、车辆放入对应分组、并区分状态
        //2、区分总的在线、离线、报警、异常
        data.map(vehicle => {
          //根据sim_id 创建所有数据集合的MAP对象
          this.data.set(vehicle.sim_id, vehicle);

          if (vehicle.alarm_count != "0") {
            this.dict.alarm.add(vehicle.sim_id);
            //车辆所对应的分组 均加入记录
            this.setGroupDict(vehicle.group_path, "alarm", vehicle.sim_id);
          }
          if (
            new Date() - new Date(vehicle.time) >
            vm.$dict.ONLINE_TIMEOUT * 5
          ) {
            vehicle.online = true;
            this.dict.online.add(vehicle.sim_id);
            this.setGroupDict(vehicle.group_path, "online", vehicle.sim_id);
          } else {
            vehicle.online = false;
            this.dict.offline.add(vehicle.sim_id);
            this.setGroupDict(vehicle.group_path, "offline", vehicle.sim_id);
          }
        });
        vm.initLoader.close();
        initMap(() => {
          // vm.$nextTick(() => {
          //   initAMapUI();
          //   this.initMap();
          // });
        });
        setInterval(() => {
          this.setCount();
          this.setUserCount();
          // this.setCurrentGroup();
        }, 0);
      },
      initGroupDict(groups) {
        //后台接口、根据当前用户分组 获取所有分组（平铺）
        groups.map(group => {
          var groupVehicleMap = new Map();
          groupVehicleMap.set("alarm", new Set());
          groupVehicleMap.set("online", new Set());
          groupVehicleMap.set("offline", new Set());
          groupVehicleMap.set("error", new Set());
          groupVehicleMap.set("data", group);
          this.dict.groups.set(group.group_id.toString(), groupVehicleMap);
        });
      },
      setGroupDict(groups, status, sim_id) {
        //传入groups 可以是String Array （String自动转为Array）
        //status 状态类表 alarm online offline error
        if (typeof groups == "string") {
          groups = [groups];
        }
        if (!groups.length) {
          return false;
        }
        var groupDict = this.dict.groups;
        groups.map(groups_id => {
          if (groups_id) {
            var group = groupDict.get(groups_id.toString());
            if (group) {
              group.get(status).add(sim_id);
            }
          }
        });
      },
      deleteGroupDict(groups, status, sim_id) {
        //传入groups 可以是String Array （String自动转为Array）
        //status 状态类表 alarm online offline error
        if (typeof groups == "string") {
          groups = [groups];
        }
        if (!groups.length) {
          return false;
        }
        var groupDict = this.dict.groups;
        groups.map(groups_id => {
          if (groups_id) {
            groupDict
              .get(groups_id.toString())
              .get(status)
              .delete(sim_id);
          }
        });
      },
      initMap() {
        var map = new AMap.Map("container", {
          //viewMode: "3D",
          //pitch: 55,
          // rotation: -45,
          // features: ["bg", "road"],
          zoom: 4
        });
        AMapUI.load(
          ["ui/geo/DistrictCluster", "lib/$"],
          (DistrictCluster, $) => {
            var distCluster = new DistrictCluster({
              map: map, //所属的地图实例
              zIndex: 11,
              autoSetFitView: false,
              getPosition: function(item) {
                return [item.lng, item.lat];
              }
            });
            setInterval(() => {
              distCluster.setData([...this.data.values()]);
            }, 15000);
          }
        );
      },

      setUserCount() {
        vm.userList.map(user => {
          var groupDict = this.dict.groups.get(user.group_id);
          user.alarm = groupDict.get("alarm").size;
          user.online = groupDict.get("online").size;
          user.offline = groupDict.get("offline").size;
          user.error = groupDict.get("error").size;
        });
      },
      setVehicleData(vehicleData) {
        if (this.data.has(vehicleData.sim_id)) {
          if (vehicleData.alarm != "") {
            this.setAlarm(vehicleData);
          }
          if (
            new Date() - new Date(vehicleData.time) >
            vm.$dict.ONLINE_TIMEOUT
          ) {
            this.setOnline(vehicleData);
          } else {
            this.setOffline(vehicleData);
          }
        }
      },
      setOnline(vehicle) {
        //离线中删除、加入在线字典
        var vehicleData = this.data.get(vehicle.sim_id);
        if (vehicleData) {
          vehicleData.online = true;
        }

        this.dict.offline.delete(vehicle.sim_id);
        this.dict.online.add(vehicle.sim_id);
        var groups = this.data.get(vehicle.sim_id).group_path;
        this.data.get(vehicle.sim_id).lng = vehicle.lng;
        this.data.get(vehicle.sim_id).lat = vehicle.lat;
        this.setGroupDict(groups, "online", vehicle.sim_id);
        this.deleteGroupDict(groups, "offline", vehicle.sim_id);
      },
      setOffline(vehicle) {
        var vehicleData = this.data.get(vehicle.sim_id);
        if (vehicleData) {
          vehicleData.online = false;
        }
        this.dict.online.delete(vehicle.sim_id);
        this.dict.offline.add(vehicle.sim_id);
        var groups = this.data.get(vehicle.sim_id).group_path;
        this.setGroupDict(groups, "offline", vehicle.sim_id);
        this.deleteGroupDict(groups, "online", vehicle.sim_id);
      },
      setCount() {
        vm.vehicleCount.online = this.dict.online.size;
        vm.vehicleCount.offline = this.dict.offline.size;
        vm.vehicleCount.error = this.dict.error.size;
        vm.vehicleCount.alarm = this.dict.alarm.size;
      },
      setAlarm() {}
    };

    var ws = new WebSocket("ws://192.168.88.88:5002");
    // var socketDataWorker = new Worker("/map/worker-socket.js");
    // ws.binaryType = "arraybuffer";
    // ws.onmessage = function(evt) {
    //   socketDataWorker.postMessage(new Uint8Array(evt.data));
    //   //  ws.close()
    // };
    // ws.onopen = function() {
    //   getUser({ user_id: vm.$store.state.user.user_id })
    //     .then(res => {
    //       if (res.data.code == 0) {
    //         var blob = new Blob(
    //           [
    //             "^x3003|" +
    //               res.data.data[0].user_name +
    //               "|" +
    //               res.data.data[0].pass_word +
    //               "$"
    //           ],
    //           {
    //             type: "text/plain"
    //           }
    //         );
    //         var reader = new FileReader();
    //         reader.readAsArrayBuffer(blob);
    //         reader.onload = function(e) {
    //           console.log(arguments, reader.result);
    //           ws.send(reader.result);
    //           ws.close();
    //         };
    //       } else {
    //         vm.$message.error("实时数据链接失败，无法登陆！");
    //       }
    //     })
    //     .catch(() => {
    //       vm.$message.error("实时数据链接失败，无法登陆！");
    //     });
    // };
    // socketDataWorker.onmessage = event => {
    //   event.data.sim_id = "0" + event.data.sim_id;
    //   monitor.setVehicleData(event.data);
    // };
  },
  destroyed() {
    this.maps.map(map => {
      console.log(map.destroy);
    });
  },
  methods: {
    init() {
      this.initLoader = this.$loading({ text: "初始化分组数据" });
      getGroupByUser()
        .then(res => {
          this.initVehicle(res.data.data);
        })
        .catch(err => {
          this.initLoader.close();
          this.$alert("初始化分组失败！");
        });
    },
    initVehicle(groups) {
      this.initLoader.setText("初始化车辆数据");
      getInitVehicle()
        .then(res => {
          var res2 = [];
          res.data.data.map(item => {
            var position = GPS.gcj_encrypt(item[4] || 0, item[5] || 0); //GPS转高德
            res2.push({
              sim_id: item[0],
              license: item[1],
              device_id: item[2],
              time: item[3], //最后定位时间
              lng: position.lon, //最后一次定位的经度
              lat: position.lat, //最后一次定位的纬度
              alarm_count: parseInt(item[6] || 0), //当天报警次数
              error_count: parseInt(item[7] || 0), //当天异常次数
              vehicle_id: item[8],
              group_path: item[9].split(","), //车辆对应分组路径 [path1,path2,path3....]
              speed: 0,
              speed1: 0,
              alarm: 0,
              altitude: 0, //高程
              angle: "", //方向
              wifiSignal: "", //信号强度
              GNSSCount: "", //卫星数
              inoutAlarm: "", //进出区域报警
              mileage: "", //总里程
              address: ""
            });
          });
          window.monitor.init(res2, groups);
        })
        .catch(err => {
          this.initLoader.close();
          this.$alert("初始车辆化失败！");
          console.error(err);
        });
    },

    showVehicleWithGroup(row, column, cell, event) {
      //根据分组显示车辆
      var type = column.property;
      if (
        ["total", "online", "offline", "alarm", "error"].indexOf(type) == -1
      ) {
        return false;
      }
      this.showVehicle.type = type;
      this.showVehicle.isShowAll = false;
      this.showVehicle.isShow = true;
      this.showVehicle.group_id = row.group_id;
      this.showVehicle.sub_title = row.real_name;
    },
    showVehicleAll(type) {
      //显示平台总数车辆
      this.showVehicle.type = type;
      this.showVehicle.isShowAll = true;
      this.showVehicle.isShow = true;
      this.showVehicle.group_id = "";
      this.showVehicle.sub_title = "全平台";
    },
    closeShowVehicle() {
      this.showVehicle.type = "";
      this.showVehicle.isShowAll = false;
      this.showVehicle.isShow = false;
      this.showVehicle.group_id = "";
      this.showVehicle.sub_title = "";
    },
    toggleUserList(current) {
      if (current != "") {
        this.getUserList();
      } else {
        this.$set(this.$data, "userList", []);
      }
    },
    searchUserList() {
      this.userListQuery.page = 1;
      this.getUserList();
    },
    getUserList() {
      var query = Object.assign({}, this.userListQuery);
      getUserList(query)
        .then(res => {
          if (res.data.code == 0) {
            res.data.data.map(user => {
              user.total = 0;
              user.alarm = 0;
              user.online = 0;
              user.offline = 0;
              user.error = 0;
            });
            this.$set(this.$data, "userList", res.data.data);
            this.userListQuery.total = res.data.total;
          } else {
            this.$set(this.$data, "userList", []);
            this.userListQuery.total = 0;
            this.userListQuery.page = 1;
          }
        })
        .catch(() => {});
    },
    userListCurrentChange(val) {
      this.userListQuery.page = val;
      this.getUserList();
    },
    vehicleSearch(queryString, cb) {
      var result = [
        // { value: "冀R12345", sim_id: 111 }
      ];
      for (let [sim_id, vehicle] of monitor.data) {
        if (result.length > 20) {
          break;
        }
        if (vehicle.license.indexOf(queryString) != -1) {
          result.push({
            value: vehicle.license,
            sim_id: vehicle.sim_id
          });
        }
      }
      cb(result);
    },
    vehicleSelected(selected) {
      var vehicle = monitor.data.get(selected.sim_id);
      vehicle.lat = 39.1014;
      vehicle.lng = 116.1114;
      if (!this.currentVehiclesSet.has(vehicle.sim_id)) {
        this.currentVehiclesSet.add(vehicle.sim_id);
        this.currentVehicles.push(vehicle);
      }
      // setInterval(() => {
      //   vehicle.lat += 39.1114;
      //   vehicle.lng += 116.1114;
      // }, 1000);
    },
    removeCurrentVehicle(sim_id) {
      var index = this.currentVehicles.findIndex(item => {
        return item.sim_id == sim_id;
      });
      if (index != -1) {
        this.currentVehicles.splice(index, 1);
      }
      this.currentVehiclesSet.delete(sim_id);
    },
    addSingleVehicle(sim_id) {
      var vehicle = monitor.data.get(sim_id);
      if (!this.singleVehicleSet.has(sim_id)) {
        this.singleVehicleSet.add(sim_id);
        this.singleVehicle.push(vehicle);
        this.currentTab = "single-" + sim_id;
      }
    },
    removeSingleVehicle(sim_id) {
      var index = this.singleVehicle.findIndex(item => {
        return item.sim_id == sim_id;
      });
      if (index != -1) {
        this.singleVehicle.splice(index, 1);
      }
      this.singleVehicleSet.delete(sim_id);
      this.currentTab = "index";
    },
    tabRemove(tabName) {
      //tabName必须遵循 类型-sim_id
      var tab = tabName.split("-");
      switch (tab[0]) {
        case "single":
          this.removeSingleVehicle(tab[1]);
          break;
      }
    }
  }
};
</script>
<style lang="less">
@import "../../style/var.less";
.monitor-nav {
  position: absolute;
  width: 50px;
  height: 40px;
  z-index: 99;
  right: 20px;
  top: 50px;
  ._header {
    font-size: 40px;
    cursor: pointer;
    position: relative;
    z-index: 2;
  }
  &:hover {
    ._list {
      transition: all 0.5s;
      transform: translate(0, 0);
      visibility: visible;
    }
  }
  ._list {
    transform: translate(0, -30%);
    visibility: hidden;
    a {
      padding-left: 5px;
      display: block;
      position: relative;
      height: 40px;
      font-size: 25px;
      line-height: 40px;
      span {
        transition: all 0.2s;
        position: absolute;
        font-size: 16px;
        left: 0;
        transform: translate(-130%, 0);
        opacity: 0;
        white-space: nowrap;
        padding-right: 10px;
      }
    }
    a:hover {
      span {
        transform: translate(-100%, 0);
        opacity: 1;
      }
    }
  }
}
.list-complete-item {
  transition: all 1s;
  display: inline-block;
  margin-right: 10px;
}
.list-complete-enter, .list-complete-leave-to
/* .list-complete-leave-active for below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(-30px);
}
.list-complete-leave-active {
  position: absolute;
}
.current-vehicle-container {
  position: absolute;
  top: 80px;
  left: 20px;
  right: 380px;
  width: 0;
  bottom: 0;
}
.monitor-tabs {
  height: 100%;
  .el-tabs__header {
    margin: 0;
    padding-left: 15px;
  }
  .el-tabs__content {
    background: none;
    overflow: auto;
    height: calc(100% - 40px);
    padding: 0;
  }
  .el-tab-pane {
    height: 100%;
  }
}

.status-container {
  width: 60%;
  position: absolute;
  z-index: 11;
  left: 390px;
  top: 20px;
  background: #fff;
  ._header {
    position: relative;
    height: 50px;
    box-sizing: border-box;
    padding: 0 15px;
    line-height: 50px;
    border-bottom: 1px solid @b3;
    font-size: 14px;
    ._open {
      position: absolute;
      right: 15px;
      top: 50%;
      transform: translate(0, -50%);
    }
    ._global-status {
      color: #303133;
      padding-right: 2em;
      strong {
        text-decoration: underline;
      }
    }
    ._online strong {
      color: @success;
    }
    ._alarm strong {
      color: @danger;
    }
    ._error strong {
      color: @warning;
    }
    ._offline strong {
      color: @t3;
    }
  }
  ._body {
    ._search {
      padding: 15px 0 15px 15px;
      border-bottom: 1px solid @b3;
      .el-form-item {
        margin-bottom: 0;
      }
    }
    ._pager {
      padding: 10px;
      text-align: center;
    }
  }
}
.monitor {
  height: 100%;
  position: relative;
  color: @t1;
}
.shadow-box {
  box-shadow: 2px 2px 5px #ddd;
  border-radius: 5px;
}
.vehicle-search {
  position: absolute;
  width: 350px;
  background: #fff;
  z-index: 10;
  left: 20px;
  top: 20px;
  padding: 10px;
  box-sizing: border-box;
  height: 50px;
  ._right {
    text-align: center;
    i {
      font-size: 30px;
      cursor: pointer;
    }
  }
}
</style>