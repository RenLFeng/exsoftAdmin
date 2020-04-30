let path = require('path');


const CompressionWebpackPlugin = require('compression-webpack-plugin');

const productionGzipExtensions = ['js', 'css'];

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
    configureWebpack: config => {
        if (isProduction) {

            config.plugins.push(new CompressionWebpackPlugin({

                algorithm: 'gzip',

                test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),

                threshold: 10240,

                minRatio: 0.8

            }))

        }

    },
  devServer: {
    port: 8088,
    // proxy: {
    //   '/api': {
    //     target:process.env.VUE_APP_HOST,
    //     pathRewrite: { '^/api': '' },
    //     changeOrigin: true
    //   }
    // }
  //  proxy: 'http://192.168.0.2:9982'
     proxy:'https://www2.exsoft.com.cn'
      //  proxy: 'http://localhost:9982'
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