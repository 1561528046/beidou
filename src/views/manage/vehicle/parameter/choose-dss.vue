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
            <el-form-item label="报警音量">
              <el-input placeholder="请输入（0-8）"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="主动拍照策略">
              <!-- <el-select style="width:100%">
                    <el-option value="0" label="不开启"></el-option>
                    <el-option value="1" label="定时拍照"></el-option>
                    <el-option value="2" label="定距拍照"></el-option>
                    <el-option value="3" label="插卡触发"></el-option>
                    <el-option value="4" label="保留"></el-option>
              </el-select>-->
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="主动定时拍照时间间隔">
              <el-input placeholder="请输入（60-60000）"></el-input>
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
            <el-form-item label="拍照分辨率"></el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="视频录制分辨率"></el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="报警使能"></el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="事件使能"></el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="吸烟报警判断时间间隔">
              <el-input placeholder="请输入（0-3600）"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="接打电话报警判断时间间隔">
              <el-input placeholder="请输入（0-3600）"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="疲劳驾驶报警分级速度阈值">
              <el-input placeholder="请输入（0-220）"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="疲劳驾驶报警前后视频录制时间">
              <el-input placeholder="请输入（0-60）"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="疲劳驾驶报警拍照张数">
              <el-input placeholder="请输入（0-10）"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="疲劳驾驶报警拍照间隔时间">
              <el-input placeholder="请输入（1-5）"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="接打电话报警分级速度阈值">
              <el-input placeholder="请输入（0-220）"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="接打电话报警前后视频录制时间">
              <el-input placeholder="请输入（0-60）"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="接打电话报警拍驾驶员面部特征照片张数">
              <el-input placeholder="请输入（1-10）"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="接打电话报警拍驾驶员面部特征照片间隔时间">
              <el-input placeholder="请输入（1-5）"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="抽烟报警分级车速阈值">
              <el-input placeholder="请输入（0-220）"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="抽烟报警前后视频录制时间">
              <el-input placeholder="请输入（0-60）"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="抽烟报警拍驾驶员面部特征照片张数">
              <el-input placeholder="请输入（1-10）"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="抽烟报警拍驾驶员面部特征照片间隔时间">
              <el-input placeholder="请输入（1-5）"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="分神驾驶报警分级车速阈值">
              <el-input placeholder="请输入（0-220）"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="分神驾驶报警前后视频录制时间">
              <el-input placeholder="请输入（0-60）"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="分神驾驶报警拍照张数">
              <el-input placeholder="请输入（0-10）"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="分神驾驶报警拍照间隔时间">
              <el-input placeholder="请输入（1-5）"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="驾驶行为异常分级速度阈值">
              <el-input placeholder="请输入（0-220）"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="驾驶行为异常视频录制时间">
              <el-input placeholder="请输入（0-60）"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="驾驶行为异常抓拍照片张数">
              <el-input placeholder="请输入（1-10）"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="驾驶行为异常拍照间隔">
              <el-input placeholder="请输入（1-5）"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="驾驶员身份识别触发">
              <!-- <el-select style="width:100%">
                <el-option value="0" label="不开启"></el-option>
                <el-option value="1" label="定时触发"></el-option>
                <el-option value="2" label="定距触发"></el-option>
                <el-option value="3" label="插卡开始行使触发"></el-option>
                <el-option value="4" label="保留"></el-option>
              </el-select>-->
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