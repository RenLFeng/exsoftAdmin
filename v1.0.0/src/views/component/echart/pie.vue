<template>
  <div :id="elId" class="my-charts aa" ref="charts"></div>
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
    id: {
      default: 0
    },
    label: {
      default: 0
    }
  },
  watch: {
    data: {
      handler(newValue, oldValue) {
        // console.log('vvview',newValue)
        for(let v of newValue.series.data){
          if(v.value==0){
            v.value=null;
          }
        }
        this.drawing();
      },
      deep: true
    }
  },
  data() {
    return {
      elId: "",
      ids: []
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
          text: this.data.title.text,
          left: "center"
        },
        tooltip: {
          trigger: "item",
          formatter: "{b} : {c} <br/>占比:({d}%)"
        },
        legend: {
          // orient: 'vertical',
          // top: 'middle',
          bottom: 10,
          left: "center",
          data: this.data.legend.data
        },
        series: [
          {
            type: "pie",
            radius: "65%",
            center: ["50%", "50%"],
            selectedMode: "single",
            data: this.data.series.data,
            label: {
              formatter: this.label?"{b}:{c} ({d}%)":"{b}"
            },
          }
        ]
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
