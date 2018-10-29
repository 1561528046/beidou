<template>
  <el-form ref="baseForm" :model="form" label-width="150px" size="small">
    <el-row :gutter="30">
      <el-col :span="6">
        <el-form-item label="数据来源">
          <el-select v-model="searchOrigin">
            <el-option label="设备终端" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="多媒体类型">
          <el-select v-model="x8802.MultimediaType">
            <el-option label="图像" value="0"></el-option>
            <el-option label="音频" value="1"></el-option>
            <el-option label="视频" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="通道">
          <el-radio v-model="x8802.ChannelId" label="0">所有通道</el-radio>
          <el-radio v-model="x8802.ChannelId" label="1">通道1</el-radio>
          <el-radio v-model="x8802.ChannelId" label="2">通道2</el-radio>
        </el-form-item>

        <el-form-item label="事件项">
          <el-select v-model="x8802.ChannelId">
            <el-option label="平台下发指令" value="0"></el-option>
            <el-option label="定时动作" value="1"></el-option>
            <el-option label="抢劫报警" value="2"></el-option>
            <el-option label="碰撞侧翻报警触发" value="3"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="getMediaList" :loading="loading">立即下发</el-button>
        </el-form-item>
      </el-col>
      <el-col :span="18">
        <el-table :data="list" size="mini">
          <el-table-column prop="SimID" label="sim id">
            <template slot-scope="scope">
              {{$props.vehicle.sim_id}}
            </template>
          </el-table-column>
          <el-table-column prop="MultimediaDataID" label="媒体ID"></el-table-column>
          <el-table-column prop="MultimediaType" label="媒体类型"></el-table-column>
          <el-table-column prop="ChannelId" label="通道"></el-table-column>
          <el-table-column prop="EventCode" label="事件项编码"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <audio :src="getMediaUrl(scope.row)" controls></audio>
            </template>
          </el-table-column>
        </el-table>
      </el-col>

    </el-row>

  </el-form>
</template>
<style lang="less" scoped>
.anwser-list {
  li {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }
  .add {
    text-align: center;
  }
}
</style>
<script>
export default {
  data() {
    return {
      searchOrigin: "1",
      loading: false,
      list: [],
      x8802: {
        SimID: this.$utils.formatSim(this.vehicle.sim_id),
        MessageID: "x8802",
        MultimediaType: "0", //多媒体类型
        ChannelId: "0", //通道ID
        EventCode: "0", //事件项编码
        StartTime: "110601000001", //起始时间
        EndTime: "110630235959"
      }
    };
  },
  props: ["vehicle"],
  created() {
    this.$instruction.on("x0802", this.vehicle.sim_id, evt => {
      var data = JSON.parse(evt.data);
      data.DataItems = JSON.parse(data.DataItems);
      this.$set(this.$data, "list", data.DataItems);
      //MultimediaDataID MultimediaType ChannelId EventCode事件项编码
    });
  },
  methods: {
    x8804(evt) {
      var msg = JSON.parse(evt.data);
      if (msg.code == 0) {
        this.$message.success("已发送");
      } else {
        this.$message.warning("发送失败");
      }
    },
    getMediaUrl(row) {
      var url =
        this.$dict.BASE_URL +
        `api/MultiMedia/GetMultiMediaByType?type=${row.MultimediaType}&sim_id=${
          row.SimID
        }&media_id=${row.MultimediaDataID}`;
      return url;
    },
    getMediaList() {
      this.$instruction.send(JSON.stringify(this.x8802));
    }
  },
  beforeDestroy() {
    this.$instruction.off("x8804", this.vehicle.sim_id, this.x8804);
    this.$instruction.off("x0800", this.vehicle.sim_id, this.x0800);
    this.$instruction.off("x8800", this.vehicle.sim_id, this.x8800);
  }
};
</script>
<style>
</style>