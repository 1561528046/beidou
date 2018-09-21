<template>
    <div>
        <el-table height="300" :data="communication.data" style="width: 100%" class="admin-table-list">
            <el-table-column prop="license" label="车牌号" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column prop="operating" label="操作状态"></el-table-column>
            <el-table-column prop="" label="定时拍照控制" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column prop="" label="定距拍照控制" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column prop="" label="图像/视频质量" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column prop="" label="亮度" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column prop="" label="对比度" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column prop="" label="饱和度" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column prop="" label="色度" :formatter="$utils.baseFormatter"> </el-table-column>
        </el-table>
        <el-form label-width="180px" label-position="left" class="table-search" size="small">
            <el-row :gutter="30">
                <el-col :span="8">
                    <el-form-item label="定时拍照控制">
                        <el-input style="width:60%">
                            <template slot="append">
                                <el-button @click="setup('0x0064')">设置</el-button>
                            </template>
                        </el-input>
                        <el-button @click="collect('0x0064')" style="margin-left:31px">采集</el-button>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="定距拍照控制">
                        <el-input style="width:60%">
                            <template slot="append">
                                <el-button @click="setup('0x0065')">设置</el-button>
                            </template>
                        </el-input>
                        <el-button @click="collect('0x0065')" style="margin-left:31px">采集</el-button>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="图像/视频质量">
                        <el-input style="width:60%">
                            <template slot="append">
                                <el-button @click="setup('0x0070')">设置</el-button>
                            </template>
                        </el-input>
                        <el-button @click="collect('0x0070')" style="margin-left:31px">采集</el-button>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="亮度">
                        <el-input style="width:60%">
                            <template slot="append">
                                <el-button @click="setup('0x0071')">设置</el-button>
                            </template>
                        </el-input>
                        <el-button @click="collect('0x0071')" style="margin-left:31px">采集</el-button>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="对比度">
                        <el-input style="width:60%">
                            <template slot="append">
                                <el-button @click="setup('0x0072')">设置</el-button>
                            </template>
                        </el-input>
                        <el-button @click="collect('0x0072')" style="margin-left:31px">采集</el-button>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="饱和度">
                        <el-input style="width:60%">
                            <template slot="append">
                                <el-button @click="setup('0x0073')">设置</el-button>
                            </template>
                        </el-input>
                        <el-button @click="collect('0x0073')" style="margin-left:31px">采集</el-button>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="色度">
                        <el-input style="width:60% ">
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
    }
  },
  computed: {},
  props: {
    message: Array
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
      // ^get + 参数id+ sim_id+$
      //   var str = this.$dict.get_communication(num);
      var instructioncollect;
      this.communication.data.map(item => {
        var simid = item.sim_id;
        instructioncollect = "^x8104" + "|" + num + "|" + simid + "|" + "$";
        console.log(instructioncollect);
      });
    },
    // 设置
    setup(num) {
      // ^set+参数id+设置的值+sim_id+// $
      //   var str = this.$dict.get_communication(num);
      var instructionset;
      this.communication.data.map(item => {
        var simid = item.sim_id;
        instructionset =
          "^x8103" + "|" + num + "|" + 10 + "|" + simid + "|" + "$";
        console.log(instructionset);
      });
      //   连接成功回调
      //   this.websocket.onopen = function() {
      //     this.websocket.send(instructionset);
      //   };
      // 服务端返回数据回调
      //   this.websocket.onmessage = function(event) {
      //     console.log(event.data);
      //   };
    }
  }
};
</script>