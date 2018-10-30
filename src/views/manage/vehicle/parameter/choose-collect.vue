<template>
    <div>
        <el-form>
            <el-row :gutter="30">
                <el-col :span="6">
                    <el-form-item label="采集类型：">
                        <el-select style="width:100%;" v-model="record" size="small" clearable>
                            <el-option value="1" label="行驶速度记录">行驶速度记录</el-option>
                            <el-option value="2" label="位置信息记录">位置信息记录</el-option>
                            <el-option value="3" label="事故疑点记录">事故疑点记录</el-option>
                            <el-option value="4" label="超时驾驶记录">超时驾驶记录</el-option>
                            <el-option value="5" label="外部供电记录">外部供电记录</el-option>
                            <el-option value="6" label="参数修改记录">参数修改记录</el-option>
                            <el-option value="7" label="速度状态日志">速度状态日志</el-option>
                            <el-option value="8" label="驾驶人身份记录">驾驶人身份记录</el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="时间：">
                        <el-date-picker style="margin-left:20px;" size="small" v-model="time" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
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
        <div>
            <el-table :data="tableData" style="width: 100%">
                <el-table-column label="平局速度" width="180">
                </el-table-column>
                <el-table-column label="状态信号" width="180">
                </el-table-column>
                <el-table-column label="开始时间">
                </el-table-column>
            </el-table>
        </div>
        <!-- 位置信息记录 -->
        <div>
            <el-table :data="tableData" style="width: 100%">
                <el-table-column label="平局速度" width="180">
                </el-table-column>
                <el-table-column label="经度" width="180">
                </el-table-column>
                <el-table-column label="纬度" width="180">
                </el-table-column>
                <el-table-column label="海拔高度" width="180">
                </el-table-column>
                <el-table-column label="开始时间">
                </el-table-column>
            </el-table>
        </div>
        <!-- 事故疑点记录 -->
        <div>
            <el-table :data="tableData" style="width: 100%">
                <el-table-column label="行驶结束时间" width="180">
                </el-table-column>
                <el-table-column label="机动车驾驶证号码" width="180">
                </el-table-column>
                <el-table-column label="行驶结束时的速度">
                </el-table-column>
                <el-table-column label="行驶结束时的状态信号">
                </el-table-column>
                <el-table-column label="位置信息">
                </el-table-column>
            </el-table>
        </div>
        <!-- 超时驾驶记录 -->
        <div>
            <el-table :data="tableData" style="width: 100%">
                <el-table-column label="机动车驾驶证号码" width="180">
                </el-table-column>
                <el-table-column label="连续架势开始时间" width="180">
                </el-table-column>
                <el-table-column label="连续架势结束时间">
                </el-table-column>
                <el-table-column label="连续架势开始时间所在的最近一次有效时间">
                </el-table-column>
                <el-table-column label="连续架势结束时间所在的最近一次有效时间">
                </el-table-column>
            </el-table>
        </div>
        <!-- 驾驶人身份记录 -->
        <div>
            <el-table :data="tableData" style="width: 100%">
                <el-table-column label="事件发生时间" width="180">
                </el-table-column>
                <el-table-column label="机动车驾驶证号码" width="180">
                </el-table-column>
                <el-table-column label="时间类型">
                </el-table-column>
            </el-table>
        </div>
        <!-- 外部供电记录 -->
        <div>
            <el-table :data="tableData" style="width: 100%">
                <el-table-column label="事件发生时间" width="180">
                </el-table-column>
                <el-table-column label="事件类型" width="180">
                </el-table-column>
            </el-table>
        </div>
        <!-- 参数修改记录 -->
        <div>
            <el-table :data="tableData" style="width: 100%">
                <el-table-column label="事件发生时间" width="180">
                </el-table-column>
                <el-table-column label="事件类型" width="180">
                </el-table-column>
            </el-table>
        </div>
        <!-- 速度状态日志 -->
        <div>
            <el-table :data="tableData" style="width: 100%">
                <el-table-column label="额速度状态" width="180">
                </el-table-column>
                <el-table-column label="速度状态判定的开始时间" width="180">
                </el-table-column>
                <el-table-column label="速度状态判定的结束时间">
                </el-table-column>
                <el-table-column label="开始时间对应的记录速度">
                </el-table-column>
                <el-table-column label="开始时间对应的参考速度">
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
export default {
  data() {
    return {
      record: "",
      time: "",
      block_data: "",
      tableData: []
    };
  },
  methods: {
    collect() {
      if (this.record == "") {
        return this.$notify({
          message: "请选择要采集的信息!",
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
    }
  }
};
</script>