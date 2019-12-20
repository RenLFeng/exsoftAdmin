<template>
  <div class="home">
    <div class="home-tit fontsize-md">
      <span>
        教师用户总数
        <a class="color-blue">{{teacherTotal}}</a> 人
      </span>
      <span>
        学生用户总数
        <a class="color-blue">{{studentTotal}}</a> 人
      </span>
      <el-button type="primary" plain class="fontsize-md export-data">导出表格</el-button>
    </div>
    <el-row :gutter="40">
      <el-col :lg="12" :sm="12" :xs="24" class="item-col">
        <div class="grid-content bg-white">
          <el-row>
            <el-col>
              <div class="info-text-title icons-right">云课堂使用数据</div>
            </el-col>
            <el-col class="info-contet">
              <div class="grid-content">
                <el-row>
                  <el-col :span="8" class="xxs-col">
                    <ul class="icons-right info-ul">
                      <li class="nmber-content">
                        <countTo
                          :startVal="user.startVal"
                          :endVal="classData.bankecount"
                          :duration="1500"
                        ></countTo>个
                      </li>
                      <li class="chain">云课堂总数</li>
                    </ul>
                  </el-col>
                  <el-col :span="8" class="xxs-col">
                    <ul class="icons-right info-ul">
                      <li class="nmber-content">
                        <el-progress
                          type="circle"
                          :percentage="bankeusepercent"
                          :strokeWidth="10"
                          :width="width"
                        ></el-progress>
                      </li>
                      <li class="chain">云课堂使用率</li>
                    </ul>
                  </el-col>
                  <el-col :span="8" class="xxs-col">
                    <ul class="icons-right info-ul">
                      <li class="nmber-content">
                        <el-progress
                          type="circle"
                          :percentage="zuoyepercent"
                          :strokeWidth="10"
                          :width="width"
                        ></el-progress>
                      </li>
                      <li class="chain">作业完成率</li>
                    </ul>
                  </el-col>
                </el-row>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>

      <el-col :lg="12" :sm="12" class="item-col">
        <div class="grid-content bg-white">
          <el-row>
            <el-col>
              <div class="info-text-title icons-right">课堂教学数据</div>
            </el-col>
            <el-col class="info-contet">
              <div class="grid-content">
                <el-row>
                  <el-col :span="8" class="xxs-col">
                    <ul class="icons-right info-ul">
                      <li class="nmber-content">
                        <countTo
                          :startVal="user.startVal"
                          :endVal="cloudData.zuoyenum"
                          :duration="1500"
                        ></countTo>个
                      </li>
                      <li class="chain">作业总数</li>
                    </ul>
                  </el-col>
                  <el-col :span="8" class="xxs-col">
                    <ul class="icons-right info-ul">
                      <li class="nmber-content">
                        <countTo
                          :startVal="user.startVal"
                          :endVal="cloudData.filesnum"
                          :duration="1500"
                        ></countTo>个
                      </li>
                      <li class="chain">资源总数</li>
                    </ul>
                  </el-col>
                  <el-col :span="8" class="xxs-col">
                    <ul class="icons-right info-ul">
                      <li class="nmber-content">
                        <el-progress
                          type="circle"
                          :percentage="bankejoinpercent"
                          :strokeWidth="10"
                          :width="width"
                        ></el-progress>
                      </li>
                      <li class="chain">学生参与率</li>
                    </ul>
                  </el-col>
                </el-row>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="40">
      <el-col :lg="24">
        <Bar :echartData="echartData" />
      </el-col>
    </el-row>
  </div>
</template>
<script>
// import F2 from "@antv/f2/lib/index-all";
// 数字滚动插件
import countTo from "vue-count-to";
import echarts from "echarts";
import { mapState } from "vuex";
import { getDate, getChartDate, parseChartWeekData, nowDate } from "../../util";
import Bar from "../component/echart/bar";
const colors = ['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'];
export default {
  name: "home",
  components: { countTo, Bar },
  data() {
    return {
      width: 100,
      cloudData: {},
      classData: {},
      user: {
        startVal: 0,
        endVal: 10951
      },
      echartData: {
        legend: {
          data: [
            "新增资源",
            "新增作业",
            "新增评测",
            "新增签到",
            "资源总数",
            "作业总数",
            "评测总数",
            "签到总数"
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
            data: [],
            matchcol: "score1"
          },
          {
            name: "新增作业",
            type: "bar",
            itemStyle: {
              color: colors[1]
            },
            data: [],
            matchcol: "score3"
          },
          {
            name: "新增评测",
            type: "bar",
            itemStyle: {
              color: colors[2]
            },
            data: [],
            matchcol: "score4"
          },
          {
            name: "新增签到",
            type: "bar",
            itemStyle: {
              color: colors[3]
            },
            data: [],
            matchcol: "score2"
          },
          {
            name: "资源总数",
            type: "line",
            lineStyle: {
              color: colors[0]
            },
            data: [],
            matchcol: "score1",
            isadd: 1
          },
          {
            name: "作业总数",
            type: "line",
            lineStyle: {
              color: colors[1]
            },
            data: [],
            isadd: 1,
            matchcol: "score3"
          },
          {
            name: "评测总数",
            type: "line",
            lineStyle: {
              color: colors[2]
            },
            data: [],
            isadd: 1,
            matchcol: "score4"
          },
          {
            name: "签到总数",
            type: "line",
            lineStyle: {
              color: colors[3]
            },
            data: [],
            isadd: 1,
            matchcol: "score2"
          }
        ]
      },
      teacherTotal: 0,
      studentTotal: 0,
      serverData: {},
      taskTotal: 0,
      rerepTotal: 0,
      signTotal: 0
    };
  },
  mounted() {
    let that = this;
    window.addEventListener("resize", function() {
      that.onresize();
    });
    this.getDate();
  },
  computed: {
    ...mapState(["loginUser"]),
    zuoyepercent() {
      return parseInt(this.classData.zuoyewpercent / 100);
    },
    bankeusepercent() {
      if (this.classData.bankecount > 0 && this.classData.bankeusecount >= 0) {
        return parseInt(
          (this.classData.bankeusecount * 100) / this.classData.bankecount
        );
      }
      return 0;
    },
    bankejoinpercent() {
      if (this.classData.bankecount > 0 && this.cloudData.bankejoincount >= 0) {
        return parseInt(
          (this.cloudData.bankejoincount * 100) / this.classData.bankecount
        );
      }
      return 0;
    }
  },
  methods: {
    getDate() {
      this.$http
        .post("/api/admin/main", {})
        .then(res => {
          console.log("res", res);
          if (res.data.code != 0){
              if (res.data.msg == 'no privilige'){
                  //! cjy: 跳转登录
                  this.$store.commit("SETLOGINUSER", {});
                  this.$store.commit("COMMIT_TOKEN", null);
                  this.$router.push("/login");

              }
              return ;
          }
          if (res.data.code == "0") {
            this.serverData = res.data.data;
            console.log("serverData", this.serverData);
            for (let v of this.serverData.usercount) {
              switch (v.role) {
                case 5:
                  this.studentTotal = this.studentTotal + v.num;
                  break;
                case 10:
                  this.teacherTotal = this.teacherTotal + v.num;
                  break;
              }
            }

            this.cloudData = this.serverData.activity;

            this.classData = this.serverData.banke;

            this.parseChartData(this.serverData.weekactivity);

            // let date = getDate(this.serverData.weekactivity[0].countdate);
            // this.echartData.xAxis.data = date;
            // for (let i = 0; i < this.serverData.weekactivity.length; i++) {
            //   //  for (let i = this.serverData.weekactivity.length - 1; i >= 0; i--) {
            //   for (let j = 0; j < this.echartData.xAxis.data.length; j++) {
            //       console.log(this.echartData.xAxis.data[j]);
            //     if (
            //       this.serverData.weekactivity[i].countdate ==
            //       this.echartData.xAxis.data[j]
            //     ) {
            //       this.serverData.weekactivity[i].index = j;
            //     }
            //   }
            //   let item = this.serverData.weekactivity[i];
            //   for (let key in item) {
            //     switch (key) {
            //       case "score1":
            //         for (let v of this.echartData.series) {
            //           if (v.name == "新增资源") {
            //             v.data[item.index] = item[key];
            //           }
            //           if (v.name == "资源总数") {
            //             let temp = item[key];
            //             this.rerepTotal = this.rerepTotal + temp;
            //             v.data[item.index] = this.rerepTotal;
            //              v.data[item.index+1] = this.rerepTotal;
            //           }
            //         }
            //         break;
            //       case "score2":
            //         for (let v of this.echartData.series) {
            //           if (v.name == "新增作业") {
            //             v.data[item.index] = item[key];
            //           }
            //           if (v.name == "作业总数") {
            //             let temp = item[key];
            //             this.taskTotal = this.taskTotal + temp;
            //             v.data[item.index] = this.taskTotal;
            //              v.data[item.index+1] = this.taskTotal;
            //           }
            //         }
            //         break;
            //       case "score3":
            //         for (let v of this.echartData.series) {
            //           if (v.name == "新增签到") {
            //             v.data[item.index] = item[key];
            //           }
            //           if (v.name == "签到总数") {
            //             let temp = item[key];
            //             this.signTotal = this.signTotal + temp;
            //             v.data[item.index] = this.signTotal;
            //              v.data[item.index+1] = this.signTotal;
            //           }
            //         }
            //         break;
            //     }
            //   }
            // }
            this.taskTotal = 0;
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
    },

    parseChartData(wa) {
      //! cjy:
      //! tudo. 首先清空图表原数据
      let ed = this.echartData;

      parseChartWeekData(ed, wa, 7, null);

      //console.log(adddata);
      //console.log(ed);
    },

    onresize() {
      // console.log(document.documentElement.clientWidth / 7.5);
      let width = document.documentElement.clientWidth;
      return () => {
        this.width = parseInt(width < 769 ? width / 7.5 : 100);
      };
    },
    toDo(item, i) {
      this.$set(this.todulist[i], "checked", item.checked ? false : true);
    }
  }
};
</script>
<style lang="scss" scoped>
.home {
  padding: 0 40px 40px 40px;
  background: $base-gray1;
  .home-tit {
    padding: 20px 0 20px 20px;
    text-align: right;
    span {
      margin-right: 30px;
    }
    .export-data {
      padding: 6px;
    }
  }
  .bg-white {
    background: $base-white;
    -webkit-box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);
    margin-bottom: 20px;
    cursor: pointer;
    .icons {
      text-align: left;
      width: 86px;
      height: 86px;
      margin: 10px;
      padding: 13px;
      transition: 0.3s ease-in-out;
      border-radius: 3px;
      &:hover {
        background: $base-bule1;
        .icon-yonghu {
          color: $base-white;
        }
      }
      .iconfont {
        font-size: 60px;
      }
      .icon-yonghu {
        font-size: 60px;
        color: $base-bule1;
      }
    }
    .icons1 {
      &:hover {
        background: $base-ye;
        .icon-xiaoxi {
          color: $base-white;
        }
      }
      .icon-xiaoxi {
        color: $base-ye;
      }
    }
    .icons2 {
      &:hover {
        background: $base-green;
        .icon-liuliang {
          color: $base-white;
        }
      }
      .icon-liuliang {
        color: $base-green;
      }
    }
    .icons3 {
      &:hover {
        background: $base-pink;
        .icon-yanjing {
          color: $base-white;
        }
      }
      .icon-yanjing {
        color: $base-pink;
      }
    }
    .icons-right {
      font-size: 24px;
      margin-top: 16px;
      margin-right: 16px;
      li {
        margin: 10px 0;
      }
    }
    .chain {
      color: rgba(0, 0, 0, 0.7);
      font-size: 18px;
    }
    .my-canvas-100 {
      width: 100%;
      height: 100%;
    }
  }
  .info-text-title {
    text-align: left;
    margin-top: 0;
    padding: 10px;
    margin: 0 !important;
  }
  .info-contet {
    border-top: 1px solid #f0f0f0;
    .info-ul {
      margin-top: 0;
      .nmber-content {
        height: 100px;
        line-height: 100px;
      }
    }
  }
  .main-center {
    width: 100%;
    margin-top: 20px;
  }
  .center-left {
    width: 100%;
    text-align: center;
    background: $base-white;
    font-size: 16px;
    color: $base-666;
    padding-bottom: 60px;
    -webkit-box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);
    .accout {
      text-align: left;
      margin: 20px;
    }
    .tou {
      margin-bottom: 20px;
      img {
        width: 85px;
        height: 85px;
        border-radius: 50%;
      }
      span {
        line-height: 25px;
      }
    }
    .mobile,
    .time {
      line-height: 30px;
    }
  }
  #charts {
    // width: 100%;
    height: 426px;
    background: $base-white;
    margin-top: 20px;
    padding-top: 20px;
    -webkit-box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);
  }
  .users {
    margin-top: 20px;
  }
  .todulist {
    background: $base-white;
    margin-top: 20px;
    .item {
      line-height: 46px;
      border-bottom: 1px solid #ededed;
      text-align: left;
      padding-left: 40px;
      cursor: pointer;
      font-size: 16px;
    }
    .done {
      text-decoration: line-through;
      color: gray;
    }
  }
  @media screen and (min-width: 769px) {
    .item-col {
      width: 50%;
    }
  }
  @media screen and (max-width: 768px) {
    .item-col {
      width: 100%;
    }
  }
  @media screen and (max-width: 415px) {
    .home {
      padding: 0 !important;
    }
    .home-tit span,
    .home-tit button {
      display: block;
      text-align: left;
    }
    .xxs-col {
      border-bottom: 1px solid #ccc;
      width: 100%;
    }
  }
}
@media screen and (max-width: 415px) {
  .home {
    padding: 0 !important;
  }
}
</style>

<style>
</style>