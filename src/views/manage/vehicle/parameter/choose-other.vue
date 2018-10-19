<template >
  <div>
    <el-table height="300" :data="communication.data" style="width: 100%" class="admin-table-list">
      <el-table-column prop="license" label="车牌号" :formatter="$utils.baseFormatter"> </el-table-column>
      <el-table-column prop="operating" label="操作状态"></el-table-column>
      <!-- <el-table-column prop="Ox8300" label="文本信息下发" :formatter="$utils.baseFormatter"> </el-table-column> -->
    </el-table>
    <el-form label-width="150px" label-position="left" class="table-search" size="small">
      <el-select @change="chooseSetting" v-model="parameter" style="margin-bottom:10px;">
        <el-option value="1" label="文本信息下发">文本信息下发</el-option>
        <el-option value="2" label="信息点播/取消">信息点播/取消</el-option>
        <el-option value="3" label="信息服务">信息服务</el-option>
        <el-option value="4" label="提问应答">提问应答</el-option>
      </el-select>
      <div v-if="text_Information" style="width:30%;margin:0 auto; text-align:center;">
        <el-form-item label="标志">
          <el-input></el-input>
        </el-form-item>
        <el-form-item label="文本信息">
          <el-input></el-input>
        </el-form-item>
        <el-button type="primary" @click="setup()" size="small">设置</el-button>
      </div>
      <div v-if="demand" style="width:30%;margin:0 auto; text-align:center;">
        <el-form-item label="信息类型">
          <el-input></el-input>
        </el-form-item>
        <el-form-item label="点播/取消标志">
          <el-select style="width:100%;">
            <el-option value="0" label="取消">取消</el-option>
            <el-option value="1" label="点播">点播</el-option>
          </el-select>
        </el-form-item>
        <el-button type="primary" @click="setup()" size="small">设置</el-button>
      </div>
      <div v-if="service" style="width:30%;margin:0 auto; text-align:center;">
        <el-form-item label="信息类型">
          <el-input></el-input>
        </el-form-item>
        <el-form-item label="信息长度">
          <el-input></el-input>
        </el-form-item>
        <el-form-item label="信息内容">
          <el-input></el-input>
        </el-form-item>
        <el-button type="primary" @click="setup()" size="small">设置</el-button>
      </div>
      <div v-if="questions" style="width:30%;margin:0 auto; text-align:center;">
        <el-form-item label="应答流水号">
          <el-input></el-input>
        </el-form-item>
        <el-form-item label="答案ID">
          <el-input></el-input>
        </el-form-item>
        <el-button type="primary" @click="setup()" size="small">设置</el-button>
      </div>
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
      text_Information: false,
      demand: false,
      service: false,
      questions: false,
      parameter: "",
      str: "",
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
    //区域展示
    chooseSetting(type) {
      if (type == "1") {
        this.text_Information = true;
        this.demand = false;
        this.service = false;
        this.questions = false;
      } else if (type == "2") {
        this.text_Information = false;
        this.demand = true;
        this.service = false;
        this.questions = false;
      } else if (type == "3") {
        this.text_Information = false;
        this.demand = false;
        this.service = true;
        this.questions = false;
      } else if (type == "4") {
        this.text_Information = false;
        this.demand = false;
        this.service = false;
        this.questions = true;
      }
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
    setup() {
      var parameter_id;
      if (this.parameter == "1") {
        parameter_id = "x8202";
      } else if (this.parameter == "2") {
        parameter_id = "x0301";
      }
      console.log(parameter_id);
    }
  }
};
</script>