<template>
  <div class="details-container shadow-box" v-if="showVehicle.isShow">
    <v-contextmenu ref="contextmenu">
      <v-contextmenu-item @click="sendInstruction" data-index="x8202">临时位置跟踪</v-contextmenu-item>
      <v-contextmenu-item @click="sendInstruction" data-index="x8201">点名</v-contextmenu-item>
      <v-contextmenu-item @click="sendInstruction" data-index="x8301">提问下发</v-contextmenu-item>
      <v-contextmenu-submenu title="车辆控制">
        <v-contextmenu-item @click="sendInstruction" data-index="x8500|0">车辆解锁</v-contextmenu-item>
        <v-contextmenu-item @click="sendInstruction" data-index="x8500|1">车辆加锁</v-contextmenu-item>
      </v-contextmenu-submenu>
      <v-contextmenu-item @click="sendInstruction" data-index="x8401">电话本</v-contextmenu-item>
      <v-contextmenu-item @click="sendInstruction" data-index="x8400">电话回拨</v-contextmenu-item>
    </v-contextmenu>
    <div class="_header">
      <div class="_title">
        {{getShowVehicleTitle()}}
      </div>
      <div class="_text">
        {{showVehicle.sub_title}}
      </div>
      <div class="_close">
        <i class="el-icon-close" @click="closeShowVehicle"></i>
      </div>
    </div>
    <div class="_body" v-show="showVehicle.isShowAll" v-contextmenu:contextmenu>
      <el-table :data="list" size="small" style="width: 100%" @row-click="openTab" @row-contextmenu="showContextmenu" highlight-current-row ref="vehicleList">
        <el-table-column prop="license" label="车牌号">
        </el-table-column>
        <el-table-column prop="alarm_count" label="今日报警总数" v-if="showVehicle.type=='alarm'" key="allalarm">
        </el-table-column>
        <el-table-column prop="error_count" label="今日异常数" v-if="showVehicle.type=='error'" key="allerror">
        </el-table-column>
        <el-table-column label="在线状态" v-if="['online','offline','total'].indexOf(showVehicle.type)!=-1" key="allOnline">
          <template slot-scope="scope">
            <span class="vehicle-online" v-if="scope.row.online">在线</span>
            <span class="vehicle-offline" v-if="!scope.row.online">离线</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="_pager">
        <el-pagination background @current-change="changePager" small :page-size="pager.size" :pager-count="5" layout="prev, pager, next" :total="pager.total">
        </el-pagination>
      </div>
    </div>
    <div class="_body" v-if="!showVehicle.isShowAll" v-contextmenu:contextmenu>
      <el-collapse accordion v-model="currentGroup" @change="groupChange" :key="'other'+showVehicle.group_id" :name="'other'+showVehicle.group_id">
        <!-- <el-collapse-item class="group-container">
          <template slot="title">
            <div class="group-name">
              未分配车辆
            </div>
          </template>
        </el-collapse-item> -->
        <el-collapse-item class="group-container" v-for="group in currentGroupSon" :key="'collapse'+group.group_id" :name="group.group_id">
          <template slot="title">
            <div class="group-name">
              {{group.group_name}}
            </div>
          </template>
          <div class="group-body">
            <el-select v-model="currentGroupFilter" placeholder="全部分组" size="mini" style="width:100%;" v-if="currentGroupSonChildrens.length">
              <el-option label="全部分组" value=""></el-option>
              <el-option :label="childrenGroup.group_name" :value="childrenGroup.group_id" v-for="childrenGroup in currentGroupSonChildrens" :key="'select'+childrenGroup.group_id"></el-option>
            </el-select>
            <el-table :data="list" size="small" style="width: 100%" @row-click="openTab" @row-contextmenu="showContextmenu" highlight-current-row ref="vehicleList">
              <el-table-column prop="license" label="车牌号">
              </el-table-column>
              <el-table-column prop="alarm_count" label="今日报警总数" v-if="showVehicle.type=='alarm'" key="tablealarm">
              </el-table-column>
              <el-table-column prop="error_count" label="今日异常数" v-if="showVehicle.type=='error'" key="tableerror">
              </el-table-column>
              <el-table-column label="在线状态" v-if="['online','offline','total'].indexOf(showVehicle.type)!=-1" key="tableOnline">
                <template slot-scope="scope">
                  <span class="vehicle-online" v-if="scope.row.online">在线</span>
                  <span class="vehicle-offline" v-if="!scope.row.online">离线</span>
                </template>
              </el-table-column>
            </el-table>
            <div class="_pager">
              <el-pagination background @current-change="changePager" small :page-size="pager.size" :pager-count="5" layout="prev, pager, next" :total="pager.total">
              </el-pagination>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>
<script>
import { getGroupChildrens } from "@/api/index.js";
export default {
  data() {
    return {
      currentGroup: "",
      currentGroupSon: [], //儿子级别组
      currentGroupSonChildrens: [],
      currentGroupFilter: "",
      pager: {
        size: 50,
        total: 0,
        current: 1
      },
      dataVersion: 0,
      timer: null,
      contextmenuVehicle: null //右键菜单选中的车辆
    };
  },
  props: ["showVehicle"],
  computed: {
    list: function() {
      var monitor = window.monitor;
      var showVehicle = this.$props.showVehicle;
      var list = [];

      //触发list更新
      // eslint-disable-next-line
      var x = this.dataVersion;
      if (showVehicle.isShowAll) {
        if (showVehicle.type == "total") {
          list = Array.from(monitor.data.values());
        } else {
          var sim_ids = monitor.dict[showVehicle.type];
          for (let sim_id of sim_ids) {
            list.push(monitor.data.get(sim_id));
          }
        }
      }
      var groups = monitor.dict.groups.get(
        this.currentGroupFilter || this.currentGroup
      );
      if (groups) {
        if (showVehicle.type == "total") {
          for (let sim_id of groups.get("online")) {
            list.push(monitor.data.get(sim_id));
          }
          for (let sim_id of groups.get("offline")) {
            list.push(monitor.data.get(sim_id));
          }
        } else {
          for (let sim_id of groups.get(showVehicle.type)) {
            list.push(monitor.data.get(sim_id));
          }
        }
      }
      // eslint-disable-next-line
      this.pager.total = list.length;
      var start = (this.pager.current - 1) * this.pager.size;
      var end = this.pager.current * this.pager.size;
      return list.slice(start, end);
    }
  },
  watch: {
    "showVehicle.group_id": function(newVal) {
      if (newVal) {
        this.getGroupSon();
      }
    },
    currentGroup: function() {
      this.initPager();
      this.getGroupChildrens();
    }
  },
  mounted() {},
  created() {
    this.timer = setInterval(() => {
      this.dataVersion++; //触发list更新
    }, 300);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    sendInstruction(vm, event) {
      var instruction = event.target.dataset.index;
      // instruction.split("|");
      this.$emit("instruction", {
        instruction: instruction,
        sim_id: this.contextmenuVehicle.sim_id
      });
    },
    showContextmenu(row) {
      this.$refs.vehicleList.setCurrentRow(row);
      this.contextmenuVehicle = row;
    },
    openTab(row) {
      switch (this.showVehicle.type) {
        case "alarm":
          this.$store.commit(
            "setMonitorAlarmVehicle",
            window.monitor.data.get(row.sim_id)
          );
          break;
        case "error":
          this.$store.commit(
            "setMonitorErrorVehicle",
            window.monitor.data.get(row.sim_id)
          );
          break;
        default:
          this.$emit("open-single", row.sim_id);
      }
    },
    initPager() {
      this.pager.size = 50;
      this.pager.total = 0;
      this.pager.current = 1;
    },
    getGroupSon() {
      var groupChildrens = [];
      // eslint-disable-next-line
      for (let [key, value] of window.monitor.dict.groups) {
        if (
          value.get("data") &&
          value.get("data").parent_id == this.showVehicle.group_id
        ) {
          groupChildrens.push(value.get("data"));
        }
      }
      if (groupChildrens.length == 0) {
        groupChildrens.push(
          window.monitor.dict.groups.get(this.showVehicle.group_id).get("data")
        );
      }
      groupChildrens.push({
        group_name: "未分配车辆",
        group_id: "other" + this.showVehicle.group_id
      }); //加入未分配车辆分组
      this.$set(this.$data, "currentGroupSon", groupChildrens);
    },
    getGroupChildrens() {
      //this.currentGroupChildrens
      // eslint-disable-next-line
      this.$set(this.$data, "currentGroupSonChildrens", []);
      if (!this.currentGroup || this.currentGroup.indexOf("other") != -1) {
        return false;
      }
      getGroupChildrens({ group_id: this.currentGroup }).then(res => {
        if (res.data.code == 0) {
          this.$set(this.$data, "currentGroupSonChildrens", res.data.data);
        }
      });
    },
    groupChange() {
      this.pager.size = 50;
      this.pager.total = 0;
      this.pager.current = 1;
    },
    changePager(current) {
      this.pager.current = current;
    },
    getShowVehicleTitle() {
      return {
        total: "全部车辆",
        online: "在线车辆",
        alarm: "报警车辆",
        error: "异常车辆",
        offline: "离线车辆"
      }[this.showVehicle.type];
    },
    closeShowVehicle() {
      this.$emit("close");
    }
  }
};
</script>
<style lang="less">
@import "../../../style/var.less";
.details-container {
  width: 17%;
  position: absolute;
  z-index: 11;
  right: 20px;
  top: 20px;
  bottom: 20px;
  background: #fff;
  z-index: 100;
  ._header {
    position: relative;
    height: 60px;
    padding: 15px;
    line-height: 1.5;
    ._text {
      font-size: 12px;
      color: @t3;
    }
    ._close {
      position: absolute;
      transition: all 0.8s;
      right: 15px;
      top: 20px;
      font-size: 20px;
      cursor: pointer;
    }
    ._close:hover {
      transform: rotate(360deg);
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
    ._pager {
      background: #fff;
      width: 100%;
      text-align: center;
      padding: 10px 0;
    }
  }

  .group-container {
    padding: 0;
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
  .vehicle-online {
    color: @success;
    &:before {
      content: "";
      width: 6px;
      height: 6px;
      line-height: 6px;
      text-align: center;
      font-size: 0;
      background: @success;
      display: inline-block;
      margin-right: 5px;
      border-radius: 6px;
      vertical-align: 1px;
    }
  }
  .vehicle-offline {
    color: @t4;
    &:before {
      content: "";
      width: 6px;
      height: 6px;
      line-height: 6px;
      text-align: center;
      font-size: 0;
      background: @t4;
      display: inline-block;
      margin-right: 5px;
      border-radius: 6px;
      vertical-align: 1px;
    }
  }
  .contextmenu {
    position: absolute;
    .el-popover {
      padding: 0;
    }
    ._list {
      li {
        list-style-type: none;
        height: 28px;
        line-height: 28px;
        border-bottom: 1px solid @b2;
        a {
          padding-left: 1.2em;
          display: block;
        }
      }
    }
  }
}
</style>