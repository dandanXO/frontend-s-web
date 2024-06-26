<template>
  <div class="bachground">
    <div class="backgroun-top">
      <img src="../../../assets/promo/aijiasu/background-top.png" alt="" style="margin: 0px" />
    </div>
    <div class="backgroun-bottom">
      <img src="../../../assets/promo/aijiasu/background-bottom.png" alt="" style="margin: 0px" />
    </div>
  </div>
  <div class="main">
    <div class="banner-info">
      <div class="title1">无法打开网址？</div>
      <div class="title2">来试试爱加速 稳定 方便 快捷</div>
      <div class="title4">
        如果您无法访问本平台请使用爱加速VPN
        <span>首月赠送爱加速VIP会员</span>
      </div>
      <div class="info-box">
        <div class="qr-code-box">
          <div class="qr-code-item">
            <div class="qrcode"><qrcode-vue :value="value" size="124" level="H" /></div>
            <div class="qrcode-info">安卓手机扫码下载</div>
          </div>
          <div class="qr-code-item">
            <div class="qrcode">
              <div class="qrcode"><qrcode-vue :value="value" size="124" level="H" /></div>
            </div>
            <div class="qrcode-info">苹果手机扫码下载</div>
          </div>
        </div>
        <div class="info">
          <img src="../../../assets/promo/aijiasu/item-img.png" alt="" />
          <div class="item-text1">无需配置，一键连接</div>
          <div class="item-text2">长按图片扫码</div>
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
          <div class="download">
            <div class="icon">
              <div class="qrcode"><qrcode-vue :value="value" size="105" level="H" /></div>
            </div>
            <div class="info">
              <div class="top">
                <img src="../../../assets/promo/aijiasu/apple-icon.png" alt="" class="logo" />
                <div>苹果手机</div>
              </div>
              <div>长按二维码下载</div>
            </div>
          </div>
          <div class="download">
            <div class="icon">
              <div class="qrcode"><qrcode-vue :value="value" size="105" level="H" /></div>
            </div>
            <div class="info">
              <div class="top">
                <img src="../../../assets/promo/aijiasu/android-icon.png" alt="" class="logo" />
                <div>安卓手机</div>
              </div>
              <div>长按二维码下载</div>
            </div>
          </div>
        </div>
      </div>
      <div class="session3">
        <img src="../../../assets/promo/aijiasu/title3.png" alt="" />
        <div class="tabs">
          <div class="tab"><img src="../../../assets/promo/aijiasu/btn1.png" alt="" /></div>
          <div class="tab"><img src="../../../assets/promo/aijiasu/btn2.png" alt="" /></div>
        </div>
      </div>

      <div class="session2">
        <img src="../../../assets/promo/aijiasu/title2.png" alt="" />
        <div class="content">
          <img src="../../../assets/promo/aijiasu/session2-1.png" alt="" style="width: 80%" />
          <img src="../../../assets/promo/aijiasu/session2-2.png" alt="" style="width: 80%"/>
          <img src="../../../assets/promo/aijiasu/session2-3.png" alt="" style="width: 80%"/>
        </div>
      </div>
      <div class="session4">
        <img src="../../../assets/promo/aijiasu/title4.png" alt="" />

        <div class="content">
          <div>
            1.
            此活动需要在IP域名注册后的用户来申请，只限新用户，需要账号首存，提供有下载爱加速以及开通爱加速首月会员截图才可申请。
          </div>
          <div>2. 符合以上条件情况下联系在线客服即可申请，优惠以红包券一倍流水发放。</div>
          <div>
            3.
            如何使用优惠券：电脑版用户，点击会员中心-自助优惠-优惠券专区，选择您的优惠券使用即可。手机版用户，访问【我的】页面-自助优惠-优惠券专区，即可使用您的优惠券。 
          </div>
          <div>
            4. 此次优惠每位玩家﹑每户﹑每一住址
            、每一电子邮箱地址﹑每一电话号码﹑相同支付方式(相同借记卡/信用卡/银行账户/姓名及号码)
            只能享有一次优惠,一旦确认为套利玩家，立即没收盈利和本金。
          </div>
          <div>5. 雷火电竞对本次活动拥有最终解释权。</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import QrcodeVue from "qrcode.vue";
const value = ref("https://example.com");
</script>

<style lang="scss" scoped>
.bachground {
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 0;
}
.main {
  position: relative;
  z-index: 1;
  .banner-info {
    position: relative;
    margin-top: 111px;
    padding: 8px;
  }
  .title1 {
    font-family: FZHanZhenGuangBiaoS-GB;
    background: linear-gradient(180deg, #ffffff 0%, #00a9f1 87.62%);
    background: -webkit- linear-gradient(180deg, #ffffff 0%, #00a9f1 87.62%);
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
    font-size: 3rem;
    font-weight: 400;
    line-height: 79.39px;
    text-align: left;
    margin-bottom: 6px;
  }
  .title2,
  .title3 {
    font-family: FZHanZhenGuangBiaoS-GB;
    font-size: 2rem;
    font-weight: 400;
    line-height: 54.32px;
    text-align: left;
    color: rgba(255, 255, 255, 1);
    margin-bottom: 6px;
  }

  .title4 {
    font-family: Microsoft YaHei UI;
    font-size: 1rem;
    font-weight: 700;
    line-height: 25.4px;
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
    margin-right: 16px;

    .qr-code-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      .qrcode {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 128px;
        height: 128px;
        background-color: #fff;
      }
      .qrcode-info {
        font-family: Microsoft YaHei UI;
        font-size: 17.25px;
        font-weight: 700;
        line-height: 21.9px;
        text-align: left;
        color: rgba(255, 255, 255, 1);
        margin-top: 13px;
      }
    }
  }
  .info {
    .item-text1 {
      font-family: Microsoft YaHei UI;
      font-size: 21px;
      font-weight: 700;
      line-height: 40.64px;
      text-align: left;
      color: rgba(250, 255, 0, 1);
      margin-top: 16.46px;
      margin-bottom: 17px;
    }
    .item-text2 {
      font-family: Microsoft YaHei UI;
      font-size: 18px;
      font-weight: 700;
      line-height: 30.48px;
      text-align: left;
      color: rgba(255, 255, 255, 1);
    }
  }

  .content-box {
    width: 100%;
    margin: 0 auto;
    padding: 8px;
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
      margin-top: 24px;
      width: 100%;

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
          .qrcode {
            background-color: #fff;
            width: 109px;
            height: 109px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
        .info {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-family: Microsoft YaHei UI;
          font-size: 18px;
          font-weight: 700;
          line-height: 22.86px;
          text-align: left;
          color: rgba(255, 255, 255, 1);
          margin-top: 22px;
          .top {
            display: flex;
            align-items: center;
            .logo {
              width: 33px;
              height: 33px;
            }
          }
        }
      }
    }
  }

  .session2 {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 22px;
    .content {
      margin-top: 21px;
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
    }
  }
  .session3 {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 22px;
    .tabs {
      width: 100%;
      display: flex;
      justify-content: space-around;
      margin-top: 21px;
    }
    .tab {
      background-size: 100% 100%;
      background-position: center center;
      width: 309px;
      height: 67px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: Microsoft YaHei UI;
      font-size: 18px;
      font-weight: 700;
      line-height: 22.86px;
      text-align: left;
      cursor: pointer;
    }

    .active {
      background-image: url("../../../assets/promo/aijiasu/tab-active.png");
      color: #221313;
    }
  }

  .session4 {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 36px;
    margin-bottom: 18px;
    .content {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      background: #0a0126;
      font-family: Microsoft YaHei UI;
      font-size: 19px;
      font-weight: 400;
      line-height: 24.13px;
      text-align: left;
      color: #ffffff;
      padding: 21px 10px;
      border: 1px solid;
      border-image: linear-gradient(90deg, #ff7272 0%, #dee227 31%, #00ef0a 60%, #08ffff 97.5%) 1;
    }
  }
}
</style>
