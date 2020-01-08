<template>
  <div class="aside">
    <el-menu
      :default-active="onRoutes"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      background-color="#304156"
      text-color="#bfcbd9"
      :collapse="isCollapse"
      active-text-color="#409EFF"
      :unique-opened="true"
      router
    >
      <template v-for="item in items">
        <template v-if="item.subs">
          <el-submenu :index="item.index" :key="item.index">
            <template slot="title">
              <i :class="'iconfont ' +item.icon"></i>
              <span slot="title">{{ item.title }}</span>
            </template>
            <template v-for="subItem in item.subs">
              <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                <template slot="title">{{ subItem.title }}</template>
                <el-menu-item
                  v-for="(threeItem,i) in subItem.subs"
                  :key="i"
                  :index="threeItem.index"
                >{{ threeItem.title }}</el-menu-item>
              </el-submenu>
              <el-menu-item v-else :index="subItem.index" :key="subItem.index">{{ subItem.title }}</el-menu-item>
            </template>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.index" :key="item.index">
            <i :class="'iconfont ' +item.icon"></i>
            <span slot="title">{{ item.title }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  data() {
      let curu = this.$store.state.loginUser;

      //console.log(curu);

      let items = [];
      items.push({
          icon: "iconshouye",
          index: "home",
          title: "系统首页"
      });
      items.push({
          icon: "exappfont exappshujutongji",
          index: "Statistics",
          title: "学情统计"
      });
      if (curu.role == 100){
          items.push({
              icon: "iconyonghu",
              index: "users",
              title: "账户管理",
              subs: [
                  {
                      index: "allUser",
                      title: "所有账户"
                  }
              ]
          });
      }
      items.push({
          icon: "iconbianzu",
          index: "school",
          title: "学校管理",
          subs: [
              {
                  index: "allSchool",
                  title: "所有学校"
              }
          ]
      });
      if (curu.role == 50){
          //! 校管理员
          items.push({
              icon: "iconyonghu",
              index: "schoolusers",
              title: "用户管理",
              subs: [
                  {
                      index: "allSchoolUser",
                      title: "所有用户"
                  }
              ]
          });
      }
      items.push( {
          icon: "iconbianzu",
          index: "banke",
          title: "班课管理",
          subs: [
              {
                  index: "allBanke",
                  title: "所有班课"
              }
          ]
      });
      items.push({
          icon: "iconzhuanyeziyuanku",
          index: "zuoye",
          title: "作业管理",
          subs: [
              {
                  index: "allZuoye",
                  title: "所有作业"
              }
          ]
      });
      if (curu.role == 100){
          items.push({
              icon: "iconxiaoxi",
              index: "comment",
              title: "评论管理",
              subs: [
                  {
                      index: "allComment",
                      title: "所有评论"
                  },
                  {
                      index: "allAnswer",
                      title: "所有回复"
                  }
              ]
          });
      }

      return {
          items: items
      };
  },
  computed: {
    onRoutes() {
      console.log(this.$route.path.replace("/", ""));
      return this.$route.path.replace("/", "");
    },
    ...mapState(["isCollapse", "loginUser"])
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  }
};
</script>
<style lang="scss" scoped>
.aside {
  -webkit-transition: width 0.28s;
  transition: width 0.28s;
  height: 100%;
  position: fixed;
  font-size: 0px;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 1001;
  overflow: hidden;
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 180px;
    height: 100%;
    text-align: left;
  }
  .el-menu--collapse {
    height: 100%;
  }
}
.iconfont {
  font-size: 20px;
  margin-right: 5px;
}
</style>
