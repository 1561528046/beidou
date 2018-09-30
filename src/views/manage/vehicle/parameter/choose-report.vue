<template>
    <div>
        <el-table height="300" :data="communication.data" style="width: 100%" class="admin-table-list">
            <el-table-column fixed prop="license" label="车牌号" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column fixed prop="operating" label="操作状态"></el-table-column>
            <el-table-column width="190" prop="Ox0027" label="休眠时汇报时间间隔" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column width="190" prop="Ox002e" label="休眠时汇报距离间隔" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column width="190" prop="Ox0028" label="紧急报警时汇报时间间隔" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column width="190" prop="Ox002f" label="紧急报警时汇报距离间隔" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column width="190" prop="Ox0029" label="缺省时间汇报间隔" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column width="190" prop="Ox002c" label="缺省距离汇报间隔" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column width="190" prop="Ox0022" label="驾驶员未登录汇报时间间隔" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column width="190" prop="Ox002d" label="驾驶员未登录汇报距离间隔" :formatter="$utils.baseFormatter"> </el-table-column>
        </el-table>
        <el-form label-width="205px" label-position="left" class="table-search" size="small">
            <el-row :gutter="30">
                <el-col :span="8">
                    <el-form-item label="休眠时汇报时间间隔(s)">
                        <el-input style="width:60%" v-model="communication.Ox0027">
                            <template slot="append">
                                <el-button @click="setup('0x0027')">设置</el-button>
                            </template>
                        </el-input>
                        <el-button @click="collect('0x0027')" style="margin-left:31px">采集</el-button>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="休眠时汇报距离间隔(m)">
                        <el-input style="width:60%" v-model="communication.Ox002E">
                            <template slot="append">
                                <el-button @click="setup('0x002E')">设置</el-button>
                            </template>
                        </el-input>
                        <el-button @click="collect('0x002E')" style="margin-left:31px">采集</el-button>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="缺省时间汇报时间间隔(s)">
                        <el-input style="width:60%" v-model="communication.Ox0029">
                            <template slot="append">
                                <el-button @click="setup('0x0029')">设置</el-button>
                            </template>
                        </el-input>
                        <el-button @click="collect('0x0029')" style="margin-left:31px">采集</el-button>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="缺省距离汇报距离间隔(m)">
                        <el-input style="width:60%" v-model="communication.Ox002C">
                            <template slot="append">
                                <el-button @click="setup('0x002C')">设置</el-button>
                            </template>
                        </el-input>
                        <el-button @click="collect('0x002C')" style="margin-left:31px">采集</el-button>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="紧急报警时汇报时间间隔(s)">
                        <el-input style="width:60%" v-model="communication.Ox0028">
                            <template slot="append">
                                <el-button @click="setup('0x0028')">设置</el-button>
                            </template>
                        </el-input>
                        <el-button @click="collect('0x0028')" style="margin-left:31px">采集</el-button>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="紧急报警时汇报距离间隔(m)">
                        <el-input style="width:60%" v-model="communication.Ox002F">
                            <template slot="append">
                                <el-button @click="setup('0x002F')">设置</el-button>
                            </template>
                        </el-input>
                        <el-button @click="collect('0x002F')" style="margin-left:31px">采集</el-button>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="驾驶员未登录汇报时间间隔(s)">
                        <el-input style="width:60%" v-model="communication.Ox0022">
                            <template slot="append">
                                <el-button @click="setup('0x0022')">设置</el-button>
                            </template>
                        </el-input>
                        <el-button @click="collect('0x0022')" style="margin-left:31px">采集</el-button>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="驾驶员未登录汇报距离间隔(m)">
                        <el-input style="width:60%" v-model="communication.Ox002D">
                            <template slot="append">
                                <el-button @click="setup('0x002D')">设置</el-button>
                            </template>
                        </el-input>
                        <el-button @click="collect('0x002D')" style="margin-left:31px">采集</el-button>
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
      selectedVehicles: [],
      length: 0,
      vehicleDialog: false,
      communication: {
        Ox0022: "",
        Ox0027: "",
        Ox0028: "",
        Ox0029: "",
        Ox002c: "",
        Ox002d: "",
        Ox002e: "",
        Ox002f: "",
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
          if (item.Ox0022 == undefined) {
            this.$set(item, "Ox0022", ""),
              this.$set(item, "Ox0027", ""),
              this.$set(item, "Ox0028", ""),
              this.$set(item, "Ox0029", ""),
              this.$set(item, "Ox002c", ""),
              this.$set(item, "Ox002d", ""),
              this.$set(item, "Ox002e", ""),
              this.$set(item, "Ox002f", "");
          }
        });
      },
      deep: true
    },
    respond: {
      handler: function() {
        var limit = ["34", "39", "40", "41", "44", "45", "46", "47"];
        var str = this.$props.respond;
        str = str.split("|");
        if (!limit.includes(str[1])) {
          return;
        }
        str[3] = str[3].substring(0, str[3].length - 1);
        str[1] = parseInt(str[1]).toString(16);
        str[1] = "Ox" + "0".repeat(4 - str[1].length) + str[1];
        this.communication.data.map(item => {
          if (item.sim_id.length == 11) {
            item.sim_id = "0" + item.sim_id;
          }
          if (item.sim_id == str[3]) {
            item[str[1]] = str[2];
            var utc = this.$dict.get_communication(str[1]);
            item.operating = utc + "采集成功";
          }
        });
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