<template>
  <div class="head-container clearfix">
    <div class="header-left">
      <showAside :toggle-click="toggleClick" />
    </div>
    <div class="header-right">
      <div class="header-user-con fontsize-md">
        <div style="margin-right:20px">{{time}}</div>
        <!-- 全屏显示 -->
        <!-- <div class="btn-fullscreen" @click="handleFullScreen">
          <el-tooltip effect="dark" :content="fullscreen?`取消全屏`:`全屏`" placement="bottom">
            <i class="el-icon-rank"></i>
          </el-tooltip>
        </div>-->
        <!-- 消息中心 -->
        <!-- <div class="btn-bell">
          <el-tooltip effect="dark" :content="message?`有${message}条未读消息`:`消息中心`" placement="bottom">
            <router-link to="/tabs">
              <i class="el-icon-bell"></i>
            </router-link>
          </el-tooltip>
          <span class="btn-bell-badge" v-if="message"></span>
        </div>-->
        <!-- 用户名下拉菜单 -->
        <el-dropdown class="avatar-container fontsize-md" trigger="click">
          <div class="avatar-wrapper">
            <img :src="loginUser.avatar" class="user-avatar" :onerror="$defaultImg('account')" />
            {{loginUser.name}}
            <!-- <i class="el-icon-caret-bottom" /> -->
          </div>
          <el-dropdown-menu slot="dropdown" class="user-dropdown">
            <router-link class="inlineBlock" to="/">
              <el-dropdown-item>首页</el-dropdown-item>
            </router-link>
            <el-dropdown-item @click.native="settings">个人设置</el-dropdown-item>
            <el-dropdown-item divided>
              <span style="display:block;" @click="logout">退出登陆</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <el-dialog title :visible.sync="setPwdDialog" width="30%" center>
      <p style>修改密码</p>
      <el-form
        ref="dataForm"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left:50px;"
      >
        <div>
          <el-form-item label="原密码:">
            <el-input type="password" placeholder="请输入原始密码" v-model="ovlPwd"></el-input>
          </el-form-item>
          <el-form-item label="新密码:">
            <el-input type="password" placeholder="请输入新密码" v-model="nvlPwd"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cance">取 消</el-button>
        <el-button type="primary" @click="subSetPwd" :loading="isSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import cookie from "js-cookie";
import showAside from "@/components/showAside.vue";
import { mapState } from "vuex";
import { nowDate } from "../../../util";
export default {
  // name:'header',
  components: {
    showAside
  },
  data() {
    return {
      setPwdDialog: false,
      fullscreen: false,
      name: "linxin",
      message: 2,
      username: "zyh",
      isSubmit: false,
      ovlPwd: "",
      nvlPwd: ""
    };
  },
  computed: {
    time() {
      return nowDate();
    },
    isCollapse: {
      get: function() {
        return this.$store.state.isCollapse;
      },
      set: function(newValue) {
        console.log(newValue);
        this.$store.commit("IS_COLLAPSE", newValue);
      }
    },
    ...mapState(["loginUser"])
  },
  methods: {
    settings() {
      this.setPwdDialog = true;
    },
    subSetPwd() {
      if (!this.ovlPwd) {
        this.$message({
          type: "error",
          message: "请输入原始密码"
        });
        return;
      }
      if (!this.nvlPwd) {
        this.$message({
          type: "error",
          message: "请输入新密码"
        });
        return;
      }
      this.isSubmit = true;
      this.$http
        .post(" /api/admin/usersetpwd", {
          id: this.loginUser.id,
          newpwd: this.nvlPwd,
          oldpwd: this.ovlPwd
        })
        .then(res => {
          if (res.data.code == 0) {
            this.$message({
              type: "success",
              message: "修改成功，请重新登陆"
            });
            this.cance();
              this.$store.commit("SETLOGINUSER", {});
              this.$store.commit("COMMIT_TOKEN", null);
              this.$router.push("/login");
          } else {
              let tipmsgs = '修改失败：'+res.data.msg;
            this.$message({
              type: "info",
              message:tipmsgs
            });
          }
          this.isSubmit = false;
        })
        .catch(res => {
          this.$message({
            type: "error",
            message: "服务异常，请稍后再试"
          });
          this.isSubmit = false;
          this.cance();
        });
    },
    cance() {
      this.nvlPwd='';
      this.ovlPwd='';
      this.setPwdDialog = false;
    },
    toggleClick() {
      this.isCollapse = !this.isCollapse;
    },
    // 用户名下拉菜单选择事件
    logout() {
      this.$http.post("/api/api/logout").then(() => {
        //! 清空本地账户信息
        this.$store.commit("SETLOGINUSER", {});
        this.$store.commit("COMMIT_TOKEN", null);
        this.$router.push("/login");
      });
    },
    // 全屏事件
    handleFullScreen() {
      let element = document.documentElement;
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen();
        }
      }
      this.fullscreen = !this.fullscreen;
    }
  }
};
</script>
<style lang="scss" scoped>
.head-container {
  height: 50px;
  line-height: 50px;
  -webkit-box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12),
    0 0 3px 0 rgba(0, 0, 0, 0.04);
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
  border-bottom: 1px solid #f0f0f0;
}
.header-left {
  float: left;
}
.header-right {
  float: right;
  padding-right: 50px;
}
.header-user-con {
  display: flex;
  height: 50px;
  align-items: center;
}
.btn-fullscreen {
  transform: rotate(45deg);
  margin-right: 5px;
  font-size: 24px;
}

.btn-fullscreen {
  position: relative;
  width: 30px;
  height: 30px;
  text-align: center;
  border-radius: 15px;
  cursor: pointer;
  margin-bottom: 10px;
}
.btn-bell {
  position: relative;
  width: 30px;
  height: 30px;
  text-align: center;
  border-radius: 15px;
  cursor: pointer;
  font-size: 24px;
  margin-right: 20px;
  margin-bottom: 15px;
}
.btn-bell-badge {
  position: absolute;
  right: 0;
  top: 8px;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background: #f56c6c;
}
.btn-bell .el-icon-bell {
  color: #666;
}
.user-name {
  margin-left: 10px;
}
.user-avator {
  margin-left: 20px;
}
.user-avator img {
  display: block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.el-dropdown-link {
  color: #fff;
  cursor: pointer;
}
.el-dropdown-menu__item {
  text-align: center;
}
.avatar-container {
  height: 50px;
  display: inline-block;
  // position: absolute;
  // right: 35px;
  .avatar-wrapper {
    cursor: pointer;
    margin-top: 5px;
    position: relative;
    line-height: initial;
    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 10px;
    }
    .el-icon-caret-bottom {
      position: absolute;
      right: -20px;
      top: 25px;
      font-size: 12px;
    }
  }
}
</style>


