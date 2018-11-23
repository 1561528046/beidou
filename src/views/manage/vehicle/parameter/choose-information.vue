<template >
  <div>
    <el-table height="300" :data="communication.data" style="width: 100%" class="admin-table-list">
      <el-table-column prop="license" label="车牌号" :formatter="$utils.baseFormatter"> </el-table-column>
      <el-table-column prop="operating" label="操作状态"></el-table-column>
      <el-table-column prop="O129" label="车辆所在的省域ID" :formatter="$utils.baseFormatter"> </el-table-column>
      <el-table-column prop="O130" label="车辆所在的市域ID" :formatter="$utils.baseFormatter"> </el-table-column>
      <el-table-column prop="O131" label="车牌颜色" :formatter="(row)=>{return this.$dict.get_color(row.O131)}"> </el-table-column>
      <el-table-column prop="O132" label="机动车号牌" :formatter="$utils.baseFormatter"> </el-table-column>
      <el-table-column prop="VIN" label="车辆识别码" :formatter="$utils.baseFormatter"></el-table-column>
      <el-table-column prop="Plate" label="机动车号牌分类" :formatter="(row)=>{return this.$dict.get_license_species(row.Plate)}"></el-table-column>
    </el-table>
    <el-form label-width="130px" label-position="left" class="table-search" size="small">
      <el-row :gutter="30">
        <el-col :span="7">
          <el-form-item label="机动车号牌">
            <el-input style="width:82%" v-model="communication.Ox0083">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="机动车号牌分类">
            <el-select style="width:82%" v-model="communication.Plate">
              <el-option v-for="(item,index) in this.$dict.license_species" :key="index" :value="index" :label="item">{{item}}</el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="车辆识别码(VIN)">
            <el-input style="width:82%" v-model="communication.VIN">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-button size="small" @click="setNational('82H')">设置</el-button>
          <el-button size="small" @click="collectNational('05H')" style="margin-left:31px">采集</el-button>
        </el-col>
        <el-col :span="7">
          <el-form-item label="车辆所在的省域ID">
            <el-input style="width:60%" v-model="communication.Ox0081">
              <template slot="append">
                <el-button @click="setup('0x0081')">设置</el-button>
              </template>
            </el-input>
            <el-button @click="collect('0x0081')" style="margin-left:30px">采集</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="车辆所在的市域ID">
            <el-input style="width:60%" v-model="communication.Ox0082">
              <template slot="append">
                <el-button @click="setup('0x0082')">设置</el-button>
              </template>
            </el-input>
            <el-button @click="collect('0x0082')" style="margin-left:30px">采集</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="车牌颜色">
            <el-select style="width:45%" v-model="communication.Ox0084">
              <el-option value="1" label="蓝色">蓝色</el-option>
              <el-option value="2" label="黄色">黄色</el-option>
              <el-option value="3" label="黑色">黑色</el-option>
              <el-option value="4" label="白色">白色</el-option>
              <el-option value="9" label="其他">其他</el-option>
            </el-select>
            <el-button @click="setup('0x0084')">设置</el-button>
            <el-button @click="collect('0x0084')" style="margin-left:31px">采集</el-button>
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
    this.$instruction.on("x0700", eve => {
      var data = JSON.parse(eve.data);
      var sim_id = "";
      this.communication.data.map(item => {
        if (item.sim_id.length == 11) {
          sim_id = "0" + item.sim_id;
        } else {
          sim_id = item.sim_id;
        }
        if (sim_id == data.SimID) {
          this.$set(item, "O132", data.PlateNo);
          this.$set(item, "VIN", data.VIN);
          this.$set(item, "Plate", data.PlateClassify);
        }
      });
    });
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
        VIN: "",
        Plate: "",
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
          if (item.O129 == undefined) {
            this.$set(item, "O129", "");
            this.$set(item, "O130", "");
            this.$set(item, "O131", "");
            this.$set(item, "O132", "");
            this.$set(item, "VIN", "");
            this.$set(item, "Plate", "");
          }
        });
      },
      deep: true
    },
    respond: {
      handler: function() {
        var data = JSON.parse(this.$props.respond);
        var sim_id = "";
        var limit = [129, 130, 131, 132];
        if (data.MessageID == "x8103") {
          if (data.code == "0") {
            if (limit.includes(data.ParameterId)) {
              this.communication.data.map(item => {
                sim_id =
                  item.sim_id.length == 11 ? "0" + item.sim_id : item.sim_id;
                if (sim_id == data.SimID) {
                  this.$set(item, "operating", "设置成功");
                }
              });
            }
          }
        } else if (data.MessageID == "x8106") {
          if (data.code == "0") {
            if (limit.includes(data.ParameterId)) {
              this.communication.data.map(item => {
                sim_id =
                  item.sim_id.length == 11 ? "0" + item.sim_id : item.sim_id;
                if (sim_id == data.SimID) {
                  this.$set(item, "operating", "采集成功");
                }
              });
            }
          }
        } else if (data.MessageID == "x0104") {
          var Parameters = JSON.parse(data.Parameters);
          if (Parameters.length != 0) {
            var ParameterId = "O" + Parameters[0].ParameterId;
            var ParameterValue = Parameters[0].ParameterValue;
            this.communication.data.map(item => {
              sim_id =
                item.sim_id.length == 11 ? "0" + item.sim_id : item.sim_id;
              if (sim_id == data.SimID) {
                this.$set(item, ParameterId, ParameterValue);
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
        instructioncollect = [num, simid];
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
        instructionset = [type, simid, value];
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
      } else if (this.communication.VIN == "") {
        return this.$notify({
          message: "请输入车辆识别码!",
          title: "提示",
          type: "error"
        });
      } else if (this.communication.Ox0083 == "") {
        return this.$notify({
          message: "请输入机动车号牌!",
          title: "提示",
          type: "error"
        });
      } else if (this.communication.Plate == "") {
        return this.$notify({
          message: "请输入机动车号牌分类!",
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
          VIN: this.communication.VIN, //车架号
          PlateNo: this.communication.Ox0083, //车牌号
          PlateClassify: this.communication.Plate //车牌分类
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