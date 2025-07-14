# (captcha-web-sdk)

# ([TIANAI-CAPTCHA)](https://gitee.com/tianai/tianai-captcha)验证码前端 SDK

| 条目     |                                                                                 |
| -------- | ------------------------------------------------------------------------------- |
| 兼容性   | Chrome、Firefox、Safari、Opera、主流手机浏览器、iOS 及 Android 上的内嵌 Webview |
| 框架支持 | H5、Angular、React、Vue2、Vue3                                                  |

## 安装

1. 执行打包命令

   ```
    npm run buildprod
   ```

2. 将打包好的`tac`目录放到自己项目中,如果是 vue、react 等框架，将 tac 目录放到 public 目录中、或者放到某个可以访问到地方
   ，比如 oss 之类的可以被浏览器访问到的地方 （tac 下载地址
   [https://gitee.com/tianai/tianai-captcha-web-sdk/releases/tag/1.2](https://gitee.com/tianai/tianai-captcha-web-sdk/releases/tag/1.2)）

3. 引入初始化函数 (load.js 下载地址
   [https://minio.tianai.cloud/public/static/captcha/js/load.min.js](https://minio.tianai.cloud/public/static/captcha/js/load.min.js))
   可自己将 load.js 下载到本地

   ```html
   <script src="load.min.js"></script>
   ```

   **注: 如果是 web 框架，将该引入代码放到 `public/index.html`**

## 使用方法

2. 创建一个 div 块用于渲染验证码， 该 div 用于装载验证码

   ```html
   <div id="captcha-box"></div>
   ```

3. 在需要调用验证码的时候执行加载验证码方法

   ```js
   function login() {
       // config 对象为TAC验证码的一些配置和验证的回调
       const config = {
           // 生成接口 (必选项,必须配置, 要符合tianai-captcha默认验证码生成接口规范)
           requestCaptchaDataUrl: "/gen",
           // 验证接口 (必选项,必须配置, 要符合tianai-captcha默认验证码校验接口规范)
           validCaptchaUrl: "/check",
           // 验证码绑定的div块 (必选项,必须配置)
           bindEl: "#captcha-box",
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
       // 一些样式配置， 可不传
       let style = {
           logoUrl: null;// 去除logo
           // logoUrl: "/xx/xx/xxx.png" // 替换成自定义的logo
       }
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

### 对滑块的按钮和背景设置为自定义的一些样式

```js
// 这里分享一些作者自己调的样式供参考
const style = {
  // 按钮样式
  btnUrl: "https://minio.tianai.cloud/public/captcha-btn/btn3.png",
  // 背景样式
  bgUrl: "https://minio.tianai.cloud/public/captcha-btn/btn3-bg.jpg",
  // logo地址
  logoUrl: "https://minio.tianai.cloud/public/static/captcha/images/logo.png",
  // 滑动边框样式
  moveTrackMaskBgColor: "#f7b645",
  moveTrackMaskBorderColor: "#ef9c0d"
};
window
  .initTAC("./tac", config, style)
  .then((tac) => {
    tac.init(); // 调用init则显示验证码
  })
  .catch((e) => {
    console.log("初始化tac失败", e);
  });
```
