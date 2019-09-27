<template>
  <div class="alluser-container">
    <div class="search-content filter-container">
      <el-button class="filter-item" @click="back()">返回</el-button>
    </div>
    <el-table :data="listData" border style="width: 100%" size="small">
      <el-table-column v-for="(v,i) in tHead" :prop="v.prop" :label="v.title" :key="i"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="danger" @click="handleClickDeleteData(scope.row)" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { zuoyeSubmitTableHead, roleType } from "@/common.js";
export default {
  name: "",
  props: ["id"],
  data() {
    return {
      listQuery: {
        account: "",
        role: "",
        name: "",
        sort: "1"
      },
      tHead: [],
      listData: [],
      downloadLoading: false,
      dialogFormVisible: false,
      temp: {
        role: "",
        account: "",
        name: "",
        password: ""
      },
      roleType: roleType,
      openForm: 0
    };
  },
  created() {
    this.getAllUser();
    this.tHead = zuoyeSubmitTableHead;
  },
  computed: {
    openFormStateText() {
      return this.openForm ? "编辑用户" : "新增用户";
    }
  },
  methods: {
    //获取所有用户数据
    getAllUser() {
      this.$http
        .post("/api/admin/zuoyesubmitquery", { zuoyeid: this.id })
           .then(res => {
          if (res.data.code == 0 && res.data.data.data.length) {
            console.log("userquery", res);
            this.listData = res.data.data.data;
            for (let v of this.listData) {
              (v.studentname = "学生姓名"), (v.filetext = "文本");
              (v.file = "文件");
            }
            this.$message({
              type: "success",
              message: "加载成功"
            });
          } else {
            this.$message({
              type: "info",
              message: "加载失败"
            });
          }
        })
        .catch(res => {
          this.$message({
            type: "error",
            message: res.data.msg
          });
        });
    },
    //删除
    handleClickDeleteData(row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http
            .post("api/admin/zuoyesubmitdelete", { id: row.id })
            .then(res => {
              if (res.data.code == 0) {
                 this.listData = this.listData.filter(v => {
                  return v.id != row.id;
                });
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
              } else {
                this.$message({
                  type: "error",
                  message: res.data.msg
                });
              }
            })
            .catch(res => {
              this.$message({
                type: "error",
                message: res.data.msg
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    back() {
      let data = { row: "", state: true };
      this.$emit("zuoyeSubmit", data);
    }
  }
};
</script>

<style lang="scss" scoped>
.alluser-container {
  .el-select {
    width: 100%;
  }
}
</style>
