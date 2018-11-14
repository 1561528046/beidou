<template >
  <div>
    <el-table height="300" :data="communication.data" style="width: 100%" class="admin-table-list">
      <el-table-column prop="license" label="车牌号" :formatter="$utils.baseFormatter"> </el-table-column>
      <el-table-column prop="operating" label="操作状态"></el-table-column>
      <el-table-column prop="Ox0081" label="车辆所在的省域ID" :formatter="$utils.baseFormatter"> </el-table-column>
      <el-table-column prop="Ox0082" label="车辆所在的市域ID" :formatter="$utils.baseFormatter"> </el-table-column>
      <el-table-column prop="Ox0083" label="机动车号牌" :formatter="$utils.baseFormatter"> </el-table-column>
      <el-table-column prop="Ox0084" label="车牌颜色" :formatter="$utils.baseFormatter"> </el-table-column>
    </el-table>
    <el-form label-width="130px" label-position="left" class="table-search" size="small">
      <el-row :gutter="30">
        <el-col :span="6">
          <el-form-item label-width="130px" label="机动车号牌">
            <el-input style="width:90%" v-model="communication.Ox0083">
              <!-- <template slot="append">
                <el-button @click="setup('0x0083')">设置</el-button>
              </template> -->
            </el-input>
            <!-- <el-button @click="collect('0x0083')" style="margin-left:31px">采集</el-button> -->
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label-width="130px" label="车牌颜色">
            <el-select style="width:90%" v-model="communication.Ox0084">
              <el-option value="1" label="蓝色">蓝色</el-option>
              <el-option value="2" label="黄色">黄色</el-option>
              <el-option value="3" label="黑色">黑色</el-option>
              <el-option value="4" label="白色">白色</el-option>
              <el-option value="9" label="其他">其他</el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label-width="130px" label="车辆识别码(VIN)">
            <el-input style="width:90%" v-model="communication.vehicle_code">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <div>
            <el-button size="small" @click="setNational('82H')">设置</el-button>
            <el-button size="small" @click="collectNational('05H')" style="margin-left:31px">采集</el-button>
          </div>
        </el-col>
        <el-col :span="8">
          <el-form-item label="车辆所在的省域ID">
            <el-input style="width:60%" v-model="communication.Ox0081">
              <template slot="append">
                <el-button @click="setup('0x0081')">设置</el-button>
              </template>
            </el-input>
            <el-button @click="collect('0x0081')" style="margin-left:31px">采集</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="车辆所在的市域ID">
            <el-input style="width:60%" v-model="communication.Ox0082">
              <template slot="append">
                <el-button @click="setup('0x0082')">设置</el-button>
              </template>
            </el-input>
            <el-button @click="collect('0x0082')" style="margin-left:31px">采集</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>

</template>
<script>
import chooseParameter from "@/components/choose-parameter.vue";
export default {
  components: { chooseParameter },
  //   name: "choose-communication",
  created() {
    // this.$instruction.on("x0700", eve => {
    // var data = JSON.parse(eve.data);
    // console.log(eve);
    // var sim_id = "";
    // if (data.code == "0") {
    //   this.communication.data.map(item => {
    //     if (item.sim_id.length == 11) {
    //       sim_id = "0" + item.sim_id;
    //     } else {
    //       sim_id = item.sim_id;
    //     }
    //     if (data.SimID == sim_id) {
    //       this.$set(item, "operating", "采集成功");
    //     }
    //   });
    // }
    // });
    this.$instruction.on("x8701", eve => {
      var data = JSON.parse(eve.data);
      var sim_id = "";
      if (data.code == "0") {
        this.communication.data.map(item => {
          if (item.sim_id.length == 11) {
            sim_id = "0" + item.sim_id;
          } else {
            sim_id = item.sim_id;
          }
          if (data.SimID == sim_id) {
            this.$set(item, "operating", "设置成功");
          }
        });
      }
    });
    this.$instruction.on("x8700", eve => {
      var data = JSON.parse(eve.data);
      var sim_id = "";
      if (data.code == "0") {
        this.communication.data.map(item => {
          if (item.sim_id.length == 11) {
            sim_id = "0" + item.sim_id;
          } else {
            sim_id = item.sim_id;
          }
          if (data.SimID == sim_id) {
            this.$set(item, "operating", "采集成功");
          }
        });
      }
    });
  },
  data() {
    return {
      str: "",
      selectedVehicles: [],
      length: 0,
      vehicleDialog: false,
      communication: {
        Ox0081: "",
        Ox0082: "",
        Ox0083: "",
        Ox0084: "",
        vehicle_code: "",
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
      tableLoading: true
    };
  },
  watch: {
    message: {
      handler: function() {
        this.$set(this.communication, "data", this.$props.message);
        this.communication.data.map(item => {
          if (item.Ox0081 == undefined) {
            this.$set(item, "Ox0081", ""),
              this.$set(item, "Ox0082", ""),
              this.$set(item, "Ox0083", ""),
              this.$set(item, "Ox0084", "");
          }
        });
      },
      deep: true
    },
    respond: {
      handler: function() {
        var limit = ["129", "130", "131", "132"];
        this.$set(this.$data, "str", this.$props.respond);
        this.str = this.str.split("|");
        if (!limit.includes(this.str[1])) {
          return;
        }
        if (this.str[0] == "^x8106") {
          if (this.str[3][0] == "0") {
            this.str[1] = parseInt(this.str[1]).toString(16);
            this.str[1] =
              "Ox" + "0".repeat(4 - this.str[1].length) + this.str[1];
            this.communication.data.map(item => {
              if (item.sim_id.length == 11) {
                item.sim_id = "0" + item.sim_id;
              }
              if (item.sim_id == this.str[2]) {
                var utc = this.$dict.get_communication(this.str[1]);
                item.operating = utc + "采集成功";
              }
            });
          }
        } else if (this.str[0] == "^x0104") {
          this.str[3] = this.str[3].substring(0, this.str[3].length - 1);
          this.str[1] = parseInt(this.str[1]).toString(16);
          this.str[1] = "Ox" + "0".repeat(4 - this.str[1].length) + this.str[1];
          this.communication.data.map(item => {
            if (item.sim_id.length == 11) {
              item.sim_id = "0" + item.sim_id;
            }
            if (item.sim_id == this.str[3]) {
              item[this.str[1]] = this.str[2];
            }
          });
        } else {
          var state = this.str[4].substring(0, this.str[4].length - 1);
          if (state == "0") {
            this.str[1] = parseInt(this.str[1]).toString(16);
            this.str[1] =
              "Ox" + "0".repeat(4 - this.str[1].length) + this.str[1];
            this.communication.data.map(item => {
              if (item.sim_id.length == 11) {
                item.sim_id = "0" + item.sim_id;
              }
              if (item.sim_id == this.str[3]) {
                var utc = this.$dict.get_communication(this.str[1]);
                item.operating = utc + "设置成功";
              }
            });
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
  methods: {
    vehicleClick() {
      this.vehicleDialog = true;
    },
    vehicleArr(scope) {
      this.vehicleDialog = false;
      this.length = scope.length;
      scope.map(item => {
        item.operating = "--";
      });
      this.$set(this.communication, "data", scope);
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
    setup(type) {
      var key = "O" + type.slice(1);
      var value = this.communication[key];
      var instructionset;
      var simid;
      type = parseInt(type);
      // ^set+参数id+设置的值+sim_id+ $
      if (this.communication.data.length == 0) {
        return this.$message.error("请选择车辆!");
      }
      if (value == "") {
        return this.$message.error("设置项不能为空!");
      }
      this.communication.data.map(item => {
        if (item.sim_id.length == 11) {
          simid = "0" + item.sim_id;
        } else {
          simid = item.sim_id;
        }
        instructionset =
          "^x8103" + "|" + type + "|" + value + "|" + simid + "$";
        this.$emit("setting", instructionset);
      });
    },
    setNational(type) {
      if (this.communication.data.length == 0) {
        return this.$notify({
          message: "请选择车辆!",
          title: "提示",
          type: "error"
        });
      } else if (this.communication.data.length > 1) {
        return this.$notify({
          message: "无法进行批量设置!",
          title: "提示",
          type: "error"
        });
      } else if (this.communication.vehicle_code == "") {
        return this.$notify({
          message: "请输入车辆识别码!",
          title: "提示",
          type: "error"
        });
      } else if (this.communication.Ox0083 == "") {
        return this.$notify({
          message: "请输入车牌号!",
          title: "提示",
          type: "error"
        });
      } else if (this.communication.Ox0084 == "") {
        return this.$notify({
          message: "请输入车牌颜色!",
          title: "提示",
          type: "error"
        });
      }
      var data = {};
      var sim_id = "";
      if (this.communication.data[0].sim_id.length == 11) {
        sim_id = "0" + this.communication.data[0].sim_id;
      }
      if (type == "82H") {
        //车辆信息
        type = parseInt(type, 16);
        data = {
          SimID: sim_id,
          MessageID: "x8701",
          CommandWord: type, //命令字
          VIN: this.communication.vehicle_code, //车架号
          PlateNo: this.communication.Ox0083, //车牌号
          PlateClassify: this.communication.Ox0084 //车牌颜色
        };
        data = JSON.stringify(data);
        this.$instruction.send(data);
      }
    },
    collectNational(type) {
      if (this.communication.data.length == 0) {
        return this.$notify({
          message: "请选择车辆!",
          title: "提示",
          type: "error"
        });
      }
      var sim_id = "";
      var data = {};
      if (this.communication.data[0].sim_id.length == 11) {
        sim_id = "0" + this.communication.data[0].sim_id;
      }
      if (type == "05H") {
        type = parseInt(type, 16);
        data = {
          SimID: sim_id,
          MessageID: "x8700",
          CommandWord: type
        };
        data = JSON.stringify(data);
        this.$instruction.send(data);
      }
    }
  }
};
</script>