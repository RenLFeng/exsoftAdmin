<template>
  <div class="alluser-container">
    <div class="search-content filter-container">
      <el-input
        v-model="listQuery.timerangebegin"
        placeholder="创建时间"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleSeach"
      />
      <el-input
        v-model="listQuery.state"
        placeholder="状态"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleSeach"
      />
      <el-select
        v-model="listQuery.order"
        placeholder="排序"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleSeach"
      >
        <el-option label="升序" value="asc" />
        <el-option label="降序" value="desc" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleSeach">搜索</el-button>
    </div>
    <el-table :data="listData" border style="width: 100%" size="small">
      <el-table-column
        v-for="(v,i) in allUserTableList.slice(0,3)"
        :prop="v.prop"
        :label="v.title"
        :key="i"
      ></el-table-column>
      <el-table-column prop="files" label="文件">
        <template slot-scope="scope" v-if="scope.row.files">
          <download
            v-for="(v,index) in scope.row.files"
            :key="index"
            :href="prefix+v.filepath"
            :filename="v.filename"
          />
        </template>
      </el-table-column>
      <el-table-column
        v-for="v in allUserTableList.slice(3)"
        :prop="v.prop"
        :label="v.title"
        :key="v.prop"
      ></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <!-- <el-button type="primary" @click="handleClickUpdateData(scope.row,1)" size="small">编辑</el-button> -->
          <el-button type="danger" @click="handleClickDeleteData(scope.row)" size="small">删除</el-button>
          <el-button type="primary" @click="handleClickSee(scope.row)" size="small">查看学生提交</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { zuoyeTableHead, roleType, prefix, filter } from "@/common.js";
import download from "../component/download";
export default {
  name: "",
  components: {
    download
  },
  data() {
    return {
      listQuery: {
        timerangebegin: "",
        order: "",
        state: ""
      },
      allUserTableList: [],
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
      openForm: 0,
      prefix: prefix
    };
  },
  created() {
    this.getAllUser();
    this.allUserTableList = zuoyeTableHead;
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
        .post("/api/admin/zuoyequery", {})
        .then(res => {
          if (res.data.code == 0) {
            if (res.data.data.data.length) {
              this.listData = res.data.data.data;
              for (let i of res.data.data.bankes) {
                for (let v of this.listData) {
                  if (i.id == v.id) {
                    v.bankename = i.name;
                  }
                }
              }
              for (let v of res.data.data.details) {
                for (let i of this.listData) {
                  if (v.id == i.ztypeid) {
                    i.files = JSON.parse(v.files);
                  }
                }
              }
              filter(this.listData);
              console.log("userquery", res);
              this.$message({
                type: "success",
                message: "加载成功"
              });
            } else {
              this.$message({
                type: "info",
                message: "暂无数据"
              });
            }
          }
        })
        .catch(res => {
          this.$message({
            type: "error",
            message: res.data.msg
          });
        });
    },
    //搜索
    handleSeach() {
      this.$http
        .post("/api/admin/zuoyequery", this.listQuery)
        .then(res => {
          if (res.data.code == 0 && res.data.data.data.length) {
            console.log("userquery", res);
            this.listData = res.data.data.data;
            for (let v of this.listData) {
              (v.file = "我的文件"), (v.answerfile = "世界那么大");
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
    //导出
    handleDownload() {},
    //导入
    handleExport() {},
    //编辑or新增
    handleClickUpdateData(row, index) {
      this.openForm = index;
      if (!this.openForm && row.id) {
        row = {
          role: "",
          account: "",
          name: "",
          password: ""
        };
      }
      this.temp = row;
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    //查看
    handleClickSee(row) {
      let data = { row: row, state: false };
      this.$emit("zuoyeSubmit", data);
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
            .post("api/admin/zuoyedelete", { id: row.id })
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
    //保存 编辑or新增
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.$http
            .post("/api/admin/useradd", this.temp)
            .then(res => {
              if (res.data.code == 0) {
                console.log(res);
                this.$message({
                  type: "success",
                  message: this.openFormStateText + "成功"
                });
                this.init();
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
              console.log("res");
            });
        }
      });
    },
    init() {
      this.temp = {
        role: "",
        account: "",
        name: "",
        password: ""
      };
    },
    getBankename(data) {
      this.$http
        .post("/api/admin/bankequery", data)
        .then(res => {
          if (res.data.code == 0 && res.data.data.data.length) {
            this.listData = res.data.data.data;
            console.log(res);
            for (let v of res.data.data.users) {
              for (let i of this.listData) {
                if (v.id == i.userid) {
                  i.teacher = v.account;
                }
              }
            }
            // console.log("userquery", this.listData);
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
          console.log("res");
          this.$message({
            type: "error",
            message: res.data.msg
          });
        });
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
