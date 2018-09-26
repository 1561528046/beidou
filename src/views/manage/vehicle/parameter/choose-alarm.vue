<template>
    <div>
        <el-table height="300" :data="communication.data" style="width: 100%" class="admin-table-list">
            <el-table-column fixed prop="license" width="100" label="车牌号" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column fixed prop="operating" width="150" label="操作状态"></el-table-column>
            <el-table-column width="180" prop="" label="报警设置" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column width="180" prop="" label="最高速度(km/h)" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column width="180" prop="" label="超速持续时间" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column width="180" prop="" label="连续驾驶时间门限" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column width="180" prop="" label="当天累计驾驶时间门限" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column width="180" prop="" label="最小休息时间" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column width="180" prop="" label="最长停车时间" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column width="180" prop="" label="超速报警预警差值" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column width="180" prop="" label="疲劳驾驶预警差值" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column width="180" prop="" label="碰撞报警参数设置" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column width="180" prop="" label="侧翻报警参数设置" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column width="180" prop="" label="报警屏蔽策略设置" :formatter="$utils.baseFormatter"> </el-table-column>
        </el-table>
        <el-form label-width="180px" label-position="left" class="table-search" size="small">
            <el-row :gutter="30">
                <el-col :span="8">
                    <el-form-item label="最高速度(km/h)">
                        <el-input style="width:60%" v-model="communication.Ox0055">
                            <template slot="append">
                                <el-button @click="setup('0x0055')">设置</el-button>
                            </template>
                        </el-input>
                        <el-button @click="collect('0x0055')" style="margin-left:31px">采集</el-button>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="超速持续时间(s)">
                        <el-input style="width:60%" v-model="communication.Ox0056">
                            <template slot="append">
                                <el-button @click="setup('0x0056')">设置</el-button>
                            </template>
                        </el-input>
                        <el-button @click="collect('0x0056')" style="margin-left:31px">采集</el-button>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="连续驾驶时间门限(s)">
                        <el-input style="width:60%" v-model="communication.Ox0057">
                            <template slot="append">
                                <el-button @click="setup('0x0057')">设置</el-button>
                            </template>
                        </el-input>
                        <el-button @click="collect('0x0057')" style="margin-left:31px">采集</el-button>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="当天累计驾驶时间门限(s)">
                        <el-input style="width:60%" v-model="communication.Ox0058">
                            <template slot="append">
                                <el-button @click="setup('0x0058')">设置</el-button>
                            </template>
                        </el-input>
                        <el-button @click="collect('0x0058')" style="margin-left:31px">采集</el-button>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="最小休息时间(s)">
                        <el-input style="width:60%" v-model="communication.Ox0059">
                            <template slot="append">
                                <el-button @click="setup('0x0059')">设置</el-button>
                            </template>
                        </el-input>
                        <el-button @click="collect('0x0059')" style="margin-left:31px">采集</el-button>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="最长停车时间(s)">
                        <el-input style="width:60%" v-model="communication.Ox005A">
                            <template slot="append">
                                <el-button @click="setup('0x005A')">设置</el-button>
                            </template>
                        </el-input>
                        <el-button @click="collect('0x005A')" style="margin-left:31px">采集</el-button>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="超速报警预警差值">
                        <el-input style="width:60%;" v-model="communication.Ox005B">
                            <template slot="append">
                                <el-button @click="setup('0x005B')">设置</el-button>
                            </template>
                        </el-input>
                        <el-button @click="collect('0x005B')" style="margin-left:31px">采集</el-button>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="疲劳驾驶预警差值(s)">
                        <el-input style="width:60%" v-model="communication.Ox005C">
                            <template slot="append">
                                <el-button @click="setup('0x005C')">设置</el-button>
                            </template>
                        </el-input>
                        <el-button @click="collect('0x005C')" style="margin-left:31px">采集</el-button>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="碰撞报警参数设置">
                        <el-input style="width:60%" v-model="communication.Ox005D">
                            <template slot="append">
                                <el-button @click="setup('0x005D')">设置</el-button>
                            </template>
                        </el-input>
                        <el-button @click="collect('0x005D')" style="margin-left:31px">采集</el-button>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="侧翻报警参数设置">
                        <el-input style="width:60%" v-model="communication.Ox005E">
                            <template slot="append">
                                <el-button @click="setup('0x005E')">设置</el-button>
                            </template>
                        </el-input>
                        <el-button @click="collect('0x005E')" style="margin-left:31px">采集</el-button>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="报警屏蔽字">
                        <el-input style="width:60%" v-model="communication.Ox0050">
                            <template slot="append">
                                <el-button @click="setup('0x0050')">设置</el-button>
                            </template>
                        </el-input>
                        <el-button @click="collect('0x0050')" style="margin-left:31px">采集</el-button>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="报警发送文本SMS开关">
                        <el-input style="width:60%" v-model="communication.Ox0051">
                            <template slot="append">
                                <el-button @click="setup('0x0051')">设置</el-button>
                            </template>
                        </el-input>
                        <el-button @click="collect('0x0051')" style="margin-left:31px">采集</el-button>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="报警拍摄开关">
                        <el-input style="width:60%" v-model="communication.Ox0052">
                            <template slot="append">
                                <el-button @click="setup('0x0052')">设置</el-button>
                            </template>
                        </el-input>
                        <el-button @click="collect('0x0052')" style="margin-left:31px">采集</el-button>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="报警拍摄存储标志">
                        <el-input style="width:60%" v-model="communication.Ox0053">
                            <template slot="append">
                                <el-button @click="setup('0x0053')">设置</el-button>
                            </template>
                        </el-input>
                        <el-button @click="collect('0x0053')" style="margin-left:31px">采集</el-button>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="关键标志">
                        <el-input style="width:60%" v-model="communication.Ox0054">
                            <template slot="append">
                                <el-button @click="setup('0x0054')">设置</el-button>
                            </template>
                        </el-input>
                        <el-button @click="collect('0x0054')" style="margin-left:31px">采集</el-button>
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
        Ox0050: "",
        Ox0051: "",
        Ox0052: "",
        Ox0053: "",
        Ox0054: "",
        Ox0055: "",
        Ox0056: "",
        Ox0057: "",
        Ox0058: "",
        Ox0059: "",
        Ox005A: "",
        Ox005B: "",
        Ox005C: "",
        Ox005D: "",
        Ox005E: "",
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
        this.communication.data = this.$props.message;
      },
      deep: true
    }
  },
  computed: {},
  props: {
    message: Array
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
        instructioncollect = "^x8104" + "|" + num + "|" + simid + "|" + "$";
        this.$emit("instruction", instructioncollect);
      });
    },
    // 设置
    setup(type) {
      var key = "O" + type.slice(1);
      var value = this.communication[key];
      var instructionset;
      var simid;
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