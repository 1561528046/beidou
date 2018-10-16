<template>
    <div>
        <el-table height="300" :data="communication.data" style="width: 100%" class="admin-table-list">
            <el-table-column fixed prop="license" label="车牌号" width="100" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column fixed prop="operating" label="操作状态" width="150"></el-table-column>
            <el-table-column width="180" prop="Ox0001" label="终端心跳发送间隔" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column width="180" prop="Ox0002" label="TCP消息应答超时时间" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column width="180" prop="Ox0003" label="TCP消息重传次数" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column width="180" prop="Ox0004" label="UDP消息应答超时时间" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column width="180" prop="Ox0005" label="UDP消息重传次数" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column width="180" prop="Ox0006" label="SMS消息应答超时时间" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column width="180" prop="Ox0007" label="SMS消息重传次数" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column width="180" prop="Ox0010" label="主服务器APN" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column width="180" prop="Ox0014" label="备份服务器APN" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column width="180" prop="Ox0013" label="主服务器地址IP或域名" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column width="180" prop="Ox0017" label="备份服务器地址IP或域名" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column width="180" prop="Ox0018" label="服务器TCP端口" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column width="180" prop="Ox0019" label="服务器UDP端口" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column width="180" prop="Ox0020" label="位置汇报策略" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column width="180" prop="Ox0021" label="位置汇报方案" :formatter="$utils.baseFormatter"> </el-table-column>
        </el-table>
        <el-form label-width="170px" label-position="left" class="table-search" size="small">
            <el-row :gutter="30">
                <el-col :span="8">
                    <el-form-item label="终端心跳发送间隔(s)">
                        <el-input style="width:60%" v-model="communication.Ox0001">
                            <template slot="append">
                                <el-button @click="setup('0x0001')">设置</el-button>
                            </template>
                        </el-input>
                        <el-button @click="collect('0x0001')" style="margin-left:31px">采集</el-button>
                    </el-form-item>
                </el-col>
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
      str: "",
      selectedVehicles: [],
      length: 0,
      vehicleDialog: false,
      communication: {
        Ox0001: "",
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
        this.$set(this.communication, "data", this.$props.message);
        this.communication.data.map(item => {
          if (item.Ox0001 == undefined) {
            this.$set(item, "Ox0001", "");
            this.$set(item, "Ox0002", "");
            this.$set(item, "Ox0003", "");
            this.$set(item, "Ox0004", "");
            this.$set(item, "Ox0005", "");
            this.$set(item, "Ox0006", "");
            this.$set(item, "Ox0007", "");
            this.$set(item, "Ox0010", "");
            this.$set(item, "Ox0013", "");
            this.$set(item, "Ox0014", "");
            this.$set(item, "Ox0017", "");
            this.$set(item, "Ox0018", "");
            this.$set(item, "Ox0019", "");
            this.$set(item, "Ox0020", "");
            this.$set(item, "Ox0021", "");
          }
        });
      },
      deep: true
    },
    respond: {
      handler: function() {
        var limit = [
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "16",
          "19",
          "20",
          "23",
          "24",
          "25",
          "32",
          "33"
        ];
        this.$set(this.$data, "str", this.$props.respond);
        this.str = this.str.split("|");
        if (!limit.includes(this.str[1])) {
          return;
        }
        if (this.str[0] == "^x8106") {
          if (this.str[3][0] == "0") {
            this.str[1] = parseInt(this.str[1]).toString(16);
            this.str[1] =
              "Ox" + "0".repeat(4 - this.str[1].length) + this.str[1];
            this.communication.data.map(item => {
              if (item.sim_id.length == 11) {
                item.sim_id = "0" + item.sim_id;
              }
              if (item.sim_id == this.str[2]) {
                var utc = this.$dict.get_communication(this.str[1]);
                item.operating = utc + "采集成功";
              }
            });
          }
        } else if (this.str[0] == "^x0104") {
          this.str[3] = this.str[3].substring(0, this.str[3].length - 1);
          this.str[1] = parseInt(this.str[1]).toString(16);
          this.str[1] = "Ox" + "0".repeat(4 - this.str[1].length) + this.str[1];
          this.communication.data.map(item => {
            if (item.sim_id.length == 11) {
              item.sim_id = "0" + item.sim_id;
            }
            if (item.sim_id == this.str[3]) {
              item[this.str[1]] = this.str[2];
            }
          });
        } else {
          var state = this.str[4].substring(0, this.str[4].length - 1);
          if (state == "0") {
            this.str[1] = parseInt(this.str[1]).toString(16);
            this.str[1] =
              "Ox" + "0".repeat(4 - this.str[1].length) + this.str[1];
            this.communication.data.map(item => {
              if (item.sim_id.length == 11) {
                item.sim_id = "0" + item.sim_id;
              }
              if (item.sim_id == this.str[3]) {
                var utc = this.$dict.get_communication(this.str[1]);
                item.operating = utc + "设置成功";
              }
            });
          }
        }
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