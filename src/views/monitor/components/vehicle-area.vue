<template>

    <div style="width:760px; height:420px; border:1px solid #777; background-color:#fff;">
        <div style="position:absolute;left:0;right:0;top:0;bottom:0; z-index:1;" ref="map"></div>
        <el-dialog width="20%" :visible.sync="addDialog " :append-to-body="true " :close-on-click-modal="false " :close-on-press-escape="false " :center="true " class="admin-dialog">
            <el-form :model="formdata">
                <el-row :gutter="30">
                    <el-col :span="24">
                        <el-form-item label="名称" prop="name">
                            <el-input v-model="formdata.name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="报警类型" prop="type">
                            <el-select v-model="formdata.type" style="width:100%;">
                                <el-option label="禁入" value="1">禁入</el-option>
                                <el-option label="禁出" value="2">禁出</el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="时间" prop="time">
                            <el-date-picker v-model="formdata.time" style="width:100%;" value-format="yyyyMMdd" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <div style="width:150px;margin:0 auto;">
                    <el-button type="primary">保存</el-button>
                    <el-button @click="addDialog=false" type="primary">关闭</el-button>
                </div>
            </el-form>
        </el-dialog>
        <div class="input-card">
            <div class="input-item">
                <input type="radio" name='func' checked="" value='marker'>
                <span class="input-text">画点</span>
                <input type="radio" name='func' value='polyline'>
                <span class="input-text">画折线</span>
                <input type="radio" name='func' value='polygon'>
                <span class="input-text">画多边形</span>
            </div>
            <div class="input-item">
                <input type="radio" name='func' value='rectangle'>
                <span style="margin-right: 26px;" class="input-text">画矩形</span>
                <input type="radio" name='func' value='circle'>
                <span class="input-text">画圆</span>
            </div>
            <div class="input-item">
                <!-- <input id="clear" type="button" class="btn" value="清除" />
                <input id="close" type="button" class="btn" value="关闭绘图" /> -->
                <el-button @click="clear" class="btn">清除</el-button>
                <el-button @click="close" class="btn">关闭绘图</el-button>
            </div>
        </div>
        <div style="width:760px;height:420px; position:absolute;left:0;right:0;top:0;bottom:0; z-index:99;background-color:#fff;">
            <el-form :model="tableQuery" ref="baseForm">
                <el-row :gutter="30">
                    <el-col :span="10">
                        <el-form-item label="名称" prop="name">
                            <el-input v-model="tableQuery.name" size="small"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="管理类型" prop="type">
                            <el-input v-model="tableQuery.type" size="small"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item style="text-align:center;margin-top:40px;">
                            <el-button type="primary" @click="formSubmit" size="small">查询</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-button type="primary" @click="addForm" size="small">添加行车区域</el-button>
                <el-button type="primary" @click="addForm" size="small">添加自定义区域</el-button>
            </el-form>
            <el-table :data="tableData.data">
                <el-table-column prop="sequence" label="序号" :formatter="$utils.baseFormatter"> </el-table-column>
                <el-table-column prop="type" label="管理类型" :formatter="$utils.baseFormatter"> </el-table-column>
                <el-table-column prop="name" label="名称" :formatter="$utils.baseFormatter"> </el-table-column>
                <el-table-column prop="alarm_type" label="报警类型" :formatter="$utils.baseFormatter"> </el-table-column>
                <el-table-column prop="time" label="时间" :formatter="$utils.baseFormatter"> </el-table-column>
                <el-table-column width="150" label="操作">
                    <template slot-scope="scope">
                        <label style="margin-right:3px;">添加车辆</label>
                        <label style="margin-right:3px;">删除</label>
                        <label>查看</label>
                    </template>
                </el-table-column>
            </el-table>
            <div class="admin-table-pager">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[10, 20, 50, 100]" :page-size="tableQuery.size" :total="tableData.total" layout="total, sizes, prev, pager, next, jumper" background>
                </el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
/*eslint-disable*/
import initMap from "@/utils/map.js";
export default {
  created() {},
  mounted() {
    initMap(() => {
      var map = new AMap.Map(this.$refs.map, {
        zoom: 14
      });
      map.plugin(["AMap.MouseTool"], function() {
        var mousetool = new AMap.MouseTool(map);
      });
      // var mouseTool = new AMap.MouseTool(map);
      //   var overlays = [];
      //   this.mouseTool.on("draw", function(e) {
      //     overlays.push(e.obj);
      //   });
    });
    //监听draw事件可获取画好的覆盖物
    // var radios = document.getElementsByName("func");
    // for (var i = 0; i < radios.length; i += 1) {
    //   radios[i].onchange = function(e) {
    //     this.draw(e.target.value);
    //   };
    // }
    // this.draw("marker");
  },
  data() {
    return {
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
    mouseTool() {},
    formSubmit() {},
    addForm() {
      this.addKey++;
      this.addDialog = true;
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
    clear() {
      //   map.remove(overlays);
      //   overlays = [];
    },
    close() {
      //   mouseTool.close(true); //关闭，并清除覆盖物
      //   for (var i = 0; i < radios.length; i += 1) {
      //     radios[i].checked = false;
      //   }
    },
    draw(type) {
      console.log(type);
      //   switch (type) {
      //     case "marker": {
      //       this.mouseTool.marker({
      //         //同Marker的Option设置
      //       });
      //       break;
      //     }
      //     case "polyline": {
      //       this.mouseTool.polyline({
      //         strokeColor: "#80d8ff"
      //         //同Polyline的Option设置
      //       });
      //       break;
      //     }
      //     case "polygon": {
      //       this.mouseTool.polygon({
      //         fillColor: "#00b0ff",
      //         strokeColor: "#80d8ff"
      //         //同Polygon的Option设置
      //       });
      //       break;
      //     }
      //     case "rectangle": {
      //       this.mouseTool.rectangle({
      //         fillColor: "#00b0ff",
      //         strokeColor: "#80d8ff"
      //         //同Polygon的Option设置
      //       });
      //       break;
      //     }
      //     case "circle": {
      //       this.mouseTool.circle({
      //         fillColor: "#00b0ff",
      //         strokeColor: "#80d8ff"
      //         //同Circle的Option设置
      //       });
      //       break;
      //     }
      //   }
    }
  }
};
</script>
<style>
.btn {
  float: left;
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
  margin-left: 24px;
  margin-right: 12px;
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
