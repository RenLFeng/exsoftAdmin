<template>
  <div class="Class-Statistics-header">
    <header class="header-nav">
      <div class="container">
        <div class="nav-menu clearfix">
          <ul class="nav navbar-nav" id="logo">
            <li>
              <a href="javascript:void(0)" style="display: inline-block;">
                <img src="../../../assets/img/EXSOFT LOGO.png" alt />
              </a>
            </li>
          </ul>
          <button
            class="navbar-toggle"
            data-toggle="collapse"
            data-target=".navbar-collapse"
            style="height:auto"
          >
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <div class="navbar-collapse collapse navbar-right">
            <ul class="nav navbar-nav fontsize-sm">
              <li class>
                <router-link :to="{path:'/ClassStatistics',query:{}}" active-class="_active">
                  <span class>首页</span>
                </router-link>
              </li>
              <li class>
                <router-link :to="{path:'/Rereport',query:{}}" active-class="_active">
                  <span class>资源报告</span>
                </router-link>
              </li>
              <li class>
                <router-link :to="{path:'/Actreport',query:{}}" active-class="_active">
                  <span class>活动报告</span>
                </router-link>
              </li>
              <li class>
                <router-link :to="{path:'/Analysis',query:{}}" active-class="_active">
                  <span class>学情分析</span>
                </router-link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  </div>
</template>

<script>
export default {
  name: "",
  props: {
    info: {
      default() {
        return {};
      }
    }
  },
  data() {
    return {};
  },

  computed: {},
  mounted() {},
  methods: {}
};
</script>

<style lang='scss' scoped>
.Class-Statistics-header {
  .header-nav {
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.1);
  }
  header {
    a {
      color: #000;
    }
  }
  .navbar-toggle {
    border: 1px solid #0089ff;
  }
  .navbar-toggle .icon-bar {
    background: #0089ff;
  }
  ._active {
    color: #0089ff;
  }
}
</style>
