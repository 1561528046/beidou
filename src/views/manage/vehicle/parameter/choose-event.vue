<template >
  <div>
    <el-table height="300" :data="communication.data" style="width: 100%" class="admin-table-list">
      <el-table-column prop="license" label="车牌号" :formatter="$utils.baseFormatter"> </el-table-column>
      <el-table-column prop="operating" label="操作状态"></el-table-column>
    </el-table>
    <div>
      <el-row :gutter="30">
        <el-col :span="8">
          <label style="display:block;margin-top:15px;">事件ID</label>
          <el-input style="width:50%" size="small"></el-input>
          <label style="display:block;margin-top:15px;">事件内容长度</label>
          <el-input style="width:50%" size="small"></el-input>
          <label style="display:block;margin-top:15px;">事件内容</label>
          <el-input style="width:50%" size="small"></el-input>
          <div style="width:50%;text-align:center;">
            <el-button type="primary" size="small">添加</el-button>
          </div>
        </el-col>
        <el-col :span="8">
          <div style="width:50%; margin: 0 auto;">
            <label style="display:block;margin-top:15px;">设置类型</label>
            <el-select size="small">
              <el-option></el-option>
              <el-option></el-option>
            </el-select>
            <label style="display:block;margin-top:15px;">事件项列表</label>
          </div>
        </el-col>
        <el-col :span="8">
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      location: false,
      event_report: false,
      on_demand: false,
      information_service: false,
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
        this.location = true;
        this.event_report = false;
        this.on_demand = false;
        this.information_service = false;
      } else if (type == "2") {
        this.location = false;
        this.event_report = true;
        this.on_demand = false;
        this.information_service = false;
      } else if (type == "3") {
        this.location = false;
        this.event_report = false;
        this.on_demand = true;
        this.information_service = false;
      } else if (type == "4") {
        this.location = false;
        this.event_report = false;
        this.on_demand = false;
        this.information_service = true;
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