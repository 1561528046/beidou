<template>
  <div>
    <el-form :model="settingForm" size="small" label-width="130px" label-position="left">
      <el-row :gutter="20">
        <el-col :span="24" v-if="this.$props.type==2">
          <el-form-item
            label="逻辑通道号"
          >{{this.$props.id}}({{this.$dict.get_logical_channel(this.$props.id)}})</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="实时流编码模式">
            <el-select v-model="settingForm.RealTimeStreamMode" style="width:100%">
              <el-option :value="0" label="CBR">CBR</el-option>
              <el-option :value="1" label="VBR">VBR</el-option>
              <el-option :value="2" label="ABR">ABR</el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="存储流编码模式">
            <el-select v-model="settingForm.StorageStreamMode" style="width:100%">
              <el-option :value="0" label="CBR">CBR</el-option>
              <el-option :value="1" label="VBR">VBR</el-option>
              <el-option :value="2" label="ABR">ABR</el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="实时流分辨率">
            <el-select v-model="settingForm.RealTimeStreamResolution" style="width:100%">
              <el-option :value="0" label="176*144[Qcif]"></el-option>
              <el-option :value="1" label="352*288[Cif]"></el-option>
              <el-option :value="2" label="480*288[Wcif]"></el-option>
              <el-option :value="3" label="704*576[D1]"></el-option>
              <el-option :value="4" label="960*576[Wd1]"></el-option>
              <el-option :value="5" label="1280*720[720P]"></el-option>
              <el-option :value="6" label="1920*1080[1080P]"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="存储流分辨率">
            <el-select v-model="settingForm.StorageStreamResolution" style="width:100%">
              <el-option :value="0" label="176*144[Qcif]"></el-option>
              <el-option :value="1" label="352*288[Cif]"></el-option>
              <el-option :value="2" label="480*288[Wcif]"></el-option>
              <el-option :value="3" label="704*576[D1]"></el-option>
              <el-option :value="4" label="960*576[Wd1]"></el-option>
              <el-option :value="5" label="1280*720[720P]"></el-option>
              <el-option :value="6" label="1920*1080[1080P]"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="实时流关键帧间隔">
            <el-input
              v-model="settingForm.RealTimeStreamKeyFrameInterval"
              placeholder="请输入关键帧间隔(0-1000)"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="存储流关键帧间隔">
            <el-input
              v-model="settingForm.StorageStreamKeyFrameInterval"
              placeholder="请输入关键帧间隔(0-1000)"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="实时流目标帧率">
            <el-input
              v-model="settingForm.RealTimeStreamTargetFrameRate"
              placeholder="请输入帧率(1-120)"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="存储流目标帧率">
            <el-input v-model="settingForm.StorageStreamTargetFrameRate" placeholder="请输入帧率(1-120)"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="实时流目标码率">
            <el-input v-model="settingForm.RealTimeStreamTargetBitRate" placeholder="请输入码率"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="存储流目标码率">
            <el-input v-model="settingForm.StorageStreamTargetBitRate" placeholder="请输入码率"></el-input>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="12">
          <el-form-item label="尺寸">
            <el-select v-model="settingForm.size" style="width:100%">
              <el-option :value="1" label="4:3"></el-option>
              <el-option :value="2" label="5:4"></el-option>
              <el-option :value="3" label="16:9"></el-option>
              <el-option :value="4" label="16:10"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="字幕选择">
            <el-select v-model="settingForm.subtitles" style="width:100%">
              <el-option value="1" label="平台字幕"></el-option>
              <el-option value="2" label="车机字幕"></el-option>
            </el-select>
          </el-form-item>
        </el-col>-->
        <el-col :span="12">
          <el-form-item label="音频输出">
            <el-radio v-model="settingForm.Enable" :label="0">不启用</el-radio>
            <el-radio v-model="settingForm.Enable" :label="1">启用</el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="字幕叠加">
            <el-checkbox-group v-model="OSDS">
              <el-checkbox :label="6">日期和时间</el-checkbox>
              <el-checkbox :label="5">车牌号码</el-checkbox>
              <el-checkbox :label="4">逻辑通道号</el-checkbox>
              <el-checkbox :label="3">经纬度</el-checkbox>
              <el-checkbox :label="2">行驶记录速度</el-checkbox>
              <el-checkbox style="margin-left:0" :label="1">卫星定位速度</el-checkbox>
              <el-checkbox style="margin-left:16px" :label="0">连续驾驶时间</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
        <el-col :span="24" style="text-align:center">
          <el-form-item label-width="0">
            <el-button @click="sendInstructions" type="primary">提交</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
export default {
  created() {
    if (this.$props.id) {
      this.$set(this.settingForm, "LogicalChannelNumber", this.$props.id);
    }
    if (this.$props.simid) {
      this.$set(this.$data, "sim_id", "0" + this.$props.simid);
    }
    this.$instruction.on("x0104", evt => {
      var data = JSON.parse(evt.data);
      switch (data.Parameters[0].ParameterId) {
        case 117:
          this.$set(this.$data, "settingForm", data.Parameters[0].x0075Item[0]);
          var num = data.Parameters[0].x0075Item[0].OSD.toString(2);
          for (var i = num.length; i < 7; i++) {
            num = "0" + num;
          }
          num.split("").map((item, index) => {
            if (item == "1") {
              this.OSDS.push(index);
            }
          });
          break;
        case 119:
          data.Parameters[0].x0077Item[1].VideoChannelSetLists.map(itcm => {
            // console.log(itcm.LogicalChannelNumber, this.$props.id);
            if (itcm.LogicalChannelNumber == this.$props.id) {
              this.$set(this.$data, "settingForm", itcm);
            }
          });
          // var number = data.Parameters[0].x0077Item[0].OSD.toString(2);
          break;
      }
    });
  },
  data() {
    return {
      sim_id: "",
      OSDS: [],
      settingForm: {
        LogicalChannelNumber: "", //逻辑通道号
        RealTimeStreamMode: "", // 实时流编码模式
        RealTimeStreamResolution: "", // 实时流分辨率
        RealTimeStreamKeyFrameInterval: "", // 实时流关键帧间隔
        RealTimeStreamTargetFrameRate: "", // 实时流目标帧率
        RealTimeStreamTargetBitRate: "", // 实时流目标码率
        StorageStreamMode: "", // 存储流编码模式
        StorageStreamResolution: "", // 存储流分辨率
        StorageStreamKeyFrameInterval: "", // 存储流关键帧间隔
        StorageStreamTargetFrameRate: "", // 存储流目标帧率
        StorageStreamTargetBitRate: "", // 存储流目标码率
        OSD: "", //字幕叠加
        Enable: 1, // 是否请用音频输出
        size: "", //尺寸
        subtitles: "" //字幕选择
      }
    };
  },
  props: ["type", "id", "simid"],
  methods: {
    // 发送指令
    sendInstructions() {
      var arr = [0, 0, 0, 0, 0, 0, 0];
      var data = {};
      this.OSDS.map(item => {
        arr[item] = 1;
      });
      this.settingForm.OSD = parseInt(arr.join(""), 2);
      if (this.$props.type == 1) {
        // 音视频参数设置
        data = {
          MessageID: "x8103",
          SimID: this.sim_id,
          ParameterId: 117,
          x0075Item: this.settingForm
        };
        this.$instruction.send(JSON.stringify(data));
      } else if (this.$props.type == 2) {
        // 单独音视频参数设置
        data = {
          MessageID: "x8103",
          SimID: this.sim_id,
          ParameterId: 119,
          x0077Item: {
            VideoChannelSetNum: 1,
            VideoChannelSetLists: []
          }
        };
        data.x0077Item.VideoChannelSetLists.push(this.settingForm);
        this.$instruction.send(JSON.stringify(data));
      }
    }
  }
};
</script>