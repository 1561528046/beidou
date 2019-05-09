<template>
  <div>
    <el-form size="small">
      <el-row :gutter="20">
        <el-col>
          <el-form-item label="通道数量">{{tableData.total}}</el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="音视频通道列表设置">
            <el-table :data="tableData.data" style="width: 100%">
              <el-table-column prop="physical_channel" label="物理通道号"></el-table-column>
              <el-table-column prop label="通道类型">
                <template slot-scope="scope">
                  <el-select @change="selectLogic(scope.row)" v-model="scope.row.channel_type">
                    <el-option value="0" label="音视频"></el-option>
                    <el-option value="1" label="音频"></el-option>
                    <el-option value="2" label="视频"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop label="逻辑通道号">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.logical_channel">
                    <el-option
                      v-for="item in scope.row.logicData"
                      :key="item.number"
                      :value="item.number"
                      :label="item.number"
                    >通道{{item.number}}{{item.area}}</el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop label="云台链接">
                <template slot-scope="scope">
                  <el-select :disabled="scope.row.link_type" v-model="scope.row.is_connect">
                    <el-option value="0" label="未连接">未连接</el-option>
                    <el-option value="1" label="连接">连接</el-option>
                  </el-select>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-col>
        <el-col style="text-align:center">
          <el-form-item label-width="0">
            <el-button @click="submitForm" type="primary">提交</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { getChannelByDeviceID, updateChannel } from "@/api/index.js";
export default {
  created() {
    this.$set(this.$data, "formData", this.$props.device);
    this.getChannel();
  },
  data() {
    return {
      channel: "",
      formData: {},
      logic_type: true,
      link_type: true,
      tableData: {
        data: [],
        total: 0
      },
      videoData: [
        { number: 1, area: "驾驶员" },
        { number: 2, area: "车辆正前方" },
        { number: 3, area: "车前门" },
        { number: 4, area: "车厢前部" },
        { number: 5, area: "车厢后部" },
        { number: 6, area: "车后门" },
        { number: 7, area: "行李舱" },
        { number: 8, area: "车辆左侧" },
        { number: 9, area: "车辆右侧" },
        { number: 10, area: "车辆正后方" },
        { number: 11, area: "车厢中部" },
        { number: 12, area: "车中门" },
        { number: 13, area: "驾驶席车门" }
      ],
      audioData: [
        { number: 33, area: "驾驶员" },
        { number: 36, area: "车厢前部" },
        { number: 37, area: "车厢后部" }
      ]
    };
  },
  props: ["device"],
  watch: {},
  methods: {
    // 查询通道信息
    getChannel() {
      getChannelByDeviceID({ device_id: this.$props.device.device_id }).then(
        res => {
          if (res.data.code == 0) {
            res.data.data.map(item => {
              if (item.channel_type == "0" || item.channel_type == "2") {
                item.logicData = this.videoData;
                item.link_type = false;
              } else if (item.channel_type == "1") {
                item.logicData = this.audioData;
                item.link_type = true;
              }
            });
            this.$set(this.tableData, "data", res.data.data);
            this.$set(this.tableData, "total", res.data.total);
          } else {
            return this.$notify({
              message: res.data.msg,
              title: "提示",
              type: "error"
            });
          }
        }
      );
    },
    selectLogic(data) {
      if (data.channel_type == "0" || data.channel_type == "2") {
        data.link_type = false;
        data.logicData = this.videoData;
        data.logical_channel = "";
      } else if (data.channel_type == "1") {
        data.link_type = true;
        data.is_connect = "0";
        data.logical_channel = "";
        data.logicData = this.audioData;
      }
    },
    // 发送指令并保存
    submitForm() {
      var data = {
        MessageID: "x8103",
        SimID: "0" + this.formData.sim_id,
        ParameterId: 118,
        x0076Item: {
          ChanneTotalNum: "", //音视频通道总数
          AudioChanneNum: "", //音频通道总数
          VideoChanneNum: "", //视频通道总数
          ChanneCheckTables: []
        }
      };
      var channel = [];
      var audio = [];
      var video = [];
      this.tableData.data.map(item => {
        updateChannel({
          device_id: this.$props.device.device_id,
          channel_type: item.channel_type, //通道类型
          physical_channel: item.physical_channel, //物理通道号
          logical_channel: item.logical_channel, //逻辑通道号
          is_connect: item.is_connect //云台链接
        }).then(res => {
          if (res.data.code != 0) {
            return this.$notify({
              message: res.data.msg,
              title: "提示",
              type: "error"
            });
          }
        });
        data.x0076Item.ChanneCheckTables.push({
          PhysicalChannelNumber: item.physical_channel, //物理通道号
          LogicalChannelNumber: item.logical_channel, //逻辑通道号
          ChannelType: item.channel_type, //通道类型
          IsConnectCloudPlatform: item.is_connect //是否连接云平台
        });
        switch (item.channel_type) {
          case "0":
            channel.push(item);
            break;
          case "1":
            audio.push(item);
            break;
          case "2":
            video.push(item);
            break;
        }
      });
      data.x0076Item.ChanneTotalNum = channel.length;
      data.x0076Item.AudioChanneNum = audio.length;
      data.x0076Item.VideoChanneNum = video.length;
      this.$instruction.send(JSON.stringify(data));
    }
  }
};
</script>