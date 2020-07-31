const path = require('path');
const debug = process.env.NODE_ENV !== 'production'

module.exports = {
    //基本路径
    baseUrl: './',
    //输出文件目录
    outputDir: 'backend',
    // eslint-loader 是否在保存的时候检查
    lintOnSave: true,
    //放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录。
    assetsDir: 'assets', // 静态资源目录 (js, css, img, fonts)
    //是否使用包含运行时编译器的 Vue 构建版本
    runtimeCompiler: false,
    //生产环境是否生成 sourceMap 文件，一般情况不建议打开
    productionSourceMap: false,
    devServer: {//反向代理
        proxy: {
            '/': {
                ws: false, // proxy websockets
              //  target: 'http://localhost:8081',
               target: 'http://192.168.1.105:8081/',//测试
                changeOrigin: true,
                pathRewrite: {
                    '^/': '/'   //需要rewrite重写的,
                },
                cookieDomainRewrite: {
                    '*': ''
                }
            }
        }
    },
    // webpack配置，值位对象时会合并配置，为方法时会改写配置
    configureWebpack: {
        resolve: {//设置别名
            alias: {
                '@': path.resolve(__dirname, './'),//设置路径别名
                '@src': path.resolve(__dirname, './src'),
                '@style': path.resolve(__dirname, './src/assets/css')
            }
        }
    }
}
