<template >
  <div>
    <el-table height="300" :data="communication.data" style="width: 100%" class="admin-table-list">
      <el-table-column prop="license" label="车牌号" :formatter="$utils.baseFormatter"> </el-table-column>
      <el-table-column prop="operating" label="操作状态"></el-table-column>
    </el-table>
    <div>
      <el-form label-width="100px" label-position="left" class="table-search" size="small">
        <el-row :gutter="30">
          <el-col :span="24">
            <el-form-item label="设置类型">
              <el-select v-model="demand_type" size="small" clearable>
                <el-option value="0" label="删除终端全部信息项">删除终端全部信息项</el-option>
                <el-option value="1" label="更新菜单">更新事件</el-option>
                <el-option value="2" label="追加菜单">追加事件</el-option>
                <el-option value="3" label="修改菜单">修改事件</el-option>
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
      formData: {
        news: false,
        weather_forecast: false
      },
      information_Items: [],
      demand_type: "",
      parameter: "",
      length: 0,
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
      handler: function() {
        console.log(this.$props.respond);
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
    cunchu(label) {
      if (this.information_Items.includes(label)) {
        this.information_Items.splice(this.information_Items.indexOf(label), 1);
      } else {
        this.information_Items.push(label);
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
      var arr = [];
      var simid;
      var instructionset;
      this.information_Items.map(item => {
        if (item == "每日新闻") {
          arr.push("1 每日新闻");
        } else if (item == "天气预报") {
          arr.push("2 天气预报");
        }
      });
      arr = arr.toString();
      arr = arr.replace(",", ";");
      var reg = new RegExp(" ", "g");
      arr = arr.replace(reg, ",");
      this.communication.data.map(it => {
        if (it.sim_id.length == 11) {
          simid = "0" + it.sim_id;
        } else {
          simid = it.sim_id;
        }
        if (arr != "") {
          instructionset =
            "^x8301" + "|" + this.demand_type + "|" + arr + "|" + simid + "$";
          this.$emit("setting", instructionset);
        } else {
          instructionset =
            "^x8301" + "|" + this.demand_type + "|" + simid + "$";
          this.$emit("setting", instructionset);
        }
      });
    }
  }
};
</script>