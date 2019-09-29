let path=require('path');
module.exports = {
  outputDir: 'dist',
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
    devServer: {
        proxy: 'http://192.168.0.2:81'
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