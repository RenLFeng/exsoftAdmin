<template>
  <div :id="elId" class="my-charts" ref="charts"></div>
</template>

<script>
import echarts from "echarts";
import uuidv1 from "uuid/v1";
export default {
  name: "",
  props: {
    data: {
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      elId: ""
    };
  },
  created() {
    this.elId = uuidv1(); //获取随机id
  },
  mounted() {
    let option = {
      tooltip: {
         textStyle: {
          align: "left"
        },
      },
      legend: {
        data:this.data.legend.data
      },
      radar: {
        // shape: 'circle',
        name: {
          textStyle: {
            color: "#fff",
            backgroundColor: "#999",
            borderRadius: 3,
            padding: [3, 5]
          }
        },
        indicator: this.data.indicator
      },
      series: [
        {
        //   name: "预算 vs 开销（Budget vs spending）",
          type: "radar",
          // areaStyle: {normal: {}},
          data: this.data.series.data
        }
      ]
    };
    const chartObj = echarts.init(document.getElementById(this.elId));
    chartObj.setOption(option);
        window.addEventListener("resize", function() {
      chartObj.resize();
    });
  },
  methods: {}
};
</script>

<style scoped>
</style>
