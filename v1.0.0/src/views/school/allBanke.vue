<template>
  <div class="allBanke-container">
    <div class="search-content filter-container" v-if="canopt">
      <el-input
        v-model="listQuery.name"
        placeholder="学校名"
        style="width: 200px;"
        class="filter-item"

      />
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
        :filterArrayLists="listData"
        :ExportFileName="ExportFileName"
      ></ExportData>
      <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" />
      <el-button class="filter-item" type="primary" @click="handleClickUpdateData(banKe,'add')">新增学校</el-button>
    </div>
    <el-table :data="listData" border style="width: 100%" size="small"
              v-loading="listLoading"
    >
      <el-table-column v-for="(v,i) in schoolTableHead" :prop="v.prop" :label="v.title" :key="i"></el-table-column>
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <div v-if="canopt">
            <el-button type="primary" @click="handleClickUpdateData(scope.row,'edit')" size="small">编辑</el-button>
            <el-button type="primary" @click="handleClickUpdateData(scope.row,'bind')" size="small" >更改校管理员</el-button>
            <el-button type="danger" @click="handleStates(scope.row)" size="small" v-if="scope.row.schoolstates > 0">禁用</el-button>
            <el-button type="primary" @click="handleStates(scope.row)" size="small" v-else>启用</el-button>
            <el-button type="danger" @click="handleClickDeleteData(scope.row)" size="small">删除</el-button>
          </div>
          <div v-else>
            <el-button type="primary" @click="handleClickUpdateData(scope.row,'edit')" size="small">编辑</el-button>
          </div>

        </template>
        <!--
        <template v-else slot-scope="scope">

        </template>-->
      </el-table-column>
    </el-table>



    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pagesize" @pagination="getList" />

    <!-- dialog -->
    <el-dialog :title="openFormStateText" :visible.sync="dialogFormVisible" class="creater-form">
      <el-form
        :rules="rules"
        ref="dataForm"
        :model="banKe"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left:50px;"
      >
        <div v-if="canopt">
          <el-form-item label="学校名:" prop="name" v-if="openForm != 'bind'">
            <el-input v-model="banKe.name" placeholder="学校名"></el-input>
          </el-form-item>
          <el-form-item label="学校名:" prop="name" v-else>
            {{banKe.name}}
          </el-form-item>
          <el-form-item label="状态：" v-if="openForm != 'add'">
            {{banKe.statesdesc}}
          </el-form-item>
          <el-form-item label="校管理员:" prop="useraccount" v-if="openForm != 'edit'">
            <el-input v-model="banKe.useraccount" placeholder="请输入校管理员账户"></el-input>
          </el-form-item>
          <el-form-item label="最大班课数：" prop="maxbankenum" v-if="openForm != 'bind'">
            <el-input v-model.number="banKe.maxbankenum"></el-input>
          </el-form-item>
          <el-form-item label="班课最大人数：" prop="maxbankemnum" v-if="openForm != 'bind'">
            <el-input v-model.number="banKe.maxbankemnum"></el-input>
          </el-form-item>
          <el-form-item label="教师班课数：" prop="maxbankeperuser" v-if="openForm != 'bind'">
            <el-input v-model.number="banKe.maxbankeperuser"></el-input>
          </el-form-item>
        </div>
        <div v-else>
          <el-form-item label="学校名:" prop="name" >
            {{banKe.name}}
          </el-form-item>
          <el-form-item label="状态：">
            {{banKe.statesdesc}}
          </el-form-item>
          <el-form-item label="最大班课数：" >
            {{banKe.maxbankenum}}
          </el-form-item>
          <el-form-item label="班课最大人数：" >
            {{banKe.maxbankemnum}}
          </el-form-item>
          <el-form-item label="教师班课数：" prop="maxbankeperuser" >
            <el-input v-model.number="banKe.maxbankeperuser"></el-input>
          </el-form-item>
        </div>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="createData()">确定</el-button>
      </div>
    </el-dialog>

    <!-- <div class="app-container">
      <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" />
      <el-table :data="tableData" border highlight-current-row style="width: 100%;margin-top:20px;">
        <el-table-column v-for="item of tableHeader" :key="item" :prop="item" :label="item" />
        <el-table-column v-if="tableData.length" label="操作" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" @click="handleClickSee(scope.row)" size="small">查看成员</el-button>
          <el-button type="primary" @click="handleClickUpdateData(scope.row,1)" size="small">编辑</el-button>
          <el-button type="danger" @click="handleClickDeleteData(scope.row)" size="small">删除</el-button>
        </template>
      </el-table-column>
      </el-table>
    </div>-->
  </div>
</template>

<script>
import { filterKey ,cloneobj, filterSearchKey} from "@/util";
import { schoolTableHead, roleType } from "@/common.js";
import createrUser from "./create";
import ExportData from "@/views/component/ExportData";
import UploadExcelComponent from "@/views/component/importExcel";
import {mapState} from 'vuex';
import Pagination from '@/components/Pagination'
export default {
  name: "",
  components: {
    createrUser,
    ExportData,
    UploadExcelComponent,
      Pagination
  },
  data() {
      var checkAccount = (rule, value, callback)=>{
          if (!value){
              return callback(new Error('账户名不能为空'));
          }
          this.$http
              .post('/api/admin/userquery',
                  {
                      accountmatch:value,
                      queryschoolbind:1
                  })
              .then(res=>{
                  if (res.data.code == 0){
                      let data = res.data.data.data;
                      console.log(data);
                      if (data && data.length > 0){
                          let ru = data[0];
                          if (ru.role == 50){
                              if (res.data.data.school ){
                                  callback(new Error('该账户已绑定到一个学校；目前暂只支持一个学校绑定'));
                              }
                              else{
                                  callback();
                              }

                          }
                          else{
                              callback(new Error('该账户不是校管理员'))
                          }
                      }
                      else{
                          callback(new Error('未找到该账户，请先新增账户'))
                      }

                  }
                  else{
                      callback(new Error('res.data.msg'));
                  }
              })
              .catch(res=>{
                   callback(new Error('异常'));
              })
      }
      let checkmrange = (stype, rule, value, callback)=>{

          if (stype == 'maxbankenum' || stype == 'maxbankeperuser'){
              if (value < 0 || value > 10000){
                  callback(new Error('范围必须在0-10000'));
              }
              else{
                  callback();
              }
          }
          if (stype == 'maxbankemnum'){
              if (value < 0 || value > 1000){
                  callback(new Error('范围必须在0-1000'));
              }
              else{
                  callback();
              }
          }
          callback();
      }
      let mvalidator = (rule, value, callback)=>{
          checkmrange('maxbankemnum', rule, value, callback);
      }
      let scdefault = {
          name:'',
          useraccount:'',
          maxbankenum:10,
          maxbankemnum:100,
          maxbankeperuser:2,
      }

    return {
      tableData: [],
      tableHeader: [],

      listQuery: {
        name: "",
        order: "",
          page:1,
          pagesize:50,
      },
        total:0,
        listLoading:false,
      schoolTableHead: schoolTableHead,
      listData: [],
      downloadLoading: false,
      dialogFormVisible: false,
        scdefault:scdefault,
      banKe: scdefault,
      roleType: roleType,
      openForm: 'add',  //! add edit bind
      rules: {
        useraccount: [
          { required: true, validator:checkAccount, trigger: "blur" }
        ],
        name: [{ required: true, message: "请输入学校名", trigger: "blur" }],
        maxbankenum:[{type:"number", message:'不是数字'}],
          maxbankeperuser:[{type:"number", message:'不是数字'}],
          maxbankemnum:[{type:"number", message:'不是数字'},{validator:mvalidator}],

      },
      ExportDataState: false,
      ExportFileName: "表格",
      tHead: schoolTableHead
    };
  },
  created() {
    //this.getAllUser({});
      this.getList();
  },
  computed: {
    openFormStateText() {
      //return this.openForm ? "编辑" : "新增";
        let o = this.openForm;
        if (o == 'add'){
            return '新增学校';
        }
        else if (o == 'edit'){
            return '编辑学校';
        }
        else if (o == 'bind'){
            return '更改校管理员';
        }
        return '';
    },
      canopt(){
       // console.log(this.loginUser);
          let curu = this.$store.state.loginUser;
         // console.log(curu);
        if (curu && curu.role == 100){
            return true;
        }
        return false;
      },
      ...mapState['loginUser']
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
        if (header[v] != this.schoolTableHead[v].title) {
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
            case "学校名":
              json.name = v[i];
            // case "成员数":
            //   json.membernum = v["成员数"] || "";
            case "校管理员":
              json.useraccount = v[i] || "";
            // case "创建时间":
            //   json.usercreatetime = v["创建时间"] || "";
          }
        }
        serveData.push(json);
      }
      this.createData(serveData);
    },

      getList(){
          this.getAllUser(filterSearchKey(this.listQuery));
      },

    //获取所有班课
    getAllUser(data) {
        this.listLoading = true;
        data.page = data.page-1;
      this.$http
        .post("/api/admin/schoolquery", data)
        .then(res => {
            this.listLoading  =false;
          if (res.data.code == 0) {
            //if (res.data.data.data.length)
            {
              this.listData = res.data.data.data;
              this.total = res.data.data.count;
              console.log(res);
              for (let v of res.data.data.users) {
                for (let i of this.listData) {
                    this.filterStates(i);
                  if (v.id == i.userid) {
                    i.useraccount = v.account;
                  }
                }
              }
              // console.log("userquery", this.listData);
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
            this.listLoading = false;
          console.log("res");
          this.$message({
            type: "error",
            message: "error"
          });
        });
    },
    //搜索
    handleSeach() {
        this.listQuery.page = 1;
      this.getAllUser(filterSearchKey(this.listQuery));
      // this.listQuery = {
      //   name: "",
      //   order: ""
      // };
    },
    //导入
    handleExport() {},
    //编辑or新增
    handleClickUpdateData(row, index) {
      this.openForm = index;
      if (this.openForm == 'add') {
        row = this.scdefault;
      }
      else{
          row = cloneobj(row);  //! 防止编辑（未保存）污染，这里使用clone数据
      }

      this.banKe = row;
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    //查看
    handleClickSee(row) {
      let data = { row: row, state: false };
      this.$emit("bankeUser", data);
    },
      filterStates(row){
        if (row.schoolstates > 0 ){
            row.statesdesc = '有效';
        }
        else{
            row.statesdesc = '被禁用';
        }

      },
    handleStates(row){
        let newstate = 0;
        if (row.schoolstates == 0){
            newstate = 10;
        }

        let tips = '';
        if (newstate == 0){
            tips = '是否禁用该学校？(禁用后，该学校不能新增班课；禁用不会影响现有班课)';
        }
        else{
            tips = '是否启用该学校？';
        }
        this.$confirm(tips, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
        })
            .then(()=>{
                this.$http.post('/api/admin/schooladd',
                    {
                        id:row.id,
                        schoolstates:newstate
                    })
                    .then((res)=>{
                        if (res.data.code == 0){
                            row.schoolstates = newstate;
                            this.filterStates(row);
                        }
                        else{
                            this.$message({
                                type: "error",
                                message: res.data.msg
                            });
                        }
                    })
                    .catch(()=>{
                        this.$message({
                            type: "error",
                            message: "异常"
                        });
                    })
            });


    },
    //删除
    handleClickDeleteData(row) {
      console.log(row);
      this.$confirm("学校没有对应的班课，才能被删除。 是否删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http
            .post("/api/admin/schooldelete", { id: row.id })
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
                message: "error"
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
        this.bankeAdd(data);
      } else {
        this.$refs["dataForm"].validate(valid => {
          if (valid) {
            this.bankeAdd();
          }
        });
      }
    },

      filterschool(item){
        let o = {


        }
        if (this.openForm != 'add'){
            //! 编辑
            o.id = item.id;
        }
        if (this.openForm != 'bind'){
            o.name = item.name;
        }
        if (this.openForm == 'add' || this.openForm == 'bind'){
            o.useraccount = item.useraccount;
        }


        return o;
      },
    bankeAdd(data) {
      let json = {};
      json.data = [];
      if (data) {
        json.data = data;
      } else {
          let uploadobj = this.filterschool(this.banKe);
          if (!this.canopt){
              //! 非admin， 提交字段受限制， 否则会失败
              uploadobj = {
                  id:this.banKe.id,
                  maxbankeperuser:this.banKe.maxbankeperuser,
              }
          }
        json.data[0] = uploadobj;

      }
      this.$http
        .post("/api/admin/schooladd", json)
        .then(res => {
          if (res.data.code == 0) {
          //  this.getAllUser({});
              this.getList();
            this.dialogFormVisible = false;
            this.$message({
              type: "success",
              message: this.openFormStateText + "成功"
            });
          } else {
              this.$message({
                  type: "error",
                  message: res.data.data.msg
              });

          }
        })
        .catch(res => {
            console.log(res);
          this.$message({
            type: "error",
            message: '异常'
          });

        });
    }
  }
};
</script>

<style lang="scss" scoped>
.allBanke-container {
}
</style>
<style>
.allBanke-container .creater-form .el-form-item__label {
  width: 115px !important;
  text-align: right;
}
.allBanke-container .creater-form .el-form-item__content {
  margin-left: 115px !important;
}
</style>
