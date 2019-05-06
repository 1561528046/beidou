<template>
  <div>
    <div style="height:630px; overflow-y:scroll">
      <el-form label-position="left" label-width="210px" size="small">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="报警判断速度阈值">
              <el-input placeholder="请输入（0-60）"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="报警提示音量">
              <el-input placeholder="请输入（0-8）"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="主动拍照策略">
              <!-- <el-select style="width:100%">
                <el-option value="0" label="不开启"></el-option>
                <el-option value="1" label="定时拍照"></el-option>
                <el-option value="2" label="定距拍照"></el-option>
                <el-option value="3" label="保留"></el-option>
              </el-select>-->
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="主动定时拍照时间间隔">
              <el-input placeholder="请输入（0-3600）"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="主动定距拍照距离间隔">
              <el-input placeholder="请输入（0-60000）"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="单次主动拍照张数">
              <el-input placeholder="请输入（1-10）"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="单次主动拍照时间间隔">
              <el-input placeholder="请输入（1-5）"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="拍照分辨率">
              <!-- <el-select style="width:100%">
                <el-option value="1" label="352×288"></el-option>
                <el-option value="2" label="704×288"></el-option>
                <el-option value="3" label="704×576"></el-option>
                <el-option value="4" label="640×480"></el-option>
                <el-option value="5" label="1280×720"></el-option>
                <el-option value="6" label="1920×1080"></el-option>
              </el-select>-->
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="视频录制分辨率">
              <!-- <el-select style="width:100%">
                <el-option value="1" label="CIF"></el-option>
                <el-option value="2" label="HD1"></el-option>
                <el-option value="3" label="D1"></el-option>
                <el-option value="4" label="WD1"></el-option>
                <el-option value="5" label="VGA"></el-option>
                <el-option value="6" label="720P"></el-option>
                <el-option value="7" label="1080P"></el-option>
              </el-select>-->
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
              <el-input placeholder="请输入（10-50）"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="障碍物报警分级速度阈值">
              <el-input placeholder="请输入（0-220）"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="障碍物报警前后视频录制时间">
              <el-input placeholder="请输入（0-60）"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="障碍物报警拍照张数">
              <el-input placeholder="请输入（0-10）"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="障碍物报警拍照间隔">
              <el-input placeholder="请输入（1-10）"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="频繁变道报警判断时间段">
              <el-input placeholder="请输入（30-120）"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="频繁变道报警判断次数">
              <el-input placeholder="请输入（3-10）"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="频繁变道报警分级速度阈值">
              <el-input placeholder="请输入（0-220）"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="频繁变道报警前后视频录制时间">
              <el-input placeholder="请输入（0-60）"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="频繁变道报警拍照张数">
              <el-input placeholder="请输入（0-10）"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="频繁变道报警拍照间隔">
              <el-input placeholder="请输入（1-60）"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="车道偏离报警分级速度阈值">
              <el-input placeholder="请输入（0-220）"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="车道偏离报警前后视频录制时间">
              <el-input placeholder="请输入（0-60）"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="车道偏离报警拍照张数">
              <el-input placeholder="请输入（0-10）"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="车道偏离报警拍照间隔">
              <el-input placeholder="请输入（1-10）"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="前向碰撞报警时间阈值">
              <el-input placeholder="请输入（10-50）"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="前向碰撞报警分级速度阈值">
              <el-input placeholder="请输入（0-220）"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="前向碰撞报警前后视频录制时间">
              <el-input placeholder="请输入（0-60）"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="前向碰撞报警拍照张数">
              <el-input placeholder="请输入（0-10）"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="前向碰撞报警拍照间隔">
              <el-input placeholder="请输入（1-10）"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="行人碰撞报警时间阈值">
              <el-input placeholder="请输入（10-50）"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="行人碰撞报警使能速度阈值">
              <el-input placeholder="请输入（0-220）"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="行人碰撞报警前后视频录制时间">
              <el-input placeholder="请输入（0-60）"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="行人碰撞报警拍照张数">
              <el-input placeholder="请输入（0-10）"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="行人碰撞报警拍照间隔">
              <el-input placeholder="请输入（1-10）"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="车距监控报警距离阈值">
              <el-input placeholder="请输入（10-50）"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="车距监控报警分级速度阈值">
              <el-input placeholder="请输入（0-220）"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="车距过近报警前后视频录制时间">
              <el-input placeholder="请输入（0-60）"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="车距过近报警拍照张数">
              <el-input placeholder="请输入（0-10）"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="车距过近报警拍照间隔">
              <el-input placeholder="请输入（1-10）"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="道路标志识别拍照张数">
              <el-input placeholder="请输入（0-10）"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="道路标志识别拍照间隔">
              <el-input placeholder="请输入（1-10）"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-button size="small" type="primary" style="display:block; margin:0 auto">提交</el-button>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  }
};
</script>