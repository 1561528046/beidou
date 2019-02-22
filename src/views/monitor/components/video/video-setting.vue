<template>
  <div>
    <el-form :model="settingForm" size="small" label-width="100px" label-position="left">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="编码模式">
            <el-select v-model="settingForm.RealTimeStreamMode" style="width:100%">
              <el-option value="0" label="CBR">CBR</el-option>
              <el-option value="1" label="VBR">VBR</el-option>
              <el-option value="2" label="ABR">ABR</el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="码率">
            <el-input v-model="settingForm.RealTimeStreamTargetBitRate" placeholder="请输入码率"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="分辨率">
            <el-select v-model="settingForm.RealTimeStreamResolution" style="width:100%">
              <el-option value="0" label="176*144[Qcif]"></el-option>
              <el-option value="1" label="352*288[Cif]"></el-option>
              <el-option value="2" label="480*288[Wcif]"></el-option>
              <el-option value="3" label="704*576[D1]"></el-option>
              <el-option value="4" label="960*576[Wd1]"></el-option>
              <el-option value="5" label="1280*720[720P]"></el-option>
              <el-option value="6" label="1920*1080[1080P]"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="帧率">
            <el-input
              v-model="settingForm.RealTimeStreamTargetFrameRate"
              placeholder="请输入帧率(1-120)"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="尺寸">
            <el-select v-model="settingForm.size" style="width:100%">
              <el-option value="1" label="4:3"></el-option>
              <el-option value="2" label="5:4"></el-option>
              <el-option value="3" label="16:9"></el-option>
              <el-option value="4" label="16:10"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="关键帧间隔">
            <el-input
              v-model="settingForm.RealTimeStreamKeyFrameInterval"
              placeholder="请输入关键帧间隔(0-1000)"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="字幕选择">
            <el-select v-model="settingForm.subtitles" style="width:100%">
              <el-option value="1" label="平台字幕"></el-option>
              <el-option value="2" label="车机字幕"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="音频输出">
            <el-radio v-model="settingForm.Enable" label="0">不启用</el-radio>
            <el-radio v-model="settingForm.Enable" label="1">启用</el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="字幕叠加">
            <el-checkbox-group v-model="settingForm.OSDS">
              <el-checkbox label="6">日期和时间</el-checkbox>
              <el-checkbox label="5">车牌号码</el-checkbox>
              <el-checkbox label="4">逻辑通道号</el-checkbox>
              <el-checkbox label="3">经纬度</el-checkbox>
              <el-checkbox label="2">行驶记录速度</el-checkbox>
              <el-checkbox style="margin-left:0" label="1">卫星定位速度</el-checkbox>
              <el-checkbox style="margin-left:16px" label="0">连续驾驶时间</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
        <el-col :span="12" style="text-align:right">
          <el-form-item label-width="0">
            <el-button type="primary">自动配置</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="12">
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
  data() {
    return {
      settingForm: {
        MessageID: "x8301",
        SimID: "",
        ParameterId: "0x0075",
        RealTimeStreamMode: "", // 编码模式
        RealTimeStreamTargetBitRate: "", //码率
        RealTimeStreamResolution: "", //分辨率
        RealTimeStreamTargetFrameRate: "", //帧率
        RealTimeStreamKeyFrameInterval: "", //关键帧间隔
        OSD: "", //字幕叠加
        OSDS: [],
        Enable: "1", // 是否请用音频输出
        size: "", //尺寸
        subtitles: "" //字幕选择
      }
    };
  },
  props: {
    type: Number
  },
  methods: {
    // 发送指令
    sendInstructions() {
      var arr = [0, 0, 0, 0, 0, 0, 0];
      this.settingForm.OSDS.map(item => {
        arr[item] = 1;
      });
      this.settingForm.OSD = parseInt(arr.join(""), 16);
      if (this.$props.type == 1) {
        var storageForm = {
          MessageID: "x8301",
          SimID: "",
          ParameterId: "0x0075",
          StorageStreamMode: this.settingForm.RealTimeStreamMode, //编码模式
          StorageStreamResolution: this.settingForm.RealTimeStreamResolution, //分辨率
          StorageStreamKeyFrameInterval: this.settingForm
            .RealTimeStreamKeyFrameInterval, //关键帧间隔
          StorageStreamTargetFrameRate: this.settingForm
            .RealTimeStreamTargetFrameRate, //帧率
          StorageStreamTargetBitRate: this.settingForm
            .RealTimeStreamTargetBitRate, //码率
          OSD: this.settingForm.OSD, //字幕叠加
          Enable: this.settingForm.Enable, // 是否请用音频输出
          size: this.settingForm.size, //尺寸
          subtitles: this.settingForm.subtitles //字幕选择
        };
        this.$instruction.send(JSON.stringify(storageForm));
      } else {
        this.$instruction.send(JSON.stringify(this.settingForm));
      }
    }
  }
};
</script>