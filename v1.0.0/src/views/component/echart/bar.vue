<template>
  <div :id="elId" class="my-charts" ref="charts"></div>
</template>

<script>
import echarts from "echarts";
import uuidv1 from "uuid/v1";
export default {
  name: "",
  props: {
    echartData: {
      default() {
        return {};
      }
    },
    istrue: {
      default: false
    }
  },
  watch: {
    echartData: {
      handler(newValue, oldValue) {
        // console.log('vvview',newValue)
        this.drawing();
      },
      deep: true
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
    this.drawing();
  },
  methods: {
    drawing() {
      let option = {
        tooltip: {
          show: true,
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999"
            }
          },
          textStyle: {
            align: "left"
          }
        },
        toolbox: {
          feature: {
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ["line", "bar"] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
          // orient: "vertical"
        },
        legend: {
          data: this.echartData.legend.data
        },
        xAxis: [
          {
            type: "category",
            data: this.echartData.xAxis.data,
            axisPointer: {
              type: "shadow"
            },
            splitLine: {
              show: true
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            name: "",
            min: 0,
            max: value => {
                return ++value.max;
            },
            interval: 1,
            axisLabel: {
              formatter: "{value}"
            },
            splitLine: {
              show: true
            }
          }
        ],
        dataZoom: [
          {
            show: true,
            start: 0,
            end: 100
          },
          {
            type: "inside",
            start: 0,
            end: 100,
            realtime: true //拖动时，是否实时更新系列的视图
          }
          // {
          //   show: true,
          //   yAxisIndex: 0,
          //   filterMode: "empty",
          //   width: 30,
          //   height: "80%",
          //   showDataShadow: false,
          //   left: "93%"
          // }
          // {
          //   type: "slider", //图表下方的伸缩条
          //   show: true, //是否显示
          //   realtime: true, //拖动时，是否实时更新系列的视图
          //   start: 0, //伸缩条开始位置（1-100），可以随时更改
          //   end: 100 //伸缩条结束位置（1-100），可以随时更改
          // }
        ],
        series: this.echartData.series
      };
      const chartObj = echarts.init(document.getElementById(this.elId));
      chartObj.setOption(option);
      window.addEventListener("resize", function() {
        chartObj.resize();
      });
    }
  }
};
</script>

<style scoped>
</style>
