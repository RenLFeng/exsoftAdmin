let path = require('path');
module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  devServer: {
    port: 8088,
    // proxy: {
    //   '/api': {
    //     target:process.env.VUE_APP_HOST,
    //     pathRewrite: { '^/api': '' },
    //     changeOrigin: true
    //   }
    // }
   //proxy: 'http://192.168.0.2:9982'
       proxy: 'http://localhost:9982'
  },
  //定义scss全局变量
  css: {
    loaderOptions: {
      sass: {
        data: `@import "@/assets/scss/global.scss";`
      }
    }
  }
}