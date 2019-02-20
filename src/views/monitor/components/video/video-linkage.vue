<template>
  <div>
    <div>
      <el-button size="small" @click="addAlarm" type="primary">新增</el-button>
    </div>
    <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop label="报警类型"></el-table-column>
      <el-table-column prop label="视频预览"></el-table-column>
      <el-table-column prop label="警音提醒"></el-table-column>
      <el-table-column prop label="联动时间"></el-table-column>
      <el-table-column prop label="是否启用"></el-table-column>
      <el-table-column prop label="操作">
        <template slot-scope="scope">
          <el-button size="mini" icon="el-icon-edit" type="warning">编辑</el-button>
          <el-button size="mini" icon="el-icon-delete" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="addDialog" :append-to-body="true" width="40%" title="添加">
      <div>
        <div style="width:40%;display:inline-block">
          <el-table
            ref="multipleTable"
            height="500"
            :data="alarmData"
            tooltip-effect="dark"
            style="width: 100%"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="alarm_name" label="报警类型"></el-table-column>
          </el-table>
        </div>
        <div style="width:60%;display:inline-block;height:500px">
          <el-form :model="formData" size="small" label-width="80px">
            <el-row :gutter="20">
              <el-col>
                <el-form-item label="视频预览">
                  <el-radio v-model="formData.preview" label="1">是</el-radio>
                  <el-radio v-model="formData.preview" label="2">否</el-radio>
                </el-form-item>
              </el-col>
              <el-col>
                <el-form-item label="监控通道">
                  <el-checkbox-group v-model="channel">
                    <el-checkbox label="CH1"></el-checkbox>
                    <el-checkbox label="CH2"></el-checkbox>
                    <el-checkbox label="CH3"></el-checkbox>
                    <el-checkbox label="CH4"></el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-col>
              <el-col>
                <el-form-item label="警音提醒">
                  <el-radio v-model="formData.remind" label="1">是</el-radio>
                  <el-radio v-model="formData.remind" label="2">否</el-radio>
                </el-form-item>
              </el-col>
              <el-col>
                <el-form-item label="联动时间">
                  <el-date-picker
                    style="width:100%"
                    v-model="formData.time"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col>
                <el-form-item label="是否启用">
                  <el-radio v-model="formData.enable" label="1">是</el-radio>
                  <el-radio v-model="formData.enable" label="2">否</el-radio>
                </el-form-item>
              </el-col>
              <el-col style="text-align:center">
                <el-form-item label-width="0">
                  <el-button type="primary">提交</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  created() {
    for (var i in this.$dict.alarm) {
      this.alarmData.push({
        alarm_type: i,
        alarm_name: this.$dict.getAlarm(i)
          ? this.$dict.getAlarm(i)
          : "非法开门报警"
      });
    }
  },
  data() {
    return {
      addKey: 0,
      addDialog: false,
      tableData: [],
      alarmData: [],
      formData: {
        preview: "1",
        channel: [],
        remind: "",
        time: "",
        enable: ""
      }
    };
  },
  methods: {
    addAlarm() {
      this.addKey++;
      this.addDialog = true;
    }
  }
};
</script>