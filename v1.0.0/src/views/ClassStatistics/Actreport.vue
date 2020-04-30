<template>
  <div class="Actreport Statistics">
    <Header2 />
    <div class="container mai">
      <Title />
      <el-row class="content-charts" :gutter="40">
        <el-col>
          <div class="chart-tit fontsize-sm">活动构成</div>
          <Pie :data="echartData" />
        </el-col>
      </el-row>
      <el-row class="content-charts" :gutter="40">
        <el-col>
          <div class="chart-tit fontsize-sm">活动参与度</div>
          <Bar :data="echartBarData" :rotate="1" :Proportion="1" :formatter="1" />
        </el-col>
      </el-row>
      <el-row class="content-charts" :gutter="40">
        <el-col>
          <div class="chart-tit fontsize-sm">作业报表</div>
          <Eline :data="echartElineData" :rotate="1" :title="1" :dataZoom="1" />
        </el-col>
        <el-col>
          <div class="chart-tit fontsize-sm" style="border-bottom:none">历次作业平均分Top5</div>
          <el-table :data="tableData" border>
            <el-table-column prop="name" label="姓名" width="180"></el-table-column>
            <el-table-column prop="ParticipationTimes" label="参与次数" width="180"></el-table-column>
            <el-table-column prop="Average" label="平均分"></el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-row class="content-charts" :gutter="40">
        <el-col>
          <div class="chart-tit fontsize-sm">签到报表</div>
          <Bar :data="echartLineSignData" :rotate="1" :Proportion="1" :formatter="1" />
        </el-col>
        <el-col>
          <div class="chart-tit fontsize-sm" style="border-bottom:none">签到率排名Top5</div>
          <el-table :data="SigntableData" border>
            <el-table-column prop="name" label="姓名" width="200"></el-table-column>
            <el-table-column prop="signnum" label="签到次数" width="180"></el-table-column>
            <el-table-column prop="sign" label="签到率"></el-table-column>
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
import Bar from "../component/echart/line";
import Eline from "../component/echart/line";
import "./style/common.scss";
import { getDate, parseChartScoreData,getChartDate, nowDate } from "../../util";
import { mapState } from "vuex";
//班课文件： finttype 标志其文件类型：
// #define FILETYPE_UNKOWN 0
// #define FILETYPE_PIC 1
// #define FILETYPE_VIDEO 2
// #define FILETYPE_AUDIO 3
// #define FILETYPE_DOC 4
// #define FILETYPE_URL 100 //! 此仅在班课资源中有效

// No Environment
// 序号对应的分数类型：
// #define SCORE_INDEX_BANKEFILES 1
// // #define SCORE_INDEX_SIGN 2
// #define SCORE_INDEX_ZUOYE 3
// #define SCORE_INDEX_PINGCE 4
// wpercent： 50% 表示为 5000

const signjoinnums = [
  {
    signnum: 1,
    userid: 1003
  }
];
const actjoin = [
  {
    atype: 1,
    joinwpercent: 5000
  },
  {
    atype: 2,
    joinwpercent: 5000
  },
  {
    atype: 3,
    joinwpercent: 5000
  },
  {
    atype: 4,
    joinwpercent: 5000
  }
];
const weekactivity = [
  {
    classid: 1000,
    countdate: "2019/11/9",
    id: 1005,
    score1: 10,
    score2: 10,
    score3: 50,
    score4: 0,
    score5: 0,
    userid: 3
  },
  {
    classid: 1000,
    countdate: "2019/11/11",
    id: 1004,
    score1: 0,
    score2: 0,
    score3: -1,
    score4: 0,
    score5: 0,
    userid: 2
  },
  {
    classid: 1000,
    countdate: "2019/11/13",
    id: 1003,
    score1: 5,
    score2: 5,
    score3: 24.5,
    score4: 0,
    score5: 0,
    userid: 1
  }
];
const weeksign = [
  {
    atype: 2,
    atypeid: 1000,
    classid: 1000,
    countdate: "2019/11/13",
    id: 1002,
    joinwpercent: 6000
  },
  {
    atype: 1,
    atypeid: 1000,
    classid: 1000,
    countdate: "2019/11/11",
    id: 1002,
    joinwpercent: 5000
  }
];
const zuoyescores = [
  {
    avgscore: 50,
    num: 1,
    userid: 1003
  }
];
//活动参与度
const echartBarData = {
  legend: {
    data: ["参与度"]
  },
  xAxis: {
    data: ["作业", "评测", "签到", "资源学习"]
  },
  series: [
    {
      name: "参与度",
      type: "bar",
      barWidth: 30, //柱图宽度
      data: [0, 0, 0, 0]
    }
  ]
};
//作业报表
const echartElineData = {
  title: {
    text: "历次作业得分情况"
  },
  legend: {
    data: ["", "", "", "最高分", "最低分", "平均分"]
  },
  xAxis: {
    data: []
  },
  series: [
    {
      name: "最高分",
      type: "line",
      data: [0, 0, 0, 0, 0, 0, 0],
        matchcol:'score3',
        matchuserid:3
    },
    {
      name: "最低分",
      type: "line",
      data: [0, 0, 0, 0, 0, 0, 0],
        matchcol:'score3',
        matchuserid:2,
    },
    {
      name: "平均分",
      type: "line",
      data: [0, 0, 0, 0, 0, 0, 0],
        matchcol:'score3',
        matchuserid:1
    }
  ]
};
//签到报表
const echartLineSignData = {
  legend: {
    data: ["签到率"]
  },
  xAxis: {
    data: []
  },
  series: [
    {
      name: "签到率",
      type: "line",
      data: [0, 0, 0, 0, 0, 0, 0]
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
      echartData: {
        title: {
          text: "活动类型分布"
        },
        legend: {
          data: ["作业", "签到", "资源", "评测"]
        },
        series: {
          data: [
            { value: 0, name: "作业" , matchcol:'zuoyenum'},
            { value: 0, name: "签到", matchcol:'signnum' },
            { value: 0, name: "资源" , matchcol:'filesnum'},
              {value:0, name:"评测", matchcol:'pingcenum'}
          ]
        }
      },
      echartBarData: {
        legend: {
          data: ["参与度"]
        },
        xAxis: {
          data: ["作业", "评测", "签到", "资源学习"]
        },
        series: [
          {
            name: "参与度",
            type: "bar",
            barWidth: 30, //柱图宽度
            data: []
          }
        ]
      },
      echartElineData: {},
      tableData: [],
      echartLineSignData: {},
      SigntableData: [],

      serverData: {}
    };
  },
  computed: {
    ...mapState(["ClassID"])
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      this.$http
        .post("/api/bankecount/actreport", { id: this.ClassID })
        .then(res => {
          console.log("success", res);
          if (res.data.code == "0") {
            this.serverData = res.data.data;

            // this.serverData.signjoinnums = signjoinnums;
            // this.serverData.actjoin = actjoin;
            // this.serverData.weekactivity = weekactivity;
            // this.serverData.weeksign = weeksign;
            // this.serverData.zuoyescores = zuoyescores;
            console.log("this.serverData", this.serverData);

            //活动个构成
              let numinfo = this.serverData.numinfo;
              for(let item of this.echartData.series.data){
                  if (typeof numinfo[item.matchcol] != 'undefined'){
                      item.value = numinfo[item.matchcol];
                  }
                  else{
                      item.value = 0;
                  }
              }
            //for (let v in this.serverData.numinfo) {



              // switch (v) {
              //   case "filesnum":
              //     for (let item of this.echartData.series.data) {
              //       if (item.name == "资源") {
              //         item.value = this.serverData.numinfo[v];
              //
              //       }
              //     }
              //     break;
              //   case "signnum":
              //     for (let item of this.echartData.series.data) {
              //       if (item.name == "签到") {
              //         item.value = this.serverData.numinfo[v];
              //
              //       }
              //     }
              //     break;
              //   case "zuoyenum":
              //     for (let item of this.echartData.series.data) {
              //       if (item.name == "作业") {
              //         item.value = this.serverData.numinfo[v];
              //
              //       }
              //     }
              //     break;
              // }
           // }
            //活动参与度
            for (let i = 0; i < this.serverData.actjoin.length; i++) {
              let item = this.serverData.actjoin[i];
              switch (item.atype) {
                case 1:
                  for (let v in echartBarData.xAxis.data) {
                    if (echartBarData.xAxis.data[v] == "资源学习") {
                      echartBarData.series[0].data[v] = (item.joinwpercent / 100).toFixed(2);
                    }
                  }
                  break;
                case 2:
                  for (let v in echartBarData.xAxis.data) {
                    if (echartBarData.xAxis.data[v] == "签到") {
                      echartBarData.series[0].data[v] = (item.joinwpercent / 100).toFixed(2);
                    }
                  }
                  break;
                case 3:
                  for (let v in echartBarData.xAxis.data) {
                    if (echartBarData.xAxis.data[v] == "作业") {
                      echartBarData.series[0].data[v] = (item.joinwpercent / 100).toFixed(2);
                    }
                  }
                  break;
                case 4:
                  for (let v in echartBarData.xAxis.data) {
                    if (echartBarData.xAxis.data[v] == "评测") {
                      echartBarData.series[0].data[v] = (item.joinwpercent / 100).toFixed(2);
                    }
                  }
                  break;
              }
            }
            this.echartBarData = echartBarData;
            // console.log("this.echartBarData", this.echartBarData);
              this.echartElineData = echartElineData;
              parseChartScoreData(this.echartElineData, this.serverData.weekactivity, 7, null);
            //作业报表
            // let date = getDate(
            //   this.serverData.weekactivity[
            //     this.serverData.weekactivity.length - 1
            //   ].countdate
            // );
            // echartElineData.xAxis.data = date;
            // for (let i = 0; i < this.serverData.weekactivity.length; i++) {
            //   for (let j = 0; j < echartElineData.xAxis.data.length; j++) {
            //     if (
            //       this.serverData.weekactivity[i].countdate ==
            //       echartElineData.xAxis.data[j]
            //     ) {
            //       this.serverData.weekactivity[i].index = j;
            //     }
            //   }
            //   let item = this.serverData.weekactivity[i];
            //   // for (let key in item) {
            //   switch (item.userid) {
            //     case 1:
            //       for (let v of echartElineData.series) {
            //         if (v.name == "平均分") {
            //           v.data[item.index] = item.score3;
            //         }
            //       }
            //       break;
            //     case 2:
            //       for (let v of echartElineData.series) {
            //         if (v.name == "最低分") {
            //           v.data[item.index] = item.score3;
            //         }
            //       }
            //       break;
            //     case 3:
            //       for (let v of echartElineData.series) {
            //         if (v.name == "最高分") {
            //           v.data[item.index] = item.score3;
            //         }
            //       }
            //       break;
            //   }
            //   // }
            // }
            // this.echartElineData = echartElineData;
            // console.log("this.echartElineData", this.echartElineData);

            //历次作业平均分Top5
            for (let v of this.serverData.zuoyescores) {
              this.tableData.push({
                name: v.username,
                ParticipationTimes: v.num,
                Average:parseInt(v.avgscore)
              });
            }
            //签到报表
            let weeksignDate = getChartDate(7, null); //getDate(this.serverData.weeksign[0].countdate);
            echartLineSignData.xAxis.data = weeksignDate;

            let ed = echartLineSignData;
              for (let v of ed.series){
                  v.data = [];
              }
            let wa = this.serverData.weeksign;
            for(let i=0; i<weeksignDate.length; i++){
                let cur = null;
                for(let j=0; j<wa.length; j++){
                    if (wa[j].countdate == weeksignDate[i]){
                        cur = wa[j];
                    }
                }
                for(let v of ed.series){
                    if (cur){
                        v.data.push(cur.joinwpercent/100);
                    }
                    else{
                        v.data.push(0);
                    }
                }
            }
            // for (let i = 0; i < this.serverData.weeksign.length; i++) {
            //   let item = this.serverData.weeksign[i];
            //   for (let j = 0; j < echartLineSignData.xAxis.data.length; j++) {
            //     if (
            //       this.serverData.weeksign[i].countdate ==
            //       echartLineSignData.xAxis.data[j]
            //     ) {
            //       this.serverData.weeksign[i].index = j;
            //     }
            //   }
            //   echartLineSignData.series[0].data[item.index] =
            //     (item.joinwpercent / 10000) * 100;
            // }
            this.echartLineSignData = echartLineSignData;
            // console.log("this.echartLineSignData", this.echartLineSignData);

            //签到率排名Top5
              let signtotal = this.serverData.numinfo.signnum;
              if (signtotal <= 0){
                  signtotal = 1;
              }
            for (let v of this.serverData.signjoinnums) {
              this.SigntableData.push({
                name: v.username,
                  signnum:v.signnum,
                sign: (v.signnum * 100 / signtotal).toFixed(2) + '%'
              });
            }
            // console.log("this.echartLineSignData", this.echartLineSignData);
            console.log("serverData serverData", this.serverData);
          } else {
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
</style>
