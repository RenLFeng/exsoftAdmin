<template>
  <div class="login-container">
    <div class="login-form">
      <el-row :gutter="20">
        <el-col :lg="6" :sm="10" class="aa">
          <h3>后台管理系统</h3>
          <el-form
            :model="ruleForm2"
            status-icon
            :rules="rules2"
            ref="ruleForm2"
            label-width="100px"
            class="login-ruleForm"
          >
            <el-form-item label="姓名" prop="username">
              <el-input v-model="ruleForm2.username" @keyup.enter.native="submitForm('ruleForm2')"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input
                type="password"
                v-model="ruleForm2.password"
                autocomplete="off"
                @keyup.enter.native="submitForm('ruleForm2')"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('ruleForm2')">登录</el-button>
              <el-button @click="resetForm('ruleForm2')">重置</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import { messages } from "@/assets/js/common.js";
import wx from "weixin-js-sdk";
export default {
  name: "login",
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm2.checkPass !== "") {
          this.$refs.ruleForm2.validateField("checkPass");
        }
        callback();
      }
    };
    var validateName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入昵称"));
      } else {
        callback();
      }
    };
    return {
      ruleForm2: {
        password: "",
        username: ""
      },
      rules2: {
        username: [{ validator: validateName, trigger: "blur" }]
      }
    };
  },
  computed: {},
  mounted() {},
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$http
            .post("/api/api/login", {
              account: this.ruleForm2.username,
              password: this.ruleForm2.password
            })
            .then(res => {
              if (res.data.code == "0") {
                if (res.data.data.role >= 50) {
                  console.log("成功", res);
                  this.$store.commit("SETLOGINUSER", res.data.data);
                  this.$store.commit("COMMIT_TOKEN", res.data.data.id);
                  this.$router.push({
                    path: "/"
                  });
                } else {
                  this.$message({
                    type: "error",
                    message: "抱歉，当前账号未授权登录，请联系您的管理员"
                  });
                }
              } else {
                this.$message({
                  type: "info",
                  message: "登录失败:"+res.data.msg
                });
              }
            })
            .catch(res => {
              this.$message({
                type: "error",
                message: "异常"
              });
            });
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>
<style lang="scss" scoped>
.login-container {
  background: #2d3a4b;
  width: 100%;
  height: 100%;
  position: fixed;
  display: table;
  .login-form {
    display: table-cell;
    vertical-align: middle;
    text-align: center;
    color: white;
    font-size: 18px;
    .aa {
      margin: auto;
      float: none;
    }
    h3 {
      line-height: 60px;
      margin-left: 100px;
    }
  }
}
</style>

