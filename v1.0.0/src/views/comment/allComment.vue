<template>
  <div class="alluser-container">
    <div class="search-content filter-container">
      <!--
      <el-input
        v-model="listQuery.timerangebegin"
        placeholder="发布时间"
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
      <el-table-column v-for="(v,i) in commentTableHead" :prop="v.prop" :label="v.title" :key="i"></el-table-column>
      <el-table-column prop="filename" label="文件附件">
        <template slot-scope="scope">
          <download
            v-if="scope.row.files"
            :href="prefix+scope.row.files.filepath"
            :filename="scope.row.files.filename"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="danger" @click="handleClickDeleteData(scope.row)" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pagesize" @pagination="getList" />

  </div>
</template>

<script>
import { commentTableHead, roleType, prefix } from "@/common.js";
import download from "../component/download";
import Pagination from '@/components/Pagination'

import {filterSearchKey, getDateStrDesc} from "../../util";

export default {
  name: "",
  components: {
    download,
      Pagination,
  },
  data() {
    return {
      listQuery: {
        order: "desc",
          page:1,
          pagesize:50,
      },
        timerange:'',
        total:0,
        listLoading:false,
      commentTableHead: commentTableHead,
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
   // this.getAllUser({});
      this.getList();
  },
  computed: {},
  methods: {
    //获取所有用户数据
      getPostData(){
          let o = filterSearchKey(this.listQuery);
          if (this.timerange && this.timerange.length == 2){
              o.timerangebegin = getDateStrDesc(this.timerange[0])
              o.timerangeend = getDateStrDesc(this.timerange[1])
          }
          o.page  = o.page-1;
          return o
      },
      getList(){
          let o = this.getPostData()
          this.getAllUser(o)
      },
    getAllUser(data) {
          this.listLoading = true
      this.$http
        .post("/api/admin/commentquery", data)
        .then(res => {
            this.listLoading = false
          if (res.data.code == 0) {
           // if (res.data.data.data.length)
            {
              console.log("userquery", res);
              this.listData = res.data.data.data;
              this.total = res.data.data.count;
              for (let v of this.listData) {
                if (v.files) {
                  v.files = JSON.parse(v.files);
                  v.filename = v.files.filename;
                }
              }
              this.$message({
                type: "success",
                message: "获取数据成功"
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
    //搜索 asc desc

    handleSeach() {
      //this.getAllUser(this.listQuery);
        this.listQuery.page = 1;
        this.getList()
    },
    //删除
    handleClickDeleteData(row) {
      this.$confirm("此操作将永久删除该信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http
            .post("/api/admin/commentdelete", { id: row.id })
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
