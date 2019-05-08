<template>
  <div>
    <div style="height:630px; overflow-y:scroll">
      <el-form :model="formData" label-position="left" label-width="210px" size="small">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="报警判断速度阈值">
              <el-input v-model="formData.AlarmJudgmentSpeedThreshold" placeholder="请输入（0-60）"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="报警提示音量">
              <el-input v-model="formData.AlarmAlertVolume" placeholder="请输入（0-8）"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="主动拍照策略">
              <el-select v-model="formData.ActivePhotographyStrategy" style="width:100%">
                <el-option value="0" label="不开启"></el-option>
                <el-option value="1" label="定时拍照"></el-option>
                <el-option value="2" label="定距拍照"></el-option>
                <el-option value="3" label="保留"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="主动定时拍照时间间隔">
              <el-input
                v-model="formData.TimeIntervalForActiveTimingPhotography"
                placeholder="请输入（0-3600）"
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
              <el-input v-model="formData.NumberOfSingleactivePhotographs" placeholder="请输入（1-10）"></el-input>
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
            <el-form-item label="障碍物报警距离阈值">
              <el-input
                v-model="formData.DistanceThresholdOfObstacleAlarm"
                placeholder="请输入（10-50）"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="障碍物报警分级速度阈值">
              <el-input
                v-model="formData.HierarchicalSpeedThresholdOfObstacleAlarm"
                placeholder="请输入（0-220）"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="障碍物报警前后视频录制时间">
              <el-input
                v-model="formData.VideoRecordingTimeBeforeAndAfterObstacleAlarm"
                placeholder="请输入（0-60）"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="障碍物报警拍照张数">
              <el-input v-model="formData.NumberOfBarrierAlarmPhotographs" placeholder="请输入（0-10）"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="障碍物报警拍照间隔">
              <el-input v-model="formData.ObstacleAlarmInterval" placeholder="请输入（1-10）"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="频繁变道报警判断时间段">
              <el-input
                v-model="formData.FrequentChannelChangeAlarmJudgmentTimePeriod"
                placeholder="请输入（30-120）"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="频繁变道报警判断次数">
              <el-input
                v-model="formData.FrequentAlarmJudgmentNumberOfChannelChange"
                placeholder="请输入（3-10）"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="频繁变道报警分级速度阈值">
              <el-input
                v-model="formData.HierarchicalSpeedThresholdOfFrequentChannelChangeAlarm"
                placeholder="请输入（0-220）"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="频繁变道报警前后视频录制时间">
              <el-input
                v-model="formData.VideoRecordingTimeBeforeAndAfterFrequentLaneChangeAlarm"
                placeholder="请输入（0-60）"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="频繁变道报警拍照张数">
              <el-input
                v-model="formData.NumberOfAlarmPhotosForFrequentChannelChange"
                placeholder="请输入（0-10）"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="频繁变道报警拍照间隔">
              <el-input v-model="formData.FrequentLaneChangeAlarmInterval" placeholder="请输入（1-60）"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="车道偏离报警分级速度阈值">
              <el-input
                v-model="formData.GradedSpeedThresholdForLaneDeviationAlarm"
                placeholder="请输入（0-220）"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="车道偏离报警前后视频录制时间">
              <el-input
                v-model="formData.VideoRecordingTimeBeforeAndAfterLaneDepartureAlarm"
                placeholder="请输入（0-60）"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="车道偏离报警拍照张数">
              <el-input v-model="formData.NumberOfLaneDeviationAlarmPhotos" placeholder="请输入（0-10）"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="车道偏离报警拍照间隔">
              <el-input v-model="formData.LaneDepartureAlarmInterval" placeholder="请输入（1-10）"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="前向碰撞报警时间阈值">
              <el-input
                v-model="formData.ForwardCollisionWarningTimeThreshold"
                placeholder="请输入（10-50）"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="前向碰撞报警分级速度阈值">
              <el-input
                v-model="formData.HierarchicalSpeedThresholdForForwardCollisionWarning"
                placeholder="请输入（0-220）"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="前向碰撞报警前后视频录制时间">
              <el-input
                v-model="formData.VideoRecordingTimeBeforeAndAfterForwardCollisionAlarm"
                placeholder="请输入（0-60）"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="前向碰撞报警拍照张数">
              <el-input
                v-model="formData.NumberOfForwardCollisionAlarmPhotographs"
                placeholder="请输入（0-10）"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="前向碰撞报警拍照间隔">
              <el-input v-model="formData.ForwardCollisionAlarmInterval" placeholder="请输入（1-10）"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="行人碰撞报警时间阈值">
              <el-input
                v-model="formData.PedestrianCollisionAlarmTimeThreshold"
                placeholder="请输入（10-50）"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="行人碰撞报警使能速度阈值">
              <el-input
                v-model="formData.PedestrianCollisionAlarmEnablingSpeedThreshold"
                placeholder="请输入（0-220）"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="行人碰撞报警前后视频录制时间">
              <el-input
                v-model="formData.VideoRecordingTimeBeforeAndAfterPedestrianCollisionAlarm"
                placeholder="请输入（0-60）"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="行人碰撞报警拍照张数">
              <el-input
                v-model="formData.NumberOfPedestrianCollisionAlarmPhotos"
                placeholder="请输入（0-10）"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="行人碰撞报警拍照间隔">
              <el-input v-model="formData.PedestrianCollisionAlarmInterval" placeholder="请输入（1-10）"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="车距监控报警距离阈值">
              <el-input
                v-model="formData.VehicleDistanceMonitoringAlarmDistanceThreshold"
                placeholder="请输入（10-50）"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="车距监控报警分级速度阈值">
              <el-input
                v-model="formData.VehicleDistanceMonitoringAndAlarmClassificationSpeedThreshold"
                placeholder="请输入（0-220）"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="车距过近报警前后视频录制时间">
              <el-input
                v-model="formData.VideoRecordingTimeBeforeAndAfterAlarmOfVehicleProximity"
                placeholder="请输入（0-60）"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="车距过近报警拍照张数">
              <el-input
                v-model="formData.NumberOfAlarmPhotographsTakenWhenTheCarIsTooClose"
                placeholder="请输入（0-10）"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="车距过近报警拍照间隔">
              <el-input
                v-model="formData.AlarmIntervalForCarDistanceTooClose"
                placeholder="请输入（1-10）"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="道路标志识别拍照张数">
              <el-input
                v-model="formData.NumberOfRoadSignRecognitionPhotographs"
                placeholder="请输入（0-10）"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="道路标志识别拍照间隔">
              <el-input
                v-model="formData.PhotoIntervalOfRoadSignRecognition"
                placeholder="请输入（1-10）"
              ></el-input>
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
        AlarmAlertVolume: "", //报警提示音量
        ActivePhotographyStrategy: "", //主动拍照策略
        TimeIntervalForActiveTimingPhotography: "", //主动定时拍照时间间隔
        ActiveFixedDistancePhotographyDistanceInterval: "", //主动定距拍照距离间隔
        NumberOfSingleactivePhotographs: "", //单次主动拍照张数
        TimeIntervalOfSingleActivePhotography: "", //单次主动拍照时间间隔
        PhotographicResolution: "", //拍照分辨率
        VideoRecordingResolution: "", //视频录制分辨率
        AlarmEnable: "", //报警使能
        EventEnabling: "", //事件使能
        DistanceThresholdOfObstacleAlarm: "", //障碍物报警距离阈值
        HierarchicalSpeedThresholdOfObstacleAlarm: "", //障碍物报警分级速度阈值
        VideoRecordingTimeBeforeAndAfterObstacleAlarm: "", //障碍物报警前后视频录制时间
        NumberOfBarrierAlarmPhotographs: "", //障碍物报警拍照张数
        ObstacleAlarmInterval: "", //障碍物报警拍照间隔
        FrequentChannelChangeAlarmJudgmentTimePeriod: "", //频繁变道报警判断时间段
        FrequentAlarmJudgmentNumberOfChannelChange: "", //频繁变道报警判断次数
        HierarchicalSpeedThresholdOfFrequentChannelChangeAlarm: "", //频繁变道报警分级速度阈值
        VideoRecordingTimeBeforeAndAfterFrequentLaneChangeAlarm: "", //频繁变道报警前后视频录制时间
        NumberOfAlarmPhotosForFrequentChannelChange: "", //频繁变道报警拍照张数
        FrequentLaneChangeAlarmInterval: "", //频繁变道报警拍照间隔
        GradedSpeedThresholdForLaneDeviationAlarm: "", //车道偏离报警分级速度阈值
        VideoRecordingTimeBeforeAndAfterLaneDepartureAlarm: "", //车道偏离报警前后视频录制时间
        NumberOfLaneDeviationAlarmPhotos: "", //车道偏离报警拍照张数
        LaneDepartureAlarmInterval: "", //车道偏离报警拍照间隔
        ForwardCollisionWarningTimeThreshold: "", //前向碰撞报警时间阈值
        HierarchicalSpeedThresholdForForwardCollisionWarning: "", //前向碰撞报警分级速度阈值
        VideoRecordingTimeBeforeAndAfterForwardCollisionAlarm: "", //前向碰撞报警前后视频录制时间
        NumberOfForwardCollisionAlarmPhotographs: "", //前向碰撞报警拍照张数
        ForwardCollisionAlarmInterval: "", //前向碰撞报警拍照间隔
        PedestrianCollisionAlarmTimeThreshold: "", //行人碰撞报警时间阈值
        PedestrianCollisionAlarmEnablingSpeedThreshold: "", //行人碰撞报警使能速度阈值
        VideoRecordingTimeBeforeAndAfterPedestrianCollisionAlarm: "", //行人碰撞报警前后视频录制时间
        NumberOfPedestrianCollisionAlarmPhotos: "", //行人碰撞报警拍照张数
        PedestrianCollisionAlarmInterval: "", //行人碰撞报警拍照间隔
        VehicleDistanceMonitoringAlarmDistanceThreshold: "", //车距监控报警距离阈值
        VehicleDistanceMonitoringAndAlarmClassificationSpeedThreshold: "", //车距监控报警分级速度阈值
        VideoRecordingTimeBeforeAndAfterAlarmOfVehicleProximity: "", //车距过近报警前后视频录制时间
        NumberOfAlarmPhotographsTakenWhenTheCarIsTooClose: "", //车距过近报警拍照张数
        AlarmIntervalForCarDistanceTooClose: "", //车距过近报警拍照间隔
        NumberOfRoadSignRecognitionPhotographs: "", //道路标志识别拍照张数
        PhotoIntervalOfRoadSignRecognition: "" //道路标志识别拍照间隔
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
          ParameterId: 100
        };
        this.$instruction.send(JSON.stringify(data));
      });
    }
  }
};
</script>