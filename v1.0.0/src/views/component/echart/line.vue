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
    },
    state: {
      default: 0
    },
    title: {
      default: 0
    },
    dataZoom: {
      default: 0
    },
    rotate: {
      default: 0
    },
    Proportion: {
      default: 0
    },
    formatter: {
      default: 0
    }
  },
  watch: {
    data: {
      handler(newValue, oldValue) {
        // console.log('vvview',newValue)
        this.drawing();
      },
      deep: true
    }
  },
  data() {
    return {
      elId: "",
    };
  },
  created() {
    this.elId = uuidv1(); //获取随机id
  },
  mounted() {
    // this.drawing();
  },
  methods: {
    drawing() {
      let option = {
        title: {
          text: this.title ? this.data.title.text : "",
          left: "center"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999"
            }
          },
          textStyle: {
            align: "left"
          },
          formatter: this.formatter
            ? "{b0}<br/>" + '<span style=""></span>{a0}:{c0}%'
            : ""
        },
        toolbox: {
          feature: {
            saveAsImage: { show: true }
          }
        },
        legend: {
          data: this.data.legend.data
        },
        xAxis: [
          {
            type: "category",
            data: this.data.xAxis.data,
            axisLabel: {
              rotate: this.rotate ? 0 : 60
            },
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
            // max:this.Proportion?100:null,
            max: (value) =>{
              console.log(value)
              if (this.Proportion) {
                return 100;
              } else {
                return value.max+10;
              }
            },
            min: 0,
            interval:this.Proportion?null:5,
            axisLabel: {
              formatter: this.Proportion ? "{value}%" : "{value}"
              // formatter: (value, index) => {
              //   if (this.Proportion) {
              //     return value + "%";
              //   } else {
              //     return value;
              //   }
              // }
            },
            splitLine: {
              show: true
            }
          }
        ],
        dataZoom: this.dataZoom
          ? [
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
            ]
          : "",
        series: this.data.series
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
