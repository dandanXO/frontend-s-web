const vueDefaultConfig = {
    publicPath: '/',
    outputDir: 'dist',
    assetsDir: 'static',
    lintOnSave: true,
    transpileDependencies: ['vue-echarts', 'resize-detector'],
    //webpack 配置的项目名称
    title: 'TF88 MAQ',
    titleSeparator: ' - ',
    titleReverse: false,
    devPort: '9999',
    abbreviation: 'TF**',
    providePlugin: {},
    build7z: false,
    showTipsMenu:['Withdrawal Management', 'Withdrawal Process', 'Apply', 'Pay'],
    startMessage:'Welcome to TF88'
}

module.exports = vueDefaultConfig
