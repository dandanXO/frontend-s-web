<template>
  <div class="welcome-page-container">
    <div class="center">
      <div class="logo">
        <img :src="loadImg('welcome-congrats')" />
      </div>
      <div class="welcome-slides">
        <div class="welcome-slide card-bg">
          <div class="slide-title">完美兼容安全设备</div>
          <img class="banner" :src="loadImg('welcome-4-types-icon')" />
          <div>
            雷火用引领市场的卓越技术，自主研发了全套
            终端应用，让您畅享Web、H5、更有iOS、Android原生App,流畅游戏，让您尽在掌握！贴心服务，7x24在线客服全年伴您左右。
          </div>
          <img class="supported-platforms-img" src="../assets/home/auth/welcome-supported-platforms.png" />
          <div class="qr-codes">
            <template v-for="(det, idx) in platforms" :key="idx">
              <div class="platform-qr-code">
                <VueQRCodeComponent :size="100" :text="det.link" />
                <div class="label-desc-wrapper">
                  <span class="label">{{ det.name }}</span>
                  <a v-if="det.mobile" :href="det.mobile" target="_blank">{{ det.mobile }}</a>
                  <span v-else>手机用户扫码下载</span>
                </div>
              </div>
            </template>
          </div>
        </div>
        <div class="welcome-slide center-slide card-bg">
          <img class="ribbon" src="../assets/home/auth/welcome-slide-ribbon.png" />
          <div class="slide-title">注册后即刻存款的玩家高达</div>
          <img class="banner" :src="loadImg('welcome-84-percent-icon')" />
          <div class="grey-card-bg">
            <div class="list">您的首次存款，将激活以下优惠：</div>
            <div class="list white-space-nowrap">
              <img src="../assets/home/auth/welcome-slide-bullet-icon.png" />
              「电竞/体育/真人/棋牌」
              <span class="highlighted">首存即送68%</span>
            </div>
            <div class="list white-space-nowrap">
              <img src="../assets/home/auth/welcome-slide-bullet-icon.png" />
              「完成新手任务」
              <span class="highlighted">领取228雷火币！</span>
            </div>
            <div class="list white-space-nowrap">
              <img src="../assets/home/auth/welcome-slide-bullet-icon.png" />
              「每日全场返水」
              <span class="highlighted">最高可返2.0% 无上限！</span>
            </div>
            <div class="list white-space-nowrap">
              <img src="../assets/home/auth/welcome-slide-bullet-icon.png" />
              「电竞/体育」
              <span class="highlighted">每日保险投注 让您稳赚不赔！</span>
            </div>
          </div>
          <router-link to="/center/deposit" class="blue-bg deposit-btn">立即存款</router-link>
        </div>
        <div class="welcome-slide card-bg">
          <div class="slide-title">最全的热门电竞赛事</div>
          <img class="banner" :src="loadImg('welcome-17-types-icon')" />
          <img class="hot-games-img" src="../assets/home/auth/welcome-hot-games.png" />
          <div style="margin: 15px 10px 5px">...等多款游戏</div>
          <router-link to="/esports" class="blue-bg proceed-btn">立即前往</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useDark } from "@vueuse/core";
import { ref } from "vue";
import VueQRCodeComponent from "vue-qrcode-component";

const isDark = useDark();

const platforms = ref([
  {
    code: "QZ",
    name: "全站APP",
    link: "https://m.e8386.com"
  },
  {
    code: "DJ",
    name: "电竞APP",
    link: "https://m.e8386.com"
  }
]);

const loadImg = (name) => {
  if (isDark.value) {
    try {
      return require(`@/assets/home/auth/${name}-dark.png`);
    } catch (error) {
      return require(`@/assets/home/auth/${name}.png`);
    }
  } else {
    return require(`@/assets/home/auth/${name}.png`);
  }
};
</script>

<style lang="scss" scoped>
.white-space-nowrap {
  white-space: nowrap;
}

.supported-platforms-img {
  width: 100%;
  margin: 20px 0px;
}

.qr-codes {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  width: 100%;

  .platform-qr-code {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    display: flex;

    .label-desc-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 3px;
      margin: 10px 0px 0px;

      .label {
        color: #3f8cff;
      }

      .desc {
        color: #7a80a1;
      }
    }

    .supported-mobile-os {
      display: flex;
      align-items: center;
      justify-content: center;

      span {
        line-height: 29px;
        padding: 0px 3px;
      }
    }
  }
}

.blue-bg {
  background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
  box-shadow: 0px -2px 4.58px 0px #b1d7ff inset, 0px -1px 3.664px 0px #5894ff inset;
  color: #fff;
  font-size: 14px;
  border-radius: 30px;
}

.deposit-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 90%;
  min-height: 45px;
  margin: 30px 0px 10px;
}

.proceed-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 15px 0px;
  min-width: 150px;
  min-height: 45px;
}

.welcome-slides {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 50px;
  align-items: center;
  font-family: "PingFang SC";
  font-weight: bold;

  .welcome-slide {
    display: flex;
    flex-direction: column;
    width: 350px;
    justify-content: space-between;
    align-items: center;
    color: #7a80a1;
    position: relative;
    padding: 25px;
    height: 100%;

    .slide-title {
      font-weight: 700;
      font-size: 18px;
    }

    .list {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 5px 0px;
    }

    .banner {
      width: 140px;
    }

    .hot-games-img {
      width: 100%;
    }

    &.center-slide {
      width: 470px;

      .banner {
        width: 100%;
      }

      .ribbon {
        position: absolute;
        top: 0px;
        left: 0px;
        width: 133px;
      }
    }

    .grey-card-bg {
      width: 100%;
      background-color: #f7f8fb;
      border-radius: 10px;
      padding: 20px;

      .highlighted {
        background: linear-gradient(180deg, #ffdc5f 0%, #ec0808 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }
  }
}

.welcome-page-container {
  width: 100%;
  min-height: 100vh;
  height: 100%;
  background: url("@/assets/home/auth/login-page-bg.jpg") no-repeat center center;
  background-size: cover;
  display: flex;
}

.center {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 30px;
  margin: 5% auto;
  width: 100%;
  max-width: 600px;
}

.logo img {
  width: 100%;
}

.card-bg {
  background-color: #ffffff;
  box-shadow: 0px 0px 10px 0px #0000001a;
  border-radius: 10px;
}

.dark {
  .welcome-page-container {
    background: url("@/assets/home/auth/login-page-bg-dark.png") no-repeat center center;
    background-size: cover;
  }

  .card-bg {
    @include content-block-dark;
  }

  .welcome-slides {
    .welcome-slide {
      color: $font-3-dark;

      .slide-title {
        color: $color-white;
      }

      .grey-card-bg {
        background-color: $background-content-block-lighter-dark;
      }

      .qr-codes {
        .platform-qr-code {
          .label-desc-wrapper {
            .label {
              color: $active-color-dark;
            }
          }
        }
      }
    }
  }

  .blue-bg {
    background: $active-color-dark-linear;
    box-shadow: $active-color-dark-shadow;
  }
}
</style>
