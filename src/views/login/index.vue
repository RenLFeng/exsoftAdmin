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
            <el-form-item label="用户名" prop="username">
              <el-input v-model="ruleForm2.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input type="password" v-model="ruleForm2.password" autocomplete="off"></el-input>
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
        callback(new Error("请输入用户名"));
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
        password: [{ validator: validatePass, trigger: "blur" }],
        username: [{ validator: validateName, trigger: "blur" }]
      }
    };
  },
  computed: {},
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
              console.log("成功", res);
              this.$store.commit("SETLOGINUSER", res.data.data);
              this.$store.commit("COMMIT_TOKEN", res.data.data.id);
              this.$router.push({
                path: "/"
              });
            })
            .catch(res => {
              console.log("失败", res);
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

