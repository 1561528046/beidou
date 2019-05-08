<template>
  <div>
    <div style="height:630px; overflow-y:scroll">
      <el-form label-position="left" label-width="300px" size="small">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="报警判断速度阈值">
              <el-input v-model="formData.AlarmJudgmentSpeedThreshold" placeholder="请输入（0-60）"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="报警音量">
              <el-input v-model="formData.AlarmVolume" placeholder="请输入（0-8）"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="主动拍照策略">
              <el-select v-model="formData.ActivePhotographyStrategy" style="width:100%">
                <el-option value="0" label="不开启"></el-option>
                <el-option value="1" label="定时拍照"></el-option>
                <el-option value="2" label="定距拍照"></el-option>
                <el-option value="3" label="插卡触发"></el-option>
                <el-option value="4" label="保留"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="主动定时拍照时间间隔">
              <el-input
                v-model="formData.TimeIntervalForActiveTimingPhotography"
                placeholder="请输入（60-60000）"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="主动定距拍照距离间隔">
              <el-input
                v-model="formData.ActiveFixedDistancePhotographyDistanceInterval"
                placeholder="请输入（0-60000）"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="单次主动拍照张数">
              <el-input v-model="formData.NumberOfSingleActivePhotographs" placeholder="请输入（1-10）"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="单次主动拍照时间间隔">
              <el-input
                v-model="formData.TimeIntervalOfSingleActivePhotography"
                placeholder="请输入（1-5）"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="拍照分辨率">
              <el-select v-model="formData.PhotographicResolution" style="width:100%">
                <el-option value="1" label="352×288"></el-option>
                <el-option value="2" label="704×288"></el-option>
                <el-option value="3" label="704×576"></el-option>
                <el-option value="4" label="640×480"></el-option>
                <el-option value="5" label="1280×720"></el-option>
                <el-option value="6" label="1920×1080"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="视频录制分辨率">
              <el-select v-model="formData.VideoRecordingResolution" style="width:100%">
                <el-option value="1" label="CIF"></el-option>
                <el-option value="2" label="HD1"></el-option>
                <el-option value="3" label="D1"></el-option>
                <el-option value="4" label="WD1"></el-option>
                <el-option value="5" label="VGA"></el-option>
                <el-option value="6" label="720P"></el-option>
                <el-option value="7" label="1080P"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="报警使能"></el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="事件使能"></el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="吸烟报警判断时间间隔">
              <el-input
                v-model="formData.TimeIntervalOfSmokingAlarmJudgment"
                placeholder="请输入（0-3600）"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="接打电话报警判断时间间隔">
              <el-input
                v-model="formData.CallCallAlarmJudgmentTimeInterval"
                placeholder="请输入（0-3600）"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="疲劳驾驶报警分级速度阈值">
              <el-input
                v-model="formData.GradedSpeedThresholdForFatigueDrivingAlarm"
                placeholder="请输入（0-220）"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="疲劳驾驶报警前后视频录制时间">
              <el-input
                v-model="formData.VideoRecordingTimeBeforeAndAfterFatigueDrivingAlarm"
                placeholder="请输入（0-60）"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="疲劳驾驶报警拍照张数">
              <el-input
                v-model="formData.NumberOfPhotosTakenByFatigueDrivingAlarm"
                placeholder="请输入（0-10）"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="疲劳驾驶报警拍照间隔时间">
              <el-input
                v-model="formData.TimeIntervalForFatigueDrivingAlarmPhotography"
                placeholder="请输入（1-5）"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="接打电话报警分级速度阈值">
              <el-input
                v-model="formData.ClassifiedSpeedThresholdForCallAlarm"
                placeholder="请输入（0-220）"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="接打电话报警前后视频录制时间">
              <el-input
                v-model="formData.VideoRecordingTimeBeforeAndAfterCallAlarm"
                placeholder="请输入（0-60）"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="接打电话报警拍驾驶员面部特征照片张数">
              <el-input
                v-model="formData.CallThePoliceAndTakePhotosOfDriverFacialFeatures"
                placeholder="请输入（1-10）"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="接打电话报警拍驾驶员面部特征照片间隔时间">
              <el-input
                v-model="formData.IntervalTimeBetweenCallsAndAlarmsToTakePicturesOfDriverFacialFeatures"
                placeholder="请输入（1-5）"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="抽烟报警分级车速阈值">
              <el-input
                v-model="formData.ClassifiedSpeedThresholdForSmokingAlarm"
                placeholder="请输入（0-220）"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="抽烟报警前后视频录制时间">
              <el-input
                v-model="formData.VideoRecordingTimeBeforeAndAfterSmokingAlarm"
                placeholder="请输入（0-60）"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="抽烟报警拍驾驶员面部特征照片张数">
              <el-input
                v-model="formData.NumberOfPhotographsOfDriverFacialFeaturesTakenBySmokingAlarm"
                placeholder="请输入（1-10）"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="抽烟报警拍驾驶员面部特征照片间隔时间">
              <el-input
                v-model="formData.IntervalTimeBetweenSmokingAlarmPhotosOfDriverFacialFeatures"
                placeholder="请输入（1-5）"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="分神驾驶报警分级车速阈值">
              <el-input
                v-model="formData.ClassifiedSpeedThresholdForDistractedDrivingAlarm"
                placeholder="请输入（0-220）"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="分神驾驶报警前后视频录制时间">
              <el-input
                v-model="formData.VideoRecordingTimeBeforeAndAfterDistractedDrivingAlarm"
                placeholder="请输入（0-60）"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="分神驾驶报警拍照张数">
              <el-input
                v-model="formData.NumberOfDistractedDrivingAlarmPhotos"
                placeholder="请输入（0-10）"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="分神驾驶报警拍照间隔时间">
              <el-input
                v-model="formData.TimeIntervalBetweenDistractedDrivingAlarmAndPhotography"
                placeholder="请输入（1-5）"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="驾驶行为异常分级速度阈值">
              <el-input
                v-model="formData.GradingSpeedThresholdOfDrivingBehaviorAbnormality"
                placeholder="请输入（0-220）"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="驾驶行为异常视频录制时间">
              <el-input
                v-model="formData.VideoRecordingTimeOfAbnormalDrivingBehavior"
                placeholder="请输入（0-60）"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="驾驶行为异常抓拍照片张数">
              <el-input
                v-model="formData.NumberOfSnapshotsOfAbnormalDrivingBehavior"
                placeholder="请输入（1-10）"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="驾驶行为异常拍照间隔">
              <el-input
                v-model="formData.PictureIntervalOfAbnormalDrivingBehavior"
                placeholder="请输入（1-5）"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="驾驶员身份识别触发">
              <el-select v-model="formData.DriverIdentificationTrigger" style="width:100%">
                <el-option value="0" label="不开启"></el-option>
                <el-option value="1" label="定时触发"></el-option>
                <el-option value="2" label="定距触发"></el-option>
                <el-option value="3" label="插卡开始行使触发"></el-option>
                <el-option value="4" label="保留"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div style="width:160px; margin:0 auto">
      <el-button size="small" type="primary">设置</el-button>
      <el-button size="small" @click="collectInstruction" type="primary">采集</el-button>
    </div>
  </div>
</template>
<script>
export default {
  created() {
    this.$instruction.on(evt => {
      var data = JSON.parse(evt.data);
      console.log(data);
    });
  },
  props: {
    message: Array
  },
  watch: {
    message: {
      handler: function() {
        console.log(this.$props.message);
        this.$set(this.$data, "communication", this.$props.message);
      },
      deep: true
    }
  },
  data() {
    return {
      communication: [],
      formData: {
        AlarmJudgmentSpeedThreshold: "", //报警判断速度阈值
        AlarmVolume: "", //报警音量
        ActivePhotographyStrategy: "", //主动拍照策略
        TimeIntervalForActiveTimingPhotography: "", //主动定时拍照时间间隔
        ActiveFixedDistancePhotographyDistanceInterval: "", //主动定距拍照距离间隔
        NumberOfSingleActivePhotographs: "", //单次主动拍照张数
        TimeIntervalOfSingleActivePhotography: "", //单次主动拍照时间间隔
        PhotographicResolution: "", //拍照分辨率
        VideoRecordingResolution: "", //视频录制分辨率
        AlarmEnable: "", //报警使能
        EventEnabling: "", //事件使能
        TimeIntervalOfSmokingAlarmJudgment: "", //吸烟报警判断时间间隔
        CallCallAlarmJudgmentTimeInterval: "", //接打电话报警判断时间间隔
        GradedSpeedThresholdForFatigueDrivingAlarm: "", //疲劳驾驶报警分级速度阈值
        VideoRecordingTimeBeforeAndAfterFatigueDrivingAlarm: "", //疲劳驾驶报警前后视频录制时间
        NumberOfPhotosTakenByFatigueDrivingAlarm: "", //疲劳驾驶报警拍照张数
        TimeIntervalForFatigueDrivingAlarmPhotography: "", //疲劳驾驶报警拍照间隔时间
        ClassifiedSpeedThresholdForCallAlarm: "", //接打电话报警分级速度阈值
        VideoRecordingTimeBeforeAndAfterCallAlarm: "", //接打电话报警前后视频录制时间
        CallThePoliceAndTakePhotosOfDriverFacialFeatures: "", //接打电话报警拍驾驶员面部特征照片张数
        IntervalTimeBetweenCallsAndAlarmsToTakePicturesOfDriverFacialFeatures:
          "", //接打电话报警拍驾驶员面部特征照片间隔时间
        ClassifiedSpeedThresholdForSmokingAlarm: "", //抽烟报警分级车速阈值
        VideoRecordingTimeBeforeAndAfterSmokingAlarm: "", //抽烟报警前后视频录制时间
        NumberOfPhotographsOfDriverFacialFeaturesTakenBySmokingAlarm: "", //抽烟报警拍驾驶员面部特征照片张数
        IntervalTimeBetweenSmokingAlarmPhotosOfDriverFacialFeatures: "", //抽烟报警拍驾驶员面部特征照片间隔时间
        ClassifiedSpeedThresholdForDistractedDrivingAlarm: "", //分神驾驶报警分级车速阈值
        VideoRecordingTimeBeforeAndAfterDistractedDrivingAlarm: "", //分神驾驶报警前后视频录制时间
        NumberOfDistractedDrivingAlarmPhotos: "", //分神驾驶报警拍照张数
        TimeIntervalBetweenDistractedDrivingAlarmAndPhotography: "", //分神驾驶报警拍照间隔时间
        GradingSpeedThresholdOfDrivingBehaviorAbnormality: "", //驾驶行为异常分级速度阈值
        VideoRecordingTimeOfAbnormalDrivingBehavior: "", //驾驶行为异常视频录制时间
        NumberOfSnapshotsOfAbnormalDrivingBehavior: "", //驾驶行为异常抓拍照片张数
        PictureIntervalOfAbnormalDrivingBehavior: "", //驾驶行为异常拍照间隔
        DriverIdentificationTrigger: "" //驾驶员身份识别触发
      }
    };
  },
  methods: {
    collectInstruction() {
      var data = {};
      var simId = "";
      this.communication.map(item => {
        simId = item.sim_id.length > 11 ? item.sim_id : "0" + item.sim_id;
        data = {
          MessageID: "x8106",
          SimID: simId,
          ParameterId: 101
        };
        this.$instruction.send(JSON.stringify(data));
      });
    }
  }
};
</script>