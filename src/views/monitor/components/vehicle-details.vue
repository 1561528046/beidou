<template>
    <div class="details-container shadow-box" v-if="true||showVehicle.isShow">
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
        <div class="_body" v-if="showVehicle.isShowAll">
            <el-table :data="list" size="small" style="width: 100%">
                <el-table-column prop="license" label="车牌号">
                </el-table-column>
                <el-table-column prop="total" label="报警总数">
                </el-table-column>
            </el-table>
            <div class="_pager">
                <el-pagination background @current-change="changePager" small :page-size="pager.size" :pager-count="5" layout="prev, pager, next" :total="pager.total">
                </el-pagination>
            </div>
        </div>
        <div class="_body" v-if="!showVehicle.isShowAll">
            <el-collapse accordion v-model="currentGroup" @change="groupChange">
                <el-collapse-item class="group-container" v-for="group in currentGroupSon" :key="group.group_id" :name="group.group_id">
                    <template slot="title">
                        <div class="group-name">
                            {{group.group_name}}
                        </div>
                    </template>
                    <div class="group-body">
                        <el-select v-model="currentGroupFilter" placeholder="全部分组" size="mini" style="width:100%;">
                            <el-option label="分组1" value="shanghai"></el-option>
                            <el-option label="分组2" value="beijing"></el-option>
                        </el-select>
                        <el-table :data="list" size="small" style="width: 100%">
                            <el-table-column prop="user_name" label="车牌号">
                            </el-table-column>
                            <el-table-column prop="total" label="报警总数">
                            </el-table-column>
                        </el-table>
                        <div class="_pager">
                            <el-pagination background @current-change="changePager" small :page-size="pager.size" :pager-count="5" layout="prev, pager, next,total" :total="pager.total">
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
      currentGroupChildrens: [],
      currentGroupFilter: "",
      pager: {
        size: 50,
        total: 0,
        current: 1
      },
      dataVersion: 0,
      timer: null
    };
  },
  props: ["showVehicle"],
  computed: {
    list: function() {
      var monitor = window.monitor;
      var showVehicle = this.$props.showVehicle;
      var list = [];
      // eslint-disable-next-line
      var x = this.dataVersion;
      if (showVehicle.isShowAll) {
        var sim_ids = monitor.dict[showVehicle.type];
        for (let sim_id of sim_ids) {
          list.push(monitor.data.get(sim_id));
        }
      }
      var groups = monitor.dict.groups.get(this.currentGroup);
      if (groups) {
        for (let sim_id of groups.get(showVehicle.type)) {
          list.push(monitor.data.get(sim_id));
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
    "showVehicle.group_id": function() {
      this.getGroupSon();
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
    }, 10);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    initPager() {
      this.pager.size = 50;
      this.pager.total = 0;
      this.pager.current = 1;
    },
    getGroupSon() {
      var groupChildrens = [];
      for (let [key, value] of window.monitor.dict.groups) {
        if (value.get("data").parent_id == this.showVehicle.group_id) {
          groupChildrens.push(value.get("data"));
        }
      }
      this.$set(this.$data, "currentGroupSon", groupChildrens);
    },
    getGroupChildrens() {
      //this.currentGroupChildrens
      getGroupChildrens({ group_id: this.currentGroup }).then(res => {});
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
}
</style>