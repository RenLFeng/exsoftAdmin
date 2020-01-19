<template>
  <div class="alluser-container">
    <div class="search-content filter-container">
      <el-input
        v-model="listQuery.account"
        placeholder="账户名"
        style="width: 200px;"
        class="filter-item"
      />
      <el-input
        v-model="listQuery.name"
        placeholder="昵称"
        style="width: 200px;"
        class="filter-item"
      />
      <el-select v-model="listQuery.role" placeholder="角色类型" style="width: 200px;margin-right:5px;">
        <el-option v-for="v in searchroleType" :key="v.role" :label="v.label" :value="v.role"></el-option>
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
      <el-button class="filter-item" type="primary" @click="handleClickUpdateData(temp,'add')">新增账户</el-button>
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
      <el-table-column prop="avatar" label="头像">
        <template slot-scope="scope">
          <img class="tabel-img" :src="scope.row.avatar" alt />
        </template>
      </el-table-column>!
      <el-table-column
        v-for="v in userTableHead.slice(3)"
        :prop="v.prop"
        :label="v.title"
        :key="v.prop"
      ></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <!-- <el-button type="primary" @click="handleClickSee(scope.row)" size="small">查看</el-button> -->
          <el-button type="primary" @click="handleClickUpdateData(scope.row,'edit')" size="small">编辑</el-button>
          <el-button type="primary" @click="handleClickUpdateData(scope.row, 'setpwd')" size="small" v-if="scope.row.accountid==0">重置密码</el-button>
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
        <el-form-item label="账户名:" prop="account" v-if="formaction=='add'">
        <el-input v-model="temp.account" placeholder="请输入账户名"></el-input>
      </el-form-item>
        <el-form-item label="账户名:"  v-else>
          {{temp.account}}
        </el-form-item>
        <el-form-item label="昵称:" prop="name" v-if="formaction!='setpwd'">
          <el-input v-model="temp.name" placeholder="请输入昵称"></el-input>
        </el-form-item>
        <el-form-item label="角色:" prop="role" v-if="formaction!='setpwd'">
          <el-select v-model="temp.role" placeholder="请选择">
            <el-option v-for="v in roleType" :key="v.role" :label="v.label" :value="v.role"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="密码:" prop="password" v-if="formaction!='edit'">
          <el-input type="password" placeholder="请输入密码" v-model="temp.password" show-password></el-input>
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
import { filterKey,cloneobj,filterSearchKey,showErrMsg } from "@/util";
import { userTableHead, roleType } from "@/common";
import ExportData from "@/views/component/ExportData";
import UploadExcelComponent from "@/views/component/importExcel";
import { filter } from "@/common.js";

import Pagination from '@/components/Pagination'

export default {
  name: "",
  components: {
    ExportData,
    UploadExcelComponent,
      Pagination
  },
  data() {
      let tempdefault = {
          role:'',
          account:'',
          name:'',
          password:'',
          id:0
      };
      let validatorAccount = (rule,value,callback)=>{
          if (!value || value.length < 1){
              callback(new Error('请输入账户名'))
          }
          this.$http.post('/api/admin/userquery', {accountmatch:value})
              .then(res=>{
                  let o = res.data.data;
                  if (o.count == 0){
                      callback();
                  }
                  else if (o.count > 0){
                      callback(new Error('账户已存在'));
                  }
                  else{
                      callback(new Error('异常'));
                  }
              })
              .catch(res=>{
                  callback(new Error('请求异常'))
              })
      }
      let searchrtype = cloneobj(roleType);
      searchrtype.unshift({
          role:'',
          label:'不限'
      })
    return {
      listQuery: {
        account: "",
        role: "",
        name: "",
        order: "",
          page:1,
          pagesize:50,
      },
        total:0,
        listLoading:false,
      userTableHead: userTableHead,
      allUserData: [],
      downloadLoading: false,
      dialogFormVisible: false,
        tempdefault:tempdefault,
      temp: tempdefault,
      roleType: roleType,
        searchroleType:searchrtype,
      formaction: 'add',  //!  add edit setpwd
      rules: {
        account: [{ required: true, validator:validatorAccount, trigger: "blur" }],
        name: [{ required: true, message: "请输入昵称", trigger: "blur" }],
        role: [
          { required: true, message: "请至少选择一个角色", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      },
      ExportDataState: true,
      ExportFileName: "账户列表",
      tHead: userTableHead,
     // seachData: {}
    };
  },
  created() {
  //  this.getAllUser({});
      console.log('users/alluser created');
      this.getList();
  },
  computed: {
    openFormStateText() {
      //return this.openForm ? "编辑" : "新增";
        let oa = this.formaction;
        if (oa == 'add'){
            return '新增账户';
        }
        else if (oa == 'edit'){
            return '编辑账户';
        }
        else if (oa == 'setpwd'){
            return '重置密码';
        }
        return '';
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
          this.$alert("请查看是否修改了表头", "导入失败", {
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
            case "账户名":
              json.account = v[i];
            case "昵称":
              json.name = v[i] || "";
            case "权限":
              json.role = this.seleceRole(v[i]);
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
        for(let r of roleType){
            if (r.label == v){
                return v.role;
            }
        }
        return roleType[0]
      // switch (v) {
      //   case "学生":
      //     return 5;
      //   case "教师":
      //     return 10;
      //     case '校管理员':
      //         return 50;
      //   case "管理员":
      //     return 100;
      // }
    },
    //获取所有用户数据
    getAllUser(data) {
        this.listLoading = true;
        if (typeof data.page != 'undefined'){
            data.page = data.page-1;
        }

      this.$http
        .post("/api/admin/userquery", data)
        .then(res => {
            this.listLoading = false;
          if (res.data.code == 0) {
          //  if (res.data.data.data.length)
            {
              console.log("userquery", res);
              this.total = res.data.data.count;
              this.allUserData = res.data.data.data;

              //! cjy: 账户统一
                for(let v of this.allUserData){
                    if (v.role < 50 && v.role > 0){
                        v.roleold = v.role;
                       // v.role = 5;  //! 显示为一般用户
                    }
                }

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
            this.listLoading = false;
          this.$message({
            type: "error",
            message: '异常'
          });
        });
    },
    // //搜索
    handleSeach() {
     // this.seachInitData();
    //    console.log(this.seachData);

        //! 重置page：
        this.listQuery.page = 1;
        let sobj = filterSearchKey(this.listQuery);


      this.getAllUser(sobj);
    //  this.init();

    },


      getList() {

          this.getAllUser(filterSearchKey(this.listQuery));

          // this.listLoading = true
          //
          // fetchList(this.listQuery).then(response => {
          //
          //     this.list = response.data.items
          //
          //     this.total = response.data.total
          //
          //
          //
          //     // Just to simulate the time of the request
          //
          //     setTimeout(() => {
          //
          //         this.listLoading = false
          //
          //     }, 1.5 * 1000)
          //
          // })

      },

    //导出
    handleDownload() {},
    //导入
    handleExport() {},
    //编辑or新增
    handleClickUpdateData(row, action) {
      this.formaction = action;
      //if (!this.openForm && row.id)
        if (action == 'add')
      {
          //! 新增
        row = this.tempdefault;
      }
      else{
          row =   cloneobj(row);  //! 防止编辑未保存，造成污染
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
      this.$confirm("此操作将永久删除该账户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http
            .post("/api/admin/userdelete", { id: row.id })
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
                message: '异常'
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
      filterUserUpdate(temp){
        let objret = {};
        let oa = this.formaction;

        if (oa != 'setpwd'){
            objret.role = temp.role;
            console.log(temp);
            if (temp.role < 50 && temp.role>0  && temp.roleold){
                objret.role = temp.roleold;  //! 赋值原账户 原role信息
            }
            objret.name = temp.name;
        }
        if (oa != 'add'){
            objret.id = temp.id;
        }
        else{
            //! 赋值账户
            objret.account = temp.account;
        }
        if (oa != 'edit'){
            //! 非编辑
            objret.password = temp.password;
        }


        return objret;
      },
    Add(data) {
      let json = {};
      json.data = [];
      if (data) {
        json.data = data;
      } else {

        json.data[0] = this.filterUserUpdate(this.temp);
      }
      if (!json.data.length){
          return;
      }
      let dopost = ()=>{
          this.$http
              .post("/api/admin/useradd", json)
              .then(res => {
                  if (res.data.code == 0) {
                      //    this.getAllUser();
                      this.getList();  //！ 这里只是简单刷新当前页， 不处理搜索等情况
                      this.dialogFormVisible = false;
                      this.$message({
                          type: "success",
                          message: this.openFormStateText + "成功"
                      });
                      // this.init();
                  } else {
                      showErrMsg(this, res.data.msg)
                      // this.$message({
                      //     type: "error",
                      //     message: res.data.msg
                      // });
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
      let tips = '';
      if (json.data[0].role == 0){
          tips = "此操作将禁用账户, 是否继续?"
      }
      else{
          if (json.data[0].role == 100){
              tips = '此操作将设置为管理员，拥有最高权限，是否继续?'
          }
      }
      if (tips.length > 0){
          this.$confirm(tips, "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
          }).then(()=>{
              dopost();
          })
      }
      else{
          dopost();
      }

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
