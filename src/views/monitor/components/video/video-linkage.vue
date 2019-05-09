<template>
  <div>
    <div>
      <el-button size="small" @click="addAlarm" type="primary">新增</el-button>
    </div>
    <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%">
      <el-table-column
        width="200"
        prop="alarm_type"
        label="报警类型"
        :formatter="(row=>{return this.$dict.getAlarmList(row.alarm_type)})"
      ></el-table-column>
      <el-table-column prop="is_video_preview" label="视频预览">
        <template slot-scope="scope">
          <label v-if="scope.row.is_video_preview=='0'">否</label>
          <label v-if="scope.row.is_video_preview=='1'">是</label>
        </template>
      </el-table-column>
      <el-table-column prop="is_alarm_alert" label="警音提醒">
        <template slot-scope="scope">
          <label v-if="scope.row.is_alarm_alert=='0'">否</label>
          <label v-if="scope.row.is_alarm_alert=='1'">是</label>
        </template>
      </el-table-column>
      <el-table-column
        prop="StartTime"
        label="开始时间"
        :formatter="(row)=>{return this.$utils.formatDate14(row.StartTime)}"
      ></el-table-column>
      <el-table-column
        prop="EndTime"
        label="结束时间"
        :formatter="(row)=>{return this.$utils.formatDate14(row.EndTime)}"
      ></el-table-column>
      <el-table-column prop="is_enabled" label="是否启用">
        <template slot-scope="scope">
          <label v-if="scope.row.is_enabled=='0'">否</label>
          <label v-if="scope.row.is_enabled=='1'">是</label>
        </template>
      </el-table-column>
      <el-table-column width="250" label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="update(scope)"
            icon="el-icon-edit"
            style="margin-right:10px"
            type="warning"
          >编辑</el-button>
          <el-popover placement="top" width="160" v-model="scope.row.delType">
            <p>确定删除吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="scope.row.delType = false">取消</el-button>
              <el-button size="mini" type="primary" @click="delLinkage(scope)">确定</el-button>
            </div>
            <el-button
              size="mini"
              @click="del(scope)"
              type="danger"
              icon="el-icon-delete"
              slot="reference"
            >删除</el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      @close="callback"
      :visible.sync="addDialog"
      :append-to-body="true"
      width="40%"
      title="添加"
    >
      <add-linkage
        :key="addKey"
        :simid="formData.sim_id"
        :id="device_id"
        @success=" ()=> {this.getTable();this.addDialog = false}"
      ></add-linkage>
    </el-dialog>
    <el-dialog
      @close="callback"
      :visible.sync="updateDialog"
      :append-to-body="true"
      width="40%"
      title="编辑"
    >
      <update-linkage
        :linkage_id="updateId "
        :simid="formData.sim_id"
        :id="device_id"
        :key="addKey"
        @success=" ()=> {this.getTable();this.updateDialog = false;this.updateId = '';}"
      ></update-linkage>
    </el-dialog>
  </div>
</template>
<script>
import { getAlarmLinkBySimID, deleteAlarmLink } from "@/api/index.js";
import addLinkage from "./linkage/add-linkage.vue";
import updateLinkage from "./linkage/update-linkage.vue";
export default {
  components: { addLinkage, updateLinkage },
  created() {
    if (this.$props.simid) {
      this.$set(this.formData, "sim_id", "0" + this.$props.simid);
    }
    this.getTable();
  },
  data() {
    return {
      addKey: 0,
      updateId: "",
      addDialog: false,
      updateDialog: false,
      device_id: "",
      tableData: [],
      alarmData: [],
      alarm: [],
      channelData: [],
      channel: [],
      formData: {
        time: "",
        sim_id: "",
        alarm_type: "",
        logical_channel: "",
        StartTime: "",
        EndTime: "",
        is_video_preview: "", //是否视频预览：0不预览，1预览
        is_alarm_alert: "", //是否警音提醒：0不提醒，1提醒
        is_enabled: "" //是否启用：0不启用，1启用
      }
    };
  },
  props: ["simid", "id"],
  watch: {},
  methods: {
    // 删除报警联动信息
    del(scope) {
      scope.row.delType = true;
    },
    delLinkage(scope) {
      deleteAlarmLink(scope.row).then(res => {
        if (res.data.code == 0) {
          this.delType = false;
          this.getTable();
          return this.$notify({
            message: "删除成功",
            title: "提示",
            type: "success"
          });
        } else {
          return this.$notify({
            message: res.data.msg,
            title: "提示",
            type: "error"
          });
        }
      });
    },
    //编辑报警联动信息
    update(scope) {
      this.addKey++;
      this.updateDialog = true;
      this.$set(this.$data, "device_id", this.$props.id);
      this.$set(this.formData, "sim_id", "0" + this.$props.simid);
      this.updateId = scope.row.alarm_link_id;
    },
    // 添加报警联动信息
    addAlarm() {
      this.addKey++;
      this.$set(this.$data, "device_id", this.$props.id);
      this.$set(this.formData, "sim_id", "0" + this.$props.simid);
      this.addDialog = true;
    },
    //关闭回调
    callback() {
      this.alarm = [];
    },
    // 查询报警联动信息
    getTable() {
      getAlarmLinkBySimID(this.formData).then(res => {
        if (res.data.code == 0) {
          this.$set(this.$data, "tableData", res.data.data);
        } else {
          return this.$notify({
            message: res.data.msg,
            title: "提示",
            type: "error"
          });
        }
      });
    }
  }
};
</script>