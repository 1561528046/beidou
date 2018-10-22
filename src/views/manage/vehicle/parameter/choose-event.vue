<template >
  <div>
    <el-table height="300" :data="communication.data" style="width: 100%" class="admin-table-list">
      <el-table-column prop="license" label="车牌号" :formatter="$utils.baseFormatter"> </el-table-column>
      <el-table-column prop="operate" label="操作状态"></el-table-column>
    </el-table>
    <div>
      <el-form label-width="100px" label-position="left" class="table-search" size="small">
        <el-row :gutter="30">
          <el-col :span="24">
            <el-form-item label="设置类型">
              <el-select v-model="event_type" size="small" clearable>
                <el-option value="0" label="删除终端现有所有事件">删除终端现有所有事件</el-option>
                <el-option value="1" label="更新事件">更新事件</el-option>
                <el-option value="2" label="追加事件">追加事件</el-option>
                <el-option value="3" label="修改事件">修改事件</el-option>
                <el-option value="4" label="删除特定几项事件">删除特定几项事件</el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="事件项列表" v-if="event_type!='0'">
              <div>
                <el-checkbox @change="cunchu('雷雨天气')" v-model="formData.rain">雷雨天气</el-checkbox>
                <el-checkbox @change="cunchu('路面潮湿')" v-model="formData.wet_road">路面潮湿</el-checkbox>
                <el-checkbox @change="cunchu('雾天')" v-model="formData.fog">雾天</el-checkbox>
                <el-checkbox @change="cunchu('山体滑坡')" v-model="formData.landslides">山体滑坡</el-checkbox>
                <el-checkbox @change="cunchu('台风')" v-model="formData.typhoon">台风</el-checkbox>
                <el-checkbox @change="cunchu('地震')" v-model="formData.earthquake">地震</el-checkbox>
                <el-checkbox @change="cunchu('隧道冒顶')" v-model="formData.tunnel">隧道冒顶</el-checkbox>
                <el-checkbox @change="cunchu('洪水')" v-model="formData.flood">洪水</el-checkbox>
                <el-checkbox @change="cunchu('风沙')" v-model="formData.sand">风沙</el-checkbox>
                <el-checkbox @change="cunchu('泥石流')" v-model="formData.debris_flow">泥石流</el-checkbox>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-button type="primary" size="small" @click="setup">设置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      formData: {
        rain: false,
        wet_road: false,
        fog: false,
        landslides: false,
        typhoon: false,
        earthquake: false,
        tunnel: false,
        flood: false,
        sand: false,
        debris_flow: false
      },
      communication: {
        data: []
      },
      tableQuery: {
        license: "",
        user_name: "",
        type: 1
      },
      tableData: {
        total: 0,
        data: []
      },
      arr: [],
      event_item: [],
      event_type: "",
      location: false,
      event_report: false,
      on_demand: false,
      instruction: "",
      information_service: false,
      parameter: "",
      length: 0,
      tableLoading: true
    };
  },
  watch: {
    event_type: function() {
      this.formData.rain = false;
      this.formData.wet_road = false;
      this.formData.fog = false;
      this.formData.landslides = false;
      this.formData.typhoon = false;
      this.formData.earthquake = false;
      this.formData.tunnel = false;
      this.formData.flood = false;
      this.formData.sand = false;
      this.formData.debris_flow = false;
      this.event_item = [];
    },
    message: {
      handler: function() {
        this.$set(this.communication, "data", this.$props.message);
      },
      deep: true
    },
    respond: {
      handler: function() {
        var setType = [
          "删除终端所有现有事件",
          "更新事件",
          "追加事件",
          "修改事件",
          "删除特定几项事件"
        ];
        this.$set(this.$data, "instruction", this.$props.respond);
        this.instruction = this.instruction.split("|");
        if (this.instruction[0] == "^x8301") {
          // 设置项为0 this.instruction.length=4
          if (this.instruction.length == 4) {
            this.instruction[3] = this.instruction[3].substring(
              0,
              this.instruction[3].length - 1
            );
            if (this.instruction[3] == "0") {
              this.communication.data.map(item => {
                if (item.sim_id.length == 11) {
                  item.sim_id = "0" + item.sim_id;
                }
                if (this.instruction[2] == item.sim_id) {
                  this.instruction[1] = parseInt(this.instruction[1]);
                  setType[this.instruction[1]] =
                    setType[this.instruction[1]] + "成功";
                  this.$set(item, "operate", setType[this.instruction[1]]);
                }
              });
            }
          } else {
            this.instruction[4] = this.instruction[4].substring(
              0,
              this.instruction[4].length - 1
            );
            if (this.instruction[4] == "0") {
              this.communication.data.map(item => {
                if (item.sim_id.length == 11) {
                  item.sim_id = "0" + item.sim_id;
                }
                if (this.instruction[3] == item.sim_id) {
                  this.instruction[1] = parseInt(this.instruction[1]);
                  setType[this.instruction[1]] =
                    setType[this.instruction[1]] + "成功";
                  this.$set(item, "operate", setType[this.instruction[1]]);
                }
              });
            }
          }
        }
      },
      deep: true
    }
  },
  computed: {},
  props: {
    message: Array,
    respond: String
  },
  created() {},
  methods: {
    cunchu(label) {
      if (this.event_item.includes(label)) {
        this.event_item.splice(this.event_item.indexOf(label), 1);
      } else {
        this.event_item.push(label);
      }
    },
    // 采集
    collect(num) {
      num = parseInt(num);
      // ^get + 参数id+ sim_id+$
      if (this.communication.data.length == 0) {
        return this.$message.error("请选择车辆!");
      }
      var instructioncollect;
      var simid;
      this.communication.data.map(item => {
        if (item.sim_id.length == 11) {
          simid = "0" + item.sim_id;
        } else {
          simid = item.sim_id;
        }
        instructioncollect = "^x8106" + "|" + num + "|" + simid + "$";
        this.$emit("instruction", instructioncollect);
      });
    },
    // 设置
    setup() {
      if (this.communication.data.length == 0) {
        return this.$notify({
          message: "请选择车辆!",
          title: "提示",
          type: "error"
        });
      } else if (this.event_type == "") {
        return this.$notify({
          message: "请选择设置类型!",
          title: "提示",
          type: "error"
        });
      } else if (this.event_type != 0) {
        if (this.event_item.length == 0) {
          return this.$notify({
            message: "请选择信息项!",
            title: "提示",
            type: "error"
          });
        }
      }
      var arr = [];
      var simid;
      var instructionset;
      this.event_item.map(item => {
        if (item == "雷雨天气") {
          arr.push("1 雷雨天气");
        } else if (item == "路面潮湿") {
          arr.push("2 路面潮湿");
        } else if (item == "雾天") {
          arr.push("3 雾天");
        } else if (item == "山体滑坡") {
          arr.push("4 山体滑坡");
        } else if (item == "台风") {
          arr.push("5 台风");
        } else if (item == "地震") {
          arr.push("6 地震");
        } else if (item == "隧道冒顶") {
          arr.push("7 隧道冒顶");
        } else if (item == "洪水") {
          arr.push("8 洪水");
        } else if (item == "风沙") {
          arr.push("9 风沙");
        } else if (item == "泥石流") {
          arr.push("10 泥石流");
        }
      });
      arr = arr.toString();
      arr = arr.replace(",", ";");
      var reg = new RegExp(" ", "g");
      arr = arr.replace(reg, ",");
      this.communication.data.map(it => {
        if (it.sim_id.length == 11) {
          simid = "0" + it.sim_id;
        } else {
          simid = it.sim_id;
        }
        if (arr != "") {
          instructionset =
            "^x8301" + "|" + this.event_type + "|" + arr + "|" + simid + "$";
          this.$emit("setting", instructionset);
        } else {
          instructionset = "^x8301" + "|" + this.event_type + "|" + simid + "$";
          this.$emit("setting", instructionset);
        }
      });
    }
  }
};
</script>