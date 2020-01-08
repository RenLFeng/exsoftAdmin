<template>
  <div class="alluser-container">
    <div class="search-content filter-container">
      <!--
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
      -->
      <el-date-picker
              v-model="timerange"
              type="datetimerange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['12:00:00']">
      </el-date-picker>


      <el-select
        v-model="listQuery.order"
        placeholder="排序"
        style="width: 200px;"
        class="filter-item"
      >
        <el-option label="升序" value="asc" />
        <el-option label="降序" value="desc" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleSeach">搜索</el-button>
    </div>
    <el-table :data="listData" border style="width: 100%" size="small"
      v-loading="listLoading"
    >
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
          <el-button type="primary" @click="handleClickSee(scope.row)" size="small">查看学生提交</el-button>
          <el-button type="danger" @click="handleClickDeleteData(scope.row)" size="small">删除</el-button>

        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pagesize" @pagination="getList" />

  </div>
</template>

<script>
import { zuoyeTableHead, roleType, prefix, filter } from "@/common.js";
import {filterSearchKey,getDateStrDesc} from "../../util";
import download from "../component/download";

import Pagination from '@/components/Pagination'

export default {
  name: "",
  components: {
    download,
      Pagination
  },
  data() {
    return {
      listQuery: {
        order: "",
        page:1,
          pagesize:50
      },
        total:0,
        listLoading:false,
        timerange:'',
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
   // this.getAllUser();

    this.allUserTableList = zuoyeTableHead;
    this.getList();
  },
  computed: {
    openFormStateText() {
      return this.openForm ? "编辑" : "新增";
    }
  },
  methods: {
    //获取所有用户数据
      getPostData(){
          let obj = filterSearchKey(this.listQuery);
        //  console.log(obj);
         // console.log(this.timerange)
          if (this.timerange && this.timerange.length == 2){
              obj.timerangebegin = getDateStrDesc(this.timerange[0]);
              obj.timerangeend = getDateStrDesc(this.timerange[1]);
          }
          obj.page = obj.page-1;
          return obj
      },
      getList(){
          let o = this.getPostData();
          this.getAllUser(o);
      },
    getAllUser(data) {
          this.listLoading = true;
      this.$http
        .post("/api/admin/zuoyequery", data)
        .then(res => {
            this.listLoading = false;
          if (res.data.code == 0) {
           // if (res.data.data.data.length)
            {
              this.listData = res.data.data.data;
              this.total = res.data.data.count;
              for (let i of res.data.data.bankes) {
                for (let v of this.listData) {
                  if (i.id == v.ownerid) {
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
            }
            // else {
            //   this.$message({
            //     type: "info",
            //     message: "暂无数据"
            //   });
            // }
          }
        })
        .catch(res => {
            this.listLoading = false
          this.$message({
            type: "error",
            message: 'error'
          });
        });
    },
    //搜索
    handleSeach() {
          this.listQuery.page = 1;
          this.getList();
      // this.$http
      //   .post("/api/admin/zuoyequery", this.listQuery)
      //   .then(res => {
      //     if (res.data.code == 0 && res.data.data.data.length) {
      //       console.log("userquery", res);
      //       this.listData = res.data.data.data;
      //       for (let v of this.listData) {
      //         (v.file = "我的文件"), (v.answerfile = "世界那么大");
      //       }
      //       this.$message({
      //         type: "success",
      //         message: "加载成功"
      //       });
      //     } else {
      //       this.$message({
      //         type: "info",
      //         message: "加载失败"
      //       });
      //     }
      //   })
      //   .catch(res => {
      //     this.$message({
      //       type: "error",
      //       message: res.data.msg
      //     });
      //   });
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
      this.$confirm("此操作将永久删除该作业, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http
            .post("/api/admin/zuoyedelete", { id: row.id })
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

    // getBankename(data) {
    //   this.$http
    //     .post("/api/admin/bankequery", data)
    //     .then(res => {
    //       if (res.data.code == 0 && res.data.data.data.length) {
    //         this.listData = res.data.data.data;
    //         console.log(res);
    //         for (let v of res.data.data.users) {
    //           for (let i of this.listData) {
    //             if (v.id == i.userid) {
    //               i.teacher = v.account;
    //             }
    //           }
    //         }
    //         // console.log("userquery", this.listData);
    //         this.$message({
    //           type: "success",
    //           message: "加载成功"
    //         });
    //       } else {
    //         this.$message({
    //           type: "info",
    //           message: "加载失败"
    //         });
    //       }
    //     })
    //     .catch(res => {
    //       console.log("res");
    //       this.$message({
    //         type: "error",
    //         message: res.data.msg
    //       });
    //     });
    // }
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
