<template>
  <div class="Analysis Statistics">
    <Header2 />
    <div class="container mai">
      <Title />
      <el-row class="content-charts" :gutter="40">
        <el-col>
          <div class="chart-tit fontsize-sm">得分情况分布</div>
          <Pie :data="echartDataP1" :label="1" />
        </el-col>
      </el-row>
      <el-row class="content-charts" :gutter="40">
        <el-col>
          <div class="chart-tit fontsize-sm">得分获得方式</div>
          <Pie :data="echartDataP2" :label="1" />
        </el-col>
      </el-row>
      <el-row class="content-charts" :gutter="40">
        <el-col>
          <div class="chart-tit fontsize-sm">得分较低同学学情分析</div>
          <!-- <div v-for="echartRadar" >

          </div>-->
          <Radar v-for="(v,index) in echartRadar" :data="v" :key="index" />
          <!-- <Radar :data="echartRadar1" />
          <Radar :data="echartRadar1" />-->
        </el-col>
      </el-row>
      <el-row class="content-charts">
        <el-col>
          <div class="chart-tit fontsize-sm" style="border-bottom:none">附: 成员得分清单</div>
          <el-table :data="DetailedTable" border>
            <el-table-column prop="name" label="姓名" width="180"></el-table-column>
            <el-table-column prop="totalScore" label="个人总分" width="180"></el-table-column>
            <el-table-column prop="score" label="作业得分"></el-table-column>
            <el-table-column prop="Scoring" label="评测得分"></el-table-column>
            <el-table-column prop="ResourceScore" label="资源得分"></el-table-column>
            <el-table-column prop="SignScore" label="签到得分"></el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </div>
    <Footer />
  </div>
</template>

<script>
import Header2 from "../layout/components/Header2";
import Footer from "../layout/components/footer";
import Title from "./common/header";
import Pie from "../component/echart/pie";
import Radar from "../component/echart/radar";
import { getDate, nowDate, compare } from "../../util";
import { mapState } from "vuex";
import "./style/common.scss";
const members= [
              {
                account: "二狗",
                score1: 60,
                score2: 70,
                score3: 80,
                score4: 50,
                score5: 30
              },
              {
                account: "大狗",
                score1: 70,
                score2: 50,
                score3: 70,
                score4: 90,
                score5: 30
              },
              {
                account: "老六",
                score1: 60,
                score2: 90,
                score3: 90,
                score4: 80,
                score5: 30
              },
              {
                account: "老八",
                score1: 50,
                score2: 30,
                score3: 30,
                score4: 70,
                score5: 90
              }
            ];
const echartDataP1 = {
  title: {
    text: "得分情况分布"
  },
  legend: {
    data: ["优秀", "及格", "入门"]
  },
  series: {
    data: [
      { value: 0, name: "优秀" },
      { value: 0, name: "及格" },
      { value: 0, name: "入门" }
    ]
  }
};
const echartDataP2 = {
  title: {
    text: "得分获得方式"
  },
  legend: {
    data: ["作业", "评测", "签到", "资源学习"]
  },
  series: {
    data: [
      { value: 0, name: "作业", type: "score1" },
      { value: 0, name: "评测", type: "score2" },
      { value: 0, name: "签到", type: "score3" },
      { value: 0, name: "资源学习", type: "score4" }
    ]
  }
};
const echartRadar = [];
export default {
  components: {
    Header2,
    Footer,
    Title,
    Pie,
    Radar
  },
  name: "",

  data() {
    return {
      allScorerule: 0,
      echartDataP1: {},
      echartDataP2: {},
      ALLTotal: 0, //所有学生  总分
      totals: [],

      AllTotalscore1: 0, //所有学生 score1总分
      AllTotalscore2: 0, //所有学生 score2总分
      AllTotalscore3: 0, //所有学生 score3总分
      AllTotalscore4: 0, //所有学生 score4总分
      AllTotalscore5: 0, //所有学生 score5总分

      score1Average: 0, //score1平均分
      score2Average: 0, //score2平均分
      score3Average: 0, //score3平均分
      score4Average: 0, //score4平均分
      score5Average: 0, //score5平均分
      AverageData: [],

      echartRadar: [],
      RadarData: [],
      excellent: {},

      poor: [],

      DetailedTable: [],
      Resourcelearning: {},
      index: 0
    };
  },
    computed: {
        ...mapState(["ClassID"])
      },
  mounted() {
    this.$http
      .post("/api/bankecount/actreport", { id: this.ClassID })
      .then(res => {
        if (res.data.code == "0") {
          this.allScorerule =
            res.data.data.banke.scorerule1 +
            res.data.data.banke.scorerule2 +
            res.data.data.banke.scorerule3 +
            res.data.data.banke.scorerule4 +
            res.data.data.banke.scorerule5;
          this.getResourcelearning();
        } else {
        }
      })
      .catch(res => {});
  },
  methods: {
    //资源学习
    getResourcelearning() {
      this.$http
        .get("/api/api/bankememberquery?bankeid="+this.ClassID)
        .then(res => {
          // console.log("success", res);
          if (res.data.code == "0") {
            this.Resourcelearning = res.data.data;
            // this.Resourcelearning.members =members
            for (let v of this.Resourcelearning.members) {
              let studentScore =
                v.score1 + v.score2 + v.score3 + v.score4 + v.score5;
              v.studentScore = studentScore;
              this.ALLTotal = studentScore + this.ALLTotal;
              this.AllTotalscore1 = v.score1 + this.AllTotalscore1;
              this.AllTotalscore2 = v.score2 + this.AllTotalscore2;
              this.AllTotalscore3 = v.score3 + this.AllTotalscore3;
              this.AllTotalscore4 = v.score4 + this.AllTotalscore4;
              this.AllTotalscore5 = v.score5 + this.AllTotalscore5;

              let total = v.score1 + v.score2 + v.score3 + v.score4 + v.score5;
              let ratio = (total / this.allScorerule) * 100;
              if (ratio < 60 && ratio > 0) {
                for (let item of echartDataP1.series.data) {
                  if (item.name == "入门") {
                    item.value++;
                  }
                }
              } else if (ratio >= 60 && ratio < 80) {
                for (let item of echartDataP1.series.data) {
                  if (item.name == "及格") {
                    item.value++;
                  }
                }
              } else if (ratio >= 80) {
                for (let item of echartDataP1.series.data) {
                  if (item.name == "优秀") {
                    item.value++;
                  }
                }
              }
            }
            this.echartDataP1 = echartDataP1;
            //得分获得方式
            this.totals = [
              this.AllTotalscore1,
              this.AllTotalscore2,
              this.AllTotalscore3,
              this.AllTotalscore4
              // this.AllTotalscore5
            ];
            for (let key in this.totals) {
              for (let i = 0; i < echartDataP2.series.data.length; i++) {
                let item = echartDataP2.series.data[key];
                switch (item.type) {
                  case "score1":
                    item.value = this.totals[key];
                    break;
                  case "score2":
                    item.value = this.totals[key];
                    break;

                  case "score3":
                    item.value = this.totals[key];
                    break;
                  case "score4":
                    item.value = this.totals[key];
                    break;
                }
              }
            }
            this.echartDataP2 = echartDataP2;
            //*得分倒数前三  雷达图
            this.Resourcelearning.members.sort(compare("studentScore", 0)); //倒序
            //优秀同学 this.excellent
            this.excellent = this.Resourcelearning.members[0];
            this.excellent.data = [
              this.excellent.score1,
              this.excellent.score2,
              this.excellent.score3,
              this.excellent.score4
            ];
            //每一项 平均分值 this.AverageData
            this.score1Average =
              this.AllTotalscore1 / this.Resourcelearning.members.length;
            this.score2Average =
              this.AllTotalscore2 / this.Resourcelearning.members.length;
            this.score3Average =
              this.AllTotalscore3 / this.Resourcelearning.members.length;
            this.score4Average =
              this.AllTotalscore4 / this.Resourcelearning.members.length;
            this.AverageData = [
              this.score1Average,
              this.score2Average,
              this.score3Average,
              this.score4Average
            ];
            for (
              let i = this.Resourcelearning.members.length - 1;
              i >= 0;
              i--
            ) {
              if (this.index > 2) break;
              let score1 = this.Resourcelearning.members[i].score1;
              let score2 = this.Resourcelearning.members[i].score2;
              let score3 = this.Resourcelearning.members[i].score3;
              let score4 = this.Resourcelearning.members[i].score4;
              //输出倒数前三学生
              let poorData = [score1, score2, score3, score4];
              echartRadar.push({
                legend: {
                  data: [
                    this.Resourcelearning.members[i].account,
                    "优秀同学",
                    "学生平均分"
                  ]
                },
                indicator: [
                  { name: "资源学习" },
                  { name: "签到" },
                  { name: "作业" },
                  { name: "评测" }
                ],
                series: {
                  data: [
                    {
                      value: poorData,
                      name: this.Resourcelearning.members[i].account
                    },
                    {
                      value: this.excellent.data,
                      name: "优秀同学"
                    },
                    {
                      value: this.AverageData,
                      name: "学生平均分"
                    }
                  ]
                }
              });
              this.index++;
            }
            this.echartRadar = echartRadar;
            //得分清单
            for (let v of this.Resourcelearning.members) {
              let total = v.score1 + v.score2 + v.score3 + v.score4;
              this.DetailedTable.push({
                name: v.account,
                totalScore: total,
                ResourceScore: v.score1,
                SignScore: v.score2,
                score: v.score3,
                Scoring: v.score4
              });
            }
            console.log("this.echartRadar", this.echartRadar);
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
    }
  }
};
</script>

<style lang='scss' scoped>
.Analysis {
}
</style>
