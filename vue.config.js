//const { config } = require("vue/types/umd");

module.exports = {
    chainWebpack: config => {
        // 发布模式
        config.when(process.env.NODE_ENV === 'production', config => {
            config.entry('app').clear().add('./src/main-prod.js')

            config.set('externals', {
                vue: 'Vue',
                'vue-router': 'VueRouter',
                axios: 'axios',
                lodash: '_',
                echarts: 'echarts',
                nprogress: 'NProgress',
                'vue-quill-editor': 'VueQuillEditor'
            })
        })

        // 开发模式
        config.when(process.env.NODE_ENV === 'development', config => {
            config.entry('app').clear().add('./src/main-dev.js')

        })
    },
    devServer: {
        proxy: {
            '/api': {
                target: 'http://localhost',
                changeOrigin: true
            }
        }
    },
    pluginOptions: {
        lintStyleOnBuild: true, // 添加了插件(@ascendancyy/vue-cli-plugin-stylelint), 所以需要配置
        stylelint: {
            fix: true, // boolean (default: true)
            files:['src/**/*.{vue,css,sss,less,scss}']// ['src/**/*.vue', 'src/assets/styles/*.l?(e|c)ss'] // string | [string] (default: ['src/**/*.{vue,htm,html,css,sss,less,scss}'])
            // formatter: () => { } // function (default: require('stylelint-codeframe-formatter'))
            // etc...
        }
    },
    outputDir: process.env.outputDir,
    lintOnSave: false
}
