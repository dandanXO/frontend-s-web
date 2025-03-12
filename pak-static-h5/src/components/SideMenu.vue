<template>
<ProfileSummary :homeProfile="true" />

  <div class="menu-open">
    <div class="side-menu" @click.stop>
      <RouterLink to="/earn-money" class="side-menu-item side-menu-item__invite">
        <div>
          {{ $t("sideNav.inviteToEarn") }}
          <span>{{ $t("sideNav.shareYourExclusiveQRCode") }}</span>
        </div>
        <div class="item-icon">
          <img src="../assets/images/auth/menu-invite.png" />
        </div>
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
        <div class="item-icon"><img src="../assets/images/auth/menu-livesupport.png" /></div>
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
          <img src="../assets/images/index/youtube-web-icon.png" />
        </div>
        Youtube
      </a>

      <a class="side-menu-item side-menu-item__transparent" :href="ui.instagramUrl" target="_blank">
        <div class="item-icon">
          <img src="../assets/images/index/insta-web-icon.png" />
        </div>
        Instagram
      </a>

      <a class="side-menu-item side-menu-item__transparent" :href="ui.whatsappUrl" target="_blank">
        <div class="item-icon"><img src="../assets/images/auth/menu-whatsapp.png" /></div>
        Whatsapp
      </a>

      <router-link class="side-menu-item side-menu-item__transparent" to="/promo?name=pak-faq">
        <div class="item-icon"><img src="../assets/images/auth/menu-faq.png" /></div>
        Faq
      </router-link>

      <a class="side-menu-item side-menu-item__transparent" :href="ui.tiktokUrl" target="_blank" v-if="ui.tiktokUrl">
        <div class="item-icon"><img src="../assets/images/auth/menu-tiktok.png" /></div>
        TikTok
      </a>

      </div>
      <RouterLink to="/language" class="side-menu-item">
        <div class="item-icon">
          <img :src="require(`../assets/images/auth/country-flag-${$t('lang.langVal')}.png`)" class="flag" />
        </div>
        {{ $t("sideNav.language") }}
      </RouterLink>

      <a
        class="side-menu-item side-menu-item__download"
        :href="ui.downloadAppUrl"
        v-if="isSideDownload && !ui.hideDownload"
      >
        <div class="item-icon">
          <img src="../assets/images/auth/download-icon.png" />
        </div>
        {{ $t("sideNav.downloadApp") }}
      </a>

      <!-- <div class="side-menu-item side-menu-item__transparent"> -->
      <!-- <LangOptions /> -->
      <!-- </div> -->
    </div>
  </div>
</template>
<script setup>

import { useRouter } from "vue-router";
import ProfileSummary from "../components/ProfileSummary.vue";
import { useUI } from "stores/ui";
const router = useRouter();
const ui = useUI();
const activateSlide = (item) => {
    router.push(`/home#${item}`);
    console.log(item)
};
</script>
<style lang="scss" scoped>

.menu-open {
  background: #232626;
  &.open {
    margin-left: 0;
  }

  .side-menu {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 12px;
    transition: 0.3s all;
    padding: 16px;

    overflow-y: auto;

    .side-menu-divider {
      background: rgba(255, 255, 255, 0.05);
      height: 2px;
      width: 100%;
      margin-top: 4px;
      margin-bottom: 4px;
    }
    .side-menu-transparent-grp {
    background: #373C3D;
    border-radius: 6px;
    display: flex
;
    flex-direction: column;
    gap: 10px;
    padding: 10px 0;
    }
    .side-menu-item {
        &__invite {
            height: 100px;
        }
      height: 50px;
      padding: 12px;
      display: flex;
      align-items: center;
    //   width: 170px;
        width: 100%;
        background: #373C3D;
      border-radius: 6px;
      color: #ffffff;
      font-weight: bold;
      line-height: 1.2;
      text-decoration: none;

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

      &__transparent {
        background-color: transparent;
        height: 40px;
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
        background: url(../assets/images/common/minibannerbg.png)no-repeat center center;
        background-size: cover;
        padding-left: 18px;
        font-size: 80%;
        color: #13553D;
        font-family: Microsoft YaHei UI;
        font-weight: 700;
        font-size: 20.21px;
        line-height: 17.21px;
        letter-spacing: 0%;
        font-variant: small-caps;

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

      .item-icon {
        width: 30px;
        margin-right: 4px;
        display: flex;
        justify-content: center;
        align-items: center;
        img {
          display: block;

          &.flag {
            width: 26px;
          }
        }
      }
    }
  }
}
</style>