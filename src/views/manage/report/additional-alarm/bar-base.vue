<template>
  <div ref="base"></div>
</template>

<script>
import echarts from "echarts";
import { getAdditionalAlarmChartBase } from "@/api/index";
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
      getAdditionalAlarmChartBase(this.$props.query).then(res => {
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
      //       name: "已处理",
      //       value: 22
      //     },
      //     {
      //       name: "未处理",
      //       value: 11
      //     },
      //     {
      //       name: "一级报警",
      //       value: 55
      //     },
      //     {
      //       name: "二级报警",
      //       value: 55
      //     },
      //     {
      //       name: "总报警数",
      //       value: 110
      //     }
      //   ]
      // };
      var xAxis = [];
      var seriesData = [];
      data.data.map(item => {
        xAxis.push(item.name);
        seriesData.push(item.value);
      });

      var option = (option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        xAxis: {
          type: "category",
          data: xAxis
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            data: seriesData,
            type: "bar"
          }
        ]
      });
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
