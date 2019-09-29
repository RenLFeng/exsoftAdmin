<template>
  <div class="allBanke-container">
    <div class="search-content filter-container">
      <ExportData
        :isForBidden="ExportDataState"
        :tHeaderFather="tHead"
        :filterArrayLists="listData"
        :ExportFileName="ExportFileName"
      ></ExportData>
      <el-button
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleExport"
      >导入</el-button>
      <el-button class="filter-item" type="primary" @click="handleClickUpdateData(0)">添加</el-button>
      <el-button class="filter-item" @click="back()">返回</el-button>
    </div>
    <el-table :data="listData" border style="width: 100%" size="small">
      <el-table-column v-for="(v,i) in tHead" :prop="v.prop" :label="v.title" :key="i"></el-table-column>
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <el-button type="danger" @click="handleClickDeleteData(scope.row)" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- /// -->
    <el-dialog :title="openFormStateText" :visible.sync="dialogFormVisible" class="creater-form">
      <el-form
        :rules="rules"
        ref="dataForm"
        :model="banKe"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="班课成员:" prop="useraccount">
          <el-input v-model="banKe.useraccount" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <!-- <el-form-item label="班课名:" prop="teacher">
          <el-input v-model="banKe.account" placeholder="班课名"></el-input>
        </!-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="createData()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { roleType } from "@/common.js";
import createrUser from "./create";
import ExportData from "@/views/component/ExportData";
const tHead = [
  {
    fixed: "",
    prop: "id",
    title: "ID",
    width: ""
  },
  {
    fixed: "",
    prop: "memberuserid",
    title: "账户",
    width: ""
  },
  {
    fixed: "",
    prop: "classid",
    title: "姓名",
    width: ""
  }
];
export default {
  name: "",
  props: ["id"],
  components: {
    createrUser,
    ExportData
  },
  data() {
    return {
      listQuery: {
        name: "",
        order: "desc"
      },
      tHead: tHead,
      listData: [],
      downloadLoading: false,
      dialogFormVisible: false,
      banKe: {
        useraccount: "",
        classid: ""
      },
      roleType: roleType,
      openForm: 0,
      rules: {
        useraccount: [
          { required: true, message: "请输入账户名", trigger: "blur" }
        ]
        // teacher: [{ required: true, message: "请输入班课名", trigger: "blur" }]
      },
      ExportDataState: false,
      ExportFileName: "表格",
      tHead: tHead
    };
  },
  created() {
    this.getAllUser();
  },
  computed: {
    openFormStateText() {
      return this.openForm ? "编辑成员" : "新增成员";
    }
  },
  methods: {
    //获取所有用户数据
    getAllUser() {
      this.$http
        .post("/api/admin/bankememberquery", { classid: this.id })
        .then(res => {
          if (res.data.code == 0 && res.data.data.data.length) {
            this.listData = res.data.data.data;
            console.log(res);
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
    },
    //导入
    handleExport() {},
    //编辑or新增
    handleClickUpdateData(index) {
      this.openForm = index;
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
            .post("api/admin/bankememberdelete", { id: row.id })
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
          this.banKe.classid = this.id;
          let json = {};
          json.data = [];
          json.data[0] = this.banKe;
          this.$http
            .post("/api/admin/bankememberadd",json)
            .then(res => {
              if (res.data.code == 0) {
                console.log(res);
                this.$message({
                  type: "success",
                  message: res.data.msg
                });
                this.getAllUser();
                this.dialogFormVisible=false;
                this.init();
              } else {
                this.$message({
                  type: "error",
                  message: res.data.msg
                });
              }
            })
            .catch(res => {
              // this.$message({
              //   type: "error",
              //   message: res.data.msg
              // });
              // console.log("res");
            });
        }
      });
    },
    init() {
      banKe = {
        useraccount: "",
        classid: ""
      };
    },
    back() {
      let data = { row: "", state: true };
      this.$emit("bankeUser", data);
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
