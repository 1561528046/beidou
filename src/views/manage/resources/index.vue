<template>
  <div class="admin-table-container">
    <div class="structure"></div>
    <div style="width:80%;float:right">
      <el-card shadow="always" class="admin-table-search">
        <el-form :model="tableQuery" size="small" label-width="90px">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="时间">
                <el-date-picker
                  style="width:100%"
                  v-model="tableQuery.time"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="位置">
                <el-input></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="音视频类型">
                <el-select v-model="tableQuery.type" style="width:100%">
                  <el-option value="0" label="音频资源">音频资源</el-option>
                  <el-option value="1" label="视频资源">视频资源</el-option>
                  <el-option value="2" label="照片抓拍">照片抓拍</el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="资源来源">
                <el-select v-model="tableQuery.source" style="width:100%">
                  <el-option value="0" label="自动报警">自动报警</el-option>
                  <el-option value="1" label="手动保存">手动保存</el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24" style="text-align:right">
              <el-form-item label-width="0">
                <el-button type="primary">查询</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
      <el-card shadow="always" class="admin-table-search">
        <el-table :data="tableData.data" style="width: 80%;float:left">
          <el-table-column prop label="名称"></el-table-column>
          <el-table-column prop label="车牌号"></el-table-column>
          <el-table-column prop label="时长"></el-table-column>
          <el-table-column prop label="时间"></el-table-column>
          <el-table-column prop label="位置"></el-table-column>
          <el-table-column prop label="大小"></el-table-column>
          <el-table-column prop label="资源来源"></el-table-column>
          <el-table-column prop label="音视频类型"></el-table-column>
          <el-table-column prop label="备注"></el-table-column>
        </el-table>
        <div style="width:20%;height:600px; display:inline-block;float:right">
          <h4 style="width:100%;text-align:center">音视频资源统计</h4>
          <ul style="list-style: none;line-height: 32px;padding: 10px 66px;font-size:14px">
            <li>总计：</li>
            <hr
              style="height:1px;border:none;border-top:1px dashed #0066CC;margin-top:5px;margin-bottom:5px"
            >
            <li>视频资源：</li>
            <li>大小：</li>
            <li>时长：</li>
            <li>自动报警：</li>
            <li>手动保存：</li>
            <hr
              style="height:1px;border:none;border-top:1px dashed #0066CC;margin-top:5px;margin-bottom:5px"
            >
            <li>音频资源：</li>
            <li>大小：</li>
            <li>时长：</li>
            <li>自动报警：</li>
            <li>手动保存：</li>
            <hr
              style="height:1px;border:none;border-top:1px dashed #0066CC;margin-top:5px;margin-bottom:5px"
            >
            <li>照片抓拍：</li>
            <li>大小：</li>
          </ul>
        </div>
      </el-card>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableQuery: {
        page: 1,
        size: 10,
        type: "",
        source: "",
        time: ""
      },
      tableData: {
        data: [],
        total: 0
      }
    };
  }
};
</script>
<style>
.structure {
  background-color: #fff;
  float: left;
  width: 20%;
  height: 764px;
}
</style>