<template >
  <div>
    <el-table height="300" :data="communication.data" style="width: 100%" class="admin-table-list">
      <el-table-column prop="license" label="车牌号" :formatter="$utils.baseFormatter"> </el-table-column>
      <el-table-column prop="operate" label="操作状态"></el-table-column>
    </el-table>
    <div>
      <el-form label-width="100px" label-position="left" class="table-search" size="small">
        <el-row :gutter="30">
          <el-col :span="24">
            <el-form-item label="设置类型">
              <el-select v-model="demand_type" size="small">
                <el-option value="0" label="删除终端全部信息项">删除终端全部信息项</el-option>
                <el-option value="1" label="更新事件">更新事件</el-option>
                <el-option value="2" label="追加事件">追加事件</el-option>
                <el-option value="3" label="修改事件">修改事件</el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="信息项列表" v-if="demand_type!='0'">
              <div>
                <el-checkbox @change="cunchu('每日新闻')" v-model="formData.news">每日新闻</el-checkbox>
                <el-checkbox @change="cunchu('天气预报')" v-model="formData.weather_forecast">天气预报</el-checkbox>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-button type="primary" size="small" @click="setup">设置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      event: ["删除终端全部信息项", "更新事件", "追加事件", "修改事件"],
      formData: {
        news: false,
        weather_forecast: false
      },
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
      information_Items: [],
      demand_type: "",
      parameter: "",
      length: 0,
      instruction: "",
      tableLoading: true
    };
  },
  watch: {
    demand_type: function() {
      this.formData.news = false;
      this.formData.weather_forecast = false;
      this.information_Items = [];
    },
    message: {
      handler: function() {
        this.$set(this.communication, "data", this.$props.message);
      },
      deep: true
    },
    respond: {
      handler: function() {},
      deep: true
    }
  },
  computed: {},
  props: {
    message: Array,
    respond: String
  },
  created() {
    this.$instruction.on("x8303", eve => {
      var data = JSON.parse(eve.data);
      var sim_id = "";
      var key = parseInt(data.MenuSetType);
      if (data.code == "0") {
        this.communication.data.map(item => {
          sim_id = item.sim_id.length == 11 ? "0" + item.sim_id : item.sim_id;
          if (sim_id == data.SimID) {
            this.$set(item, "operate", this.event[key] + "设置成功");
          }
        });
      }
    });
  },
  methods: {
    cunchu(label) {
      if (this.information_Items.includes(label)) {
        this.information_Items.splice(this.information_Items.indexOf(label), 1);
      } else {
        this.information_Items.push(label);
      }
    },
    // 设置
    setup() {
      if (this.communication.data.length == 0) {
        return this.$notify({
          message: "请选择车辆!",
          title: "提示",
          type: "error"
        });
      } else if (this.demand_type == "") {
        return this.$notify({
          message: "请选择设置类型!",
          title: "提示",
          type: "error"
        });
      } else if (this.demand_type != 0) {
        if (this.information_Items.length == 0) {
          return this.$notify({
            message: "请选择信息项!",
            title: "提示",
            type: "error"
          });
        }
      }
      var arr = [];
      var simid;
      var data = {};
      this.information_Items.map(item => {
        if (item == "每日新闻") {
          arr.push({ MessageType: 1, MessageName: "每日新闻" });
        } else if (item == "天气预报") {
          arr.push({ MessageType: 2, MessageName: "天气预报" });
        }
      });
      this.communication.data.map(itam => {
        if (itam.sim_id.length == 11) {
          simid = "0" + itam.sim_id;
        } else {
          simid = itam.sim_id;
        }
        if (arr.length != 0) {
          this.communication.data.map(itbm => {
            simid = itbm.sim_id.length == 11 ? "0" + itbm.sim_id : itbm.sim_id;
            data = {
              MessageID: "x8303",
              SimID: simid,
              MenuSetType: this.demand_type,
              MessageItems: arr
            };
            data = JSON.stringify(data);
            this.$instruction.send(data);
          });
        } else {
          this.communication.data.map(item => {
            simid = item.sim_id.length == 11 ? "0" + item.sim_id : item.sim_id;
            data = {
              MessageID: "x8303",
              SimID: simid,
              MenuSetType: this.demand_type
            };
            data = JSON.stringify(data);
            this.$instruction.send(data);
          });
        }
      });
    }
  }
};
</script>