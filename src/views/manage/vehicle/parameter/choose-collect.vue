<template>
    <div>
        <el-form>
            <el-row :gutter="30">
                <el-col :span="6">
                    <el-form-item label="采集类型：">
                        <el-select style="width:100%;" v-model="record" size="small" clearable>
                            <el-option value="08H" label="行驶速度记录">行驶速度记录</el-option>
                            <el-option value="09H" label="位置信息记录">位置信息记录</el-option>
                            <el-option value="10H" label="事故疑点记录">事故疑点记录</el-option>
                            <el-option value="11H" label="超时驾驶记录">超时驾驶记录</el-option>
                            <el-option value="12H" label="外部供电记录">外部供电记录</el-option>
                            <el-option value="13H" label="参数修改记录">参数修改记录</el-option>
                            <el-option value="14H" label="速度状态日志">速度状态日志</el-option>
                            <el-option value="15H" label="驾驶人身份记录">驾驶人身份记录</el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="时间：">
                        <el-date-picker style="margin-left:20px;" value-format="yyyy-MM-dd HH:mm:ss" size="small" v-model="time" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="最大单位数据块个数：">
                        <el-input size="small" v-model="block_data"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-button type="primary" size="small" @click="collect" style="margin-left:20px;margin-top:43px;">采集</el-button>
                </el-col>
            </el-row>
        </el-form>
        <!-- 行驶速度记录 -->
        <div v-if="collect_type.speed">
            <el-table :data="tableData" style="width: 100%">
                <el-table-column label="开始时间">
                </el-table-column>
                <el-table-column label="平局速度">
                </el-table-column>
                <el-table-column label="状态信号">
                </el-table-column>
            </el-table>
        </div>
        <!-- 位置信息记录 -->
        <div v-if="collect_type.location">
            <el-table :data="tableData" style="width: 100%">
                <el-table-column label="开始时间">
                </el-table-column>
                <el-table-column label="平局速度">
                </el-table-column>
                <el-table-column label="经度">
                </el-table-column>
                <el-table-column label="纬度">
                </el-table-column>
                <el-table-column label="海拔高度">
                </el-table-column>
            </el-table>
        </div>
        <!-- 事故疑点记录 -->
        <div v-if="collect_type.accident">
            <el-table :data="tableData" style="width: 100%">
                <el-table-column label="行驶结束时间">
                </el-table-column>
                <el-table-column label="机动车驾驶证号码">
                </el-table-column>
                <el-table-column label="行驶结束时的速度">
                </el-table-column>
                <el-table-column label="行驶结束时间前的速度">
                </el-table-column>
                <el-table-column label="行驶结束时间前的状态信号">
                </el-table-column>
                <el-table-column label="经度">
                </el-table-column>
                <el-table-column label="纬度">
                </el-table-column>
                <el-table-column label="海拔高度">
                </el-table-column>
            </el-table>
        </div>
        <!-- 超时驾驶记录 -->
        <div v-if="collect_type.driving">
            <el-table :data="tableData" style="width: 100%">
                <el-table-column label="机动车驾驶证号码">
                </el-table-column>
                <el-table-column label="连续驾驶开始时间">
                </el-table-column>
                <el-table-column label="连续驾驶结束时间">
                </el-table-column>
                <el-table-column label="连续驾驶开始时间所在的最近一次有效经度">
                </el-table-column>
                <el-table-column label="连续驾驶开始时间所在的最近一次有效纬度">
                </el-table-column>
                <el-table-column label="连续驾驶开始时间所在的最近一次有效海拔高度">
                </el-table-column>
                <el-table-column label="连续驾驶结束时间所在的最近一次有效经度">
                </el-table-column>
                <el-table-column label="连续驾驶结束时间所在的最近一次有效纬度">
                </el-table-column>
                <el-table-column label="连续驾驶开始时间所在的最近一次有效海拔高度">
                </el-table-column>
            </el-table>
        </div>
        <!-- 驾驶人身份记录 -->
        <div v-if="collect_type.driver_status">
            <el-table :data="tableData" style="width: 100%">
                <el-table-column label="事件发生时间">
                </el-table-column>
                <el-table-column label="机动车驾驶证号码">
                </el-table-column>
                <el-table-column label="事件类型">
                </el-table-column>
            </el-table>
        </div>
        <!-- 外部供电记录 -->
        <div v-if="collect_type.power_supply">
            <el-table :data="tableData" style="width: 100%">
                <el-table-column label="事件发生时间">
                </el-table-column>
                <el-table-column label="事件类型">
                </el-table-column>
            </el-table>
        </div>
        <!-- 参数修改记录 -->
        <div v-if="collect_type.parameter">
            <el-table :data="tableData" style="width: 100%">
                <el-table-column label="事件发生时间">
                </el-table-column>
                <el-table-column label="事件类型">
                </el-table-column>
            </el-table>
        </div>
        <!-- 速度状态日志 -->
        <div v-if="collect_type.speed_state">
            <el-table :data="tableData" style="width: 100%">
                <el-table-column label="记录仪速度状态">
                </el-table-column>
                <el-table-column label="速度状态判定的开始时间">
                </el-table-column>
                <el-table-column label="速度状态判定的结束时间">
                </el-table-column>
                <el-table-column label="开始时间对应的记录速度">
                </el-table-column>
                <el-table-column label="开始时间对应的参考速度">
                </el-table-column>
                <el-table-column label="开始时间后对应的参考速度">
                </el-table-column>
                <el-table-column label="开始时间后对应的参考速度">
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
export default {
  created() {
    this.$instruction.on("x8700", evs => {
      console.log(evs);
      //   var data = JSON.parse(evs.data);
      // if(data.code=="0"){
      // }
    });
  },
  data() {
    return {
      record: "",
      time: "",
      block_data: "",
      communication: [],
      tableData: [],
      collect_type: {
        speed: false, //行驶速度
        location: false, //位置信息
        accident: false, //事故疑点
        driving: false, //超时驾驶
        driver_status: false, //驾驶人身份
        power_supply: false, //外部供电
        parameter: false, //参数修改
        speed_state: false //速度状态
      }
    };
  },
  watch: {
    message: {
      handler: function() {
        this.$set(this.communication, "data", this.$props.message);
      }
    }
  },
  props: {
    message: Array
  },
  methods: {
    collect() {
      if (this.communication.data.length == 0) {
        return this.$notify({
          message: "请选择车辆!",
          title: "提示",
          type: "error"
        });
      } else if (this.record == "") {
        return this.$notify({
          message: "请选择采集类型!",
          title: "提示",
          type: "error"
        });
      } else if (this.time == "") {
        return this.$notify({
          message: "请选择时间!",
          title: "提示",
          type: "error"
        });
      } else if (this.block_data == "") {
        return this.$notify({
          message: "请输入最大单位数据块个数!",
          title: "提示",
          type: "error"
        });
      }
      var data = {};
      var sim_id = "";
      var command_word = parseInt(this.record, 16);
      var start_time = this.time[0];
      var end_time = this.time[1];
      this.communication.data.map(item => {
        if (item.sim_id.length == 11) {
          sim_id = "0" + item.sim_id;
        } else {
          sim_id = item.sim_id;
        }
        data = {
          SimID: sim_id,
          MessageID: "x8700",
          CommandWord: command_word, //命令字
          StartTime: start_time, //开始时间
          EndTime: end_time, //结束时间
          MaxUnitDataCount: this.block_data //最大单位数据块个数
        };
        data = JSON.stringify(data);
        this.$instruction.send(data);
      });

      //   if (this.record == "1") {
      //   }
    }
  }
};
</script>