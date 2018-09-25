<template slot-scope="scope">
    <div>
        <el-table height="300" :data="communication.data" style="width: 100%" class="admin-table-list">
            <el-table-column fixed prop="license" label="车牌号" width="100" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column fixed prop="operating" label="操作状态" width="150"></el-table-column>
            <el-table-column width="180" prop="" label="TCP消息应答超时时间" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column width="180" prop="" label="TCP消息重传次数" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column width="180" prop="" label="UDP消息应答超时时间" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column width="180" prop="" label="UDP消息重传次数" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column width="180" prop="" label="SMS消息应答超时时间" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column width="180" prop="" label="SMS消息重传次数" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column width="180" prop="" label="主服务器APN" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column width="180" prop="" label="备份服务器APN" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column width="180" prop="" label="主服务器地址IP或域名" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column width="180" prop="" label="备份服务器地址IP或域名" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column width="180" prop="" label="服务器TCP端口" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column width="180" prop="" label="服务器UDP端口" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column width="180" prop="" label="位置汇报策略" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column width="180" prop="" label="位置汇报方案" :formatter="$utils.baseFormatter"> </el-table-column>
        </el-table>
        <el-form label-width="170px" label-position="left" class="table-search" size="small">
            <el-row :gutter="30">
                <el-col :span="8">
                    <el-form-item label="TCP消息应答超时时间(s)">
                        <el-input style="width:60%">
                            <template slot="append">
                                <el-button @click="setup('0x0002')">设置</el-button>
                            </template>
                        </el-input>
                        <el-button @click="collect('0x0002')" style="margin-left:31px">采集</el-button>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="TCP消息重传次数">
                        <el-input style="width:60%">
                            <template slot="append">
                                <el-button @click="setup('0x0003')">设置</el-button>
                            </template>
                        </el-input>
                        <el-button @click="collect('0x0003')" style="margin-left:31px">采集</el-button>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="UDP消息应答超时时间(s)">
                        <el-input style="width:60%">
                            <template slot="append">
                                <el-button @click="setup('0x0004')">设置</el-button>
                            </template>
                        </el-input>
                        <el-button @click="collect('0x0004')" style="margin-left:31px">采集</el-button>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="UDP消息重传次数">
                        <el-input style="width:60%">
                            <template slot="append">
                                <el-button @click="setup('0x0005')">设置</el-button>
                            </template>
                        </el-input>
                        <el-button @click="collect('0x0005')" style="margin-left:31px">采集</el-button>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="SMS消息应答超时时间(s)">
                        <el-input style="width:60%">
                            <template slot="append">
                                <el-button @click="setup('0x0006')">设置</el-button>
                            </template>
                        </el-input>
                        <el-button @click="collect('0x0006')" style="margin-left:31px">采集</el-button>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="SMS消息重传次数">
                        <el-input style="width:60%">
                            <template slot="append">
                                <el-button @click="setup('0x0007')">设置</el-button>
                            </template>
                        </el-input>
                        <el-button @click="collect('0x0007')" style="margin-left:31px">采集</el-button>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="主服务器APN">
                        <el-input style="width:60%">
                            <template slot="append">
                                <el-button @click="setup('0x0010')">设置</el-button>
                            </template>
                        </el-input>
                        <el-button @click="collect('0x0010')" style="margin-left:31px">采集</el-button>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="备份服务器APN">
                        <el-input style="width:60%">
                            <template slot="append">
                                <el-button @click="setup('0x0014')">设置</el-button>
                            </template>
                        </el-input>
                        <el-button @click="collect('0x0014')" style="margin-left:31px">采集</el-button>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="主服务器地址IP或域名">
                        <el-input style="width:60%">
                            <template slot="append">
                                <el-button @click="setup('0x0013')">设置</el-button>
                            </template>
                        </el-input>
                        <el-button @click="collect('0x0013')" style="margin-left:31px">采集</el-button>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="备份服务器地址IP或域名">
                        <el-input style="width:60%">
                            <template slot="append">
                                <el-button @click="setup('0x0017')">设置</el-button>
                            </template>
                        </el-input>
                        <el-button @click="collect('0x0017')" style="margin-left:31px">采集</el-button>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="服务器TCP端口">
                        <el-input style="width:60%">
                            <template slot="append">
                                <el-button @click="setup('0x0018')">设置</el-button>
                            </template>
                        </el-input>
                        <el-button @click="collect('0x0018')" style="margin-left:31px">采集</el-button>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="服务器UDP端口">
                        <el-input style="width:60%">
                            <template slot="append">
                                <el-button @click="setup('0x0019')">设置</el-button>
                            </template>
                        </el-input>
                        <el-button @click="collect('0x0019')" style="margin-left:31px">采集</el-button>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="位置汇报策略">
                        <el-input style="width:60%">
                            <template slot="append">
                                <el-button @click="setup('0x0020')">设置</el-button>
                            </template>
                        </el-input>
                        <el-button @click="collect('0x0020')" style="margin-left:31px">采集</el-button>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="位置汇报方案">
                        <el-input style="width:60%">
                            <template slot="append">
                                <el-button @click="setup('0x0021')">设置</el-button>
                            </template>
                        </el-input>
                        <el-button @click="collect('0x0021')" style="margin-left:31px">采集</el-button>
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
        TCPtime: "",
        TCPtimes: "",
        UDPtime: "",
        UDPtimes: "",
        SMStime: "",
        SMStimes: "",
        masterAPN: "",
        backupAPN: "",
        masterIP: "",
        backupIP: "",
        serverTCP: "",
        serverUDP: "",
        locationStrategy: "",
        locationPlan: "",
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
    // socket: {
    //   handler: function() {
    //     console.log(this.$props.socket);
    //   },
    //   deep: true
    // }
  },
  computed: {},
  props: {
    message: Array
    // socket: Object
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
      if (this.communication.data.length == 0) {
        return this.$message.error("请选择车辆!");
      }
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
      if (this.communication.data.length == 0) {
        return this.$message.error("请选择车辆!");
      }
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