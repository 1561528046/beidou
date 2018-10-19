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
              <el-select v-model="event_type" size="small" clearable>
                <el-option value="0" label="删除终端现有所有事件">删除终端现有所有事件</el-option>
                <el-option value="1" label="更新事件">更新事件</el-option>
                <el-option value="2" label="追加事件">追加事件</el-option>
                <el-option value="3" label="修改事件">修改事件</el-option>
                <el-option value="4" label="删除特定几项事件">删除特定几项事件</el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="事件项列表" v-if="event_type!='0'">
              <div>
                <el-checkbox @change="cunchu('雷雨天气')" v-model="formData.rain">雷雨天气</el-checkbox>
                <el-checkbox @change="cunchu('路面潮湿')" v-model="formData.wet_road">路面潮湿</el-checkbox>
                <el-checkbox @change="cunchu('雾天')" v-model="formData.fog">雾天</el-checkbox>
                <el-checkbox @change="cunchu('山体滑坡')" v-model="formData.landslides">山体滑坡</el-checkbox>
                <el-checkbox @change="cunchu('台风')" v-model="formData.typhoon">台风</el-checkbox>
                <el-checkbox @change="cunchu('地震')" v-model="formData.earthquake">地震</el-checkbox>
                <el-checkbox @change="cunchu('隧道冒顶')" v-model="formData.tunnel">隧道冒顶</el-checkbox>
                <el-checkbox @change="cunchu('洪水')" v-model="formData.flood">洪水</el-checkbox>
                <el-checkbox @change="cunchu('风沙')" v-model="formData.sand">风沙</el-checkbox>
                <el-checkbox @change="cunchu('泥石流')" v-model="formData.debris_flow">泥石流</el-checkbox>
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
        rain: false,
        wet_road: false,
        fog: false,
        landslides: false,
        typhoon: false,
        earthquake: false,
        tunnel: false,
        flood: false,
        sand: false,
        debris_flow: false
      },
      arr: [],
      event_type: "",
      location: false,
      event_report: false,
      on_demand: false,
      information_service: false,
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
  created() {},
  methods: {
    cunchu(label) {
      console.log(label);
      //  if(label=="雷雨天气"){}
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
      console.log(this.event_type);
      console.log(this.formData);
      // var instructionset;
      // instructionset="x8301"+"|"+
    }
  }
};
</script>