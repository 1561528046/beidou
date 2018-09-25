<template>

  <el-tabs v-model="currentTab" style="height:100%;" class="monitor-tabs">
    <el-tab-pane label="监控" :closable="false" name="m">
      <div class="monitor">
        <div id="container" style="width:100%;height:100%;"></div>
        <div class="vehicle-search shadow-box">
          <el-row :gutter="20">
            <el-col :span="20">
              <el-input placeholder="搜索车辆（车牌号、终端ID）" size="small" class="input-with-select">
                <el-button slot="append" icon="el-icon-search"></el-button>
              </el-input>
            </el-col>
            <el-col :span="4" class="_right">
              <i class="el-icon-more" @click="add"></i>
            </el-col>
          </el-row>
        </div>
        <transition-group name="list-complete" tag="div" class="current-vehicle-container">
          <vehicle-monitor class="list-complete-item" @close="remove(vehicle.vehicle_id)" v-for="(vehicle,index) in currentVehicles" :index="index" :key="vehicle.vehicle_id"></vehicle-monitor>
        </transition-group>

        <el-collapse accordion class="status-container shadow-box">
          <el-collapse-item class="group-container">
            <template slot="title">
              <div class="_header">
                <span class="_global-status" @click.stop>平台车辆总数：
                  <strong>{{vehicleCount.online + vehicleCount.offline}} </strong>
                </span>
                <span class="_global-status _online">在线车辆：
                  <strong>{{vehicleCount.online}} </strong>
                </span>
                <span class="_global-status _alarm">报警车辆：
                  <strong>{{vehicleCount.alarm}} </strong>
                </span>
                <span class="_global-status _error">异常车辆：
                  <strong>{{vehicleCount.error}} </strong>
                </span>
                <span class="_global-status _offline">离线车辆：
                  <strong>{{vehicleCount.offline}}</strong>
                </span>

              </div>
            </template>
            <div class="_body">
              <el-form :inline="true" size="mini" class="_search">
                <el-form-item label="用户名称">
                  <el-input placeholder="用户名称"></el-input>
                </el-form-item>
                <el-form-item label="活动区域">
                  <el-select value="1" placeholder="活动区域">
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary">查询</el-button>
                </el-form-item>
              </el-form>
              <div class="_table">
                <el-table :data="userList" size="small" style="width: 100%">
                  <el-table-column prop="user_name" label="用户名称" width="180">
                  </el-table-column>
                  <el-table-column prop="total" label="车辆总数">
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
                <el-pagination background layout="prev, pager, next" :total="1000">
                </el-pagination>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>

        <div class="details-container shadow-box">
          <div class="_header">
            <div class="_title">
              报警车辆
            </div>
            <div class="_text">
              新东方客运公司
            </div>
          </div>
          <div class="_body">

            <!-- <el-collapse accordion>
              <el-collapse-item class="group-container">
                <template slot="title">
                  <div class="group-name">
                    子级分组1
                  </div>
                </template>
                <div class="group-body">
                  <el-select value="1" placeholder="全部分组" size="mini" style="width:100%;">
                    <el-option label="分组1" value="shanghai"></el-option>
                    <el-option label="分组2" value="beijing"></el-option>
                  </el-select>
                  <el-table :data="userList" size="small" style="width: 100%">
                    <el-table-column prop="user_name" label="车牌号">
                    </el-table-column>
                    <el-table-column prop="total" label="报警总数">
                    </el-table-column>
                  </el-table>
                </div>
              </el-collapse-item>
              <el-collapse-item class="group-container">
                <template slot="title">
                  <div class="group-name">
                    子级分组1
                  </div>
                </template>
                <div class="group-body">
                  <el-select value="1" placeholder="全部分组" size="mini" style="width:100%;">
                    <el-option label="分组1" value="shanghai"></el-option>
                    <el-option label="分组2" value="beijing"></el-option>
                  </el-select>
                  <el-table :data="tableData" size="small" style="width: 100%">
                    <el-table-column prop="user_name" label="车牌号">
                    </el-table-column>
                    <el-table-column prop="total" label="报警总数">
                    </el-table-column>
                  </el-table>
                </div>
              </el-collapse-item>
              <el-collapse-item class="group-container">
                <template slot="title">
                  <div class="group-name">
                    子级分组1
                  </div>
                </template>
                <div class="group-body">
                  <el-select value="1" placeholder="全部分组" size="mini" style="width:100%;">
                    <el-option label="分组1" value="shanghai"></el-option>
                    <el-option label="分组2" value="beijing"></el-option>
                  </el-select>
                  <el-table :data="tableData" size="small" style="width: 100%">
                    <el-table-column prop="user_name" label="车牌号">
                    </el-table-column>
                    <el-table-column prop="total" label="报警总数">
                    </el-table-column>
                  </el-table>
                </div>
              </el-collapse-item>

            </el-collapse> -->

          </div>
        </div>

      </div>
    </el-tab-pane>

    <el-tab-pane label="冀R12345" :closable="true" name="x">asdfasdf
    </el-tab-pane>
  </el-tabs>

</template>

<script>
/*eslint-disable*/
import initMap from "@/utils/map.js";
import vehicleMonitor from "./components/vehicle-monitor.vue";
var Monitor = {};
export default {
  name: "monitor",
  components: { vehicleMonitor },
  data() {
    return {
      x: new Set([1]),
      currentVehicles: [{ vehicle_id: 1 }],
      currentTab: "m",
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
      userList: [
        // {
        //   user_id: 1,
        //   //...
        //   alarm: 1000,
        //   online: 1000,
        //   offline: 1000,
        //   error: 1000
        // }
      ]
    };
  },
  watch: {
    userList: function() {}
  },
  created() {
    var that = this;
    var userList = JSON.parse(
      '[{"user_id":"1","parent_id":"0","user_name":"admin","pass_word":"49ba59abbe56e057","user_type":"2","province_id":"130000","city_id":"130900","county_id":"130902","real_name":"admin","industry":"1","linkman":"1","tel":"1","address":"1","device_total":"11","device_num":"12","role_id":"2","state":"1","expiry_time":"0","group_id":"1","balance":"","group_ids":"1","corporation":"","business_no":"","province_name":"河北省","city_name":"沧州市","county_name":"新华区","role_name":"","group_id1":"1","group_name":"根目录","parent_id1":"0","level":"1"},{"user_id":"94","parent_id":"1","user_name":"bbb","pass_word":"8f00b204e9800998","user_type":"1","province_id":"130000","city_id":"130100","county_id":"130102","real_name":"个人","industry":"1","linkman":"123","tel":"123456","address":"123","device_total":"4","device_num":"","role_id":"6","state":"1","expiry_time":"20180920","group_id":"3","balance":"70.00","group_ids":"1,2,3","corporation":"","business_no":"","province_name":"河北省","city_name":"石家庄市","county_name":"长安区","role_name":"二级管理员","group_id1":"3","group_name":"廊坊市","parent_id1":"2","level":"3"},{"user_id":"105","parent_id":"94","user_name":"caca","pass_word":"ac59075b964b0715","user_type":"1","province_id":"130000","city_id":"130100","county_id":"130102","real_name":"123xxx","industry":"","linkman":"","tel":"","address":"","device_total":"7","device_num":"","role_id":"9","state":"1","expiry_time":"20180929","group_id":"3","balance":"","group_ids":"1,2,3","corporation":"","business_no":"","province_name":"河北省","city_name":"石家庄市","county_name":"长安区","role_name":"三级管理员","group_id1":"3","group_name":"廊坊市","parent_id1":"2","level":"3"},{"user_id":"106","parent_id":"1","user_name":"河北省","pass_word":"ac59075b964b0715","user_type":"2","province_id":"130000","city_id":"130100","county_id":"130102","real_name":"河北省用户","industry":"1","linkman":"","tel":"17732154214","address":"0","device_total":"1","device_num":"","role_id":"6","state":"1","expiry_time":"0","group_id":"2","balance":"","group_ids":"1,2","corporation":"","business_no":"","province_name":"河北省","city_name":"石家庄市","county_name":"长安区","role_name":"二级管理员","group_id1":"2","group_name":"河北省","parent_id1":"1","level":"2"},{"user_id":"107","parent_id":"106","user_name":"廊坊市","pass_word":"ad75564da5d89e83","user_type":"2","province_id":"130000","city_id":"130100","county_id":"130102","real_name":"廊坊市用户","industry":"1","linkman":"","tel":"","address":"","device_total":"0","device_num":"","role_id":"6","state":"1","expiry_time":"0","group_id":"3","balance":"","group_ids":"1,2,3","corporation":"","business_no":"","province_name":"河北省","city_name":"石家庄市","county_name":"长安区","role_name":"二级管理员","group_id1":"3","group_name":"廊坊市","parent_id1":"2","level":"3"},{"user_id":"110","parent_id":"1","user_name":"甘肃省","pass_word":"ac59075b964b0715","user_type":"2","province_id":"130000","city_id":"130100","county_id":"130102","real_name":"甘肃省用户","industry":"","linkman":"","tel":"","address":"","device_total":"0","device_num":"","role_id":"6","state":"1","expiry_time":"0","group_id":"71","balance":"","group_ids":"1,71","corporation":"","business_no":"","province_name":"河北省","city_name":"石家庄市","county_name":"长安区","role_name":"二级管理员","group_id1":"71","group_name":"甘肃省","parent_id1":"1","level":"2"},{"user_id":"111","parent_id":"106","user_name":"石家庄","pass_word":"ac59075b964b0715","user_type":"2","province_id":"130000","city_id":"130100","county_id":"130102","real_name":"石家庄","industry":"","linkman":"","tel":"","address":"","device_total":"0","device_num":"","role_id":"6","state":"1","expiry_time":"0","group_id":"4","balance":"","group_ids":"1,2,4","corporation":"","business_no":"","province_name":"河北省","city_name":"石家庄市","county_name":"长安区","role_name":"二级管理员","group_id1":"4","group_name":"石家庄市","parent_id1":"2","level":"3"},{"user_id":"112","parent_id":"111","user_name":"长安区","pass_word":"ac59075b964b0715","user_type":"2","province_id":"130000","city_id":"130100","county_id":"130102","real_name":"长安区","industry":"1","linkman":"","tel":"","address":"","device_total":"0","device_num":"","role_id":"6","state":"1","expiry_time":"0","group_id":"72","balance":"1100.00","group_ids":"1,2,4,72","corporation":"","business_no":"","province_name":"河北省","city_name":"石家庄市","county_name":"长安区","role_name":"二级管理员","group_id1":"72","group_name":"长安区","parent_id1":"4","level":"4"},{"user_id":"114","parent_id":"106","user_name":"衡水市","pass_word":"ac59075b964b0715","user_type":"","province_id":"130000","city_id":"131100","county_id":"131102","real_name":"衡水市有限公司","industry":"1","linkman":"张三","tel":"17723561452","address":"桃城区","device_total":"100","device_num":"","role_id":"6","state":"1","expiry_time":"0","group_id":"73","balance":"","group_ids":"1,2,73","corporation":"规范","business_no":"DVS2","province_name":"河北省","city_name":"衡水市","county_name":"桃城区","role_name":"二级管理员","group_id1":"73","group_name":"衡水市","parent_id1":"2","level":"3"},{"user_id":"116","parent_id":"106","user_name":"邯郸市","pass_word":"ac59075b964b0715","user_type":"","province_id":"130000","city_id":"130400","county_id":"130402","real_name":"邯郸公司","industry":"1","linkman":"李四","tel":"17723541245","address":"","device_total":"200","device_num":"","role_id":"6","state":"1","expiry_time":"20180930","group_id":"74","balance":"","group_ids":"1,2,74","corporation":"","business_no":"","province_name":"河北省","city_name":"邯郸市","county_name":"邯山区","role_name":"二级管理员","group_id1":"74","group_name":"邯郸市","parent_id1":"2","level":"3"}]'
    );
    userList.map(user => {
      user.total = 0;
      user.alarm = 0;
      user.online = 0;
      user.offline = 0;
      user.error = 0;
    });
    that.$set(that.$data, "userList", userList);

    this.$ajax("http://localhost:8080/static/vehicle.json").then(res => {
      var res2 = [];
      res.data.map(item => {
        // let item1 = JSON.parse(JSON.stringify(item));
        // item1.id += "a";
        // let item2 = JSON.parse(JSON.stringify(item));
        // item2.id += "b";
        // let item3 = JSON.parse(JSON.stringify(item));
        // item3.id += "c";
        // let item4 = JSON.parse(JSON.stringify(item));
        // item4.id += "d";
        res2.push(item);
        // res2.push(item1);
        // res2.push(item2);
        // res2.push(item3);
        // res2.push(item4);
      });

      Monitor.init(res2);
    });
    var that = this;
    Monitor = {
      data: new Map(), //所有数据
      dict: {
        //字典
        alarm: new Set(), //报警
        online: new Set(), //在线
        offline: new Set(), //离线
        error: new Set(), //异常
        groups: new Map() //userid为key 车辆为value
      },
      init(data) {
        var groups = JSON.parse(
          "[1, 2, 3, 4, 5, 69, 71, 72, 73, 74, 75, 77, 78, 79, 80, 81, 83, 85, 106, 107, 108, 109, 110, 111]"
        );
        //建立分组字典
        this.initGroupDict(groups);
        //初始化车辆
        //1、车辆放入对应分组、并区分状态
        //2、区分总的在线、离线、报警、异常
        data.map(vehicle => {
          vehicle.group_ids = [];
          vehicle.group_ids.push(
            groups[Math.round(Math.random() * 23)].toString()
          );
          vehicle.group_ids.push(
            groups[Math.round(Math.random() * 23)].toString()
          );
          vehicle.group_ids.push(
            groups[Math.round(Math.random() * 23)].toString()
          );
          vehicle.sim_id = vehicle.id;
          vehicle.time = vehicle.Time;
          vehicle.lat = vehicle.Lat;
          vehicle.lng = vehicle.Lon;
          vehicle.alarm = vehicle.Alarm;
          vehicle.license = vehicle.name;
          vehicle.alarm_count = 0;
          //根据sim_id 创建所有数据集合的MAP对象
          this.data.set(vehicle.sim_id, vehicle);
          if (vehicle.alarm != "0") {
            this.dict.alarm.add(vehicle.sim_id);

            //车辆所对应的分组 均加入记录
            this.setGroupDict(vehicle.group_ids, "alarm", vehicle.sim_id);
          }
          if (new Date() - new Date(vehicle.time) > 95132724) {
            this.dict.online.add(vehicle.sim_id);
            this.setGroupDict(vehicle.group_ids, "online", vehicle.sim_id);
          } else {
            this.dict.offline.add(vehicle.sim_id);
            this.setGroupDict(vehicle.group_ids, "offline", vehicle.sim_id);
          }
        });
        initMap(() => {
          that.$nextTick(() => {
            initAMapUI();
            this.initMap();
          });
        });
        setInterval(() => {
          this.setCount();
          this.setUserCount();
        }, 0);
      },
      setGroupDict(groups, status, sim_id) {
        //传入groups 可以是String Array （String自动转为Array）
        //status 状态类表 alarm online offline error
        if (typeof groups == "string") {
          groups = [groups];
        }
        var groupDict = this.dict.groups;
        groups.map(groups_id => {
          groupDict
            .get(groups_id)
            .get(status)
            .add(sim_id);
        });
      },
      deleteGroupDict(groups, status, sim_id) {
        //传入groups 可以是String Array （String自动转为Array）
        //status 状态类表 alarm online offline error
        if (typeof groups == "string") {
          groups = [groups];
        }
        var groupDict = this.dict.groups;
        groups.map(groups_id => {
          groupDict
            .get(groups_id)
            .get(status)
            .delete(sim_id);
        });
      },
      initMap() {
        var map = new AMap.Map("container", {
          //viewMode: "3D",
          //pitch: 55,
          // rotation: -45,
          zoom: 4
        });
        window.a = 1;
        AMapUI.load(
          ["ui/geo/DistrictCluster", "lib/$"],
          (DistrictCluster, $) => {
            var distCluster = new DistrictCluster({
              map: map, //所属的地图实例
              zIndex: 11,
              autoSetFitView: false,
              getPosition: function(item) {
                // if (window.a == 1) {
                //   console.log(item);
                //   window.a = 2;
                // }
                return [item.lng, item.lat];
              }
            });
            setInterval(() => {
              distCluster.setData([...this.data.values()]);
            }, 15000);
          }
        );
      },
      initGroupDict(groups) {
        //后台接口、根据当前用户分组 获取所有分组（平铺）
        groups.map(group_id => {
          var groupVehicleMap = new Map();
          groupVehicleMap.set("alarm", new Set());
          groupVehicleMap.set("online", new Set());
          groupVehicleMap.set("offline", new Set());
          groupVehicleMap.set("error", new Set());
          this.dict.groups.set(group_id.toString(), groupVehicleMap);
        });
      },
      setUserCount() {
        that.userList.map(user => {
          var groupDict = this.dict.groups.get(user.group_id);
          user.alarm = groupDict.get("alarm").size;
          user.online = groupDict.get("online").size;
          user.offline = groupDict.get("offline").size;
          user.error = groupDict.get("error").size;
        });
      },
      setVehicleData(vehicleData) {
        if (this.data.has(vehicleData.sim_id)) {
          vehicleData.lat = vehicleData.lat - 0 + Math.random() * 0.8;
          vehicleData.lng = vehicleData.lng - 0 + Math.random() * 0.8;
          if (vehicleData.alarm != "") {
            this.setAlarm(vehicleData);
          }
          if (new Date() - new Date(vehicleData.time) > 95132724) {
            this.setOnline(vehicleData);
          } else {
            this.setOffline(vehicleData);
          }
        }
      },
      setOnline(vehicle) {
        //离线中删除、加入在线字典
        this.dict.offline.delete(vehicle.sim_id);
        this.dict.online.add(vehicle.sim_id);
        var groups = this.data.get(vehicle.sim_id).group_ids;
        this.data.get(vehicle.sim_id).lng = vehicle.lng;
        this.data.get(vehicle.sim_id).lat = vehicle.lat;
        this.setGroupDict(groups, "online", vehicle.sim_id);
        this.deleteGroupDict(groups, "offline", vehicle.sim_id);
      },
      setOffline(vehicle) {
        this.dict.online.delete(vehicle.sim_id);
        this.dict.offline.add(vehicle.sim_id);
        var groups = this.data.get(vehicle.sim_id).group_ids;
        this.setGroupDict(groups, "offline", vehicle.sim_id);
        this.deleteGroupDict(groups, "online", vehicle.sim_id);
      },
      setCount() {
        that.vehicleCount.online = this.dict.online.size;
        that.vehicleCount.offline = this.dict.offline.size;
        that.vehicleCount.error = this.dict.error.size;
        that.vehicleCount.alarm = this.dict.alarm.size;
      },
      setAlarm() {}
    };

    // initMap(() => {
    //   this.$nextTick(() => {
    //     // var map = new AMap.Map("container", {
    //     //   //viewMode: "3D",
    //     //   //pitch: 55,
    //     //   // rotation: -45,
    //     //   zoom: 4
    //     // });
    //   });
    // });
    var ws = new WebSocket("ws://127.0.0.1:9999");
    var socketDataWorker = new Worker("/map/worker-socket.js");
    ws.binaryType = "arraybuffer";

    socketDataWorker.onmessage = event => {
      event.data.sim_id = "0" + event.data.sim_id;
      Monitor.setVehicleData(event.data);
    };
    ws.onmessage = function(evt) {
      socketDataWorker.postMessage(new Uint8Array(evt.data));
      //  ws.close()
    };
  },
  destroyed() {
    this.maps.map(map => {
      console.log(map.destroy);
    });
  },
  methods: {
    add() {
      this.currentVehicles.push({ vehicle_id: new Date().getTime() });
    },
    remove(vehicle_id) {
      var index = this.currentVehicles.findIndex(item => {
        return item.vehicle_id == vehicle_id;
      });
      this.currentVehicles.splice(index, 1);
    }
  }
};
</script>
<style lang="less">
@import "../../style/var.less";
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
.details-container {
  width: 17%;
  position: absolute;
  z-index: 11;
  right: 20px;
  top: 20px;
  bottom: 20px;
  background: #fff;
  ._header {
    height: 60px;
    padding: 15px;
    line-height: 1.5;
    ._text {
      font-size: 12px;
      color: @t3;
    }
  }
  ._body {
    padding: 15px;
    box-sizing: border-box;
    overflow: auto;
    position: absolute;
    top: 60px;
    bottom: 0;
    width: 100%;
    left: 0;
  }
  .group-container {
    .el-collapse-item__header {
      height: 35px;
      line-height: 35px;
      .el-collapse-item__arrow {
        line-height: 35px;
      }
    }
    .group-name {
      background: @b4;
      color: @t2;
      padding-left: 1em;
    }
    .group-body {
      padding: 12px;
    }
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
      padding-right: 2em;
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