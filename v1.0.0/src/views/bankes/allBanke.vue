<template>
  <div class="allBanke-container">
    <div class="search-content filter-container">
      <el-input
        v-model="listQuery.name"
        placeholder="班课名"
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
      <ExportData
        :isForBidden="ExportDataState"
        :tHeaderFather="tHead"
        :filterArrayLists="listData"
        :ExportFileName="ExportFileName"
      ></ExportData>
      <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" />
      <el-button class="filter-item" type="primary" @click="handleClickUpdateData(banKe,0)">新增</el-button>
    </div>
    <el-table :data="listData" border style="width: 100%" size="small">
      <el-table-column v-for="(v,i) in bankeTableHead" :prop="v.prop" :label="v.title" :key="i"></el-table-column>
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" @click="handleClickSee(scope.row)" size="small">查看成员</el-button>
          <el-button type="primary" @click="handleClickUpdateData(scope.row,1)" size="small">编辑</el-button>
          <el-button type="danger" @click="handleClickDeleteData(scope.row)" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
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
        <el-form-item label="班课名:" prop="name">
          <el-input v-model="banKe.name" placeholder="班课名"></el-input>
        </el-form-item>
        <el-form-item label="任课教师:" prop="useraccount">
          <el-input v-model="banKe.useraccount" placeholder="教师账户"></el-input>
        </el-form-item>
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
import { filterKey } from "@/util";
import { bankeTableHead, roleType } from "@/common.js";
import createrUser from "./create";
import ExportData from "@/views/component/ExportData";
import UploadExcelComponent from "@/views/component/importExcel";
export default {
  name: "",
  components: {
    createrUser,
    ExportData,
    UploadExcelComponent
  },
  data() {
    return {
      tableData: [],
      tableHeader: [],

      listQuery: {
        name: "",
        order: ""
      },
      bankeTableHead: bankeTableHead,
      listData: [],
      downloadLoading: false,
      dialogFormVisible: false,
      banKe: {
        name: "",
        useraccount: ""
      },
      roleType: roleType,
      openForm: 0,
      rules: {
        useraccount: [
          { required: true, message: "请输入教师名", trigger: "blur" }
        ],
        name: [{ required: true, message: "请输入班课名", trigger: "blur" }]
      },
      ExportDataState: false,
      ExportFileName: "表格",
      tHead: bankeTableHead
    };
  },
  created() {
    this.getAllUser({});
  },
  computed: {
    openFormStateText() {
      return this.openForm ? "编辑班课" : "新增班课";
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
        if (header[v] != this.bankeTableHead[v].title) {
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
            case "班课名":
              json.name = v["班课名"];
            // case "成员数":
            //   json.membernum = v["成员数"] || "";
            case "任课教师":
              json.useraccount = v["任课教师"] || "";
            // case "创建时间":
            //   json.usercreatetime = v["创建时间"] || "";
          }
        }
        serveData.push(json);
      }
      this.createData(serveData);
    },

    //获取所有班课
    getAllUser(data) {
      this.$http
        .post("/api/admin/bankequery", data)
        .then(res => {
          if (res.data.code == 0) {
            if (res.data.data.data.length) {
              this.listData = res.data.data.data;
              console.log(res);
              for (let v of res.data.data.users) {
                for (let i of this.listData) {
                  if (v.id == i.userid) {
                    i.teacher = v.name;
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
                message: "暂无数据"
              });
            }
          }
        })
        .catch(res => {
          console.log("res");
          this.$message({
            type: "error",
            message: "error"
          });
        });
    },
    //搜索
    handleSeach() {
      this.getAllUser(this.listQuery);
      this.listQuery = {
        name: "",
        order: ""
      };
    },
    //导入
    handleExport() {},
    //编辑or新增
    handleClickUpdateData(row, index) {
      this.openForm = index;
      if (!this.openForm && row.id) {
        row = {
          name: ""
        };
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
    //删除
    handleClickDeleteData(row) {
      console.log(row);
      this.$confirm("此操作将永久删除该信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http
            .post("api/admin/bankedelete", { id: row.id })
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
    init() {
      this.banKe = {
        name: "",
        useraccount: ""
      };
    },
    bankeAdd(data) {
      let json = {};
      json.data = [];
      if (data) {
        json.data = data;
      } else {
        json.data[0] = this.banKe;
      }
      this.$http
        .post("/api/admin/bankeadd", json)
        .then(res => {
          if (res.data.code == 0) {
            this.getAllUser({});
            this.dialogFormVisible = false;
            this.$message({
              type: "success",
              message: this.openFormStateText + "成功"
            });
            this.init();
          } else {
            if (res.data.data.errmsg.includes("1062")) {
              let errMsg = res.data.data.errmsg.split(":")[2].split("entry")[1];
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
