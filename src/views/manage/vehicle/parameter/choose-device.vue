<template>
  <div>
    <el-table height="300" :data="communication.data" style="width: 100%" class="admin-table-list">
      <el-table-column prop="license" label="车牌号" :formatter="$utils.baseFormatter"></el-table-column>
      <el-table-column prop="operating" label="操作状态"></el-table-column>
      <el-table-column prop="O64" label="监控平台电话号码" :formatter="$utils.baseFormatter"></el-table-column>
      <el-table-column prop="O65" label="复位电话号码" :formatter="$utils.baseFormatter"></el-table-column>
      <el-table-column prop="O66" label="恢复出厂设置电话号码" :formatter="$utils.baseFormatter"></el-table-column>
      <el-table-column prop="O67" label="监控平台SMS电话号码" :formatter="$utils.baseFormatter"></el-table-column>
      <el-table-column prop="O68" label="接受终端SMS文本报警号码" :formatter="$utils.baseFormatter"></el-table-column>
      <el-table-column prop="O69" label="终端电话接听策略">
        <template slot-scope="scope">
          <label v-if="scope.row.O69==0">自动接听</label>
          <label v-if="scope.row.O69==1">ACC(ON 时自动接听,OFF时手动接听)</label>
        </template>
      </el-table-column>
      <el-table-column prop="O70" label="每次最长通话时间" :formatter="$utils.baseFormatter"></el-table-column>
      <el-table-column prop="O71" label="当月最长通话时间" :formatter="$utils.baseFormatter"></el-table-column>
      <el-table-column prop="O72" label="监听电话号码" :formatter="$utils.baseFormatter"></el-table-column>
      <el-table-column prop="O73" label="监管平台特权短信号码" :formatter="$utils.baseFormatter"></el-table-column>
    </el-table>
    <el-form label-width="180px" label-position="left" class="table-search" size="small">
      <el-row :gutter="30">
        <el-col :span="8">
          <el-form-item label="监控平台电话号码">
            <el-input style="width:60%" v-model="communication.Ox0040">
              <template slot="append">
                <el-button @click="setup('0x0040')">设置</el-button>
              </template>
            </el-input>
            <el-button @click="collect('0x0040')" style="margin-left:31px">采集</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="复位电话号码">
            <el-input style="width:60%" v-model="communication.Ox0041">
              <template slot="append">
                <el-button @click="setup('0x0041')">设置</el-button>
              </template>
            </el-input>
            <el-button @click="collect('0x0041')" style="margin-left:31px">采集</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="恢复出厂设置电话号码">
            <el-input style="width:60%" v-model="communication.Ox0042">
              <template slot="append">
                <el-button @click="setup('0x0042')">设置</el-button>
              </template>
            </el-input>
            <el-button @click="collect('0x0042')" style="margin-left:31px">采集</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="监控平台SMS电话号码">
            <el-input style="width:60%" v-model="communication.Ox0043">
              <template slot="append">
                <el-button @click="setup('0x0043')">设置</el-button>
              </template>
            </el-input>
            <el-button @click="collect('0x0043')" style="margin-left:31px">采集</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="接受终端SMS文本报警号码">
            <el-input style="width:60%" v-model="communication.Ox0044">
              <template slot="append">
                <el-button @click="setup('0x0044')">设置</el-button>
              </template>
            </el-input>
            <el-button @click="collect('0x0044')" style="margin-left:31px">采集</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="终端电话接听策略">
            <el-select style="width:46%;" v-model="communication.Ox0045">
              <el-option label="自动接听" value="0"></el-option>
              <el-option label="ACC(ON 时自动接听,OFF时手动接听)" value="1"></el-option>
            </el-select>
            <el-button
              style="background-color:#f5f7fa;color:#909399;font-size: inherit"
              @click="setup('0x0045')"
            >设置</el-button>
            <el-button @click="collect('0x0045')" style="margin-left:31px">采集</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="每次最长通话时间">
            <el-input style="width:60%" v-model="communication.Ox0046">
              <template slot="append">
                <el-button @click="setup('0x0046')">设置</el-button>
              </template>
            </el-input>
            <el-button @click="collect('0x0046')" style="margin-left:31px">采集</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="当月最长通话时间">
            <el-input style="width:60%" v-model="communication.Ox0047">
              <template slot="append">
                <el-button @click="setup('0x0047')">设置</el-button>
              </template>
            </el-input>
            <el-button @click="collect('0x0047')" style="margin-left:31px">采集</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="监听电话号码">
            <el-input style="width:60%" v-model="communication.Ox0048">
              <template slot="append">
                <el-button @click="setup('0x0048')">设置</el-button>
              </template>
            </el-input>
            <el-button @click="collect('0x0048')" style="margin-left:31px">采集</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="监管平台特权短信号码">
            <el-input style="width:60%" v-model="communication.Ox0049">
              <template slot="append">
                <el-button @click="setup('0x0049')">设置</el-button>
              </template>
            </el-input>
            <el-button @click="collect('0x0049')" style="margin-left:31px">采集</el-button>
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
        Ox0040: "",
        Ox0041: "",
        Ox0042: "",
        Ox0043: "",
        Ox0044: "",
        Ox0045: "",
        Ox0046: "",
        Ox0047: "",
        Ox0048: "",
        Ox0049: "",
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
          if (item.Ox0040 == undefined) {
            this.$set(item, "O64", ""),
              this.$set(item, "O65", ""),
              this.$set(item, "O66", ""),
              this.$set(item, "O67", ""),
              this.$set(item, "O68", ""),
              this.$set(item, "O69", ""),
              this.$set(item, "O70", ""),
              this.$set(item, "O71", ""),
              this.$set(item, "O72", ""),
              this.$set(item, "O73", "");
          }
        });
      },
      deep: true
    },
    respond: {
      handler: function() {
        var data = JSON.parse(this.$props.respond);
        var sim_id = "";
        var limit = [64, 65, 66, 67, 68, 69, 70, 71, 72, 73];
        if (data.MessageID == "x8103") {
          if (data.code == "0") {
            if (limit.includes(data.ParameterId)) {
              this.communication.data.map(item => {
                sim_id =
                  item.sim_id.length == 11 ? "0" + item.sim_id : item.sim_id;
                if (sim_id == data.SimID) {
                  this.$set(item, "operating", "指令发送成功");
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
          var Parameters = data.Parameters;
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