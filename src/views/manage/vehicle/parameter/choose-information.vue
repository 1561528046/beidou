<template slot-scope="scope">
  <div>
    <el-table height="300" :data="communication.data" style="width: 100%" class="admin-table-list">
      <el-table-column prop="license" label="车牌号" :formatter="$utils.baseFormatter"> </el-table-column>
      <el-table-column prop="operating" label="操作状态"></el-table-column>
      <el-table-column prop="Ox0081" label="车辆所在的省域ID" :formatter="$utils.baseFormatter"> </el-table-column>
      <el-table-column prop="Ox0082" label="车辆所在的市域ID" :formatter="$utils.baseFormatter"> </el-table-column>
      <el-table-column prop="Ox0083" label="机动车号牌" :formatter="$utils.baseFormatter"> </el-table-column>
      <el-table-column prop="Ox0084" label="车牌颜色" :formatter="$utils.baseFormatter"> </el-table-column>
    </el-table>
    <el-form label-width="170px" label-position="left" class="table-search" size="small">
      <el-row :gutter="30">
        <el-col :span="8">
          <el-form-item label="车辆所在的省域ID">
            <el-input style="width:60%" v-model="communication.Ox0081">
              <template slot="append">
                <el-button @click="setup('0x0081')">设置</el-button>
              </template>
            </el-input>
            <el-button @click="collect('0x0081')" style="margin-left:31px">采集</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="车辆所在的市域ID">
            <el-input style="width:60%" v-model="communication.Ox0082">
              <template slot="append">
                <el-button @click="setup('0x0082')">设置</el-button>
              </template>
            </el-input>
            <el-button @click="collect('0x0082')" style="margin-left:31px">采集</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="机动车号牌">
            <el-input style="width:60%" v-model="communication.Ox0083">
              <template slot="append">
                <el-button @click="setup('0x0083')">设置</el-button>
              </template>
            </el-input>
            <el-button @click="collect('0x0083')" style="margin-left:31px">采集</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="车牌颜色">
            <el-input style="width:60%" v-model="communication.Ox0084">
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
      str: "",
      selectedVehicles: [],
      length: 0,
      vehicleDialog: false,
      communication: {
        Ox0081: "",
        Ox0082: "",
        Ox0083: "",
        Ox0084: "",
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
          if (item.Ox0081 == undefined) {
            this.$set(item, "Ox0081", ""),
              this.$set(item, "Ox0082", ""),
              this.$set(item, "Ox0083", ""),
              this.$set(item, "Ox0084", "");
          }
        });
      },
      deep: true
    },
    respond: {
      handler: function() {
        var limit = ["129", "130", "131", "132"];
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