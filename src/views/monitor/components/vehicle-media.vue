<template>
  <el-form
    ref="baseForm"
    :model="message"
    label-width="90px"
    size="small"
    style="position:relative;z-index:99;"
  >
    <el-row :gutter="30" style="margin:0;">
      <el-col :span="6">
        <div class="shadow-box" style="background:#FFF; padding:15px; margin-top:20px;">
          <el-form-item label="数据来源">
            <el-select v-model="searchOrigin" style="width:100%;">
              <el-option label="设备终端" value="1"></el-option>
              <el-option label="指定上传" value="2"></el-option>
              <el-option label="查询服务器" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="开始时间">
            <el-date-picker
              v-model="message.StartTime"
              type="datetime"
              placeholder="选择日期时间"
              value-format="yyMMddHHmmss"
              style="width:100%;"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间">
            <el-date-picker
              v-model="message.EndTime"
              type="datetime"
              placeholder="选择日期时间"
              value-format="yyMMddHHmmss"
              style="width:100%;"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="多媒体类型">
            <el-select v-model="message.MultimediaType" style="width:100%;">
              <el-option label="图像" value="0"></el-option>
              <el-option label="音频" value="1"></el-option>
              <el-option label="视频" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="通道" v-if="searchOrigin!=3">
            <el-radio v-model="message.ChannelId" label="0">所有通道</el-radio>
            <el-radio v-model="message.ChannelId" label="1">通道1</el-radio>
            <el-radio v-model="message.ChannelId" label="2">通道2</el-radio>
          </el-form-item>

          <el-form-item label="事件项" v-if="searchOrigin!=3">
            <el-select v-model="message.EventCode" style="width:100%;">
              <el-option label="平台下发指令" value="0"></el-option>
              <el-option label="定时动作" value="1"></el-option>
              <el-option label="抢劫报警" value="2"></el-option>
              <el-option label="碰撞侧翻报警触发" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="删除标志" v-if="searchOrigin==2">
            <el-radio v-model="message.DeleteFlag" label="0">保留</el-radio>
            <el-radio v-model="message.DeleteFlag" label="1">删除</el-radio>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              @click="getMediaList"
              :loading="loading"
              v-if="searchOrigin!=3"
            >立即下发</el-button>
            <el-button
              type="primary"
              @click="getMediaListOnServer"
              :loading="loading"
              v-if="searchOrigin==3"
            >查询</el-button>
          </el-form-item>
        </div>
      </el-col>
      <el-col :span="18">
        <div class="shadow-box" style="background:#FFF; padding:15px; margin-top:20px;">
          <el-table :data="list" size="mini">
            <el-table-column prop="SimID" label="sim id">
              <template slot-scope="scope">{{$props.vehicle.sim_id}}</template>
            </el-table-column>
            <el-table-column prop="MultimediaDataID" label="媒体ID"></el-table-column>
            <el-table-column prop="MultimediaType" label="媒体类型">
              <template slot-scope="scope">
                <label v-if="scope.row.MultimediaType=='0'">图像</label>
                <label v-if="scope.row.MultimediaType=='1'">音频</label>
                <label v-if="scope.row.MultimediaType=='2'">视频</label>
              </template>
            </el-table-column>
            <el-table-column prop="ChannelId" label="通道"></el-table-column>
            <el-table-column prop="EventCode" label="事件项编码">
              <template slot-scope="scope">
                <label v-if="scope.row.EventCode=='0'">平台下发指令</label>
                <label v-if="scope.row.EventCode=='1'">定时动作</label>
                <label v-if="scope.row.EventCode=='2'">抢劫报警触发</label>
                <label v-if="scope.row.EventCode=='3'">碰撞侧翻报警触发</label>
                <label v-if="scope.row.EventCode=='4'">门开拍照</label>
                <label v-if="scope.row.EventCode=='5'">门关拍照</label>
                <label v-if="scope.row.EventCode=='6'">车门由开变关</label>
                <label v-if="scope.row.EventCode=='7'">定距拍照</label>
              </template>
            </el-table-column>
            <el-table-column label="位置信息">
              <template slot-scope="scope">
                <el-popover placement="right" style="height:400px" width="400" trigger="click">
                  经度：{{scope.row.Position.Longitude}}
                  纬度：{{scope.row.Position.Latitude}}
                  海拔高度：{{scope.row.Position.Altitude}}
                  速度：{{scope.row.Position.Speed}}
                  方向：{{scope.row.Position.Direction}}
                  <el-button size="small" type="primary" slot="reference">查看更多</el-button>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column label="操作" v-if="viewmodel=='server'">
              <template slot-scope="scope">
                <el-button @click="getMediaUrl(scope.row)">查看</el-button>
              </template>
            </el-table-column>
            <el-table-column label="操作" v-if="viewmodel=='x8802'">
              <template slot-scope="scope">
                <el-button @click="showMedia(scope.row)">查看</el-button>
              </template>
            </el-table-column>
            <el-table-column label="媒体" width="300">
              <template slot-scope="scope">
                <span v-if="viewmodel=='x8803' && !scope.row.media_url">
                  <i class="el-icon-loading"></i> 媒体资源正在上传
                </span>
                <div v-if="scope.row.media_url">
                  <img
                    :src="scope.row.media_url"
                    v-if="scope.row.MultimediaType==0"
                    style="width:100%;"
                  >
                  <audio
                    :src="scope.row.media_url"
                    controls
                    v-if="scope.row.MultimediaType==1"
                    style="width:100%;"
                  ></audio>
                  <video
                    :src="scope.row.media_url"
                    controls
                    v-if="scope.row.MultimediaType==2"
                    style="width:100%;"
                  ></video>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
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
      viewmodel: "", //指令模式
      searchOrigin: "1",
      loading: false,
      list: [],
      getMeidaList: [], //正在请求的SIM
      message: {
        SimID: this.$utils.formatSim(this.vehicle.sim_id),
        MessageID: "x8802",
        MultimediaType: "0", //多媒体类型
        ChannelId: "0", //通道ID
        EventCode: "0", //事件项编码
        StartTime: "110601000001", //起始时间
        EndTime: "110630235959",
        DeleteFlag: "0"
      }
    };
  },
  watch: {
    searchOrigin: function() {
      if (this.searchOrigin == 1) {
        this.message.MessageID = "x8802";
      } else {
        this.message.MessageID = "x8803";
      }
    }
  },
  props: ["vehicle"],
  created() {
    this.$instruction.on("x8802", this.vehicle.sim_id, evt => {
      var data = JSON.parse(evt.data);
      if (data.code == 0) {
        this.$message.success("下发成功");
      } else {
        this.$message.warning("下发失败");
      }
    });
    this.$instruction.on("x8803", this.vehicle.sim_id, evt => {
      this.$set(this.$data, "list", []);
      var data = JSON.parse(evt.data);
      if (data.code == 0) {
        this.$message.success("下发成功");
      } else {
        this.$message.warning("下发失败");
      }
    });
    this.$instruction.on("x0800", this.vehicle.sim_id, evt => {
      if (this.viewmodel == "x8803") {
        this.list.push(JSON.parse(evt.data));
      }
    });
    this.$instruction.on("x0802", this.vehicle.sim_id, evt => {
      var data = JSON.parse(evt.data);
      data.DataItems = JSON.parse(data.DataItems);
      this.$set(this.$data, "list", data.DataItems);
      //MultimediaDataID MultimediaType ChannelId EventCode事件项编码
    });
    this.$instruction.on("x8800", this.x8800);
  },
  methods: {
    x8800(evt) {
      var data = JSON.parse(evt.data);
      this.list.map(item => {
        if (item.MultimediaDataID == data.MultimediaDataID) {
          this.getMediaUrl(item);
          var index = this.getMeidaList.indexOf(item);
          if (index != -1) {
            this.getMeidaList.replace(index, 1);
          }
        }
      });
    },
    showMedia(row) {
      this.getMeidaList.push(row);
      this.$instruction.send(
        JSON.stringify({
          SimID: this.$utils.formatSim(this.vehicle.sim_id),
          MessageID: "x8805",
          DeleteFlag: "0",
          MultimediaID: row.MultimediaDataID
        })
      );
    },
    getMediaUrl(row) {
      if (row.MultimediaType == 2) {
        this.$ajax
          .get("/MultiMedia/GetVideo", {
            params: {
              sim_id: this.$utils.formatSim(this.vehicle.sim_id),
              media_id: row.MultimediaDataID
            }
          })
          .then(res => {
            if (res.data.code == 0) {
              this.$set(row, "media_url", res.data.data[0].FileUrl);
            }
          });
      } else {
        var url =
          this.$dict.BASE_URL +
          `api/MultiMedia/GetMultiMediaByType?type=${
            row.MultimediaType
          }&sim_id=${this.$utils.formatSim(this.vehicle.sim_id)}&media_id=${
            row.MultimediaDataID
          }`;
        this.$set(row, "media_url", url);
      }
    },
    getMediaList() {
      this.viewmodel = this.message.MessageID;
      this.$instruction.send(JSON.stringify(this.message));
    },
    getMediaListOnServer() {
      var postData = {
        page: 1,
        size: 999,
        SimID: this.message.SimID,
        MultimediaType: this.message.MultimediaType,
        StartTime: "20" + this.message.StartTime,
        EndTime: "20" + this.message.EndTime
      };
      this.$ajax
        .get("/MultiMedia/GetMultiMediaList", {
          params: postData
        })
        .then(res => {
          if (res.data.code == 0) {
            this.viewmodel = "server";
            res.data.data.map(item => {
              item.MultimediaDataID = item.MediaId;
              item.MultimediaType = item.MediaType;
            });
            this.$set(this.$data, "list", res.data.data);
          }
        });
    }
  },
  beforeDestroy() {
    this.$instruction.offAll("x0802", this.vehicle.sim_id);
    this.$instruction.offAll("x8802", this.vehicle.sim_id);
    this.$instruction.offAll("x8803", this.vehicle.sim_id);
    this.$instruction.off("x8800", this.vehicle.sim_id, this.x8800);
  }
};
</script>