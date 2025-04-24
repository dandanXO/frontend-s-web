<template>
  <!-- <ProfileSummary :homeProfile="true" /> -->

  <div class="left-side-menu" @click.stop>
    <div class="topbar">
      <RouterLink v-if="store.token" to="/vip" style="padding: 0;" no-caps :ripple="false" unelevated>
        <div class="profile-pic" :class="store.vip ? 'vip-' + store.vip.replace('VIP', '') : 'vip-0'">
            <q-avatar size="40px">
              <img :src="profileImagePath" />
            </q-avatar>
            <div class="profile-pic-frame" v-if="!homeProfile"></div>

            <div class="vip-details">
              <img
                class="bg"
                :src="
                  require(`../assets/images/index/vip-badge/vip-${
                    store.vip ? store.vip.replace('VIP', '') : '0'
                  }.png`)
                "
                alt=""
              />
            </div>
        </div>
      </RouterLink>
      <div v-else>
        <RouterLink class="reg-btn" to="/register">
          {{ $t('header.register') }}
        </RouterLink>
      </div>
      <div class="right-top">
        <a @click="isLanguageDialog = !isLanguageDialog" class="side-menu-item">
        <div class="item-icon__language">
          {{ $t('lang.langVal') }}
          <div class="icon-flag">
            <img :src="require(`../assets/images/auth/country-flag-circle-${$t('lang.langVal')}.png`)" class="flag" />
          </div>
        </div>
        <!-- {{ $t("sideNav.language") }} -->
      </a>
      <div class="close-btn" @click="closeSideMenu()">
        <img src="../assets/images/index/close-btn-white.png">
      </div>
    </div>
  </div>
  <div class="vipbar">
    
    <div class="progress-bar-outer">
        <q-linear-progress
          reverse
          rounded
          size="8px"
          :value="progressBarRef"
          class="custom-progress-bar"
        />
        <div
          class="progress-circle"
          :style="{ right: `calc(${progressBarRef * 100}% - 12px)` }"
        ></div>
      </div>
      <div class="progress-bar-level">
        <span>{{ store.vip }}</span>
        
        <span>{{ 'VIP' + (Number(store.vip.replace('VIP', '')) + 1) }}</span>
      </div>
  </div>
    <!-- <RouterLink to="/earn-money" class="side-menu-item side-menu-item__invite">
      <div>
        {{ $t("sideNav.inviteToEarn") }}
        <span>{{ $t("sideNav.shareYourExclusiveQRCode") }}</span>
      </div>
      <!- <div class="item-icon">
          <img src="../assets/images/auth/menu-invite.png" />
        </div> ->
    </RouterLink> -->

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
    <div class="side-menu-divider" />
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
          <img src="../assets/images/auth/menu-youtube.png" />
        </div>
        Youtube
      </a>

      <a class="side-menu-item side-menu-item__transparent" :href="ui.instagramUrl" target="_blank">
        <div class="item-icon">
          <img src="../assets/images/auth/menu-instagram.png" />
        </div>
        Instagram
      </a>

      <a class="side-menu-item side-menu-item__transparent" :href="ui.whatsappUrl" target="_blank">
        <div class="item-icon"><img src="../assets/images/auth/menu-whatsapp.png" /></div>
        Whatsapp
      </a>
      <a class="side-menu-item side-menu-item__transparent" :href="ui.tiktokUrl" target="_blank" v-if="ui.tiktokUrl">
        <div class="item-icon"><img src="../assets/images/auth/menu-tiktok.png" /></div>
        TikTok
      </a>
      <router-link class="side-menu-item side-menu-item__transparent" to="/faq-page">
        <div class="item-icon"><img src="../assets/images/auth/menu-faq.png" /></div>
        FAQ
      </router-link>
      <router-link class="side-menu-item side-menu-item__transparent" to="/cs-verifier">
        <div class="item-icon"><img src="../assets/images/auth/menu-cs-verifier.png" /></div>
        {{ $t('sideNav.customerServiceVerifier') }}
      </router-link>
    </div>
    
    <div class="side-menu-divider" />
    <RouterLink to="/earn-money" class="side-menu-item side-menu-item__invitetoearn">
      <div>
        {{ $t("sideNav.inviteToEarn") }}
        <span>{{ $t("sideNav.shareYourExclusiveQRCode") }}</span>
      </div>
      <div class="right-icon">
        <img :src="require(`../assets/images/auth/invite-earn.png`)" />
      </div>
    </RouterLink>
    <RouterLink to="/earn-money" class="side-menu-item side-menu-item__appdownload">
      <div>
        {{ $t("sideNav.appDownload") }}
        <span>{{ $t("sideNav.experienceOneStopGaming") }}</span>
      </div>
      <div class="right-icon">
        <img :src="require(`../assets/images/auth/app-download.png`)" />
      </div>
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
    <a @click="openConfirmSignOutDialog">
        <div class="acct-logout">
          <img src="../assets/images/index/menu/logout.png" />
          <div class="acct-nav-label">{{ $t("settings.logout") }}</div>
        </div>
      </a>
    <!-- <div class="side-menu-item side-menu-item__transparent"> -->
    <!-- <LangOptions /> -->
    <!-- </div> -->
  </div>
  <q-dialog width="100%" v-model="confirmSignOutDialog" persistent>
    <div class="popout-dialog">
      <q-btn dense icon="close" class="text-white top-right" flat v-close-popup />
      <div class="popout-dialog-container">
        <div class="txt-title">{{ $t("btn.signOut") }}</div>

        <div class="txt-content q-mt-md text-center">{{ $t("notify.signOutMessage") }}</div>

        <div style="width: 100%;" class="q-mt-lg q-pl-lg q-pr-lg y-n-container">
          <q-btn :label="$t('btn.cancel')" no-caps class="btn-cancel" v-close-popup />
          <q-btn :label="$t('btn.confirm')" no-caps class="btn-confirm" @click="logout" />
        </div>
      </div>
    </div>
  </q-dialog>
  <q-dialog v-model="isLanguageDialog">
    
    <div class="popout-dialog">
      <q-btn dense icon="close" class="text-white top-right" flat v-close-popup />
      <div class="popout-dialog-container">
        <div class="txt-title">{{ $t("lang.language") }}</div>

        <div class="txt-content q-mt-md text-center" style="width: 100%;">
          <LanguagePage />
        </div>
      </div>
    </div>
  </q-dialog>
</template>
<script setup>
import { defineEmits, computed, ref } from "vue";

import { useRouter } from "vue-router";
import ProfileSummary from "../components/ProfileSummary.vue";
import LanguagePage from "../pages/LanguagePage.vue";
import { useUI } from "stores/ui";
import { userStore } from "stores/index";
const emits = defineEmits(["closeMenu"]);
const router = useRouter();
const store = userStore();
const ui = useUI();
const isLanguageDialog = ref(true)
import { convertToCommaAmount } from "src/boot/utils";


// progress bar
// const maxProgress = store.levelUpDeposit.toFixed(2);
// const progressRef = ref(store.currentDeposit.toFixed(2));

const progressBarRef = computed(() => {
  return 1 - store.currentDeposit / store.levelUpDeposit;
});
const confirmSignOutDialog = ref(false);
const openConfirmSignOutDialog = () => {
  confirmSignOutDialog.value = !confirmSignOutDialog.value;
};
const activateSlide = (item) => {
  emits("closeMenu");
  router.push(`/home#${item}`);
  console.log(item);
};


const randomProfileImg = computed(() => {
  const storedImg = sessionStorage.getItem("PROFILE_IMG");
  if (storedImg) {
    return storedImg;
  } else {
    const randomIndex = Math.floor(Math.random() * 24) + 1;
    const imgPath = `image-${randomIndex}`;
    sessionStorage.setItem("PROFILE_IMG", imgPath);
    return imgPath;
  }
});
const profileImagePath = computed(() => {
  return require(`../assets/images/account/profile/${randomProfileImg.value}.png`);
});
const closeSideMenu = () => {
  emits("closeMenu");
}
const openCSInNewTab = (url) => {
  const absoluteUrl = url;
  window.open(absoluteUrl, "_blank");
};
</script>
<style lang="scss" scoped>

$colors: (
  #6d96c6,
  #8c9b6a,
  #4ca1fc,
  #4c5efc,
  #d34cfc,
  #fc4cc4,
  #efa1f6,
  #FF9D86,
  #5bfc49,
  #efe639,
  #67c2ac,
  #ff7879,
  #d89053
);
@for $i from 1 through length($colors) {
  $color: nth($colors, $i);
  .vip-#{$i - 1} .q-avatar {
    border: 2px solid $color;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: auto;
  }
}
.menu-open {
  // background: #232626;
  background: #1B2339;
  border-radius: 20px 0 0 20px;

  &.open {
    margin-left: 0;
  }
// @supports (height: 100dvh) {
//   .left-side-menu {
//     height: calc(100dvh - 70px); /* modern browsers */
//   }
// }

  .left-side-menu {
    width: 100%;
    // padding-top: 72px;
    // height: calc(100vh - 70px);
    padding-top: 5px;
    // height: calc(100- 16px);
    height: 100%;
    display: flex;
    flex-direction: column;
    padding-left: 16px;
    padding-right: 16px;
    // gap: 12px;
    transition: 0.3s all;
    overflow-y: auto;
    max-width: 500px;
    margin: 0 auto;

    .topbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .right-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        }
      .close-btn {
        width: 10px;
        img {
          width: 100%;
        }
      }
      .reg-btn {
        background: linear-gradient(270deg, #089E4E 0%, #2CAC64 100%);
        box-shadow: 0px 0px 4px 0px #089E4EB2;
        border-radius: 15px;
        padding: 10px;
        text-decoration: none;
        color: #ffffff;
      }
    }
    .vipbar {
    position: relative;
    z-index: 1;
    margin-top: 20px;
      :deep(.q-linear-progress__track--dark) {

        background: linear-gradient(90deg, #30DAFE 0%, #FFFFFF 100%);

      }
      :deep(.q-linear-progress__model--determinate) {
        
        background: #65727C;
      }
    .progress-circle {
      position: absolute;
      top: -4px;
      width: 16px;
      height: 16px;
      // background-color: #21EF89;
      // border: 4px solid rgb(59 143 102);
      background: radial-gradient(59.37% 59.37% at 50% 50%, #D7EEFF 0%, #60B4FD 53.85%, #63E6FF 80.81%);
      border-radius: 50%;
      z-index: 2;
      transition: left 0.3s ease;
    }
      .progress-bar-level {
        display: flex;
        justify-content: space-between;
        font-weight: 700;
        font-size: 10px;
        margin-top: 5px;
      }
    }
    .side-menu-divider {
      // background: rgba(255, 255, 255, 0.05);
      background: linear-gradient(90deg, #333B54 0%, rgba(51, 59, 84, 0) 100%);

      padding: 1px;
      height: 2px;
      width: 100%;
      margin-top: 10px;
      margin-bottom: 10px;
    }
    .side-menu-transparent-grp {
      // background: #373c3d;
      border-radius: 6px;
      display: flex;
      flex-direction: column;
      // gap: 10px;
      // padding: 10px 0;
      // min-height: 372px;
    }

.acct-logout {
  // height: 60px;
  // background: #2e30344f;
  // background-image: url("../assets/images/account/logout-btn.png");
  // background-repeat: no-repeat;
  width: calc(95% - 20px);
  margin: 20px auto;
  // aspect-ratio: 335/40;
  // background-size: 100% 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  // gap: 5px;
  :not(:last-child) {
    margin-right: 5px;
  }
  img {
    width: 30px;
  }
  .acct-nav-label {
    // color: rgba(206, 206, 206, 0.8);
    color: #ffffff;
    font-size: 12px;
    font-weight: 700;
  }

  &:active {
    filter: brightness(1.2);
    transform: translate(0px, 1px);
  }
}
    .side-menu-item {
      height: 50px;
      min-height: 50px;
      line-height: 50px;
      // padding: 12px;
      display: flex;
      align-items: center;
      //   width: 170px;
      // width: 100%;
      // background: #373c3d;
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
          text-transform: uppercase;
          img {
            display: block;
            width: 20px;
          }
        }
      }
      &:after {
        // content: ">";
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
        min-height: 50px;
        line-height: 50px;
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
      &__invitetoearn {
        background: linear-gradient(90deg, #802D85 0%, #2A324C 100%);
        &::before {
          content: "";
          position: absolute;
          left: -2px;
          width: 4px;
          height: 80%;
          background: linear-gradient(180deg, #FFFFFF 0%, #FF05DE 100%);
        }
      }
      &__appdownload {
        background: linear-gradient(90deg, #235C9A 0%, #283149 100%);
        &::before {
          content: "";
          position: absolute;
          left: -2px;
          width: 4px;
          height: 80%;
          background: linear-gradient(180deg, #0094FE 0%, #0758C7 100%);
        }
      }

      &__appdownload, &__invitetoearn {
        margin-bottom: 10px;
        color: #ffffff;
        font-family: "Microsoft YaHei UI", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
        font-weight: 700;
        font-family: Microsoft YaHei UI;
        font-weight: 700;
        font-size: 15.15px;
        border-radius: 12px;
        letter-spacing: 0%;
        min-height: 70px;
        position: relative;
        padding: 10px 15px;
        margin: 10px 0px;
        &:after {
          // content: "";
          // bottom: 0;
          // top: 0;
          // margin: auto;
          // background: url("../assets/images/auth/download-btn.png") no-repeat center center;
          content: unset;
        }
        .right-icon {
          width: 100px;
          position: absolute;
          right: 0;
          img {
            width: 100%;
          }
          // height: 135%;
          // overflow: hidden;
          // padding-right: 0px;
          // max-width: 140px;

          // img {
          //   height: 180%;
          //   margin: -25% 0 -25% -25%;
          //   min-height: 184px;
          // }
        }

        span {
          padding-top: 8px;
          display: block;
          color: #ffffff80;
          font-family: Microsoft YaHei UI;
          font-weight: 700;
          font-size: 9.8px;
          line-height: 15.15px;
          letter-spacing: 0%;
          font-variant: small-caps;

          font-weight: 400;
        }

        .item-icon {
          margin-left: auto;
          margin-top: -8px;
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

      .item-icon__language {
        margin-right: 15px;
        display: flex;
    justify-content: center;
    text-transform: uppercase;
    background: #283048;
    padding: 5px 8px;
    align-items: center;
    border-radius: 4px;
        img {
          display: block;
          width: 100%;

          &.flag {
            margin-left: 10px;
            width: 20px;
          }
        }
      }
    }
  }
  
  .profile-pic {
      position: relative;
      width: 50px;
      height: 50px;
      padding-top: 8px;
      text-align: center;
      
      // margin: 6px 6px 6px 12px;
    }

    .profile-pic-frame {
      // background-image: url(../assets/images/common/profile-frame.png);
      // width: 70px;
      // height: 70px;
      // background-size: 100%;
      // position: absolute;
      // top: -8px;
      // left: -4px;
    }

    .vip-details {
  position: relative;
  margin-bottom: 5px;
  margin-top: -15px;

  img.bg {
    display: block;
    width: 45px;
    position: absolute;
    top: -2px;
    left: 0;
    right: 0;
    margin: auto;
  }

  .vip-level {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    line-height: 1.1;
    padding-top: 3px;
    padding-bottom: 4px;
    z-index: 3;
    color: #ffffff;
    font-weight: 700;
    font-style: italic;
    display: none;
    img {
      width: 68%;
      margin-left: -7px;
    }
  }
}
}
    .progress-bar {
      // border: 1px solid #fed87d;
      // background: linear-gradient(180deg, #fff0a0 17.41%, #fff8d4 17.41%, #ffdc26 67.56%);
      // background: linear-gradient(356.25deg, #00430b -0.21%, #00ae00 93.65%);
      border-radius: 100px;
      color: #320b5b;
      // background: linear-gradient(90deg, #2CED88 0%, #9EE871 100%);

    }

    .vip-text {
      font-size: 20px;
      font-weight: 700;
    }
</style>
