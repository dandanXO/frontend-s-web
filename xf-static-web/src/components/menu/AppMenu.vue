<template>
    <div>
        
        <div class="platform-menu app">
            
          <div
              class="platform-box"
            >
                <img :src="require('../../assets/app/header_nav_app.png')" style="width: 205px;">
          </div>
          <div>
            <h3 class="header-menu-title">全站APP</h3>
            <div id="headerAllQrcode" class="download-img-container"><img src="../../assets/app/download.png" /></div>
            <p class="qrcode-scan-txt">扫一扫下载全站APP</p>
            <p class="qrcode-scan-support">支持IOS &amp; Android等全部移动设备</p>
            <a id="headerAllHref" href="https://xf9866.com?url=xf882.com&amp;agentCode=" class="download-url">xf9866.com</a>
        </div>
        </div>
    </div>
</template>
<style scoped lang="scss">
    .download-img-container {
        padding: 5px 5px 0;
        background: #ffffff;
        width: 100px;
        margin: 0 auto;
        img {
            width: 100%;
        }
    }
    .platform-menu.app {
        .header-menu-title {
                color: #d4e2fa;
                font-size: 1.5rem;
    margin-bottom: 9px;
        }
        .qrcode-scan-txt { 
            
    color: #5a758e;
    margin-top: 12px;
        }
        .qrcode-scan-support {
            
    color: #666;
    margin: 6px 0 3px;
        }
        .download-url {
            
    width: 190px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
    font-size: 18px;
    color: #3b9be5;
    text-decoration: none;
        }
    }
</style>