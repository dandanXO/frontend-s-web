
# ([TIANAI-CAPTCHA)](https://gitee.com/tianai/tianai-captcha)验证码前端 SDK



## 安装

1. 执行打包命令

   ```
    npm run buildprod
   ```
    会产生 /dist 目录，`dist/tac`就是打包完成的 SDK
2. 将打包好的`tac`目录放到自己项目的`public`或是其他能够访问的路径中
   ，比如 oss 之类的可以被浏览器访问到的地方

3. 引入初始化函数 (load.js 下载地址
   [https://minio.tianai.cloud/public/static/captcha/js/load.min.js](https://minio.tianai.cloud/public/static/captcha/js/load.min.js))
   可自己将 load.js 下载到本地

   ```html
   <script src="load.min.js"></script>
   ```

   **注: 请将该引入代码放到`index.html`**

## 使用方法

2. 创建一个 div 块用于渲染验证码， 该 div 用于装载验证码

   ```html
   <div id="captcha-box"></div>
   ```
3. 配置 SDK 设定项
    ```js
    // config 设定项
    const config = {
        // 生成接口 (必选项,必须配置, 要符合tianai-captcha默认验证码生成接口规范)
        requestCaptchaDataUrl: "/gen",
        // 验证接口 (必选项,必须配置, 要符合tianai-captcha默认验证码校验接口规范)
        validCaptchaUrl: "/check",
        // 验证码绑定的div块 (必选项,必须配置)
        bindEl: "#captcha-box",
        // 翻译函数，当验证接口 code !== 0 调用，参数为验证接口返回的 code
        translate: (code) => {
            return t(`error.${code}`);
        },
        // 验证成功回调函数(必选项,必须配置)
        validSuccess: (res, c, tac) => {
            // 销毁验证码服务
            tac.destroyWindow();
            console.log("验证成功，后端返回的数据为", res);
        // 调用具体的login方法
            login(res.data.token)
        },
        // 验证失败的回调函数(可忽略，如果不自定义 validFail 方法时，会使用默认的)
        validFail: (res, c, tac) => {
            console.log("验证码验证失败回调...")
            // 验证失败后重新拉取验证码
            tac.reloadCaptcha();
        },
        // 刷新按钮回调事件
        btnRefreshFun: (el, tac) => {
            console.log("刷新按钮触发事件...")
            tac.reloadCaptcha();
        },
        // 关闭按钮回调事件
        btnCloseFun: (el, tac) => {
            console.log("关闭按钮触发事件...")
            tac.destroyWindow();
        }
    }


    // style 设定项
    const style = {
        // 按钮样式
        btnUrl: "https://minio.tianai.cloud/public/captcha-btn/btn3.png",
        // 背景样式
        bgUrl: "https://minio.tianai.cloud/public/captcha-btn/btn3-bg.jpg",
        // logo地址
        logoUrl: "https://minio.tianai.cloud/public/static/captcha/images/logo.png",
        // 滑动边框样式
        moveTrackMaskBgColor: "#f7b645",
        moveTrackMaskBorderColor: "#ef9c0d",
        // 多语系文本
        i18n: {
            tips_error: '验证失败，请重新尝试!', // 验证失败时的文本
            tips_success: '验证成功,耗时{s}秒', // 验证成功时的文本，{s} 会替换为实际秒数
            slider_title: '拖动滑块完成拼图' // 滑块验证的标题
            // 其他验证类型的标题
            concat_title: '拖动滑块完成拼图'
            image_click_title: '请依次点击'
            rotate_title: '拖动滑块完成拼图'
        }
    };
    ```


4. 在需要调用验证码的时候执行加载验证码方法

   ```js
   function login() {
       // 参数1 为 tac文件是目录地址， 目录里包含 tac的js和css等文件
       // 参数2 为 tac验证码相关配置
       // 参数3 为 tac窗口一些样式配置
       window.initTAC("./tac", config, style).then(tac => {
           tac.init(); // 调用init则显示验证码
       }).catch(e => {
           console.log("初始化tac失败", e);
       })
   }
   ```
