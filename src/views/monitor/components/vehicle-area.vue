<template slot-scope="scope">
    <div style="width:760px; height:420px; border:1px solid #777; background-color:#fff;">
        <div style="position:absolute;left:0;right:0;top:0;bottom:0; z-index:1;" ref="map"></div>
        <el-dialog width="20%" :visible.sync="addDialog " :append-to-body="true " :close-on-click-modal="false " :close-on-press-escape="false " :center="true " class="admin-dialog">
            <el-form :model="formdata">
                <el-row :gutter="30">
                    <el-col :span="24">
                        <el-form-item label="名称" prop="name">
                            <el-input size="small" v-model="formdata.name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="报警类型" prop="type">
                            <el-select size="small" v-model="formdata.type" style="width:100%;">
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
                    <el-button @click="down" type="primary">关闭</el-button>
                </div>
            </el-form>
        </el-dialog>
        <div v-if="operation" class="input-card">
            <div class="input-item" style="margin-top:15px;">
                <el-radio style="margin-left:0;padding-left:0" @change="selectRadio" v-model="radio" label="circle">画圆</el-radio>
                <el-radio style="margin-left:15px;padding-left:0" @change="selectRadio" v-model="radio" label="rectangle">画矩形</el-radio>
                <el-radio style="margin-left:15px;padding-left:0" @change="selectRadio" v-model="radio" label="polygon">画多边形</el-radio>
            </div>
            <div class="input-item item-btn" style="margin-top:24px; width:227px;margin:0 auto;">
                <!-- <el-button @click="clear" class="btn">清除</el-button> -->
                <el-button @click="close" size="mini" icon="iconfont icon-tuodong"></el-button>
                <el-button class="btn" @click="down" style="margin-left:95px;">关闭绘图</el-button>
            </div>
        </div>
        <div v-show="areaType" style="width:760px;height:420px; position:absolute;left:0;right:0;top:0;bottom:0;border:1px solid #777; z-index:99;background-color:#fff; ">
            <el-form :model="tableQuery " ref="baseForm ">
                <el-row :gutter="30 ">
                    <el-col :span="10 ">
                        <el-form-item label="名称 " prop="name ">
                            <el-input v-model="tableQuery.name " size="small "></el-input>
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
                <el-button type="primary " @click="addForm " size="small ">添加行车区域</el-button>
                <el-button type="primary " @click="addForm " size="small ">添加自定义区域</el-button>
            </el-form>
            <el-table :data="tableData.data ">
                <el-table-column prop="sequence" label="序号 " :formatter="$utils.baseFormatter "> </el-table-column>
                <el-table-column prop="type" label="管理类型 " :formatter="$utils.baseFormatter "> </el-table-column>
                <el-table-column prop="name" label="名称 " :formatter="$utils.baseFormatter "> </el-table-column>
                <el-table-column prop="alarm_type" label="报警类型 " :formatter="$utils.baseFormatter "> </el-table-column>
                <el-table-column prop="time" label="时间 " :formatter="$utils.baseFormatter "> </el-table-column>
                <el-table-column width="150" label="操作 ">
                    <template slot-scope="scope ">
                        <label style="margin-right:3px; ">添加车辆</label>
                        <label style="margin-right:3px; ">删除</label>
                        <label>查看</label>
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
import initMap from "@/utils/map.js";
import moment from "moment";
export default {
  created() {
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
    });
  },
  data() {
    return {
      radio: false,
      label: "",
      areaType: true,
      operation: false,
      mapData: {
        map: {},
        mouseTool: {},
        overlays: [],
        radios: {}
      },
      addDialog: false,
      addKey: 0,
      tableQuery: {
        name: "",
        type: "",
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
    save() {
      var str;
      this.formdata.start_time =
        "000000" + moment(this.formdata.time[0]).format("HHmmss");
      this.formdata.stop_time =
        "000000" + moment(this.formdata.time[1]).format("HHmmss");
      if (this.label == "circle") {
        str =
          "^0x8600|" +
          this.formdata.type +
          "|" +
          this.mapData.overlays[0].lat +
          "|" +
          this.mapData.overlays[0].lng +
          "|" +
          this.mapData.overlays[1] +
          "|" +
          this.formdata.start_time +
          "|" +
          this.formdata.stop_time +
          "$";
      } else if (this.label == "rectangle") {
        str =
          "^0x8602|" +
          this.formdata.type +
          "|" +
          this.mapData.overlays[0].path[0].lat +
          "|" +
          this.mapData.overlays[0].path[0].lng +
          "|" +
          this.mapData.overlays[0].path[3].lat +
          "|" +
          this.mapData.overlays[0].path[3].lng +
          "|" +
          this.formdata.start_time +
          "|" +
          this.formdata.stop_time +
          "$";
      } else if (this.label == "polygon") {
        var vertices = "";
        this.mapData.overlays[0].map(item => {
          vertices = vertices + item.lat + "," + item.lng + ";";
        });
        vertices = vertices.substring(0, vertices.lastIndexOf(";"));
        str =
          "^0x8604|" +
          this.formdata.start_time +
          "|" +
          this.formdata.stop_time +
          "|" +
          vertices +
          "$";
      }
      this.socket.send(str);
    },
    selectRadio(label) {
      this.label = label;
      this.draw(label);
    },
    selectForm() {},
    addForm() {
      this.areaType = false;
      this.operation = true;
    },
    down() {
      this.addDialog = false;
      this.operation = false;
      this.areaType = true;
      this.radio = false;
      this.formdata.time = "";
      this.formdata.name = "";
      this.formdata.type = "";
      this.mapData.mouseTool.close(true);
    },
    // 分页
    handleSizeChange(val) {
      this.tableQuery.page = 1;
      this.tableQuery.size = val;
      this.getTable();
    },
    handleCurrentChange(val) {
      this.tableQuery.page = val;
      this.getTable();
    },
    close() {
      this.mapData.mouseTool.close(true); //关闭，并清除覆盖物
      this.radio = false;
    },
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
</style>
