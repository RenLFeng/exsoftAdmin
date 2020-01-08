<template>
  <div class="alluser-container">
    <div class="search-content filter-container">
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
    <el-table :data="listData" border style="width: 100%" size="small" v-loading="listLoading">
      <el-table-column
        v-for="(v,i) in TableHead.slice(0,4)"
        :prop="v.prop"
        :label="v.title"
        :key="i"
      ></el-table-column>
      <el-table-column prop="filename" label="文件附件">
        <template slot-scope="scope">
          <download
            v-if="scope.row.files"
            :href="prefix+scope.row.files.filepath"
            :filename="scope.row.files.filename"
          />
        </template>
      </el-table-column>
      <el-table-column
        v-for="v in TableHead.slice(4)"
        :prop="v.prop"
        :label="v.title"
        :key="v.prop"
      ></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="danger" @click="handleClickDeleteData(scope.row)" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pagesize" @pagination="getList" />

    <!-- <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage"
      :page-size="5"
      layout="prev, pager, next, jumper"
      :total="20"
    ></el-pagination>-->
  </div>
</template>

<script>
import { ansnwerTableHead, roleType, prefix } from "@/common.js";
import download from "../component/download";
import {filterSearchKey,getDateStrDesc} from "../../util";
import Pagination from '@/components/Pagination'

const d = [];
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
        total:0,
        timerange:'',
        listLoading:false,
      listData: [],
      TableHead: [],
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
      currentPage: 1,
      prefix: prefix
    };
  },
  created() {
    this.TableHead = ansnwerTableHead;
    //this.getAllUser({});
      this.getList()
  },
  computed: {},
  methods: {
    //获取所有用户数据
      getPostData(){
          let o  = filterSearchKey(this.listQuery)
          if (this.timerange && this.timerange.length == 2){
              o.timerangebegin = getDateStrDesc(this.timerange[0])
              o.timerangeend = getDateStrDesc(this.timerange[1])
          }
          o.page = o.page-1;
          return o
      },
      getList(){
          let o = this.getPostData()
          this.getAllUser(o)
      },
    getAllUser(data) {
          this.listLoading  = true
      this.$http
        .post("/api/admin/replyquery", data)
        .then(res => {
            this.listLoading = false
          if (res.data.code == 0) {
           // if (res.data.data.data.length)
            {
              this.listData = res.data.data.data;
              this.total = res.data.data.count;
              for (let v of this.listData) {
                if (v.files) {
                  v.files = JSON.parse(v.files);
                  v.filename = v.files.filename;
                }
              }
              console.log("userquery", this.listData);
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
          this.$message({
            type: "error",
            message: 'error'
          });
        });
    },
    //搜索
    handleSeach() {
  //    this.getAllUser(this.listQuery);
        this.listQuery.page = 1
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
            .post("/api/admin/replydelete", { id: row.id })
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
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
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
