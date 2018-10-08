<template>
  <div>
    <el-table height="300" :data="communication.data" style="width: 100%" class="admin-table-list">
      <el-table-column prop="license" label="车牌号" :formatter="$utils.baseFormatter"> </el-table-column>
      <el-table-column prop="operating" label="操作状态"></el-table-column>
      <el-table-column prop="Ox0040" label="监控平台电话号码" :formatter="$utils.baseFormatter"> </el-table-column>
      <el-table-column prop="Ox0043" label="监控平台SMS电话号码" :formatter="$utils.baseFormatter"> </el-table-column>
      <el-table-column prop="Ox0044" label="接受终端SMS文本报警号码" :formatter="$utils.baseFormatter"> </el-table-column>
      <el-table-column prop="Ox0045" label="终端电话接听策略" :formatter="$utils.baseFormatter"> </el-table-column>
      <el-table-column prop="Ox0048" label="监听电话号码" :formatter="$utils.baseFormatter"> </el-table-column>
      <el-table-column prop="Ox0049" label="监管平台特权短信号码" :formatter="$utils.baseFormatter"> </el-table-column>
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
            <!-- <el-input style="width:60%">
                            <template slot="append">
                                <el-button @click="setup('0x0045')">设置</el-button>
                            </template>
                        </el-input> -->
            <el-select style="width:46%;" v-model="communication.Ox0045">
              <el-option label="自动接听" value="0"></el-option>
              <el-option label="ACC(ON 时自动接听,OFF时手动接听)" value="1"></el-option>
            </el-select>
            <el-button style="background-color:#f5f7fa;color:#909399;font-size: inherit" @click="setup('0x0045')">设置</el-button>
            <el-button @click="collect('0x0045')" style="margin-left:31px">采集</el-button>
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
        Ox0043: "",
        Ox0044: "",
        Ox0045: "",
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
            this.$set(item, "Ox0040", ""),
              this.$set(item, "Ox0043", ""),
              this.$set(item, "Ox0044", ""),
              this.$set(item, "Ox0045", ""),
              this.$set(item, "Ox0048", ""),
              this.$set(item, "Ox0049", "");
          }
        });
      },
      deep: true
    },
    respond: {
      handler: function() {
        var limit = ["64", "67", "68", "69", "72", "73"];
        this.$set(this.$data, "str", this.$props.respond);
        this.str = this.str.split("|");
        if (!limit.includes(this.str[1])) {
          return;
        }
        if (this.str[0] == "^x8106") {
          if (this.str[2][this.str[2].length - 1] == "0") {
            var seletSim = this.str[2].substring(0, this.str[2].length - 2); //sim_id
            this.str[1] = parseInt(this.str[1]).toString(16);
            this.str[1] =
              "Ox" + "0".repeat(4 - this.str[1].length) + this.str[1];
            this.communication.data.map(item => {
              if (item.sim_id.length == 11) {
                item.sim_id = "0" + item.sim_id;
              }
              if (item.sim_id == seletSim) {
                var utc = this.$dict.get_communication(this.str[1]);
                item.operating = utc + "采集成功";
                // item[this.str[1]] = this.str[1];
              }
            });
          }
        } else {
          if (this.str[3][this.str[3].length - 1] == "0") {
            var setSim = this.str[3].substring(0, this.str[3].length - 2);
            this.str[1] = parseInt(this.str[1]).toString(16);
            this.str[1] =
              "Ox" + "0".repeat(4 - this.str[1].length) + this.str[1];
            this.communication.data.map(item => {
              if (item.sim_id.length == 11) {
                item.sim_id = "0" + item.sim_id;
              }
              if (item.sim_id == setSim) {
                var utc = this.$dict.get_communication(this.str[1]);
                item.operating = utc + "设置成功";
                // item[this.str[1]] = this.str[1];
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
    handleClick(tab) {
      console.log(tab.label);
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
    }
  }
};
</script>