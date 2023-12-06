const vueDefaultConfig = {
    publicPath: '/',
    outputDir: 'dist',
    assetsDir: 'static',
    lintOnSave: true,
    transpileDependencies: ['vue-echarts', 'resize-detector'],
    //webpack 配置的项目名称
    title: 'Affiliate MAQ',
    titleSeparator: ' - ',
    titleReverse: false,
    devPort: '9998',
    abbreviation: 'MG**',
    providePlugin: {},
    build7z: false,
    showTipsMenu:['Member','Member List','Deposit Management','Online Deposit'],
    startMessage:'Welcome to Affiliate'
}

module.exports = vueDefaultConfig
