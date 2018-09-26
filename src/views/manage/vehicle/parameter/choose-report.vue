<template>
    <div>
        <el-table height="300" :data="communication.data" style="width: 100%" class="admin-table-list">
            <el-table-column fixed prop="license" label="车牌号" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column fixed prop="operating" label="操作状态"></el-table-column>
            <el-table-column width="190" prop="" label="休眠时汇报时间间隔" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column width="190" prop="" label="紧急报警时汇报时间间隔" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column width="190" prop="" label="缺省时间汇报间隔" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column width="190" prop="" label="缺省距离汇报间隔" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column width="190" prop="" label="驾驶员未登录汇报时间间隔" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column width="190" prop="" label="驾驶员未登录汇报距离间隔" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column width="190" prop="" label="休眠时汇报距离间隔" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column width="190" prop="" label="紧急报警时汇报距离间隔" :formatter="$utils.baseFormatter"> </el-table-column>
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
                    <el-form-item label="缺省时间汇报间隔(s)">
                        <el-input style="width:60%" v-model="communication.Ox0029">
                            <template slot="append">
                                <el-button @click="setup('0x0029')">设置</el-button>
                            </template>
                        </el-input>
                        <el-button @click="collect('0x0029')" style="margin-left:31px">采集</el-button>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="缺省距离汇报间隔(m)">
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
        Ox0027: "",
        Ox002E: "",
        Ox0029: "",
        Ox002C: "",
        Ox0028: "",
        Ox002F: "",
        Ox0022: "",
        Ox002D: "",
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
        instructioncollect = "^x8104" + "|" + num + "|" + simid + "$";
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