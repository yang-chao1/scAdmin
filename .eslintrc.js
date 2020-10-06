module.exports = {
    root: true,
    env: {
        node: true,
        es6: true
    },
    'extends': [
        'plugin:vue/strongly-recommended',

    ],
    plugins: [
        'html'
    ],
    rules: {
        'vue/max-attributes-per-line': 'off',//让html标签可以有多个属性
        "space-before-function-paren": 0,
        "no-undef": 0, //不允许未声明的变量
        'indent': [ 'error',4,],
        "no-multiple-empty-lines": [2, {"max": 2}], //空行最多不能超过两行
        "semi-spacing": [0, {"before": false, "after": true}], //分后前后空格
       // "space-before-function-paren": [1, {"anonymous": "always", "named": "always"}], //函数定义时括号前的空格
        "vue/html-self-closing": ["error", {
            "html": {
              "void": "always",
              "normal": "never",
              "component": "never"
            },
            "svg": "always",
            "math": "always"
          }],


    },
    parserOptions: {
        parser: 'babel-eslint'
    }

}
