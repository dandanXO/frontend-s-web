<template>
  <!-- <ProfileSummary :homeProfile="true" /> -->
  <div class="left-side-menu" :class="{ fullHeight: !topDownload }" @click.stop>
    <RouterLink to="/earn-money" class="side-menu-item side-menu-item__invite">
      <div>
        {{ $t("sideNav.inviteToEarn") }}
        <span>{{ $t("sideNav.shareYourExclusiveQRCode") }}</span>
      </div>
      <!-- <div class="item-icon">
          <img src="../assets/images/auth/menu-invite.png" />
        </div> -->
    </RouterLink>

    <div class="side-menu-item side-menu-item__checkin">
      <div>
        CHECK
        <span>-IN</span>
      </div>
      <div class="item-icon">
        <img src="../assets/images/auth/menu-checkin.png" />
      </div>
    </div>

    <div class="side-menu-item side-menu-item__luckyspin">
      <div>
        LUCKY
        <span>SPIN</span>
      </div>
      <div class="item-icon">
        <img src="../assets/images/auth/menu-luckyspin.png" />
      </div>
    </div>

    <div class="side-menu-item" @click="activateSlide('Slot')">
      <div class="item-icon"><img src="../assets/images/auth/menu-slot.png" /></div>
      {{ $t("sideNav.slots") }}
    </div>
    <div class="side-menu-item" @click="activateSlide('Live')">
      <div class="item-icon"><img src="../assets/images/auth/menu-live.png" /></div>
      {{ $t("sideNav.livecasino") }}
    </div>
    <div class="side-menu-item" @click="activateSlide('Fish')">
      <div class="item-icon"><img src="../assets/images/auth/menu-fish.png" /></div>
      {{ $t("sideNav.fishing") }}
    </div>
    <div class="side-menu-item" @click="activateSlide('Poker')">
      <div class="item-icon"><img src="../assets/images/auth/menu-poker.png" /></div>
      {{ $t("sideNav.poker") }}
    </div>
    <div class="side-menu-item" @click="activateSlide('Sport')">
      <div class="item-icon"><img src="../assets/images/auth/menu-sport.png" /></div>
      {{ $t("sideNav.sport") }}
    </div>
    <div class="side-menu-transparent-grp">
      <div class="side-menu-item side-menu-item__transparent" @click="openCSInNewTab(ui.CSAUrl)">
        <div class="item-icon"><img src="../assets/images/auth/menu-livesupport.svg" /></div>
        {{ $t("sideNav.livesupport") }}
      </div>

      <!-- <div class="side-menu-item side-menu-item__transparent" @click="handleMenuRouteClick('/account/feedback')">
        <div class="item-icon"><img src="../assets/images/auth/menu-feedback.png" /></div>
        {{ $t("sideNav.feedback") }}
      </div> -->

      <!--      <a class="side-menu-item side-menu-item__transparent" href="https://www.tiktok.com/@b9game" target="_blank">-->
      <!--        <div class="item-icon">-->
      <!--          <img src="../assets/images/auth/menu-tiktok.png" />-->
      <!--        </div>-->
      <!--        Tik Tok-->
      <!--      </a>-->

      <a class="side-menu-item side-menu-item__transparent" :href="ui.youtubeUrl" target="_blank">
        <div class="item-icon">
          <img src="../assets/images/index/youtube-web-icon.svg" />
        </div>
        Youtube
      </a>

      <a class="side-menu-item side-menu-item__transparent" :href="ui.instagramUrl" target="_blank">
        <div class="item-icon">
          <img src="../assets/images/index/insta-web-icon.svg" />
        </div>
        Instagram
      </a>

      <a class="side-menu-item side-menu-item__transparent" :href="ui.whatsappUrl" target="_blank">
        <div class="item-icon"><img src="../assets/images/auth/menu-whatsapp.svg" /></div>
        Whatsapp
      </a>
      <a class="side-menu-item side-menu-item__transparent" :href="ui.tiktokUrl" target="_blank" v-if="ui.tiktokUrl">
        <div class="item-icon"><img src="../assets/images/auth/menu-tiktok.svg" /></div>
        TikTok
      </a>
      <router-link class="side-menu-item side-menu-item__transparent" to="/faq-page">
        <div class="item-icon"><img src="../assets/images/auth/menu-faq.svg" /></div>
        FAQ
      </router-link>
      <router-link class="side-menu-item side-menu-item__transparent" to="/cs-verifier">
        <div class="item-icon"><img src="../assets/images/auth/menu-cs-verifier.png" /></div>
        {{ $t("sideNav.customerServiceVerifier") }}
      </router-link>
      <router-link
        v-if="ui.siteType === 'CURACAO'"
        class="side-menu-item side-menu-item__transparent"
        to="/terms-and-conditions"
      >
        <div class="item-icon"><img src="../assets/images/auth/tac.png" /></div>
        {{ $t("sideNav.termsAndConditions") }}
      </router-link>
    </div>
    <a v-if="!isAndroid()" :href="ui.downloadAppUrl" class="side-menu-item side-menu-item__appdownload">
      <div>
        {{ $t("sideNav.appDownload") }}
        <span>{{ $t("sideNav.experienceOneStopGaming") }}</span>
      </div>
      <div class="right-icon">
        <img :src="require(`../assets/images/auth/panda-app.png`)" />
      </div>
    </a>
    <RouterLink to="/language" class="side-menu-item">
      <div class="item-icon">
        <img :src="require(`../assets/images/auth/country-flag-${$t('lang.langVal')}.png`)" class="flag" />
      </div>
      {{ $t("sideNav.language") }}
    </RouterLink>
    

    <div v-if="ui.siteType === 'CURACAO'" class="side-menu-item license">
      <img class="license-img" src="../assets/images/license/curacao-license.png" />
      <div class="license-text-wrapper">
        <span class="license-text__title">{{ $t("sideNav.license.curacao.title") }}</span>
        <span class="license-text__description">{{ $t("sideNav.license.curacao.description") }}</span>
      </div>
    </div>

    <!--    <a class="side-menu-item side-menu-item__download" :href="ui.downloadAppUrl" v-if="!ui.hideDownload">-->
    <!--      <div class="item-icon">-->
    <!--        <img src="../assets/images/auth/download-icon.png" />-->
    <!--      </div>-->
    <!--      {{ $t("sideNav.downloadApp") }}-->
    <!--    </a>-->

    <!-- <div class="side-menu-item side-menu-item__transparent"> -->
    <!-- <LangOptions /> -->
    <!-- </div> -->
  </div>
</template>
<script setup>
import { defineEmits, inject } from "vue";
import { isAndroid } from "boot/utils";
import { useRouter } from "vue-router";
import ProfileSummary from "../components/ProfileSummary.vue";
import { useUI } from "stores/ui";
const emits = defineEmits(["closeMenu"]);
const router = useRouter();
const ui = useUI();
const topDownload = inject("topDownload");
const activateSlide = (item) => {
  emits("closeMenu");
  router.push(`/home#${item}`);
  console.log(item);
};
const openCSInNewTab = (url) => {
  const absoluteUrl = url;
  window.open(absoluteUrl, "_blank");
};
</script>
<style lang="scss" scoped>
.menu-open {
  background: #232626;
  &.open {
    margin-left: 0;
  }
  @supports (height: 100dvh) {
    .left-side-menu {
      height: calc(100dvh - 70px); /* modern browsers */

      &.fullHeight {
        height: calc(100dvh - 20px); /* modern browsers */
      }
    }
  }

  .left-side-menu {
    width: 100%;
    padding-top: 72px;
    height: calc(100vh - 70px);

    &.fullHeight {
      height: calc(100vh - 20px);
    }

    display: flex;
    flex-direction: column;
    padding-left: 16px;
    padding-right: 16px;
    // gap: 12px;
    :not(:last-child) {
      margin-bottom: 12px;
    }
    transition: 0.3s all;
    overflow-y: auto;
    max-width: 500px;
    margin: 0 auto;

    .side-menu-divider {
      background: rgba(255, 255, 255, 0.05);
      height: 2px;
      width: 100%;
      margin-top: 4px;
      margin-bottom: 4px;
    }
    .side-menu-transparent-grp {
      background: #373c3d;
      border-radius: 6px;
      display: flex;
      flex-direction: column;
      // gap: 10px;
      padding: 10px 0;
      // height: 100%;
    }
    .side-menu-item {
      height: 50px;
      min-height: 50px;
      line-height: 50px;
      padding: 12px;
      display: flex;
      align-items: center;
      //   width: 170px;
      width: 100%;
      background: #373c3d;
      border-radius: 6px;
      color: #ffffff;
      font-weight: bold;
      line-height: 1.2;
      text-decoration: none;
      position: relative;
      &__download {
        background: linear-gradient(180deg, #1baa99 0%, #8ac542 100%);
        color: #000a01;
        font-weight: bold;

        .item-icon {
          img {
            display: block;
            width: 20px;
          }
        }
      }
      &:after {
        content: ">";
        position: absolute;
        right: 20px;
        top: 12px;
        width: 25px;
        height: 25px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 6px;
        background: #464f50;
        font-weight: bold;
      }
      &__transparent {
        background-color: transparent;
        height: 40px;
        min-height: 40px;
        line-height: 40px;
        &:after {
          content: unset;
        }
      }

      &__checkin {
        background: linear-gradient(270deg, #168346 0%, #171719 100%);
        padding-left: 18px;
        font-size: 80%;
        color: #ffffff;
        display: none !important;
        span {
          display: block;
          color: #61ff00;
        }

        .item-icon {
          margin-left: auto;
          margin-top: -18px;
        }
      }

      &__luckyspin {
        background: linear-gradient(270deg, #b2267d 0%, #171719 100%);
        padding-left: 18px;
        font-size: 80%;
        color: #ffffff;
        display: none !important;
        span {
          display: block;
          color: #ff00f5;
        }

        .item-icon {
          margin-left: auto;
          margin-top: -8px;
        }
      }

      &__invite {
        background: url(../assets/images/common/minibannerbg.png) no-repeat center center;
        background-size: cover;
        padding-left: 18px;
        font-size: 80%;
        color: #13553d;
        font-family: "Microsoft YaHei UI", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
        font-weight: 700;
        font-size: 20.21px;
        line-height: 17.21px;
        letter-spacing: 0;
        font-variant: small-caps;
        height: 80px;
        min-height: 80px;
        &:after {
          content: unset;
        }

        span {
          font-size: 14px;
          padding-top: 8px;
          display: block;
          color: #ffffff;
        }

        .item-icon {
          margin-left: auto;
          margin-top: -8px;
        }
      }

      &__appdownload {
        background: #373c3d;
        color: #ffffff;
        font-family: "Microsoft YaHei UI", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
        font-weight: 700;
        font-size: 16.21px;
        line-height: 17.21px;
        letter-spacing: 0%;
        height: 100px;
        min-height: 100px;
        position: relative;
        &:after {
          content: "";
          bottom: 0;
          top: 0;
          margin: auto;
          background: url("../assets/images/auth/download-btn.png") no-repeat center center;
        }
        .right-icon {
          height: 135%;
          overflow: hidden;
          padding-right: 0px;
          max-width: 140px;

          img {
            height: 180%;
            margin: -25% 0 -25% -25%;
            min-height: 184px;
          }
        }

        span {
          font-size: 14px;
          padding-top: 8px;
          display: block;
          color: #ffffff80;
          font-weight: 400;
        }

        .item-icon {
          margin-left: auto;
          margin-top: -8px;
        }
      }

      &.license {
        background: none;
        padding: 0;
        &::after {
          content: unset;
        }
        .license-img {
          max-width: 47px;
          margin-right: 4px;
          margin-bottom: 0;
        }
        .license-text-wrapper {
          display: flex;
          flex-direction: column;
          span {
            margin-bottom: 0;
            font-weight: 600;
            color: #ffffff99;
          }
          .license-text__title {
            font-size: 12px;
          }
          .license-text__description {
            font-size: 10px;
          }
        }
      }

      .item-icon {
        width: 20px;
        margin-right: 15px;
        display: flex;
        justify-content: center;
        align-items: center;
        img {
          display: block;
          width: 100%;

          &.flag {
            width: 26px;
          }
        }
      }
    }

    .gcb-container {
      display: flex;
      color: #ffffff99;
      font-weight: 600;
      line-height: 12.93px;
      letter-spacing: 0px;
      align-items: center;
      font-size: 12px;
      margin-top: 4px;
      img {
        width: 64px;
        margin: 0;
        margin-right: 8px;
      }
      div {
        margin: 0;
      }
      .bottom-txt {
        font-size: 10px;
        margin-top: 4px;
      }
    }
  }
}
</style>
