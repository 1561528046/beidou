<template>
  <div>
    <el-table height="300" :data="communication.data" style="width: 100%" class="admin-table-list">
      <el-table-column prop="license" label="车牌号" :formatter="$utils.baseFormatter"> </el-table-column>
      <el-table-column prop="operating" label="操作状态"></el-table-column>
      <el-table-column prop="O100" label="定时拍照控制"> </el-table-column>
      <el-table-column prop="O101" label="定距拍照控制"> </el-table-column>
      <el-table-column prop="O112" label="图像/视频质量"> </el-table-column>
      <el-table-column prop="O113" label="亮度"> </el-table-column>
      <el-table-column prop="O114" label="对比度"> </el-table-column>
      <el-table-column prop="O115" label="饱和度"> </el-table-column>
      <el-table-column prop="O116" label="色度"> </el-table-column>
    </el-table>
    <el-form label-width="180px" label-position="left" class="table-search" size="small">
      <el-row :gutter="30">
        <el-col :span="8">
          <el-form-item label="定时拍照控制">
            <el-input style="width:60%" v-model="communication.Ox0064">
              <template slot="append">
                <el-button @click="setup('0x0064')">设置</el-button>
              </template>
            </el-input>
            <el-button @click="collect('0x0064')" style="margin-left:31px">采集</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="定距拍照控制">
            <el-input style="width:60%" v-model="communication.Ox0065">
              <template slot="append">
                <el-button @click="setup('0x0065')">设置</el-button>
              </template>
            </el-input>
            <el-button @click="collect('0x0065')" style="margin-left:31px">采集</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="图像/视频质量(1-10)">
            <el-input style="width:60%" v-model="communication.Ox0070">
              <template slot="append">
                <el-button @click="setup('0x0070')">设置</el-button>
              </template>
            </el-input>
            <el-button @click="collect('0x0070')" style="margin-left:31px">采集</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="亮度(0-255)">
            <el-input style="width:60%" v-model="communication.Ox0071">
              <template slot="append">
                <el-button @click="setup('0x0071')">设置</el-button>
              </template>
            </el-input>
            <el-button @click="collect('0x0071')" style="margin-left:31px">采集</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="对比度(0-127)">
            <el-input style="width:60%" v-model="communication.Ox0072">
              <template slot="append">
                <el-button @click="setup('0x0072')">设置</el-button>
              </template>
            </el-input>
            <el-button @click="collect('0x0072')" style="margin-left:31px">采集</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="饱和度(0-127)">
            <el-input style="width:60%" v-model="communication.Ox0073">
              <template slot="append">
                <el-button @click="setup('0x0073')">设置</el-button>
              </template>
            </el-input>
            <el-button @click="collect('0x0073')" style="margin-left:31px">采集</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="色度(0-255)">
            <el-input style="width:60%" v-model="communication.Ox0074">
              <template slot="append">
                <el-button @click="setup('0x0074')">设置</el-button>
              </template>
            </el-input>
            <el-button @click="collect('0x0074')" style="margin-left:31px ">采集</el-button>
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
  data() {
    return {
      str: "",
      selectedVehicles: [],
      length: 0,
      vehicleDialog: false,
      communication: {
        Ox0064: "",
        Ox0065: "",
        Ox0070: "",
        Ox0071: "",
        Ox0072: "",
        Ox0073: "",
        Ox0074: "",
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
          if (item.O100 == undefined) {
            this.$set(item, "O100", ""),
              this.$set(item, "O101", ""),
              this.$set(item, "O112", ""),
              this.$set(item, "O113", ""),
              this.$set(item, "O114", ""),
              this.$set(item, "O115", ""),
              this.$set(item, "O116", "");
          }
        });
      },
      deep: true
    },
    respond: {
      handler: function() {
        var data = JSON.parse(this.$props.respond);
        var sim_id = "";
        var limit = [100, 101, 112, 113, 114, 115, 116];
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
  created() {},
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
    }
  }
};
</script>