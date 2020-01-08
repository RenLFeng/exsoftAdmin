<template>
  <div class="alluser-container">
    <div class="search-content filter-container">
      <el-input
        v-model="listQuery.sno"
        placeholder="学号/工号"
        style="width: 200px;"
        class="filter-item"
      />
      <el-select v-model="listQuery.schoolrole" placeholder="用户类型" style="width: 200px;margin-right:5px;">
        <el-option v-for="v in roleType" :key="v.role" :label="v.label" :value="v.role"></el-option>
      </el-select>
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
      <br/>
      <ExportData
        :isForBidden="ExportDataState"
        :tHeaderFather="tHead"
        :filterArrayLists="allUserData"
        :ExportFileName="ExportFileName"
      ></ExportData>
      <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" />
      <el-button class="filter-item" type="primary" @click="handleClickUpdateData(temp,0)">新增</el-button>
    </div>
    <el-table :data="allUserData" border style="width: 100%" size="small"
     v-loading="listLoading"
    >
      <el-table-column
        v-for="(v,i) in userTableHead.slice(0,3)"
        :prop="v.prop"
        :label="v.title"
        :key="i"
      ></el-table-column>
      <!--
      <el-table-column prop="avatar" label="头像">
        <template slot-scope="scope">
          <img class="tabel-img" :src="scope.row.avatar" alt />
        </template>
      </el-table-column>!
      -->
      <el-table-column
        v-for="v in userTableHead.slice(3)"
        :prop="v.prop"
        :label="v.title"
        :key="v.prop"
      ></el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <!-- <el-button type="primary" @click="handleClickSee(scope.row)" size="small">查看</el-button> -->
          <el-button type="primary" @click="handleClickUpdateData(scope.row,1)" size="small">编辑</el-button>
          <el-button type="danger" @click="handleClickDeleteData(scope.row)" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pagesize" @pagination="getList" />

    <!-- /// -->
    <el-dialog :title="openFormStateText" :visible.sync="dialogFormVisible">
      <el-form
        :rules="rules"
        ref="dataForm"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="学号/工号:" prop="sno">
          <el-input v-model="temp.sno" placeholder="请输入学号/工号"></el-input>
        </el-form-item>
        <el-form-item label="角色:" prop="schoolrole">
          <el-select v-model="temp.schoolrole" placeholder="请选择">
            <el-option v-for="v in roleType" :key="v.role" :label="v.label" :value="v.role"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="验证码:" prop="schoolpwd">
          <el-input  placeholder="请输入验证码" v-model="temp.schoolpwd" show-password></el-input>
          <!-- <el-date-picker v-model="temp.password" type="datetime" placeholder="Please pick a date" /> -->
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="createData()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { filterKey,filterSearchKey,cloneobj } from "@/util";
import { schoolroleType } from "@/common";
import ExportData from "@/views/component/ExportData";
import UploadExcelComponent from "@/views/component/importExcel";
import { filter } from "@/common.js";
import {mapState} from 'vuex';

import Pagination from '@/components/Pagination'




export default {
  name: "",
  components: {
    ExportData,
    UploadExcelComponent,
      Pagination
  },
  data() {
      let sst= [{
              fixed: '',
              prop: 'id',
              title: 'ID',
              width: '',
          },
              {
                  fixed: '',
                  prop: 'sno',
                  title: '学号/工号',
                  width: '',
              },
              {
                  fixed: '',
                  prop: 'roledesc',
                  title: '用户类型',
                  width: '',
              },
          {
              fixed: '',
              prop: 'schoolpwd',
              title: '验证码',
              width: '',
          },
          ]
      let tmpdefault = {
          schoolrole: "",
          schoolpwd: "",
          sno:'',
      }
    return {
      listQuery: {
        sno: "",
        schoolrole: "",
          page:1,
          pagesize:50,
      },
        total:0,
        listLoading:false,
      userTableHead: sst,
      allUserData: [],
      downloadLoading: false,
      dialogFormVisible: false,
        tempdefault:tmpdefault,
      temp: tmpdefault,
      roleType: schoolroleType,
      openForm: 0,
      rules: {
        sno: [{ required: true, message: "请输入学号/工号", trigger: "blur" }],
        schoolrole: [
          { required: true, message: "请至少选择一个用户类型", trigger: "blur" }
        ],
      },
      ExportDataState: true,
      ExportFileName: "表格",
      tHead: sst,
    //  seachData: {}
    };
  },
  created() {
   // this.getAllUser({});
      this.getList()
  },
  computed: {
    openFormStateText() {
      return this.openForm ? "编辑用户" : "新增用户";
    }
  },
  methods: {
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1;
      if (isLt1M) {
        return true;
      }
      this.$message({
        message: "Please do not upload files larger than 1m in size.",
        type: "warning"
      });
      return false;
    },
    handleSuccess({ results, header }) {
      for (let v = 0; v < header.length; v++) {
        if (header[v] != this.tHead[v].title) {
          this.$alert("请查看是否有修改", "导入失败", {
            confirmButtonText: "确定",
            center: true
          });
          return;
        }
      }
      let serveData = [];
      for (let v of results) {
        let json = {};
        let key = Object.keys(v);
        for (let i of key) {
          switch (i) {
            // case "ID":
            //   json.id = v["ID"];
            case "学号/工号":
              json.sno = v[i];
              break;
            case "用户类型":
              json.schoolrole = this.seleceRole(v[i]);
              break;
              case '验证码':
                  json.schoolpwd = v[i];
                  break;
          }
        }
        serveData.push(json);
      }
      console.log("serveData", serveData);
      // this.tableData = results;
      // this.tableHeader = header;
      this.createData(serveData);
    },
    seleceRole(v) {
      switch (v) {
        case "学生":
          return 5;
        case "教师":
          return 10;
      }
    },
      getList(){
        let o = filterSearchKey(this.listQuery)
          o.page = o.page-1;
        this.getAllUser(o)
      },
    //获取所有用户数据
    getAllUser(data) {
        this.listLoading = true
      this.$http
        .post("/api/admin/schooluserquery", data)
        .then(res => {
            this.listLoading = false
          if (res.data.code == 0) {
         //   if (res.data.data.data.length)
            {
              console.log("userquery", res);
              this.total = res.data.data.count
              this.allUserData = res.data.data.data;
              filter(this.allUserData);
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
    // //搜索
    handleSeach() {
   //   this.seachInitData();
       // console.log(this.seachData)
        this.listQuery.page = 1
        this.getList()
    //  this.getAllUser(filterSearchKey(this.listQuery));
     // this.init();
    //  this.seachData = {};
    },
    //导出
    handleDownload() {},
    //导入
    handleExport() {},
    //编辑or新增
    handleClickUpdateData(row, index) {
      this.openForm = index;
      if (this.openForm ==0  ) {
        row = this.tempdefault;
      }
      else{
          row = cloneobj(row);
      }
      this.temp = row;
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    //查看
    handleClickSee(row) {
      console.log(row);
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
            .post("/api/admin/schooluserdelete", { id: row.id })
            .then(res => {
              if (res.data.code == 0) {
                this.allUserData = this.allUserData.filter(v => {
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
    createData(data) {
      if (data) {
        this.Add(data);
      } else {
        this.$refs["dataForm"].validate(valid => {
          if (valid) {
            this.Add();
          }
        });
      }
    },
      filterUserUpdate(oitem){
        let oret = {
            schoolrole:oitem.schoolrole,
            sno:oitem.sno,
            schoolpwd:oitem.schoolpwd
        };
        if (oitem.id){
            oret.id = oitem.id;
        }
        return oret;
      },
    Add(data) {
      let json = {};
      json.data = [];
      if (data) {
        json.data = data;
      } else {
        json.data[0] = this.filterUserUpdate(this.temp);
      }
      this.$http
        .post("/api/admin/schooluseradd", json)
        .then(res => {
          if (res.data.code == 0) {
            this.getAllUser();
            this.dialogFormVisible = false;
            this.$message({
              type: "success",
              message: this.openFormStateText + "成功"
            });
         //   this.init();
          } else {
            if (res.data.msg.includes("1062")) {
              let errMsg = res.data.msg.split(":")[2].split("entry")[1];
              this.$message({
                type: "error",
                message: data ? "导入失败" : this.openFormStateText + "失败"
              });
              this.$alert(
                "<div><p>请查看是否重复账户</p><p>发现如一下问题:" +
                  errMsg +
                  "</p></div>",
                data ? "导入失败" : this.openFormStateText + "失败",
                {
                  confirmButtonText: "确定",
                  center: true,
                  dangerouslyUseHTMLString: true
                }
              );
            }
          }
        })
        .catch(res => {
          this.$message({
            type: "error",
            message: res.data.msg
          });
          console.log("res");
        });
    },
    // init() {
    //   this.temp = {
    //     role: "",
    //     account: "",
    //     name: "",
    //     password: ""
    //   };
    //   this.listQuery = {
    //     account: "",
    //     role: "",
    //     name: "",
    //     order: ""
    //   };
    // },
    // seachInitData() {
    //   if (this.listQuery.account) {
    //     this.seachData.account = this.listQuery.account;
    //   }
    //   if (this.listQuery.role) {
    //     this.seachData.role = this.listQuery.role;
    //   }
    //   if (this.listQuery.name) {
    //     this.seachData.name = this.listQuery.name;
    //   }
    //   if (this.listQuery.order) {
    //     this.seachData.order = this.listQuery.order;
    //   }
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
