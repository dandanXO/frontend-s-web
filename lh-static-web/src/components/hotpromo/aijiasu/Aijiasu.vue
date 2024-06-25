<template>
  <div class="bachground">
    <div class="backgroun-top">
      <img src="../../../assets/promo/aijiasu/background-top.png" alt="" />
    </div>
    <div class="backgroun-bottom">
      <img src="../../../assets/promo/aijiasu/background-bottom.png" alt="" />
    </div>
  </div>

  <div class="main">
    <div class="banner-info">
      <div class="black-bg"></div>
      <div class="title1">无法打开网址？</div>
      <div class="title2">来试试爱加速</div>
      <div class="title3">稳定方便快捷</div>
      <div class="title4">
        如果您无法访问本平台请使用爱加速VPN
        <span>首月赠送爱加速VIP会员</span>
      </div>
      <div class="info-box">
        <div class="qr-code-box">
          <div class="qr-code-item">
            <div class="qrcode"></div>
            <div class="qrcode-info">安卓手机扫码下载</div>
          </div>
          <div class="qr-code-item">
            <div class="qrcode"></div>
            <div class="qrcode-info">苹果手机扫码下载</div>
          </div>
        </div>
        <div class="info">
          <img src="../../../assets/promo/aijiasu/item-img.png" alt="" />
          <div class="item-text1">无需配置，一键连接</div>
          <div class="item-text2">请使用手机扫码</div>
        </div>
      </div>
    </div>
    <div class="content-box">
      <div class="session1">
        <img src="../../../assets/promo/aijiasu/title1.png" alt="" />
        <div class="content">
          长期活动，但凡在雷火电竞无法访问我们官网的会员，可以和在线客服索要IP域名先注册，注册后首存以及下载爱加速VPN，提供账号以及爱加速开通首月截图给客服，雷火电竞会为您报销此笔费用，联系在线客服办理即可。
        </div>
        <div class="download-content">
          <img src="../../../assets/promo/aijiasu/item-img.png" width="300" height="111.57" alt="" />
          <div class="download">
            <div class="icon">
              <img src="../../../assets/promo/aijiasu/download.png" alt="" />
            </div>
            <div class="info">
              <img src="../../../assets/promo/aijiasu/window-icon.png" alt="" />
              <div>Windows下载</div>
            </div>
          </div>
          <div class="download">
            <div class="icon"></div>
            <div class="info">
              <img src="../../../assets/promo/aijiasu/apple-icon.png" alt="" />
              <div>苹果手机下载</div>
            </div>
          </div>
          <div class="download">
            <div class="icon"></div>
            <div class="info">
              <img src="../../../assets/promo/aijiasu/android-icon.png" alt="" />
              <div>安卓手机下载</div>
            </div>
          </div>
        </div>
      </div>
      <div class="session2"></div>

      <div class="session3"></div>

      <div class="session4"></div>
    </div>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.bachground {
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: -2;
}

.main {
  height: 1600px;

  .banner-info {
    margin-left: 890px;
    margin-top: 80px;
    position: relative;
    .black-bg {
      width: 1096px;
      height: 486px;
      position: absolute;
      top: -80px;
      left: -200px;
      /* background: radial-gradient(ellipse closest-side, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0) 50%); */
      background: radial-gradient(
        ellipse closest-side at center center,
        rgba(0, 0, 0, 255) 0%,
        rgba(0, 0, 0, 0.7) 30%,
        rgba(0, 0, 0, 0.5) 70%,
        rgba(0, 0, 0, 0) 100%
      );
      border-radius: 50%;
      z-index: -1;
    }
  }
  .title1 {
    font-family: FZHanZhenGuangBiaoS-GB;
    background: linear-gradient(180deg, #ffffff 0%, #00a9f1 87.62%);
    background: -webkit- linear-gradient(180deg, #ffffff 0%, #00a9f1 87.62%);
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
    font-size: 80px;
    font-weight: 400;
    line-height: 96.56px;
    text-align: left;
    margin-bottom: 6px;
  }
  .title2,
  .title3 {
    font-family: FZHanZhenGuangBiaoS-GB;
    font-size: 80px;
    font-weight: 400;
    line-height: 96.56px;
    text-align: left;
    color: rgba(255, 255, 255, 1);
    margin-bottom: 6px;
  }

  .title4 {
    font-family: Microsoft YaHei UI;
    font-size: 32px;
    font-weight: 700;
    line-height: 40.64px;
    text-align: left;
    margin-top: 22px;
    color: rgba(255, 255, 255, 1);
    span {
      color: rgba(250, 255, 27, 1);
    }
  }
  .info-box {
    display: flex;
    align-items: center;
    margin-left: 16px;
    margin-top: 16px;
  }
  .qr-code-box {
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 398px;
    height: 224px;
    background: rgba(18, 0, 0, 0.6);
    border: 1px solid;
    border-image: linear-gradient(90deg, #ff7272 0%, #dee227 31%, #00ef0a 60%, #08ffff 97.5%) 1;
    margin-right: 36px;

    .qr-code-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      .qrcode {
        width: 149px;
        height: 149px;
        background-color: #fff;
      }
      .qrcode-info {
        font-family: Microsoft YaHei UI;
        font-size: 20px;
        font-weight: 700;
        line-height: 25.4px;
        text-align: left;
        color: rgba(255, 255, 255, 1);
        margin-top: 13px;
      }
    }
  }
  .info {
    .item-text1 {
      font-family: Microsoft YaHei UI;
      font-size: 32px;
      font-weight: 700;
      line-height: 40.64px;
      text-align: left;
      color: rgba(250, 255, 0, 1);
      margin-top: 16.46px;
      margin-bottom: 17px;
    }
    .item-text2 {
      font-family: Microsoft YaHei UI;
      font-size: 24px;
      font-weight: 700;
      line-height: 30.48px;
      text-align: left;
      color: rgba(255, 255, 255, 1);
    }
  }
  .content-box {
    width: 1200px;
    margin: 0 auto;
  }
  .session1 {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 22px;
    .content {
      height: 99px;
      display: flex;
      align-items: center;
      font-family: Microsoft YaHei UI;
      font-size: 20px;
      font-weight: 400;
      line-height: 25.4px;
      text-align: left;
      color: rgba(236, 230, 238, 1);
      background: linear-gradient(90deg, rgba(10, 1, 38, 0) 0%, #0a0126 50%, rgba(10, 1, 38, 0) 100%);
    }
    .download-content {
      display: flex;
      align-items: center;
      justify-content: space-around;
      width: 1000px;
      margin-top: 24px;
      .download {
        display: flex;
        flex-direction: column;
        align-items: center;
        .icon {
          width: 126px;
          height: 123px;
          border: 1px solid;
          border-image: linear-gradient(90deg, #ff7272 0%, #dee227 31%, #00ef0a 60%, #08ffff 97.5%) 1;
          background: rgba(18, 0, 0, 1);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .info {
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: Microsoft YaHei UI;
          font-size: 18px;
          font-weight: 700;
          line-height: 22.86px;
          text-align: left;
          color: rgba(255, 255, 255, 1);
          margin-top: 22px;
        }
      }
    }
  }
}
</style>
