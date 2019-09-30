<template>
  <div class="alluser-container">
    <div class="search-content filter-container">
      <el-input
        v-model="listQuery.account"
        placeholder="账户名"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleSeach"
      />
      <el-input
        v-model="listQuery.name"
        placeholder="姓名"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleSeach"
      />
      <el-select v-model="listQuery.role" placeholder="角色类型" style="width: 200px;margin-right:5px;">
        <el-option v-for="v in roleType" :key="v.role" :label="v.label" :value="v.role"></el-option>
      </el-select>
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
      <ExportData
        :isForBidden="ExportDataState"
        :tHeaderFather="tHead"
        :filterArrayLists="allUserData"
        :ExportFileName="ExportFileName"
      ></ExportData>
      <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" />
      <el-button class="filter-item" type="primary" @click="handleClickUpdateData(temp,0)">新增</el-button>
    </div>
    <el-table :data="allUserData" border style="width: 100%" size="small">
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
          <el-button type="primary" @click="handleClickUpdateData(scope.row,1)" size="small">编辑</el-button>
          <el-button type="danger" @click="handleClickDeleteData(scope.row)" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
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
        <el-form-item label="账户名:" prop="account">
          <el-input v-model="temp.account" placeholder="请输入账户名"></el-input>
        </el-form-item>
        <el-form-item label="姓名:" prop="name">
          <el-input v-model="temp.name" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="角色:" prop="role">
          <el-select v-model="temp.role" placeholder="请选择">
            <el-option v-for="v in roleType" :key="v.role" :label="v.label" :value="v.role"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="密码:" prop="password">
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
import { filterKey } from "@/util";
import { userTableHead, userTableHead2, roleType } from "@/common";
import ExportData from "@/views/component/ExportData";
import UploadExcelComponent from "@/views/component/importExcel";
import { filter } from "@/common.js";
export default {
  name: "",
  components: {
    ExportData,
    UploadExcelComponent
  },
  data() {
    return {
      listQuery: {
        account: "",
        role: "",
        name: "",
        order: ""
      },
      userTableHead: userTableHead,
      allUserData: [],
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
      rules: {
        account: [{ required: true, message: "请输入账户名", trigger: "blur" }],
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        role: [
          { required: true, message: "请至少选择一个角色", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      },
      ExportDataState: false,
      ExportFileName: "表格",
      tHead: userTableHead2,
      seachData: {}
    };
  },
  created() {
    this.getAllUser({});
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
              json.account = v["账户名"];
            case "角色名":
              json.name = v["角色名"] || "";
            case "角色":
              json.role = this.seleceRole(v["角色"]);
            case "最后登录时间":
              json.createtime = v["最后登录时间"] || "";
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
        case "管理员":
          return 100;
      }
    },
    //获取所有用户数据
    getAllUser(data) {
      this.$http
        .post("/api/admin/userquery", data)
        .then(res => {
          if (res.data.code == 0) {
            console.log("userquery", res);
            this.allUserData = res.data.data.data;
            filter(this.allUserData);
            this.$message({
              type: "success",
              message: "获取用户数据成功"
            });
          } else {
            this.$message({
              type: "info",
              message: "获取用户数据失败"
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
    // //搜索
    handleSeach() {
      this.seachInitData();
      this.getAllUser(this.seachData);
      this.init();
      this.seachData = {};
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
      console.log(row);
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
            .post("api/admin/userdelete", { id: row.id })
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
    Add(data) {
      let json = {};
      json.data = [];
      if (data) {
        json.data = data;
      } else {
        json.data[0] = this.temp;
      }
      this.$http
        .post("/api/admin/useradd", json)
        .then(res => {
          if (res.data.code == 0) {
            this.getAllUser();
            this.dialogFormVisible = false;
            this.$message({
              type: "success",
              message: this.openFormStateText + "成功"
            });
            this.init();
          } else {
            let errMsg = res.data.data.errmsg.split(":")[2].split("entry")[1];
            this.$message({
              type: "error",
              message: data ? "导入失败" : this.openFormStateText + "失败"
            });
            this.$alert("<div><p>请查看是否重复账户</p><p>发现如一下问题:"+errMsg+"</p></div>", data ? "导入失败" : this.openFormStateText + "失败", {
              confirmButtonText: "确定",
              center: true,
               dangerouslyUseHTMLString: true
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
    },
    init() {
      this.temp = {
        role: "",
        account: "",
        name: "",
        password: ""
      };
      this.listQuery = {
        account: "",
        role: "",
        name: "",
        order: ""
      };
    },
    seachInitData() {
      if (this.listQuery.account) {
        this.seachData.account = this.listQuery.account;
      }
      if (this.listQuery.role) {
        this.seachData.role = this.listQuery.role;
      }
      if (this.listQuery.name) {
        this.seachData.name = this.listQuery.name;
      }
      if (this.listQuery.order) {
        this.seachData.order = this.listQuery.order;
      }
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
