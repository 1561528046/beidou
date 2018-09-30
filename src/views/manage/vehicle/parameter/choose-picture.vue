<template>
  <div>
    <el-table height="300" :data="communication.data" style="width: 100%" class="admin-table-list">
      <el-table-column prop="license" label="车牌号" :formatter="$utils.baseFormatter"> </el-table-column>
      <el-table-column prop="operating" label="操作状态"></el-table-column>
      <el-table-column prop="Ox0064" label="定时拍照控制" :formatter="$utils.baseFormatter"> </el-table-column>
      <el-table-column prop="Ox0065" label="定距拍照控制" :formatter="$utils.baseFormatter"> </el-table-column>
      <el-table-column prop="Ox0070" label="图像/视频质量" :formatter="$utils.baseFormatter"> </el-table-column>
      <el-table-column prop="Ox0071" label="亮度" :formatter="$utils.baseFormatter"> </el-table-column>
      <el-table-column prop="Ox0072" label="对比度" :formatter="$utils.baseFormatter"> </el-table-column>
      <el-table-column prop="Ox0073" label="饱和度" :formatter="$utils.baseFormatter"> </el-table-column>
      <el-table-column prop="Ox0074" label="色度" :formatter="$utils.baseFormatter"> </el-table-column>
    </el-table>
    <el-form label-width="180px" label-position="left" class="table-search" size="small">
      <el-row :gutter="30">
        <el-col :span="8">
          <el-form-item label="定时拍照控制">
            <el-input style="width:60%" v-model="communication.Ox0064">
              <template slot="append">
                <el-button @click="setup('0x0064')">设置</el-button>
              </template>
            </el-input>
            <el-button @click="collect('0x0064')" style="margin-left:31px">采集</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="定距拍照控制">
            <el-input style="width:60%" v-model="communication.Ox0065">
              <template slot="append">
                <el-button @click="setup('0x0065')">设置</el-button>
              </template>
            </el-input>
            <el-button @click="collect('0x0065')" style="margin-left:31px">采集</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="图像/视频质量(1-10)">
            <el-input style="width:60%" v-model="communication.Ox0070">
              <template slot="append">
                <el-button @click="setup('0x0070')">设置</el-button>
              </template>
            </el-input>
            <el-button @click="collect('0x0070')" style="margin-left:31px">采集</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="亮度(0-255)">
            <el-input style="width:60%" v-model="communication.Ox0071">
              <template slot="append">
                <el-button @click="setup('0x0071')">设置</el-button>
              </template>
            </el-input>
            <el-button @click="collect('0x0071')" style="margin-left:31px">采集</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="对比度(0-127)">
            <el-input style="width:60%" v-model="communication.Ox0072">
              <template slot="append">
                <el-button @click="setup('0x0072')">设置</el-button>
              </template>
            </el-input>
            <el-button @click="collect('0x0072')" style="margin-left:31px">采集</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="饱和度(0-127)">
            <el-input style="width:60%" v-model="communication.Ox0073">
              <template slot="append">
                <el-button @click="setup('0x0073')">设置</el-button>
              </template>
            </el-input>
            <el-button @click="collect('0x0073')" style="margin-left:31px">采集</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="色度(0-255)">
            <el-input style="width:60%" v-model="communication.Ox0074">
              <template slot="append">
                <el-button @click="setup('0x0074')">设置</el-button>
              </template>
            </el-input>
            <el-button @click="collect('0x0074')" style="margin-left:31px ">采集</el-button>
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
        Ox0064: "",
        Ox0065: "",
        Ox0070: "",
        Ox0071: "",
        Ox0072: "",
        Ox0073: "",
        Ox0074: "",
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
          if (item.Ox0064 == undefined) {
            this.$set(item, "Ox0064", ""),
              this.$set(item, "Ox0065", ""),
              this.$set(item, "Ox0070", ""),
              this.$set(item, "Ox0071", ""),
              this.$set(item, "Ox0072", ""),
              this.$set(item, "Ox0073", ""),
              this.$set(item, "Ox0074", "");
          }
        });
      },
      deep: true
    },
    respond: {
      handler: function() {
        var limit = ["100", "101", "112", "113", "114", "115", "116"];
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