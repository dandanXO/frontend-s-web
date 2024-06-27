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
            <div class="qrcode"><qrcode-vue :value="value" size="145" level="H" /></div>
            <div class="qrcode-info">安卓手机扫码下载</div>
          </div>
          <div class="qr-code-item">
            <div class="qrcode">
              <div class="qrcode"><qrcode-vue :value="value" size="145" level="H" /></div>
            </div>
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
            <div class="icon">
              <div class="qrcode"><qrcode-vue :value="value" size="105" level="H" /></div>
            </div>
            <div class="info">
              <img src="../../../assets/promo/aijiasu/apple-icon.png" alt="" />
              <div>苹果手机下载</div>
            </div>
          </div>
          <div class="download">
            <div class="icon">
              <div class="qrcode"><qrcode-vue :value="value" size="105" level="H" /></div>
            </div>
            <div class="info">
              <img src="../../../assets/promo/aijiasu/android-icon.png" alt="" />
              <div>安卓手机下载</div>
            </div>
          </div>
        </div>
      </div>
      <div class="session2">
        <img src="../../../assets/promo/aijiasu/title2.png" alt="" />
        <div class="content">
          <img src="../../../assets/promo/aijiasu/session2-1.png" alt="" />
          <img src="../../../assets/promo/aijiasu/session2-2.png" alt="" />
          <img src="../../../assets/promo/aijiasu/session2-3.png" alt="" />
        </div>
      </div>

      <div class="session3">
        <img src="../../../assets/promo/aijiasu/title3.png" alt="" />
        <div class="tabs">
          <div :class="`tab ${activeTab === 0 ? 'active' : 'inactive'}`" @click="handleActiveClick(0)">
            <img
              src="../../../assets/promo/aijiasu/window-icon.png"
              alt=""
              v-if="activeTab !== 0"
              style="margin-right: 8px"
            />
            <img src="../../../assets/promo/aijiasu/window-black.png" alt="" v-if="activeTab === 0" style="margin-right:
            8px;"> Windows教程
          </div>
          <div :class="`tab ${activeTab === 1 ? 'active' : 'inactive'}`" @click="handleActiveClick(1)">
            <img src="../../../assets/promo/aijiasu/apple-icon.png" alt="" v-if="activeTab !== 1"  style="margin-right:
            8px;"> <img src="../../../assets/promo/aijiasu/apple-black.png" alt="" v-if="activeTab === 1" width="23"
            height="23"  style="margin-right:
            8px;"/> 苹果手机教程
          </div>
          <div :class="`tab ${activeTab === 2 ? 'active' : 'inactive'}`" @click="handleActiveClick(2)">
            <img src="../../../assets/promo/aijiasu/android-icon.png" alt="" v-if="activeTab !== 2"  style="margin-right:
            8px;"> <img src="../../../assets/promo/aijiasu/android-black.png" alt="" v-if="activeTab === 2"width="19"
            height="19" style="margin-right: 8px;"> 安卓手机教程
          </div>
        </div>
        <div class="slider" style="position: relative" v-if="activeTab === 0">
          <swiper
            :spaceBetween="20"
            :loop="false"
            @swiper="onSwiper"
            @slideChange="onSlideChange"
            class="swiper-wrapper"
          >
            <swiper-slide>
              <div class="img-box"><img src="../../../assets/promo/aijiasu/demo-img.png" alt="" /></div>
            </swiper-slide>
            <swiper-slide><div style="color: #fff">2</div></swiper-slide>
            <swiper-slide><div style="color: #fff">3</div></swiper-slide>
          </swiper>
          <div class="swiper-button-prev" @click="prevSlide"></div>
          <div class="swiper-button-next" @click="nextSlide"></div>
        </div>
        <div class="slider" v-if="activeTab === 1" style="position: relative">
          <swiper
            :spaceBetween="20"
            :loop="false"
            @swiper="onSwiper"
            @slideChange="onSlideChange"
            class="swiper-wrapper"
          >
            <swiper-slide>
              <div class="img-box"><img src="../../../assets/promo/aijiasu/demo-img.png" alt="" /></div>
            </swiper-slide>
            <swiper-slide><div style="color: #fff">2-2</div></swiper-slide>
            <swiper-slide><div style="color: #fff">2-3</div></swiper-slide>
          </swiper>
          <div class="swiper-button-prev" @click="prevSlide"></div>
          <div class="swiper-button-next" @click="nextSlide"></div>
        </div>
        <div class="slider" v-if="activeTab === 2" style="position: relative">
          <swiper
            :spaceBetween="20"
            :loop="false"
            @swiper="onSwiper"
            @slideChange="onSlideChange"
            class="swiper-wrapper"
          >
            <swiper-slide>
              <div class="img-box"><img src="../../../assets/promo/aijiasu/demo-img.png" alt="" /></div>
            </swiper-slide>
            <swiper-slide><div style="color: #fff">3-2</div></swiper-slide>
            <swiper-slide><div style="color: #fff">3-3</div></swiper-slide>
          </swiper>
          <div class="swiper-button-prev" @click="prevSlide"></div>
          <div class="swiper-button-next" @click="nextSlide"></div>
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
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/navigation";
import QrcodeVue from "qrcode.vue";
const activeTab = ref(0);

const value = ref("https://example.com");

const handleActiveClick = (num) => {
  activeTab.value = num;
};

const $swiper = ref(null);

const onSwiper = (swiper) => {
  $swiper.value = swiper;
};

const prevSlide = () => {
  $swiper.value.slidePrev();
};

const nextSlide = () => {
  $swiper.value.slideNext();
};
</script>

<style lang="scss" scoped>
.bachground {
  position: absolute;
  top: 0px;
  left: 0px;
  bottom: 0px;
  z-index: -2;
  width:100%;

  .backgroun-top{
    img{
      width: 100%;
    }
  }
  .backgroun-bottom{
    height: 100%;

    img{
      width: 100%;
      height: 100%;
    }
  }
}

.main {
  /* height: 2500px; */

  .banner-info {
    width: 100%;
    max-width: 1400px;
    //margin-top: 80px;
    margin: 80px auto 0px;
    padding-left: 450px;
    position: relative;
    .black-bg {
      width: 1096px;
      height: 486px;
      position: absolute;
      top: -100px;
      right: 0px;
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
        display: flex;
        align-items: center;
        justify-content: center;
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
      justify-content: space-between;
      align-items: center;
    }
  }

  .session3 {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 49px;
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
    .inactive {
      background-image: url("../../../assets/promo/aijiasu/tab-inactive.png");
      color: #fff;
    }
    .swiper-wrapper {
      max-width: 900px;
      margin-top: 66px;
    }

    .img-box {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    :deep(.swiper-button-prev) {
      left: -110px;

      background: url(../../../assets/promo/aijiasu/back.png) no-repeat center center;
      background-size: contain;
      border-radius: 50%;
      width: 150px;
      height: 150px;
      &:after {
        color: transparent;
      }
    }

    :deep(.swiper-button-next) {
      right: -110px;
      background: url(../../../assets/promo/aijiasu/next.png) no-repeat center center;
      background-size: contain;
      border-radius: 50%;
      width: 150px;
      height: 150px;
      &:after {
        color: transparent;
      }
    }
  }

  .session4 {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 25px;
    margin-bottom: 84px;
    .content {
      height: 269px;
      width: 1193px;
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
