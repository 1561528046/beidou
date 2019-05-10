
<template>
  <div ref="base"></div>
</template>

<script>
import echarts from "echarts";
import { getAdditionalAlarmChartBarDriver } from "@/api/index";
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
      getAdditionalAlarmChartBarDriver(this.$props.query).then(res => {
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
      //       name: "张三",
      //       value: 44
      //     },
      //     {
      //       name: "李四4",
      //       value: 22
      //     },
      //     {
      //       name: "这是啥",
      //       value: 11
      //     }
      //   ]
      // };
      var yAxis = [];
      var serie = {
        name: "报警次数",
        type: "bar",
        data: []
      };
      data.data.map(item => {
        yAxis.push(item.name);
        serie.data.push(item.value);
      });

      var option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },

        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: {
          type: "value",
          boundaryGap: [0, 0.01]
        },
        yAxis: {
          type: "category",
          data: yAxis
        },
        series: [serie]
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
