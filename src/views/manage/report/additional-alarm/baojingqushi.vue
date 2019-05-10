<template>
  <div ref="base"></div>
</template>

<script>
import echarts from "echarts";
import { getAdditionalAlarmChartAll } from "@/api/index";
export default {
  props: {
    query: Object
  },
  data() {
    return {
      chart: null
    };
  },
  watch: {
    "$props.query": function() {
      this.getData();
    }
  },
  methods: {
    getData() {
      getAdditionalAlarmChartAll(this.$props.query).then(res => {
        if (res.data.code == 0) {
          this.setOption(res.data);
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    setOption(data) {
      // var data = {
      //   code: 0,
      //   data: {
      //     legend: [
      //       "前向碰撞报警",
      //       "车道偏离报警",
      //       "车距过近报警",
      //       "行人碰撞报警",
      //       "频繁变道报警",
      //       "障碍物报警",
      //       "驾驶员不匹配",
      //       "疲劳驾驶报警",
      //       "接打电话报警",
      //       "抽烟报警",
      //       "分神驾驶报警",
      //       "驾驶员异常报警"
      //     ],
      //     list: [
      //       {
      //         date: "2019-04-22",
      //         value: [1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1]
      //       },
      //       {
      //         date: "2019-04-23",
      //         value: [1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 11, 1]
      //       },
      //       {
      //         date: "2019-04-24",
      //         value: [1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 6, 1]
      //       }
      //     ]
      //   }
      // };
      var legend = data.data.legend;
      var xAxis = [];
      var series = [
        //  { name:前向碰撞报警 , type: "line", data: [] }
      ];

      legend.map((item, index) => {
        var serie = {
          name: item,
          type: "line",
          data: []
        };
        series.push(serie);
        data.data.list.map(item => {
          serie.data.push(item.value[index]);
        });
      });

      data.data.list.map(item => {
        xAxis.push(item.date);
      });

      var option = {
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: legend
        },
        grid: {
          left: "3%",
          right: "3%",
          bottom: "0",
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: xAxis
        },
        yAxis: {
          type: "value"
        },
        series: series
        // [
        // {
        //   name: "邮件营销",
        //   type: "line",
        //   stack: "总量",
        //   data: [120, 132, 101, 134, 90, 230, 210]
        // }
        // ]
      };
      this.chart.setOption(option);
    }
  },
  mounted() {
    this.$set(this.$data, "chart", echarts.init(this.$refs.base));
  }
};
</script>

<style>
</style>
