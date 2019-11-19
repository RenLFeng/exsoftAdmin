<template>
  <div class="Rereport Statistics">
    <Header2 />
    <div class="container mai">
      <Title />
      <el-row class="content-charts" :gutter="40">
        <el-col>
          <div class="chart-tit fontsize-sm">资源构成</div>
          <Pie :data="echartData" id="1" />
        </el-col>
      </el-row>
      <el-row class="content-charts" :gutter="40">
        <el-col>
          <div class="chart-tit fontsize-sm">资源学习</div>
          <Pie :data="echartData2" id="2" :label="1" />
        </el-col>
        <el-col>
          <div class="chart-tit fontsize-sm" style="border-bottom:none">资源学习Top5</div>
          <el-table :data="tableData" border>
            <el-table-column prop="name" label="姓名" width="180"></el-table-column>
            <el-table-column prop="score" label="资源学习得分" width="180"></el-table-column>
            <el-table-column prop="Percentage" label="占资源总分的百分比"></el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-row class="content-charts">
        <el-col>
          <div class="chart-tit fontsize-sm">资源查阅时间分布</div>
          <Eline :data="echartLineData" />
        </el-col>
      </el-row>
      <el-row class="content-charts">
        <el-col>
          <div class="chart-tit fontsize-sm" style="border-bottom:none">附: 资源清单</div>
          <el-table :data="DetailedTabel" border>
            <el-table-column prop="id" label="序号" width="180"></el-table-column>
            <el-table-column prop="name" label="资源名称" width="180"></el-table-column>
            <el-table-column prop="type" label="分类"></el-table-column>
            <el-table-column prop="seeNumber" label="查阅人数"></el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </div>
    <Footer />
  </div>
</template>

<script>
import echarts from "echarts";
import Header2 from "../layout/components/Header2";
import Footer from "../layout/components/footer";
import Title from "./common/header";
import Pie from "../component/echart/pie";
import Bar from "../component/echart/bar";
import Eline from "../component/echart/line";
import { mapState } from "vuex";
import "./style/common.scss";
import { getDate, nowDate, getFileType } from "../../util";
const times = [];
for (let i = 0; i < 24; i++) {
  times.push(`${i}点-${i + 1}点`);
}
const echartData = {
  title: {
    text: "资源类型分布"
  },
  legend: {
    data: ["视频类", "音频类", "网页链接", "文档类", "图片类", "其它"]
  },
  series: {
    data: [
      { value: 0, name: "视频类" },
      { value: 0, name: "音频类" },
      { value: 0, name: "网页链接" },
      { value: 0, name: "文档类" },
      { value: 0, name: "图片类" },
      { value: 0, name: "其它" }
    ]
  }
};
const echartData2 = {
  title: {
    text: "资源学习得分报表"
  },
  legend: {
    data: ["60%以下", "60%(含)至80%", "80%及以上"]
  },
  series: {
    data: [
      { value: 0, name: "60%以下", type: "Fail" },
      { value: 0, name: "60%(含)至80%", type: "pass" },
      { value: 0, name: "80%及以上", type: "excellent" }
    ]
  }
};
const echartLineData = {
  legend: {
    data: ["资源个数"]
  },
  xAxis: {
    data: times
  },
  series: [
    {
      name: "资源个数",
      type: "line",
      data: []
    }
  ]
};
export default {
  components: {
    Header2,
    Footer,
    Title,
    Pie,
    Bar,
    Eline
  },
  name: "",

  data() {
    return {
      echartData: {},
      echartData2: {},
      tableData: [],
      echartLineData: {},
      DetailedTabel: [],

      querytimecount: {
        time13: 0,
        time14: 0,
        time15: 0,
        time16: 0,
        time17: 0,
        time18: 0,
        time19: 0,
        time2: 0,
        time20: 0,
        time21: 0,
        time22: 0,
        time23: 0,
        time3: 0,
        time4: 0,
        time5: 0,
        time6: 0,
        time7: 0,
        time8: 0,
        time9: 0,
        time0: 0,
        time1: 0,
        time10: 0,
        time11: 0,
        time12: 0
      },
      ResourceTatol: 0, //资源总数
      Bankefile: [],
      Resourcelearning: {},
      serverData: {}
    };
  },
  computed: {
    ...mapState(["ClassID"])
  },
  mounted() {
    this.getBankefile();
    this.getQueryTimeCount();
  },
  methods: {
    //资源构成
    getBankefile() {
      this.$http
        .get(
          "/api/bankefile/query?bankeid=" + this.ClassID + "&&pagesize=10000",
          {}
        )
        .then(res => {
          // console.log("success", res);
          if (res.data.code == "0") {
            this.Bankefile = res.data.data;
            //资源构成
            for (let v of this.Bankefile) {
              switch (v.finttype) {
                case 0:
                  for (let item of echartData.series.data) {
                    if (item.name == "其它") {
                      item.value++;
                    }
                  }
                  break;
                case 1:
                  for (let item of echartData.series.data) {
                    if (item.name == "图片类") {
                      item.value++;
                    }
                  }
                  break;
                case 2:
                  for (let item of echartData.series.data) {
                    if (item.name == "视频类") {
                      item.value++;
                    }
                  }
                  break;
                case 3:
                  for (let item of echartData.series.data) {
                    if (item.name == "音频类") {
                      item.value++;
                    }
                  }
                  break;

                case 4:
                  for (let item of echartData.series.data) {
                    if (item.name == "文档类") {
                      item.value++;
                    }
                  }
                  break;
                case 100:
                  for (let item of echartData.series.data) {
                    if (item.name == "网页链接") {
                       item.value++;
                    }
                  }
                  break;
              }
              this.ResourceTatol = this.ResourceTatol + v.score;
            }
            this.echartData = echartData;
            //资源查阅时间分布
            //资源清单
            for (let key in this.Bankefile) {
              this.DetailedTabel.push({
                id: key,
                name: this.Bankefile[key].name,
                type: getFileType(this.Bankefile[key].finttype),
                seeNumber: this.Bankefile[key].viewnum
              });
            }
            this.getResourcelearning();
            console.log("this.Bankefile", this.Bankefile);
          }
        })
        .catch(res => {
          console.log("error", res);
          this.$message({
            type: "error",
            message: "error"
          });
        });
    },
    //资源学习
    getResourcelearning() {
      this.$http
        .get("/api/api/bankememberquery?bankeid=" + this.ClassID)
        .then(res => {
          // console.log("success", res);
          if (res.data.code == "0") {
            this.Resourcelearning = res.data.data;
            //  this.Resourcelearning.members.push({score1:5})
            // this.Resourcelearning.members[0].score1 = 3;
            // this.Resourcelearning.members[1].score1 = 6;
            for (let v of this.Resourcelearning.members) {
              let score = (v.score1 / this.ResourceTatol) * 100;
              score = score.toFixed(2);
              // alert(score);
              if (score < 60) {
                for (let item of echartData2.series.data) {
                  if (item.type == "Fail") {
                    item.value++;
                  }
                }
              } else if (score >= 60 && score < 80) {
                for (let item of echartData2.series.data) {
                  if (item.type == "pass") {
                    item.value++;
                  }
                }
              } else {
                for (let item of echartData2.series.data) {
                  if (item.type == "excellent") {
                    item.value++;
                  }
                }
              }
            }
            this.echartData2 = echartData2;
            // 资源学习Top5
            for (let v of this.Resourcelearning.members) {
              this.tableData.push({
                name: v.account,
                score: v.score1,
                Percentage:
                  ((v.score1 / this.ResourceTatol) * 100).toFixed(2) + "%"
              });
            }
            console.log("this.echartData2", this.echartData2);
            console.log("this.Resourcelearning", this.Resourcelearning);
          }
        })
        .catch(res => {
          console.log("error", res);
          this.$message({
            type: "error",
            message: "error"
          });
        });
    },
    //资源查阅时间分布
    getQueryTimeCount() {
      this.$http
        .post("/api/bankefile/querytimecount", { id: this.ClassID })
        .then(res => {
          // console.log("success", res);
          if (res.data.code == "0") {
            for (let key in this.querytimecount) {
              let index = key.split("time")[1];
              echartLineData.series[0].data[index] = this.querytimecount[key];
            }
            this.echartLineData = echartLineData;

            // console.log("this.echartLineData", this.echartLineData);
          }
        })
        .catch(res => {
          console.log("error", res);
          this.$message({
            type: "error",
            message: "error"
          });
        });
    },
    getData() {
      this.$http
        .post("/api/bankecount/filesreport", { id: this.ClassID })
        .then(res => {
          // console.log("success", res);
          this.serverData = res.data.data;
          // console.log("this.serverData", this.serverData);
        })
        .catch(res => {
          console.log("error", res);
          this.$message({
            type: "error",
            message: "error"
          });
        });
    }
  }
};
</script>

<style lang='scss' scoped>
.Rereport {
}
</style>
