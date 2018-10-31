<template>
    <div style="width:100%;">
        <el-table height="300" :data="communication.data" style="width:100%" class="admin-table-list">
            <el-table-column fixed prop="license" label="车牌号" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column fixed prop="operating" label="操作状态"></el-table-column>
        </el-table>
        <div style="width:50%;float:left">
            <div style="margin-top:10px; margin-left:15px;">
                <label style="display:inline-block;width:140px; ">采集类型：</label>
                <el-select style="width:60%;" v-model="collect_type" size="small">
                    <el-option value="00H" label="记录仪执行标准版本">记录仪执行标准版本</el-option>
                    <el-option value="01H" label="当前驾驶人信息">当前驾驶人信息</el-option>
                    <el-option value="02H" label="记录仪实时时间">记录仪实时时间</el-option>
                    <el-option value="03H" label="累计行驶里程">累计行驶里程</el-option>
                    <el-option value="04H" label="记录仪脉冲系数">记录仪脉冲系数</el-option>
                    <el-option value="06H" label="状态信号配置信息">状态信号配置信息</el-option>
                    <el-option value="07H" label="唯一性编号">唯一性编号</el-option>
                </el-select>
                <el-button size="small" type="primary" style="float:right">采集</el-button>
            </div>
            <el-form label-position="left" style="margin-top:20px;margin-left:15px;" label-width="140px">
                <el-row>
                    <el-col v-if="collect_state.standard" :span="24">
                        <!-- 记录仪执行标准版本 -->
                        <el-form-item label="年号：">
                        </el-form-item>
                        <el-form-item label="修改单号：">
                        </el-form-item>
                    </el-col>
                    <el-col v-if="collect_state.driver" :span="24">
                        <!-- 当前驾驶人信息 -->
                        <el-form-item label="机动车驾驶证号码：">
                        </el-form-item>
                    </el-col>
                    <el-col v-if="collect_state.real_time" :span="24">
                        <!-- 记录仪实时时间 -->
                        <el-form-item label="时间：">
                        </el-form-item>
                    </el-col>
                    <el-col v-if="collect_state.cumulative_mileage" :span="24">
                        <!-- 累计行驶里程 -->
                        <el-form-item label="时间：">
                        </el-form-item>
                        <el-form-item label="初始里程：">
                        </el-form-item>
                        <el-form-item label="累计行驶里程：">
                        </el-form-item>
                    </el-col>
                    <el-col v-if="collect_state.pulse" :span="24">
                        <!-- 记录仪脉冲系数 -->
                        <el-form-item label="时间：">
                        </el-form-item>
                        <el-form-item label="脉冲系数：">
                        </el-form-item>
                    </el-col>
                    <el-col v-if="collect_state.state_signal" :span="24">
                        <!-- 状态信号配置信息 -->
                        <div></div>
                    </el-col>
                    <el-col v-if="collect_state.serial_number" :span="24">
                        <!-- 唯一性编号 -->
                        <el-form-item label="唯一性编号：">
                        </el-form-item>
                        <el-form-item label="初始安装日期：">
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div style="width:50%;float:right">
        </div>
    </div>
</template>
<script>
export default {
  data() {
    return {
      collect_type: "",
      communication: {
        data: []
      },
      collect_state: {
        standard: false, //记录仪执行标准版本
        driver: false, //当前驾驶人信息
        real_time: false, //记录仪实时时间
        cumulative_mileage: false, //累计行驶里程
        pulse: false, //记录仪脉冲系数
        state_signal: false, //状态信号配置信息
        serial_number: false //唯一性编号
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
  }
};
</script>
