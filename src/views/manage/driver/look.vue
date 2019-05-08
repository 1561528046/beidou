<template>
  <div>
    <el-form :model="formData" size="small">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-row>
            <el-col>
              <el-form-item label="姓名">{{formData.driver_name}}</el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="性别">
                <label v-show="formData.driver_sex=='1'">男</label>
                <label v-show="formData.driver_sex=='2'">女</label>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="出生日期">{{$utils.formatDate(formData.driver_birth)}}</el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="住址">{{formData.address}}</el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="联系方式">{{formData.tel}}</el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="准驾车型">
                <label v-show="formData.quasi_driving=='A1'">A1</label>
                <label v-show="formData.quasi_driving=='A2'">A2</label>
                <label v-show="formData.quasi_driving=='A3'">A3</label>
                <label v-show="formData.quasi_driving=='B1'">B1</label>
                <label v-show="formData.quasi_driving=='B2'">B2</label>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="驾驶证号">{{formData.identity_id}}</el-form-item>
            </el-col>
            <el-col>
              <el-form-item
                label="驾驶证有效期"
              >{{$utils.formatDate(formData.begin_date)}}——{{$utils.formatDate(formData.end_date)}}</el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="驾驶员身份识别卡编号">{{formData.driver_card_id}}</el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-form-item label="驾驶员正面照">
            <div style="width:220px;height:220px">
              <img
                :src="$dict.BASE_URL+'/Upload/Photo/201905/132017506568640000.jpg'"
                style="width:100%;height:100%"
                alt
              >
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-row>
            <el-col :span="15">
              <el-form-item label="异常驾驶行为评分">
                <el-date-picker v-model="scoreTime" type="month" placeholder="选择月"></el-date-picker>
                <div id="radarChart" style="width:400px;height:300px"></div>
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-card class="box-card">
                每项满分100，分数一月一重置
                疲劳驾驶：
                打哈欠每次扣0.5分
                超过连续驾驶时长，每小时扣1分
                异常驾驶行为：
                抽烟每次扣1分
                打电话每次扣1分
                百公里报警：（每次报警：由报警开始时间到报警结束为一次）
                每次1分
                准点率：
                每次扣1分
              </el-card>
            </el-col>
            <el-col :span="15" style="margin-top:20px">
              <el-form-item label="驾驶员评分">
                <el-date-picker v-model="time" align="right" type="year" placeholder="选择年"></el-date-picker>
                <div id="brokenlineChart" style="width:300px;height:300px"></div>
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-card class="box-card">
                驾驶员评分：
                疲劳驾驶*0.3 + 百公里报警*0.3 + 准点率*0.1 + 异常驾驶行为*0.3
              </el-card>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { getDriver } from "@/api/index.js";
export default {
  data() {
    return {
      time: "",
      scoreTime: "",
      formData: {
        driver_id: this.$props.driver_id
      }
    };
  },
  mounted() {
    // 基于准备好的dom，初始化echarts实例
    let radarChart = this.$echarts.init(document.getElementById("radarChart"));
    let brokenlineChart = this.$echarts.init(
      document.getElementById("brokenlineChart")
    );
    // 绘制图表
    var radar = {
      tooltip: {},

      legend: {
        top: 20,
        left: 100
      },
      radar: {
        // shape: 'circle',
        center: ["50%", "60%"],
        radius: 90,
        name: {
          textStyle: {
            color: "#fff",
            backgroundColor: "#999",
            borderRadius: 3,
            padding: [3, 5]
          }
        },
        indicator: [
          { name: "疲劳驾驶", max: 100 },
          { name: "准点率", max: 100 },
          { name: "异常驾驶行为", max: 100 },
          { name: "百公里报警", max: 100 }
        ]
      },
      series: [
        {
          name: "驾驶员次数累计 vs 行业平均值",
          type: "radar",
          // areaStyle: {normal: {}},
          data: [
            {
              value: [80, 52, 20, 10, 70],
              name: "驾驶员次数累计",
              itemStyle: { normal: { areaStyle: { type: "default" } } }
            },
            {
              value: [40, 62, 10, 39, 55],
              name: "行业平均值 "
            }
          ]
        }
      ]
    };
    var broken_line = {
      grid: {
        top: 10,
        width: 332
      },
      xAxis: {
        type: "category",
        data: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]
      },
      yAxis: {
        type: "value"
      },
      series: [
        {
          data: [87, 81, 89, 88],
          type: "line"
        }
      ]
    };

    radarChart.setOption(radar);
    brokenlineChart.setOption(broken_line);
  },
  created() {
    getDriver({ driver_id: this.formData.driver_id }).then(res => {
      if (res.data.code == 0 && res.data.data.length) {
        var mixinData = Object.assign({}, this.formData, res.data.data[0]);
        this.$set(this.$data, "formData", mixinData);
      }
    });
  },
  props: {
    driver_id: String
  }
};
</script>