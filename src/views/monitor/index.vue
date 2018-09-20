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
                  <strong>{{offlineList.length+onlineList.length}} </strong>
                </span>
                <span class="_global-status _online">在线车辆：
                  <strong>{{onlineList.length}} </strong>
                </span>
                <span class="_global-status _alarm">报警车辆：
                  <strong>{{alarmList.length}} </strong>
                </span>
                <span class="_global-status _error">异常车辆：
                  <strong>{{errorList.length}} </strong>
                </span>
                <span class="_global-status _offline">离线车辆：
                  <strong>{{offlineList.length}}</strong>
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
                <el-table :data="tableData" size="small" style="width: 100%">
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

            <el-collapse accordion>
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

            </el-collapse>

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
export default {
  name:"monitor",
  components: { vehicleMonitor },
  data() {
    return {
      currentVehicles: [{ vehicle_id: 1 }],
      currentTab: "m",
      maps: [],
      tableData: [
        {
          user_name: "王小虎",
          total: 616161,
          error: 16161,
          online: 1234,
          offline: 1255,
          alarm: 2616
        },
        {
          user_name: "王小虎",
          total: 616161,
          error: 16161,
          online: 1234,
          offline: 1255,
          alarm: 2616
        },
        {
          user_name: "王小虎",
          total: 616161,
          error: 16161,
          online: 1234,
          offline: 1255,
          alarm: 2616
        },
        {
          user_name: "王小虎",
          total: 616161,
          error: 16161,
          online: 1234,
          offline: 1255,
          alarm: 2616
        },
        {
          user_name: "王小虎",
          total: 616161,
          error: 16161,
          online: 1234,
          offline: 1255,
          alarm: 2616
        }
      ],
      alarmList:{},
      errorList:{},
      onlineList:{},
      offlineList:{}
    };
  },
  created() {

var arr = [];
var dict = {};
    this.$ajax("http://localhost:8080/static/vehicle.json").then(res => {
      Monitor.init(res.data)
      console.log(Monitor);
      
    });
    var that = this;
    var Monitor = {
      data: [], //所有数据
      dict: {
        //字典
        index: {}, //车辆在数组中的位置
        alarm: {}, //报警
        online: {}, //在线
        offline: {}, //离线
        error: {} //异常
      },
      init(data) {
        this.data = data;
        this.initDict();
        setInterval(()=>{
          // that.$set(that.$data,"alarmList",this.dict.alarm);
          // that.$set(that.$data,"errorList",this.dict.error);
          // that.$set(that.$data,"onlineList",this.dict.online);
          // that.$set(that.$data,"offlineList",this.dict.offline);
          console.log(111)
        },3000)
      },
      initDict() {
        //初始化字典

       Object.defineProperty(this.dict.alarm, "len", {
          value: 0,
          enumerable: false,
          writable:true
      });

      Object.defineProperty(this.dict.online, "len", {
          value: 0,
          enumerable: false,
          writable:true
      });

      Object.defineProperty(this.dict.offline, "len", {
          value: 0,
          enumerable: false,
          writable:true
      });

      Object.defineProperty(this.dict.error, "len", {
          value: 0,
          enumerable: false,
          writable:true
      });


        //{"id":"064867953103","pId":"130635","name":"冀FF7251","Owner":"郭立娜","LinkMan":"郭立娜","Tel":"15530283288","ProvinceId":0,"CityId":130600,"CountyId":130635,"CityAgentId":0,"CountyAgentId":0,"Time":"2018-09-20T14:32:52","Alarm":0,"Status":786627,"Lon":116.336040,"Lat":39.619132,"Altitude":41,"GPSSpeed":350,"Direction":271,"x01":931294,"x02":0,"x03":350,"x25":0,"x30":14,"x31":16}
       
        this.data.map((vehicle, index) => {

          vehicle.sim_id = vehicle.id;
          vehicle.time = vehicle.Time;
          vehicle.lat = vehicle.Lat;
          vehicle.lng = vehicle.Lon;
          vehicle.alarm = vehicle.Alarm;
          vehicle.license = vehicle.name
          vehicle.alarm_count = 0;


          this.dict.index[vehicle.id] = index; //记录在数组中的位置
          if(vehicle.alarm!="0"){
            this.dict.alarm[vehicle.sim_id] = true;
            this.dict.alarm.len++
          }
          if(new Date()-new Date(vehicle.time) > 180000){
            this.dict.online[vehicle.sim_id] = true;
            this.dict.online.len++
          }else{
            this.dict.offline[vehicle.sim_id] = true;
            this.dict.offline.len++
          }
        });
        console.log(this);
      },
      setVehicleData(vehicleData){
        if(this.dict.index[vehicleData.sim_id]){
        if(vehicleData.alarm!=""){
          this.setAlarm(vehicleData)
        }
        if(new Date()-new Date(vehicleData.time) > 180000){
          this.setOnline(vehicleData)
        }else{
          this.setOffline(vehicleData)
        }
        }
      },
      setOnline(vehicle){
        //离线中删除、加入在线字典
        this.delOffline(vehicle);
        if(!this.dict.online[vehicle.sim_id]){
          this.dict.online[vehicle.sim_id]=true;
          this.dict.online.len++;
        }
      },
      delOnline(vehicle){
        if(this.dict.online[vehicle.sim_id]){
          delete this.dict.online[vehicle.sim_id];
          this.dict.online.len--;
        }
      },
      setOffline(vehicle){
        this.delOnline(vehicle);
        if( this.dict.offline[vehicle.sim_id]){
          this.dict.offline[vehicle.sim_id]=true;
          this.dict.offline.len++;
        }
      },
      delOffline(vehicle){
         if(this.dict.offline[vehicle.sim_id]){
          delete this.dict.offline[vehicle.sim_id];
          this.dict.offline.len--;
        }
        
      },
      setAlarm(){},
    };
   
    initMap(() => {
      this.$nextTick(() => {
        // var map = new AMap.Map("container", {
        //   viewMode: "3D",
        //   pitch: 55,
        //   rotation: -45
        // });
      });
    });
    var ws = new WebSocket("ws://127.0.0.1:9999");
     var socketDataWorker = new Worker("/map/worker-socket.js");
     ws.binaryType = 'arraybuffer'
   

      window.arr = [];
      window.bb = [];
    socketDataWorker.onmessage = event => {
      window.arr.push(event.data);
      event.data.sim_id = "0"+event.data.sim_id;
      Monitor.setVehicleData(event.data);

    };
    ws.onmessage=function(evt){      
       socketDataWorker.postMessage(new Uint8Array(evt.data));
      //  ws.close()
       
    }
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
  transform: translateY(30px);
}
.list-complete-leave-active {
  position: absolute;
}
.current-vehicle-container {
  position: absolute;
  top: 80px;
  left: 20px;
  right: 380px;
  width:0;
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
    height: calc(100% - 50px);
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