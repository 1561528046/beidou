<template>
  <div>
    <el-table height="300" :data="communication.data" style="width: 100%" class="admin-table-list">
      <el-table-column prop="license" label="车牌号" :formatter="$utils.baseFormatter"></el-table-column>
      <el-table-column prop="operate" label="操作状态"></el-table-column>
    </el-table>
    <el-form label-width="220px" label-position="left">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="拐点补传角度">
            <el-input size="small" v-model="communication.Ox0030">
              <template slot="append">
                <el-button @click="setUp('0x0030')">设置</el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="电子围栏半径">
            <el-input size="small" v-model="communication.Ox0031">
              <template slot="append">
                <el-button @click="setUp('0x0031')">设置</el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="车辆里程表读数">
            <el-input size="small" v-model="communication.Ox0080">
              <template slot="append">
                <el-button @click="setUp('0x0080')">设置</el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="机动车号牌">
            <el-input size="small" v-model="communication.Ox0083">
              <template slot="append">
                <el-button @click="setUp('0x0083')">设置</el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="主服务器无线通信拨号用户名">
            <el-input size="small" v-model="communication.Ox0011">
              <template slot="append">
                <el-button @click="setUp('0x0011')">设置</el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="主服务器无线通信拨号密码">
            <el-input size="small" v-model="communication.Ox0012">
              <template slot="append">
                <el-button @click="setUp('0x0012')">设置</el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="备份服务器无线通信拨号用户名">
            <el-input size="small" v-model="communication.Ox0015">
              <template slot="append">
                <el-button @click="setUp('0x0015')">设置</el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="备份服务器无线通信拨号密码 ">
            <el-input size="small" v-model="communication.Ox0016">
              <template slot="append">
                <el-button @click="setUp('0x0016')">设置</el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label-width="310px" label="道路运输证 IC 卡认证主服务器 TCP 端口">
            <el-input size="small" v-model="communication.Ox001B">
              <template slot="append">
                <el-button @click="setUp('0x001B')">设置</el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label-width="310px" label="道路运输证 IC 卡认证主服务器 UDP 端口">
            <el-input size="small" v-model="communication.Ox001C">
              <template slot="append">
                <el-button @click="setUp('0x001C')">设置</el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label-width="310px" label="道路运输证 IC 卡认证主服务器 IP 地址或域名 ">
            <el-input size="small" v-model="communication.Ox001A">
              <template slot="append">
                <el-button @click="setUp('0x001A')">设置</el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label-width="310px" label="道路运输证 IC 卡认证备份服务器 IP 地址或域名">
            <el-input size="small" v-model="communication.Ox001D">
              <template slot="append">
                <el-button @click="setUp('0x001D')">设置</el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      communication: {
        Ox0011: "",
        Ox0012: "",
        Ox0015: "",
        Ox0016: "",
        Ox001A: "",
        Ox001B: "",
        Ox001C: "",
        Ox001D: "",
        Ox0030: "",
        Ox0031: "",
        Ox0080: "",
        Ox0083: "",
        data: []
      }
    };
  },
  props: {
    message: Array,
    respond: String
  },
  watch: {
    message: {
      handler: function() {
        this.$set(this.communication, "data", this.$props.message);
        this.communication.data.map(item => {
          this.$set(item, "Ox0011", "");
          this.$set(item, "Ox0012", "");
          this.$set(item, "Ox0015", "");
          this.$set(item, "Ox0016", "");
          this.$set(item, "Ox001a", "");
          this.$set(item, "Ox001b", "");
          this.$set(item, "Ox001c", "");
          this.$set(item, "Ox001d", "");
          this.$set(item, "Ox0030", "");
          this.$set(item, "Ox0031", "");
          this.$set(item, "Ox0080", "");
          this.$set(item, "Ox0083", "");
        });
      },
      deep: true
    },
    respond: {
      handler: function() {
        var sim_id = "";
        var data = JSON.parse(this.$props.respond);
        var limit = [17, 18, 21, 22, 26, 27, 28, 29, 48, 49, 12, 131];
        if (limit.includes(data.ParameterId)) {
          if (data.code == "0") {
            this.communication.data.map(item => {
              sim_id =
                item.sim_id.length == 11 ? "0" + item.sim_id : item.sim_id;
              if (data.SimID == sim_id) {
                this.$set(item, "operate", "指令发送成功");
              }
            });
          }
        }
      }
    }
  },
  methods: {
    setUp(type) {
      var data = {};
      var code = "O" + type.slice(1);
      var sim_id = "";
      this.communication.data.map(item => {
        sim_id = item.sim_id.length == 11 ? "0" + item.sim_id : item.sim_id;
        data = {
          SimID: sim_id,
          MessageID: "x8103",
          ParameterId: parseInt(type),
          ParameterValue: this.communication[code]
        };
        data = JSON.stringify(data);
        this.$instruction.send(data);
      });
    }
  }
};
</script>