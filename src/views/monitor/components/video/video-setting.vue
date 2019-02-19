<template>
  <div>
    <el-form :model="settingForm" size="small" label-width="100px" label-position="left">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="码率">
            <el-select v-model="settingForm.bit_rate" style="width:100%">
              <el-option value="1" label="CBR">CBR</el-option>
              <el-option value="2" label="VBR">VBR</el-option>
              <el-option value="3" label="ABR">ABR</el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="分辨率">
            <el-select v-model="settingForm.resolution" style="width:100%">
              <el-option value="1" label="176*144[Qcif]"></el-option>
              <el-option value="2" label="352*288[Cif]"></el-option>
              <el-option value="3" label="480*288[Wcif]"></el-option>
              <el-option value="4" label="704*576[D1]"></el-option>
              <el-option value="5" label="960*576[Wd1]"></el-option>
              <el-option value="6" label="1280*720[720P]"></el-option>
              <el-option value="7" label="1920*1080[1080P]"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="帧率">
            <el-select v-model="settingForm.frame_rate" style="width:100%">
              <el-option value="1" label="24"></el-option>
              <el-option value="2" label="29.97"></el-option>
              <el-option value="3" label="30"></el-option>
              <el-option value="4" label="59.9"></el-option>
              <el-option value="5" label="60"></el-option>
            </el-select>
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
            <el-input v-model="settingForm.interval" placeholder="请输入关键帧间隔(0-1000)"></el-input>
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
        <el-col :span="24">
          <el-form-item label="字幕叠加">
            <el-checkbox-group v-model="settingForm.superposition">
              <el-checkbox label="日期和时间"></el-checkbox>
              <el-checkbox label="车牌号码"></el-checkbox>
              <el-checkbox label="逻辑通道号"></el-checkbox>
              <el-checkbox label="经纬度"></el-checkbox>
              <el-checkbox label="行驶记录速度"></el-checkbox>
              <el-checkbox style="margin-left:0" label="卫星定位速度"></el-checkbox>
              <el-checkbox style="margin-left:16px" label="连续驾驶时间"></el-checkbox>
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
            <el-button type="primary">提交</el-button>
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
        bit_rate: "", //码率
        resolution: "", //分辨率
        frame_rate: "", //帧率
        size: "", //尺寸
        interval: "", //关键帧间隔
        subtitles: "", //字幕选择
        superposition: [] //字幕叠加
      }
    };
  }
};
</script>