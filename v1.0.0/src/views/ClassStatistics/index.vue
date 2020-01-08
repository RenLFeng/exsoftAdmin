<template>
  <div class="Class-Statistics Statistics" :class="isCloud?'act':''">
    <header2 />
    <div class="container mai">
      <ul class="content">
        <Title :info="classTitInfo" />
        <el-row class="content-icon">
          <div v-for="(v,i) in classList" :key="i">
            <el-col :lg="8" :md="8" :sm="12" :xs="12">
              <ul class="item" @click="onitem(v)">
                <li>
                  <div>
                    <i :class="'exappfont icon-fontsize-xl '+v.icon" :style="{color:v.color}"></i>
                    <div>
                      <span class="fontsize-xs">{{v.typeName}}</span>
                      <span class="fontsize-sm">
                        <b class="fontsize-lg">{{v.number}}</b>个
                      </span>
                    </div>
                  </div>
                </li>
              </ul>
            </el-col>
          </div>
        </el-row>
        <el-row class="content-charts" :gutter="40">
          <el-col>
            <div class="tit fontsize-sm">教学周报</div>
            <Bar :echartData="echartData" :istrue="istrue" />
          </el-col>
        </el-row>
      </ul>
    </div>
    <Footer />
  </div>
</template>

<script>
import echarts from "echarts";
import Header2 from "../layout/components/Header2";
import Footer from "../layout/components/footer";
import Title from "./common/header";
import Bar from "../component/echart/bar";
import { getDate, nowDate, parseChartWeekData, parseURL } from "../../util";
import { mapState } from "vuex";
import "./style/common.scss";
const colors = ['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'];
const classList = [
  {
    type: "filesnum",
    typeName: "资源",
    number: 4,
    icon: "exappwenjian",
    color: "#38ADA9"
  },
  {
    type: "membernum",
    typeName: "成员",
    number: 4,
    icon: "exappchengyuan",
    color: "#FF0076"
  },
  {
    type: "signnum",
    typeName: "签到",
    number: 4,
    icon: "exappqiandao2",
    color: "#86C29C"
  },
  {
    type: "zuoyenum",
    typeName: "作业",
    number: 4,
    icon: "exappzuoye-copy",
    color: "#FF8900"
  }
];
export default {
  name: "",
  components: {
    Header2,
    Footer,
    Title,
    Bar
  },
  data() {
    return {
      echartData: {
        legend: {
          data: [
            "新增资源",
            "新增活动",
            "新增签到",
            "新增评测",
            "资源总数",
            "活动总数",
            "签到总数",
            "评测总数"
          ]
        },
        xAxis: {
          data: []
        },
        series: [
          {
            name: "新增资源",
            type: "bar",
            itemStyle: {
              color: colors[0]
            },
            data: [0, 0, 0, 0, 0, 0, 0],
            matchcol: "score1"
          },
          {
            name: "新增活动",
            type: "bar",
            itemStyle: {
              color: colors[1]
            },
            data: [0, 0, 0, 0, 0, 0, 0],
            matchcol: "score3"
          },
          {
            name: "新增签到",
            type: "bar",
            itemStyle: {
              color: colors[2]
            },
            data: [0, 0, 0, 0, 0, 0, 0],
            matchcol: "score2"
          },
          {
            name: "新增评测",
            type: "bar",
            itemStyle: {
              color: colors[3]
            },
            data: [0, 0, 0, 0, 0, 0, 0],
            matchcol: "score4"
          },

          {
            name: "资源总数",
            type: "line",
            lineStyle: {
                color: colors[0]
            },
            data: [0, 0, 0, 0, 0, 0, 0],
            matchcol: "score1",
            isadd: 1
          },
          {
            name: "活动总数",
            type: "line",
            lineStyle: {
               color: colors[1]
            },
            data: [0, 0, 0, 0, 0, 0, 0],
            isadd: 1,
            matchcol: "score3"
          },
          {
            name: "签到总数",
            type: "line",
            lineStyle: {
              color: colors[2]
            },
            data: [0, 0, 0, 0, 0, 0, 0],
            isadd: 1,
            matchcol: "score2"
          },
          {
            name: "评测总数",
            type: "line",
            lineStyle: {
             color: colors[3]
            },
            data: [0, 0, 0, 0, 0, 0, 0],
            isadd: 1,
            matchcol: "score4"
          }
        ]
      },

      classList,

      classTitInfo: {},
      classInfo: {},
      serverData: {},
      numinfo: {},
      istrue: false,
      activTotal: 0,
      rerepTotal: 0,
      signTotal: 0,
      classId: ""
    };
  },
  created() {
    window.scrollTo(0, 0);
    const obj = parseURL(window.location.href);
    this.classInfo = this.$route.params.classInfo;
    if (obj.id) {
        this.$store.commit("SET_CLASS_ID", obj.id);
        this.$store.commit("SET_CLOUD", true);
    }else if (obj.backendid){
        this.$store.commit("SET_CLASS_ID", obj.backendid);
        this.$store.commit("SET_CLOUD",  false);
    } else {
      this.$store.commit("SET_CLASS_ID", this.$route.params.classInfo.id);
    }
  },
  computed: {
    ...mapState(["ClassID","isCloud"])
  },
  mounted() {
    this.getDate();
  },
  methods: {
      onitem(v){
          console.log(v);
          let tourl = '';
          if (v.type == 'filesnum'){
              tourl = '/Rereport';
          }
          else if (v.type == 'membernum'){
              tourl = '/Analysis';
          }
          else if (v.type == 'signum' || v.type=='zuoyenum'){
              tourl = '/Actreport';
          }
          if (tourl.length > 0){
              this.$router.push(tourl);
          }
      },
    getDate() {
      this.$http
        .post("/api/bankecount/main", { id: this.ClassID })
        .then(res => {
          // console.log("res", res);
          if (res.data.code == "0") {
            this.serverData = res.data.data;
            this.classTitInfo = {
              name: this.serverData.banke.name,
              teacherName: this.serverData.banke.username
            };

            let pagetitle = '教学报告-' + this.classTitInfo.name;
            document.title = pagetitle;

            this.$store.commit("SET_CLASS_TITLE_INFO", this.classTitInfo);
            this.istrue = true;
            console.log("serverData", this.serverData);
            this.serverData.numinfo.membernum = this.serverData.banke.membernum;
            this.numinfo = this.serverData.numinfo;
            for (let key in this.numinfo) {
              for (let item of this.classList) {
                if (key == item.type) {
                  item.number = this.numinfo[key];
                }
              }
            }

            // this.parseChartData(this.serverData.weekactivity);
            parseChartWeekData(
              this.echartData,
              this.serverData.weekactivity,
              7,
              null
            );

            // console.log('this.classList',this.classList)
            // if (this.serverData.weekactivity.length) {
            //   let date = getDate(this.serverData.weekactivity[0].countdate);
            //   this.echartData.xAxis.data = date;
            //   for (
            //     let i = this.serverData.weekactivity.length - 1;
            //     i >= 0;
            //     i--
            //   ) {
            //     for (let j = 0; j < this.echartData.xAxis.data.length; j++) {
            //       if (
            //         this.serverData.weekactivity[i].countdate ==
            //         this.echartData.xAxis.data[j]
            //       ) {
            //         this.serverData.weekactivity[i].index = j;
            //       }
            //     }
            //     let item = this.serverData.weekactivity[i];
            //     for (let key in item) {
            //       switch (key) {
            //         case "score1":
            //           for (let v of this.echartData.series) {
            //             if (v.name == "新增资源") {
            //               v.data[item.index] = item[key];
            //             }
            //             if (v.name == "资源总数") {
            //               let temp = item[key];
            //               this.rerepTotal = this.rerepTotal + temp;
            //               v.data[item.index] = this.rerepTotal;
            //               v.data[item.index + 1] = this.rerepTotal;
            //             }
            //           }
            //           break;
            //         case "score2":
            //           for (let v of this.echartData.series) {
            //             if (v.name == "新增活动") {
            //               v.data[item.index] = item[key];
            //             }
            //             if (v.name == "活动总数") {
            //               let temp = item[key];
            //               this.activTotal = this.activTotal + temp;
            //               v.data[item.index] = this.activTotal;
            //               v.data[item.index + 1] = this.activTotal;
            //             }
            //           }
            //           break;
            //         case "score3":
            //           for (let v of this.echartData.series) {
            //             if (v.name == "签到次数") {
            //               v.data[item.index] = item[key];
            //             }
            //             if (v.name == "签到总数") {
            //               let temp = item[key];
            //               this.signTotal = this.signTotal + temp;
            //               v.data[item.index] = this.signTotal;
            //               v.data[item.index + 1] = this.signTotal;
            //             }
            //           }
            //           break;
            //       }
            //     }
            //   }
            // }
            this.activTotal = 0;
            this.rerepTotal = 0;
            this.signTotal = 0;
            console.log("echartData", this.echartData);
          } else {
            this.$message({
              type: "error",
              message: res.data.msg
            });
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
.Class-Statistics {
  .mai {
    .content {
      .content-icon {
        margin-top: 20px;
        background: #fff;
      }
      .content-icon {
        .item {
          height: 150px;
          border: 1px solid #ccc;
          li {
            height: 100%;
            position: relative;
            > div {
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%);
              i {
                margin-right: 30px;
              }
              div {
                display: inline-block;
                text-align: left;
                span {
                  display: block;
                }
              }
            }
          }
        }
      }
      .content-charts {
        .tit {
          padding: 10px;
          text-align: left;
          background: #fff;
          border-bottom: 1px solid #ccc;
        }
      }
    }
  }
}
</style>