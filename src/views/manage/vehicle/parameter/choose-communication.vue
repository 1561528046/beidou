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
                        <el-input style="width:60%" v-model="communication.Ox0002">
                            <template slot="append">
                                <el-button @click="setup('0x0002')">设置</el-button>
                            </template>
                        </el-input>
                        <el-button @click="collect('0x0002')" style="margin-left:31px">采集</el-button>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="TCP消息重传次数">
                        <el-input style="width:60%" v-model="communication.Ox0003">
                            <template slot="append">
                                <el-button @click="setup('0x0003')">设置</el-button>
                            </template>
                        </el-input>
                        <el-button @click="collect('0x0003')" style="margin-left:31px">采集</el-button>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="UDP消息应答超时时间(s)">
                        <el-input style="width:60%" v-model="communication.Ox0004">
                            <template slot="append">
                                <el-button @click="setup('0x0004')">设置</el-button>
                            </template>
                        </el-input>
                        <el-button @click="collect('0x0004')" style="margin-left:31px">采集</el-button>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="UDP消息重传次数">
                        <el-input style="width:60%" v-model="communication.Ox0005">
                            <template slot="append">
                                <el-button @click="setup('0x0005')">设置</el-button>
                            </template>
                        </el-input>
                        <el-button @click="collect('0x0005')" style="margin-left:31px">采集</el-button>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="SMS消息应答超时时间(s)">
                        <el-input style="width:60%" v-model="communication.Ox0006">
                            <template slot="append">
                                <el-button @click="setup('0x0006')">设置</el-button>
                            </template>
                        </el-input>
                        <el-button @click="collect('0x0006')" style="margin-left:31px">采集</el-button>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="SMS消息重传次数">
                        <el-input style="width:60%" v-model="communication.Ox0007">
                            <template slot="append">
                                <el-button @click="setup('0x0007')">设置</el-button>
                            </template>
                        </el-input>
                        <el-button @click="collect('0x0007')" style="margin-left:31px">采集</el-button>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="主服务器APN">
                        <el-input style="width:60%" v-model="communication.Ox0010">
                            <template slot="append">
                                <el-button @click="setup('0x0010')">设置</el-button>
                            </template>
                        </el-input>
                        <el-button @click="collect('0x0010')" style="margin-left:31px">采集</el-button>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="备份服务器APN">
                        <el-input style="width:60%" v-model="communication.Ox0014">
                            <template slot="append">
                                <el-button @click="setup('0x0014')">设置</el-button>
                            </template>
                        </el-input>
                        <el-button @click="collect('0x0014')" style="margin-left:31px">采集</el-button>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="主服务器地址IP或域名">
                        <el-input style="width:60%" v-model="communication.Ox0013">
                            <template slot="append">
                                <el-button @click="setup('0x0013')">设置</el-button>
                            </template>
                        </el-input>
                        <el-button @click="collect('0x0013')" style="margin-left:31px">采集</el-button>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="备份服务器地址IP或域名">
                        <el-input style="width:60%" v-model="communication.Ox0017">
                            <template slot="append">
                                <el-button @click="setup('0x0017')">设置</el-button>
                            </template>
                        </el-input>
                        <el-button @click="collect('0x0017')" style="margin-left:31px">采集</el-button>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="服务器TCP端口">
                        <el-input style="width:60%" v-model="communication.Ox0018">
                            <template slot="append">
                                <el-button @click="setup('0x0018')">设置</el-button>
                            </template>
                        </el-input>
                        <el-button @click="collect('0x0018')" style="margin-left:31px">采集</el-button>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="服务器UDP端口">
                        <el-input style="width:60%" v-model="communication.Ox0019">
                            <template slot="append">
                                <el-button @click="setup('0x0019')">设置</el-button>
                            </template>
                        </el-input>
                        <el-button @click="collect('0x0019')" style="margin-left:31px">采集</el-button>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="位置汇报策略">
                        <!-- <el-input style="width:60%" v-model="communication.Ox0020">
                            <template slot="append">
                                <el-button @click="setup('0x0020')">设置</el-button>
                            </template>
                        </el-input> -->
                        <el-select style="width:46%;" v-model="communication.Ox0020">
                            <el-option label="定时汇报" value="0"></el-option>
                            <el-option label="定距汇报" value="1"></el-option>
                            <el-option label="定时和定距汇报" value="2"></el-option>
                        </el-select>
                        <el-button style="background-color:#f5f7fa;color:#909399;font-size: inherit" @click="setup('0x0020')">设置</el-button>
                        <el-button @click="collect('0x0020')" style="margin-left:31px">采集</el-button>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="位置汇报方案">
                        <!-- <el-input style="width:60%" v-model="communication.Ox0021">
                            <template slot="append">
                                <el-button @click="setup('0x0021')">设置</el-button>
                            </template>
                        </el-input> -->
                        <el-select style="width:46%;" v-model="communication.Ox0021">
                            <el-option label="根据ACC状态" value="0"></el-option>
                            <el-option label="根据登录状态和ACC状态" value="1"></el-option>
                        </el-select>
                        <el-button style="background-color:#f5f7fa;color:#909399;font-size: inherit" @click="setup('0x0021')">设置</el-button>
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
        Ox0002: "",
        Ox0003: "",
        Ox0004: "",
        Ox0005: "",
        Ox0006: "",
        Ox0007: "",
        Ox0010: "",
        Ox0013: "",
        Ox0014: "",
        Ox0017: "",
        Ox0018: "",
        Ox0019: "",
        Ox0020: "",
        Ox0021: "",
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
    },
    respond: {
      handler: function() {
        // this.communication.data.map(item=>{
        //     item.sim_id==this.$props.respond
        // })
        console.log(this.$props.respond);
        var last = this.$props.respond.indexOf("|");
        console.log(last);
      }
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