<template>
  <div class="welcome-page-container">
    <div class="center">
      <div class="logo">
        <img src="../../assets/home/auth/welcome-header.png" />
        {{ $t("welcome.congrats") }}
      </div>
      <div class="welcome-slides">
        <div class="welcome-slide first card-bg">
          <div class="slide-title">{{ $t("welcome.firstSlide") }}</div>
          <div class="slide-content">{{ $t("welcome.firstSlideContent") }}</div>
          <div class="slide-qr">
            <VueQRCodeComponent :size="100" :text="ui.downloadUrl" />
          </div>

          <div class="bold-content">{{ $t("welcome.firstSlideSub") }}</div>
        </div>
        <div class="welcome-slide center-slide card-bg">
          <div class="slide-title">{{ $t("welcome.secondSlide") }}</div>
          <div class="slide-content sec">{{ $t("welcome.secondSlideContent") }}</div>
          <img class="banner" style="margin: -20px 0px; width: 100%" src="../../assets/home/auth/hundred.png" />
          <div class="deposit-btn" @click="goToDeposit()">{{ $t("welcome.depositNow") }}</div>
        </div>
        <div class="welcome-slide card-bg">
          <div class="slide-title">{{ $t("welcome.thirdSlide") }}</div>
          <div class="slide-content">{{ $t("welcome.thirdSlideContent") }}</div>
          <img class="hot-games-img" style="margin-top: 20px" src="../../assets/home/auth/vnm-welcome-hot-games.png" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineEmits } from "vue";
import VueQRCodeComponent from "vue-qrcode-component";
import { useI18n } from "vue-i18n";
import { uiStore } from "@/store/ui";
import { useRouter } from "vue-router";

const router = useRouter();
const { t } = useI18n();
const ui = uiStore();

const emits = defineEmits(["close-dialog, open-login-dialog"]);

const goToDeposit = () => {
  router.push('/center/personal');
  emits("close-dialog");
}
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
  font-weight: 500;
  background: url(../../assets/home/auth/title-bg-blue.png) no-repeat center center;
  background-size: contain;
  color: #ffffff;
  cursor: pointer;
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
  .welcome-slide {
    display: flex;
    flex-direction: column;
    width: 320px;
    min-height: 420px;
    justify-content: flex-start;
    align-items: center;
    color: #7a80a1;
    background: #ffffffcc;
    position: relative;
    padding: 25px;
    box-shadow: 0px 0px 10px 0px #0000001a;
    &.first {
      .slide-qr {
        background: url(../../assets/home/auth/welcome-qrbg.png) no-repeat center center;

        width: 150px;
        height: 155px;
        display: flex;
        justify-content: center;
        align-items: center;
        padding-top: 10px;
        margin: 25px auto;
      }
      .slide-content {
        width: 75%;
      }
    }

    .slide-title {
      font-weight: 900;
      font-size: 20px;
      color: #424f72;
    }
    .slide-content {
      text-align: center;
      font-size: 15px;
      margin: 10px auto;
      color: #7a80a1;
    }
    .slide-images {
      display: flex;
      gap: 5px;
      justify-content: center;
      align-items: center;
      margin: 10px auto;
    }
    .bold-content {
      font-weight: 900;
      color: #7a80a1;
      font-size: 17px;
    }

    .list {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 5px 0px;
      white-space: pre-wrap;
    }

    .banner {
      width: 140px;
    }

    .hot-games-img {
      width: 100%;
    }

    &.center-slide {
      // width: 470px;

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
  width: calc(100% + 32px);
  margin: -16px;
  // min-height: 90vh;
  padding-top: 16px;
  height: 100%;
  background: url("../../assets/home/auth/welcome-bg.png") no-repeat center center;
  background-size: cover;
  display: flex;
  border-radius: 12px;
  .logo {
    font-size: 36px;
    font-weight: bold;
    color: #ffffff;
    text-shadow: 5px 5px 25px #5894ff;
    flex-direction: column;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      max-width: 200px;
      margin: -80px 0;
    }
  }
}

.center {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 30px;
  margin: 5% auto 3%;
  width: 100%;
  max-width: 900px;
}

.logo img {
  width: 100%;
}

.card-bg {
  background-color: #ffffff;
  box-shadow: 0px 0px 10px 0px #0000001a;
  border-radius: 10px;
}
</style>
