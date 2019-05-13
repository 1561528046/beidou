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
              <img :src="$dict.BASE_URL+formData.photo_path" style="width:100%;height:100%" alt>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-row>
            <el-col :span="15">
              <el-form-item label="异常驾驶行为评分">
                <el-date-picker v-model="formData.date" type="month" placeholder="选择月"></el-date-picker>
                <div id="radarChart" style="width:400px;height:300px"></div>
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-card class="box-card">
                每项满分100，分数一月一重置
                疲劳驾驶：
                <br>分神驾驶每次扣0.5分
                <br>疲劳驾驶每次扣1分
                <br>异常驾驶行为：
                <br>抽烟每次扣1分
                <br>打电话每次扣1分
                <br>百公里报警：（每次报警：由报警开始时间到报警结束为一次）
                <br>每次1分
                <br>准点率：
                <br>每次扣1分
              </el-card>
            </el-col>
            <el-col :span="15" style="margin-top:20px">
              <el-form-item label="驾驶员评分">
                <el-date-picker
                  v-model="formData.year"
                  value-format="yyyy"
                  align="right"
                  type="year"
                  placeholder="选择年"
                ></el-date-picker>
                <div id="brokenlineChart" style="width:300px;height:300px"></div>
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-card class="box-card">
                驾驶员评分：
                <br>疲劳驾驶*0.3 + 百公里报警*0.3 + 准点率*0.1 + 异常驾驶行为*0.3
              </el-card>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { getDriver, GetAbnormal, GetStatistics } from "@/api/index.js";
import moment from "moment";
export default {
  data() {
    return {
      time: "",
      formData: {
        date: "", //年-月
        year: "", //年
        driver_id: this.$props.driver_id
      }
    };
  },
  mounted() {},
  created() {
    getDriver({ driver_id: this.formData.driver_id }).then(res => {
      if (res.data.code == 0 && res.data.data.length) {
        var mixinData = Object.assign({}, this.formData, res.data.data[0]);
        mixinData.date = moment(new Date())
          .subtract(1, "months")
          .format("YYYY-MM");
        mixinData.year = moment(new Date()).format("YYYY");
        this.$set(this.$data, "formData", mixinData);
      }
    });
  },
  watch: {
    "formData.date": function() {
      var time = moment(this.formData.date).format("YYYYMM");
      GetAbnormal({ driver_id: this.formData.driver_id, date: time }).then(
        res => {
          if (res.data.code == 0) {
            let radarChart = this.$echarts.init(
              document.getElementById("radarChart")
            );
            var num = [
              Number(res.data.data[0].num_fatigue_driving),
              Number(res.data.data[0].num_punctuality),
              Number(res.data.data[0].num_abnormal_driving),
              Number(res.data.data[0].num_100km_alarm)
            ];
            // 绘制图表
            var radar = {
              tooltip: {},
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
                  name: "异常驾驶行为评分",
                  type: "radar",
                  // areaStyle: {normal: {}},
                  data: [
                    {
                      value: num,
                      name: "异常驾驶行为评分",
                      itemStyle: { normal: { areaStyle: { type: "default" } } }
                    }
                  ]
                }
              ]
            };
            radarChart.setOption(radar);
          } else {
            var radar_line = {
              tooltip: {},
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
                  name: "异常驾驶行为评分",
                  type: "radar",
                  // areaStyle: {normal: {}},
                  data: [
                    {
                      value: [],
                      name: "异常驾驶行为评分",
                      itemStyle: { normal: { areaStyle: { type: "default" } } }
                    }
                  ]
                }
              ]
            };
            let radarChart = this.$echarts.init(
              document.getElementById("radarChart")
            );
            radarChart.setOption(radar_line);
            return this.$notify({
              message: res.data.msg,
              title: "提示",
              type: "error"
            });
          }
        }
      );
    },
    "formData.year": function() {
      GetStatistics({
        driver_id: this.formData.driver_id,
        year: this.formData.year
      }).then(res => {
        if (res.data.code == 0) {
          var between = Number(res.data.data[0].date.substring(4)) - "01";
          var num = [];
          if (between) {
            for (var i = 0; i < between; i++) {
              num.push(0);
            }
          }
          res.data.data.map(item => {
            num.push(Number(item.num_total));
          });
          // 基于准备好的dom，初始化echarts实例
          let brokenlineChart = this.$echarts.init(
            document.getElementById("brokenlineChart")
          );
          var broken_line = {
            grid: {
              top: 10,
              width: 270
            },
            xAxis: {
              type: "category",
              data: [
                "1",
                "2",
                "3",
                "4",
                "5",
                "6",
                "7",
                "8",
                "9",
                "10",
                "11",
                "12"
              ]
            },
            yAxis: {
              type: "value"
            },
            series: [
              {
                data: num,
                type: "line"
              }
            ]
          };
          brokenlineChart.setOption(broken_line);
        } else {
          let brokenlineChart = this.$echarts.init(
            document.getElementById("brokenlineChart")
          );
          var broken = {
            grid: {
              top: 10,
              width: 270
            },
            xAxis: {
              type: "category",
              data: [
                "1",
                "2",
                "3",
                "4",
                "5",
                "6",
                "7",
                "8",
                "9",
                "10",
                "11",
                "12"
              ]
            },
            yAxis: {
              type: "value"
            },
            series: [
              {
                data: [],
                type: "line"
              }
            ]
          };
          brokenlineChart.setOption(broken);
          return this.$notify({
            message: res.data.msg,
            title: "提示",
            type: "error"
          });
        }
      });
    }
  },
  props: {
    driver_id: String
  }
};
</script>