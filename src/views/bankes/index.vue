<template>
  <div>
    <allUsers />
    <el-button type="warning" style="width:100px;height:36px;" ref="btn" @click="ExportData">导出数据</el-button>
  </div>
</template>

<script>
import allUsers from "./allUser";
export default {
  name: "",
  components: {
    allUsers
  },
  data() {
    return {
      list: [
        {
          author: "Carol",
          comment_disabled: true,
          content_short: "我是测试数据",
          display_time: "1974-06-19 10:01:57",
          forecast: 71.85,
          id: 1,
          importance: 2,
          pageviews: 1670,
          reviewer: "Ruth",
          status: "deleted",
          timestamp: 1126391703464,
          title: "哦i啥v就开始对方能看出来市场v恐龙世界",
          type: "JP"
        }
      ],
      listLoading: true,
      downloadLoading: false,
      filename: "",
      autoWidth: true
    };
  },
  created() {},
  methods: {
    ExportData() {
      console.log("导出数据");
      import("@/vendor/Export2Excel").then(excel => {
        //表格的表头列表
        const tHeader = ["Id", "Title", "Author", "Readings", "Date"];
        //与表头相对应的数据里边的字段
        const filterVal = [
          "id",
          "title",
          "author",
          "pageviews",
          "display_time"
        ];
        const list = this.list;
        const data = this.formatJson(filterVal, list);
        //这里还是使用export_json_to_excel方法比较好，方便操作数据
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.filename,
          autoWidth: this.autoWidth
        });
        this.downloadLoading = false;
      });
    },
    //洗数据
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          // if (j === "timestamp") {
          // return parseTime(v[j]);
          // } else {
          return v[j];
          // }
        })
      );
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
