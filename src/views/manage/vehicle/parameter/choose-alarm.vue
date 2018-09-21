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
        <el-form label-width="170px" label-position="left" class="table-search" size="small">
            <el-row :gutter="30">
                <el-col :span="8">
                    <el-form-item label="报警设置">
                        <el-input style="width:60%">
                            <template slot="append">
                                <el-button @click="setup()">设置</el-button>
                            </template>
                        </el-input>
                        <el-button @click="collect()" style="margin-left:31px">采集</el-button>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="最高速度(km/h)">
                        <el-input style="width:60%">
                            <template slot="append">
                                <el-button @click="setup('0x0055')">设置</el-button>
                            </template>
                        </el-input>
                        <el-button @click="collect('0x0055')" style="margin-left:31px">采集</el-button>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="超速持续时间">
                        <el-input style="width:60%">
                            <template slot="append">
                                <el-button @click="setup('0x0056')">设置</el-button>
                            </template>
                        </el-input>
                        <el-button @click="collect('0x0056')" style="margin-left:31px">采集</el-button>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="连续驾驶时间门限">
                        <el-input style="width:60%">
                            <template slot="append">
                                <el-button @click="setup('0x0057')">设置</el-button>
                            </template>
                        </el-input>
                        <el-button @click="collect('0x0057')" style="margin-left:31px">采集</el-button>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="当天累计驾驶时间门限">
                        <el-input style="width:60%">
                            <template slot="append">
                                <el-button @click="setup('0x0058')">设置</el-button>
                            </template>
                        </el-input>
                        <el-button @click="collect('0x0058')" style="margin-left:31px">采集</el-button>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="最小休息时间">
                        <el-input style="width:60%">
                            <template slot="append">
                                <el-button @click="setup('0x0059')">设置</el-button>
                            </template>
                        </el-input>
                        <el-button @click="collect('0x0059')" style="margin-left:31px">采集</el-button>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="最长停车时间">
                        <el-input style="width:60%">
                            <template slot="append">
                                <el-button @click="setup('0x005A')">设置</el-button>
                            </template>
                        </el-input>
                        <el-button @click="collect('0x005A')" style="margin-left:31px">采集</el-button>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="超速报警预警差值">
                        <el-input style="width:60%">
                            <template slot="append">
                                <el-button @click="setup('0x005B')">设置</el-button>
                            </template>
                        </el-input>
                        <el-button @click="collect('0x005B')" style="margin-left:31px">采集</el-button>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="疲劳驾驶预警差值">
                        <el-input style="width:60%">
                            <template slot="append">
                                <el-button @click="setup('0x005C')">设置</el-button>
                            </template>
                        </el-input>
                        <el-button @click="collect('0x005C')" style="margin-left:31px">采集</el-button>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="碰撞报警参数设置">
                        <el-input style="width:60%">
                            <template slot="append">
                                <el-button @click="setup('0x005D')">设置</el-button>
                            </template>
                        </el-input>
                        <el-button @click="collect('0x005D')" style="margin-left:31px">采集</el-button>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="侧翻报警参数设置">
                        <el-input style="width:60%">
                            <template slot="append">
                                <el-button @click="setup('0x005E')">设置</el-button>
                            </template>
                        </el-input>
                        <el-button @click="collect('0x005E')" style="margin-left:31px">采集</el-button>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="报警屏蔽策略设置">
                        <el-input style="width:60%">
                            <template slot="append">
                                <el-button @click="setup('0x0084')">设置</el-button>
                            </template>
                        </el-input>
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
  data() {
    return {
      selectedVehicles: [],
      length: 0,
      vehicleDialog: false,
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
      //   var str = this.$dict.get_communication(num);
      var instructioncollect;
      this.communication.data.map(item => {
        var simid = item.sim_id;
        instructioncollect = "^x8104" + "|" + num + "|" + simid + "|" + "$";
        console.log(instructioncollect);
      });
    },
    // 设置
    setup(num) {
      // ^set+参数id+设置的值+sim_id+// $
      //   var str = this.$dict.get_communication(num);
      var instructionset;
      this.communication.data.map(item => {
        var simid = item.sim_id;
        instructionset =
          "^x8103" + "|" + num + "|" + 10 + "|" + simid + "|" + "$";
        console.log(instructionset);
      });
      //   连接成功回调
      //   this.websocket.onopen = function() {
      //     this.websocket.send(instructionset);
      //   };
      // 服务端返回数据回调
      //   this.websocket.onmessage = function(event) {
      //     console.log(event.data);
      //   };
    }
  }
};
</script>