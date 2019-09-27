<template>
  <el-button type="primary" ref="btn" :disabled="isForBidden" @click="ExportData">导出数据</el-button>
</template>

<script>
export default {
  //   tHeaderFather: [], //导出数据的header
  //   ExportListsFather: []  //导出数据的过滤条件
  //   filterArrayLists: [], //导出数据的all
  //   ExportFileName:"",    //导出的文件的名字
  //   isForBidden: boolean,    //是否禁止导出按钮
  props: [
    "tHeaderFather",
    "filterArrayLists",
    "ExportFileName",
    "isForBidden"
  ],
  data() {
    return {
      listLoading: true,
      downloadLoading: false,
      autoWidth: true
    };
  },
  created(){
  },
  methods: {
    ExportData() {
      let TableHead = [];
      let ListsFather=[];
      for (let v of this.tHeaderFather) {
        TableHead.push(v.title);
        ListsFather.push(v.prop)
      }
      import("@/vendor/Export2Excel").then(excel => {
        const tHeader = TableHead;
        const filterVal =ListsFather;
        const list = this.filterArrayLists; 
        const data = this.formatJson(filterVal, list);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.ExportFileName,
          autoWidth: this.autoWidth
        });
        // this.downloadLoading = false;
      });
    },
    //对数据与表头字段进行匹配
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          return v[j];
        })
      );
    }
  }
};
</script>

<style scoped>
</style>