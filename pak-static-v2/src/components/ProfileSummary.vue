<template>
  <div style="height: 56px" v-if="topDownload && !ui.hideDownload"></div>
  <div style="height: 60px"></div>

  <div class="shadow-pseudo" :class="{ 'with-top-download': topDownload && !ui.hideDownload }"></div>

  <div class="top-download shadow" v-if="topDownload && !ui.hideDownload">
    <div class="download-container">
      <div class="download-close" :style="!topDownloadcloseBtn && 'opacity:0'">
        <q-icon name="close" size="24px" style="color: #81889a" @click="closeTopdownload()" />
      </div>
      <div class="download-logo"><img src="../assets/images/index/download/download-logo.png" /></div>
      <!-- <div class="download-btn">
        <a :href="topDownloadUrl">
          <img src="../assets/images/index/download/top-download-btn.png" />
        </a>
      </div> -->
      <div class="download-btn-yel">
        <a :href="ui.downloadAppUrl">{{ $t("header.download") }}</a>
      </div>
      <!-- <div class="download-count">({{ topDownloadCount }}s)</div> -->
    </div>
  </div>

  <div class="menu-open" :class="{ open: menuOpen }" @click="handleMenuBackgroundClick">
    <div style="height: 56px" v-if="topDownload && !ui.hideDownload"></div>
    <div class="side-menu" @click.stop>
      <div class="side-menu-item side-menu-item__invite" @click="handleMenuRouteClick('/earn-money')">
        <div>
          {{ $t("sideNav.inviteToEarn") }}
          <span>{{ $t("sideNav.shareYourExclusiveQRCode") }}</span>
        </div>
        <div class="item-icon">
          <img src="../assets/images/auth/menu-invite.png" />
        </div>
      </div>

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

      <div class="side-menu-item" :class="{ active: activeSlide === 'Slot' }" @click="activateSlide('Slot')">
        <div class="item-icon"><img src="../assets/images/auth/menu-slot.png" /></div>
        {{ $t("sideNav.slots") }}
      </div>
      <div class="side-menu-item" :class="{ active: activeSlide === 'Live' }" @click="activateSlide('Live')">
        <div class="item-icon"><img src="../assets/images/auth/menu-live.png" /></div>
        {{ $t("sideNav.livecasino") }}
      </div>
      <div class="side-menu-item" :class="{ active: activeSlide === 'Fish' }" @click="activateSlide('Fish')">
        <div class="item-icon"><img src="../assets/images/auth/menu-fish.png" /></div>
        {{ $t("sideNav.fishing") }}
      </div>
      <div class="side-menu-item" :class="{ active: activeSlide === 'Poker' }" @click="activateSlide('Poker')">
        <div class="item-icon"><img src="../assets/images/auth/menu-poker.png" /></div>
        {{ $t("sideNav.poker") }}
      </div>
      <div class="side-menu-item" :class="{ active: activeSlide === 'Sport' }" @click="activateSlide('Sport')">
        <div class="item-icon"><img src="../assets/images/auth/menu-sport.png" /></div>
        {{ $t("sideNav.sport") }}
      </div>

      <div class="side-menu-divider"></div>

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

      <router-link class="side-menu-item side-menu-item__transparent" to="/promo?name=pak-faq">
        <div class="item-icon"><img src="../assets/images/auth/menu-faq.png" /></div>
        Faq
      </router-link>

      <a class="side-menu-item side-menu-item__transparent" :href="ui.whatsappUrl" target="_blank">
        <div class="item-icon"><img src="../assets/images/auth/menu-whatsapp.png" /></div>
        Whatsapp
      </a>

      <a class="side-menu-item side-menu-item__transparent" :href="ui.tiktokUrl" target="_blank" v-if="ui.tiktokUrl">
        <div class="item-icon"><img src="../assets/images/auth/menu-tiktok.png" /></div>
        TikTok
      </a>

      <div class="side-menu-item side-menu-item__transparent" @click="handleMenuRouteClick('/language')">
        <div class="item-icon">
          <img :src="require(`../assets/images/auth/country-flag-${$t('lang.langVal')}.png`)" class="flag" />
        </div>
        {{ $t("sideNav.language") }}
      </div>

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

  <div
    class="infoboard-container"
    :class="{
      'q-pa-md': !homeProfile,
      'with-top-download': topDownload && !ui.hideDownload,
      'logged-in': !!store.token
    }"
  >
    <!-- <img src="../assets/images/earn-money/infoboard.png" v-if="!homeProfile" /> -->
    <div class="infoboard-wrapper" :class="homeProfile && 'home-profile'">
      <div class="profile-menu">
        <img src="../assets/images/auth/auth-menu.png" @click="toggleMenuOpen()" />
      </div>
      <div class="profile-wrapper-extra">
        <div class="logo-img">
          <img src="../assets/images/auth/auth-logo-text-only.png" @click="onClickLogo" />
        </div>
      </div>
      <div class="profile-wrapper" v-if="ui.loggedIn || store.hasToken()">
        <!-- <div class="profile-details-container"> -->
        <!-- <template v-if="!homeProfile"> -->
        <!-- <div class="profile-rating"> -->
        <!-- <img src="../assets/images/index/profile-rating-off.png" alt="" /> -->
        <!-- <img src="../assets/images/index/profile-rating-off.png" alt="" /> -->
        <!-- <img src="../assets/images/index/profile-rating-off.png" alt="" /> -->
        <!-- </div> -->
        <!-- <div class="profile-agency"> -->
        <!-- <div class="profile-agency-lbl">Agency Level:</div> -->
        <!-- <div class="profile-agency-val">1</div> -->
        <!-- </div> -->
        <!-- </template> -->

        <!-- <template v-else> -->
        <!-- <div class="flex-c-start"> -->
        <!-- <div :class="`profile-balance ${isLoadingBalance ? 'active' : ''}`" @click="refreshBalance()"> -->
        <!-- <span class="currency-amount"> -->
        <!-- {{ store.currency.value }} -->
        <!-- </span> -->
        <!-- <span class="balance-amount" :style="`${store.balance > 9999999 && 'font-size: 10px'}`"> -->
        <!-- {{ isLoadingBalance ? `${$t("btn.loading")}...` : convertToCommaAmount(store.balance, false) }} -->
        <!-- </span> -->

        <!-- <q-btn square class="style-blue-btn" icon="wallet" dense @click="handleBackBtn()" /> -->
        <!-- <div class="btn-refresh">
                  <q-icon name="sync" size="16px" color="white-7"></q-icon>
                </div> -->
        <!-- </div> -->
        <!-- </div> -->
        <!-- </template> -->
        <!-- </div> -->

        <!-- <div>
          <q-btn square class="style-blue-btn" icon="add" dense @click="router.push('/deposit?from=' + route.path)" />
        </div> -->
        <!-- <div class="profile-msg btn-effect" v-if="homeProfile">
          <q-icon name="mail" size="40px" color="yellow-7" @click="router.push('/account/message')" />
          <q-chip v-if="store.unreadInboxMail" class="notification" color="red" size="xs"></q-chip>
        </div> -->
        <q-btn-dropdown no-caps :ripple="false" dropdown-icon="expand_more" class="profile-dropdown" unelevated>
          <template v-slot:label>
            <div class="profile-pic">
              <div class="unread-total" v-if="store.unreadInboxMail > 0">{{ store.unreadInboxMail }}</div>
              <q-avatar size="50px">
                <img :src="profileImagePath" />
              </q-avatar>
              <div class="profile-pic-frame" v-if="!homeProfile"></div>

              <div class="vip-details">
                <img
                  v-if="store.vip"
                  :src="require(`../assets/images/vip/smallBadge/${store.vip.toLocaleLowerCase()}.png`)"
                  alt=""
                />
                <!-- <div class="vip-level">
                  {{ store.vip }}
                </div> -->
              </div>
            </div>
          </template>

          <q-list style="background: #fff" dense unelevated flat class="dropdown-list">
            <q-item clickable v-close-popup @click="onVipClick">
              <q-item-section avatar>
                <q-avatar icon="diamond" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ $t("settings.vip") }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup @click="router.push('/account/message?from=' + route.path)">
              <q-item-section avatar>
                <q-avatar icon="mail" />
              </q-item-section>
              <q-item-section>
                <q-item-label>
                  <span class="message-amt" v-if="store.unreadInboxMail > 0">{{ store.unreadInboxMail }}</span>
                  {{ $t("settings.message") }}
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup @click="router.push('/account/order?from=' + route.path)">
              <q-item-section avatar>
                <q-avatar icon="receipt" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ $t("settings.order") }}</q-item-label>
              </q-item-section>
            </q-item>

            <hr class="menu-line" />

            <q-item clickable v-close-popup @click="router.push('/account/bank?from=' + route.path)">
              <q-item-section avatar>
                <q-avatar icon="account_balance" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ $t("settings.bank") }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup @click="onLogout()">
              <q-item-section avatar>
                <q-avatar icon="logout" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ $t("settings.logout") }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>
      <div class="profile-wrapper" v-else>
        <q-btn no-caps unelevated class="btn-primary" @click="goLogin">{{ $t("header.login") }}</q-btn>
        <q-btn no-caps unelevated class="btn-secondary" @click="router.push('/register')">
          {{ $t("header.register") }}
        </q-btn>
        <div class="btn-lang" @click="router.push('/language')"><img src="../assets/images/auth/icon-globe.png" /></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useQuasar, Platform } from "quasar";
import { userStore } from "stores/index";
import { useRoute, useRouter } from "vue-router";
import { convertToCommaAmount, isAndroid, isInPwa } from "src/boot/utils";
import { api } from "boot/axios";
import { useUI } from "stores/ui";
import { cached, TIME_EXPIRED } from "boot/cache";
import { useI18n } from "vue-i18n";
import LangOptions from "components/LangOptions";

import { defineEmits } from "vue";

const props = defineProps(["homeProfile"]);
const emits = defineEmits(["closeslot", "activateSlide"]);
const route = useRoute();
const router = useRouter();
const store = userStore();
const ui = useUI();

const loadCustomerAddress = () => {
  cached
    .get("customerAddress", () =>
      api.get("/config/customerAddress/v2").then((res) => {
        return res;
      })
    )
    .then((data) => {
      console.log(data);
      var url = data.liveUrl1;
      ui.CSAUrl = url;
    });
};

const openCSInNewTab = (url) => {
  const absoluteUrl = url;
  window.open(absoluteUrl, "_blank");
  menuOpen.value = false;
};

const activateSlide = (item) => {
  router
    .push(`/home#${item}`)
    .then(() => {
      if (props.homeProfile) {
        emits("closeslot");
      }
      emits("activateSlide", item);
      menuOpen.value = false;
    })
    .catch((error) => {
      console.error("Navigation error:", error);
    });
  menuOpen.value = false;
};

const profileImg = [
  {
    imgPath: ["profile-pic"]
  }
];

const goLogin = () => {
  if (props.homeProfile) {
    emits("closeslot");
  }
  router.push("/login");
};

const randomProfileImg = computed(() => {
  const storedImg = sessionStorage.getItem("PROFILE_IMG");
  if (storedImg) {
    return storedImg;
  } else {
    const randomProfile = profileImg[0];
    const randomIndex = Math.floor(Math.random() * randomProfile.imgPath.length);
    const imgPath = randomProfile.imgPath[randomIndex];
    sessionStorage.setItem("PROFILE_IMG", imgPath);
    return imgPath;
  }
});

const profileImagePath = computed(() => {
  return require(`../assets/images/account/${randomProfileImg.value}.png`);
});

const activeSlide = computed(() => route.hash.replace("#", ""));

const isLoadingBalance = ref(false);
const refreshBalance = () => {
  if (store.token) {
    isLoadingBalance.value = true;
    store.getBalance().then((res) => {
      isLoadingBalance.value = false;
    });
  }
};

const onClickLogo = () => {
  if (isAndroid()) {
    window.open("http://0vsadwuz3sh.com/", "_blank");
    return;
  }

  router.push("/");
};

const onVipClick = () => {
  router.push({ path: "/vip", query: { redirect: route.path } });
};

const onLogout = () => {
  store.memberLogout().then(() => {
    // location.reload();
    router.push("/home");
  });
};

const topDownload = ref(false);
const topDownloadcloseBtn = ref(true);

const topDownloadCount = ref(6);

const closeTopdownload = () => {
  topDownload.value = false;
};

const countdown = () => {
  if (topDownloadCount.value > 0) {
    topDownloadCount.value--;
    setTimeout(countdown, 1000); // Update every 1000 milliseconds (1 second)
  }
};

const checkTopDownloadAppear = () => {
  const omitSites = ["bw3.genoortisy.com"];

  if (route.path === "/home") {
    // console.log("Platform", Platform);
    if (
      ("standalone" in window.navigator && window.navigator.standalone) ||
      (Platform.is.capacitor && Platform.is.android) ||
      omitSites.includes(location.host)
    ) {
      topDownload.value = false;
    } else {
      topDownload.value = true;
      // countdown();
      // setTimeout(() => {
      //   topDownload.value = false;
      // }, 6000);
    }
  }
};

const menuOpen = ref(false);

const toggleMenuOpen = () => {
  menuOpen.value = !menuOpen.value;
};

const handleMenuBackgroundClick = (event) => {
  // if (event.target === event.currentTarget) {
  menuOpen.value = false;
  // }
};

const handleMenuRouteClick = (route) => {
  router.push(route);
  menuOpen.value = false;
};

const sideLang = ref(false);
const handleBackBtn = () => {
  if (props.homeProfile) {
    emits("closeslot");
  }
  router.push("/deposit?from=" + route.path);
};

const isSideDownload = ref(false);

onMounted(() => {
  if (!sessionStorage.getItem("PROFILE_IMG")) {
    const randomProfile = profileImg[0];
    const randomIndex = Math.floor(Math.random() * randomProfile.imgPath.length);
    const imgPath = randomProfile.imgPath[randomIndex];
    sessionStorage.setItem("PROFILE_IMG", imgPath);
  }

  checkTopDownloadAppear();
  loadCustomerAddress();
  ui.shouldFetchDownloadAppUrl = true;

  sideLang.value = store.memberType === "TEST";
  if (isAndroid() || isInPwa() || store.isFromGooglePackage) {
    isSideDownload.value = false;
  } else {
    isSideDownload.value = true;
  }
});
</script>

<style scoped lang="scss">
.shadow-pseudo {
  position: fixed;
  z-index: 2004;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  max-width: 500px;
  width: 100%;
  height: 60px;
  background-color: transparent;
  box-shadow: 0px -5px 8px 0px #c3d4e6 inset, 0px 2px 0px 0px #a7c2dd;
  pointer-events: none;

  &.with-top-download {
    height: 115px;
  }
}
.top-download {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  max-width: 500px;
  margin: auto;
  width: 100%;
  height: 55px; /* adjust the height as needed */
  padding: 12px 16px 28px;
  background: #fff;
  // backdrop-filter: blur(6px);
  z-index: 2003;

  // &.shadow {
  //   box-shadow: -5px 4px 8px -5px #c3d4e6 inset, 5px 4px 8px -5px #c3d4e6 inset;
  // }

  .download-container {
    display: flex;
    // gap: 16px;
    width: 100%;
    align-items: center;
    transition: 0.3s all;
    > * {
      margin-left: 16px;
    }

    .download-icon {
      width: 50px;
      min-width: 50px;

      img {
        width: 100%;
        display: block;
      }
    }

    .download-rating {
      .rate-exp {
        margin-bottom: 4px;
        text-wrap: nowrap;
        font-size: 12px;
      }

      .rate-stars {
        img {
          display: block;
          width: 100%;
        }
      }
    }

    .download-count {
      color: #97a6b4;
      font-size: 20px;
      width: 50px;
    }

    .download-btn {
      // margin-left: auto;
      margin-left: auto;
      display: none;

      img {
        width: 100%;
        display: block;
      }
    }

    .download-btn-yel {
      margin-left: auto;
      // display: none;

      a {
        background: $linear-bg;
        text-decoration: none;
        color: #fff;
        font-weight: bold;
        font-size: 12px;
        min-width: 104px;
        padding: 0 8px;
        height: 36px;
        border-radius: 40px;
        // padding: 12px 16px;

        display: flex;
        justify-content: center;
        align-items: center;
      }
    }

    .download-close {
      margin-top: 4px;
      margin-bottom: auto;
      opacity: 1;
      transition: 1s all;
    }
    .download-logo img {
      max-height: 33px;
      max-width: 100%;
    }
  }
}

.menu-open {
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(19, 19, 19, 0.9);
  backdrop-filter: blur(4px);
  width: 100%;
  height: 100%;
  display: block;
  z-index: 2002;
  transition: 0.3s all;
  margin-left: -100%;
  &.open {
    margin-left: 0;
  }

  .side-menu {
    padding-top: 72px;
    background-color: #fff;
    width: 202px;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding-left: 16px;
    padding-right: 16px;
    // gap: 12px;
    transition: 0.3s all;
    overflow-y: auto;

    > * {
      margin-bottom: 12px;
    }

    .side-menu-divider {
      background: #3636360d;
      height: 2px;
      width: 100%;
      margin-top: 4px;
      margin-bottom: 4px;
    }

    .side-menu-item {
      height: 50px;
      padding: 12px;
      display: flex;
      align-items: center;
      width: 170px;
      background-color: rgba(255, 255, 255, 0.05);
      border-radius: 5px;
      color: #9f9f9f;
      font-weight: bold;
      line-height: 1.2;
      text-decoration: none;

      &.active {
        background-color: #4877f60d;
        color: #73b2ff;
        img {
          filter: brightness(0) saturate(100%) invert(64%) sepia(14%) saturate(1526%) hue-rotate(176deg)
            brightness(101%) contrast(102%);
        }
      }

      &__download {
        background: $linear-bg;
        color: #fff;
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
        background: linear-gradient(270deg, #7a1683 0%, #171719 100%);
        padding-left: 18px;
        font-size: 80%;
        color: #ffffff;
        span {
          font-size: 9px;
          padding-top: 4px;
          display: block;
          color: #ffe500;
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

.infoboard-container {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background-color: #fff;
  // background-image: url("../assets/images/auth/auth-bg.png");
  // background-size: 100% 100%;
  // box-shadow: 0px -3px 7px 0px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: fixed;
  top: 0;
  width: 100%;
  max-width: 500px;
  z-index: 2003;
  transition: 0.3s all;
  height: 60px;

  &.with-top-download {
    // border-top-right-radius: 25px;
    // border-top-left-radius: 25px;
    top: 55px;
  }

  &.logged-in {
    // background-color: #e9f2fd;
    box-shadow: none;
  }

  .infoboard-wrapper {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.5rem;
    // width: 22rem;
    width: 100%;
    margin: 0;

    &.home-profile {
      position: relative;
      width: 100%;
      gap: 0;
      justify-content: space-between;
      align-items: center;
      padding: 0 12px;
      // overflow-y: hidden;

      .profile-pic {
        margin-top: -20px;
        margin-right: 20px;
      }
    }
  }

  .profile-dropdown {
    margin-top: 15px;
  }
  .profile-wrapper {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    // gap: 6px;
    padding-top: 8px;
    padding-bottom: 5px;
    margin-bottom: 4px;
    width: 100%;
    position: relative;

    > * {
      margin-left: 6px;
    }

    .btn-lang {
      img {
        display: block;
        width: 24px;
        // filter: brightness(0) invert(50%) sepia(11%) saturate(3258%) hue-rotate(77deg) brightness(122%) contrast(75%);
        // filter: brightness(1) sepia(0) hue-rotate(0deg) saturate(1);
        animation: hueBlink 1s infinite;
      }
    }

    .unread-total {
      position: absolute;
      right: 0px;
      top: 0px;
      background: #4e97fa;
      border-radius: 100px;
      padding: 0px 3px;
      z-index: 1;
      font-size: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      color: #fff;
    }

    .profile-pic {
      position: relative;
      margin: 6px 6px 6px 12px;
    }

    .profile-pic-frame {
      // background-image: url(../assets/images/common/profile-frame.png);
      width: 70px;
      height: 70px;
      background-size: 100%;
      position: absolute;
      top: -8px;
      left: -4px;
    }

    .profile-details-container {
      display: flex;
      flex-direction: column;
      font-size: 16px;
    }

    .profile-name {
      display: flex;
      align-items: center;
      line-height: 1;
      gap: 10px;
    }

    .profile-agency {
      display: flex;
      gap: 0.75rem;

      .profile-agency-lbl {
        color: rgba(255, 255, 255, 0.5);
      }
    }

    .profile-rating {
      display: flex;
      gap: 6px;

      img {
        display: block;
        width: 20px;
      }
    }

    .profile-balance {
      position: relative;
      background: #1e4fff1a;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 6px;
      min-width: 100px;
      width: 100%;
      min-height: 35px;
      font-size: 14px;
      color: #8c968f;
      font-weight: bold;

      &:active {
        filter: brightness(0.75);
      }

      .currency-amount {
        color: #8c968f;
        font-size: 12px;
        margin-right: auto;
        padding-right: 4px;
      }

      .balance-amount {
        padding-right: 18px;
        white-space: nowrap;
        color: #3181f5;
      }
    }

    .profile-msg {
      margin-left: auto;
      position: relative;

      .notification {
        position: absolute;
        top: -0.25rem;
        left: -0.5rem;
      }
    }
  }

  .profile-menu {
    display: flex;

    img {
      display: block;
      width: 30px;
      height: 30px;
    }
  }

  .profile-wrapper-extra {
    display: flex;
    align-items: center;
    width: 100%;
    margin-left: 12px;
  }

  .logo-img {
    width: 100%;
    margin: 0 auto;
    // display: flex;

    img {
      max-width: 115px;
      width: 100%;
      text-align: center;
      display: block;
    }
  }

  img {
    width: 30rem;
  }
}

.vip-details {
  position: relative;
  margin-left: 20px;
  margin-bottom: 5px;
  margin-top: -15px;

  img {
    display: block;
    width: 60px;
    position: absolute;
    top: -2px;
    left: -25px;
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
    color: #4e97fa;
    font-weight: 700;
    font-style: italic;
  }
}

.vip-chevron {
  position: absolute;
  top: 25px;
  right: -25px;
}

.btn-refresh {
  position: absolute;
  right: 0px;
  top: 50%;
  transform: translate(-50%, -50%);
}

.style-blue-btn {
  background: $linear-bg;
  border-radius: 5px;
  animation: blink 1.5s infinite;
  color: #fff;
}

.menu-line {
  border-color: #f3f3f3;
}

@media (max-width: 375px) {
  .infoboard-container .profile-wrapper {
    gap: 4px;
  }

  .infoboard-container .infoboard-wrapper.home-profile {
    padding: 0px 4px;
  }
}

.message-amt {
  background-color: #4e97fa;
  border-radius: 30px;
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 1;
  font-size: 10px;
  position: absolute;
  bottom: 5px;
  left: 15px;
  font-weight: bold;
  color: #fff;
}
</style>

<style lang="scss">
.q-btn-dropdown--simple * + .q-btn-dropdown__arrow {
  margin-left: -12px !important;
}

.q-btn-dropdown--simple {
  width: 80px !important;
}

.q-item__label {
  color: #35648f;
  font-weight: 500;
}

.q-avatar {
  i.q-icon {
    color: #3080f4;
  }
}

.q-item__section--avatar {
  min-width: 40px;
}

.q-item__section--side {
  padding-right: 6px;
}

.q-menu--dark {
  // box-shadow: none;
  box-shadow: 0px 0px 20px 5px rgba(0, 0, 0, 0.2) !important;
}

.dropdown-list {
  // box-shadow: 14px 14px 14px rgba(0, 0, 0, 0.4) !important;
}

@keyframes hueBlink {
  50% {
    filter: brightness(0) saturate(100%) invert(41%) sepia(24%) saturate(6433%) hue-rotate(203deg) contrast(91%);
  }
}

@keyframes blink {
  0% {
    filter: brightness(0.8) saturate(0.8) contrast(0.8);
  }

  50% {
    filter: brightness(1.3) saturate(1) contrast(1);
  }

  100% {
    filter: brightness(0.8) saturate(0.8) contrast(0.8);
  }
}
</style>
