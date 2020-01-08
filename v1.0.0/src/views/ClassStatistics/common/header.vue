<template>
  <div>
    <div class="content-tit fontsize-sm">
      <p>{{acttitle}}</p>
      <div>
        <p>班课名称: {{ClassTitleInfo.name}}</p>
        <p>教师: {{ClassTitleInfo.teacherName}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "",
  props: {
    info: {
      default() {
        return {};
      }
    }
  },
  data() {
    return {};
  },
  computed: {
      acttitle(){
          let curpath = this.$route.path;
          if (curpath == '/Rereport'){
              return '资源报告';
          }
          else if (curpath == '/Actreport'){
              return '活动报告';
          }
          else if (curpath == '/Analysis'){
              return '学情分析';
          }
          return '教学报告';
      },
    ...mapState(["ClassTitleInfo"])
  },
  methods: {}
};
</script>

<style lang='scss' scoped>
.content-tit {
  margin-top: 20px;
  background: #fff;
  text-align: left;
  padding: 10px 0;

  > p {
    border-bottom: 1px solid #ccc;
    padding: 0 10px 10px;
  }

  > div {
    padding: 0 10px;
  }
}
</style>
