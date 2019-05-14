<template>
  <div ref="base"></div>
</template>

<script>
import echarts from "echarts";
import { getAdditionalAlarmChartPieVehicle } from "@/api/index";
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
      getAdditionalAlarmChartPieVehicle(this.$props.query).then(res => {
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
      //   data: [
      //     {
      //       name: "前向碰撞报警",
      //       value: 22
      //     },
      //     {
      //       name: "车道偏离报警",
      //       value: 11
      //     },
      //     {
      //       name: "车距过近报警",
      //       value: 55
      //     }
      //   ]
      // };
      var legend = [];
      var seriesData = data.data;
      data.data.map(item => {
        legend.push(item.name);
      });
      var option = {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          x: "left",
          data: legend
        },
        series: [
          {
            name: "报警类型",
            type: "pie",

            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: "center"
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: seriesData
          }
        ]
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
