<template>
  <header class="header-container">
    <div class="top-nav-wrapper">
      <div class="top-nav">
        <div class="left-hamb">
          <div class="hamburger" :class="globalStore.isMenuActive ? 'active' : ''" @click="showMobileMenu">
            <img src="../../assets/hamburger.svg" v-if="!globalStore.isMenuActive" style="transform: rotate(180deg)" />
            <img src="../../assets/hamburger.svg" v-if="globalStore.isMenuActive" />
          </div>
          <Logo />
          <text-switch
            :tabs="switches"
            v-model="activateTab"
            class="text-switch-wrapper"
            @change="handleSwitchChange"
          />
        </div>

        <div class="header-menu-container mobile-menu-hide" :class="globalStore.isMenuActive ? 'active' : ''">
          <router-link class="without-divider" to="/share">
            <img src="@/assets/images/layout/header/invite-to-earn.png" />
          </router-link>
          <ul class="header-menu-list">
            <li v-for="nav in sortedNavigations" :key="nav.name" class="header-menu-item">
              <router-link
                :to="nav.path"
                class="header-nav"
                @mouseover="hoveredMenu = nav.code"
                :class="[nav.code.toLowerCase(), nav.submenu ? 'suffix' : '']"
              >
                {{ nav.name }}
              </router-link>
              <!-- TODO: sub menu? -->
              <!-- <div
                v-if="nav.hasSub"
                class="submenu"
                :class="{ active: hoveredMenu === nav.code }"
                @mouseleave="hoveredMenu = ''"
              >
                <div v-if="nav.code === 'E-sports'" class="inner-side-menu">
                  <router-link v-for="(sub, a) in nav.submenu" :key="a" :to="`/e-sport`">
                    <div class="inner-sub">
                      <img :src="require(`../../assets/images/common/submenu/esport-${sub.icon}.png`)" />
                      <div class="text">
                        <span>{{ sub.code }}</span>
                        <span>{{ nav.name }}</span>
                      </div>
                    </div>
                  </router-link>
                </div>
                <div v-if="nav.code === 'Sports'" class="inner-side-menu">
                  <router-link v-for="(sub, a) in nav.submenu" :key="a" :to="`/sport`">
                    <div class="inner-sub">
                      <img :src="require(`../../assets/images/common/submenu/sport-${sub.icon}.png`)" />
                      <div class="text">
                        <span>{{ sub.code }}</span>
                        <span>{{ nav.name }}</span>
                      </div>
                    </div>
                  </router-link>
                </div>
                <div v-if="nav.code === 'Slots'" class="inner-slot-menu">
                  <router-link v-for="(sub, a) in nav.submenu" :key="a" :to="`/slot?plat=${sub.code}`">
                    <div class="slots-sub">
                      <img :src="require(`../../assets/images/common/logo/${sub.icon}.png`)" />
                    </div>
                  </router-link>
                </div>
                <div v-if="nav.code === 'Fishing'" class="inner-bottom-menu">
                  <router-link v-for="(sub, a) in nav.submenu" :key="a" :to="`/aviator?plat=${sub.code}`">
                    <div class="inner-sub">
                      <img :src="require(`../../assets/images/common/submenu/fish-${sub.icon}.png`)" />
                      <div class="text">
                        <span>{{ sub.code }}</span>
                        <span>{{ nav.name }}</span>
                      </div>
                    </div>
                  </router-link>
                </div>
                <div v-if="nav.code === 'casino'" class="inner-bottom-menu">
                  <span
                    v-for="(sub, a) in nav.submenu"
                    :key="a"
                    @click="playGame(sub.name, sub.code, sub.gameCode, sub.status)"
                  >
                    <div class="inner-sub">
                      <img :src="require(`../../assets/images/games/liveCasino/${sub.icon}.png`)" />
                      <div class="text">
                        <span>{{ sub.gameName }}</span>
                        <span>{{ nav.name }}</span>
                      </div>
                    </div>
                  </span>
                </div>
                <div v-if="nav.code === 'CockFight'" class="inner-side-menu">
                  <router-link v-for="(sub, a) in nav.submenu" :key="a" :to="`/cockfight`">
                    <div class="inner-sub">
                      <img :src="require(`../../assets/images/common/submenu/${sub.icon}`)" />
                      <div class="text">
                        <span>{{ sub.code }}</span>
                        <span>{{ nav.name }}</span>
                      </div>
                    </div>
                  </router-link>
                </div>
                <div v-if="nav.code === 'bingo'" class="inner-side-menu">
                  <router-link v-for="(sub, a) in nav.submenu" :key="a" :to="`/bingo`">
                    <div class="inner-sub">
                      <img :src="require(`../../assets/images/common/submenu/${sub.icon}`)" />
                      <div class="text">
                        <span>{{ sub.code }}</span>
                        <span>{{ nav.name }}</span>
                      </div>
                    </div>
                  </router-link>
                </div>
                <div v-if="nav.code === 'Poker'" class="inner-bottom-menu">
                  <span
                    v-for="(sub, a) in nav.submenu"
                    :key="a"
                    @click="playGame(sub.name, sub.code, sub.gameCode, sub.status)"
                  >
                    <div class="inner-sub">
                      <img :src="sub.menuicon" />
                      <div class="text">
                        <span>{{ sub.gameName }}</span>
                        <span>{{ nav.name }}</span>
                      </div>
                    </div>
                  </span>
                </div>
              </div> -->
            </li>
          </ul>
          <ul class="header-menu-list">
            <li class="header-menu-item">
              <a class="header-nav live-support" href="https://direct.lc.chat/16986612/" target="_blank">
                Live Support
              </a>
              <a class="header-nav feedback" @click="openFeedback">Feedback</a>
              <a class="header-nav telegram" href="https://t.me/B9game" target="_blank">Telegram</a>
              <a
                class="header-nav whatsapp"
                href="https://whatsapp.com/channel/0029VacTtkK9RZAWeWe6NI3l"
                target="_blank"
              >
                Whatsapp
              </a>
              <!-- TODO: wait i18n -->
              <!-- <a class="header-nav language" href="" target="_blank">Language</a> -->
            </li>
          </ul>
          <!-- <bet-ranking /> -->
        </div>

        <!-- <div class="mobile-menu-overlay" @click="showMobileMenu" /> -->

        <!-- <Jackpot /> -->
        <!-- <div class="toggle-box">
          <input
            type="checkbox"
            @click="toggleTheme"
            name="checkbox1"
            id="toggle-box-checkbox"
            :checked="globalStore.isDarkMode"
          />
          <label for="toggle-box-checkbox" class="toggle-box-label-left"></label>
          <label for="toggle-box-checkbox" class="toggle-box-label"></label>
        </div> -->
        <!-- <router-link to="/getapp" class="apphead">
          <img src="../../assets/images/common/appheadicon.svg" />
        </router-link> -->
        <!-- <router-link to="/vip" class="viphead">
          <img src="../../assets/images/common/vipheadicon.svg" />
        </router-link> -->
        <div v-if="!token" class="login-box">
          <button class="common-btn login-btn" @click="openAccountModal">Login</button>
          <button class="common-btn reg-btn" @click="openAccountModal('register')" style="margin-right: 30px">
            Register
            <!-- <img style="position: absolute; right: -30px" src="../../assets/images/common/regpresent.png" /> -->
          </button>
        </div>
        <div v-else class="login-box">
          <!-- <button class="action-btn">
            <RiSearchLine />
          </button> -->
          <router-link
            class="action-btn"
            :class="{ 'has-unread-notification': !!unreadInboxMail }"
            to="/center/mailbox"
          >
            <img :src="NotificationSvg" />
          </router-link>
          <!-- <div class="header-balance">
            <div v-if="isLoadingBal">Loading...</div>
            <div v-else>₱ {{ balance.toFixed(2) }}</div>

            <div class="refreshbtn" @click="refreshBalance"><img src="../../assets/images/common/refresh.png" /></div>
          </div> -->
          <router-link class="common-btn deposit-btn" to="/center/top-up">
            {{ $t("layout.header.deposit") }}
          </router-link>
          <UserProfile @open-dialog="trigger" />
          <button class="action-btn" @click="handleLogoutClick">
            <RiLoginBoxLine />
          </button>
        </div>
      </div>
      <SpinWheelModal ref="spinWheel" @spinWheelOnClose="spinWheelOnCloseHandler" />
      <GameModal ref="casinoGame" />
      <AppPromoModal ref="appPromo" />
      <ClaimModal ref="claimPromo" />
      <DailyLoginCashBonusPromoPopup ref="dailyLoginPromoPopup" />
      <AdsPopupList ref="adsPopupListRef" />
      <AccountModal v-model="accountModalVisible" :isReg="accountModalRegVisible" />
      <FeedbackModal ref="feedbackModalRef" v-model="feedbackModalVisible" />
      <LogoutModal v-model="logoutModalVisible" @confirm="onLogout" />
    </div>
  </header>
</template>

<script setup>
import "vue3-carousel/dist/carousel.css";
import { onMounted, onUnmounted, ref, computed, watch } from "vue";
import { storeToRefs } from "pinia";
import { userStore, globalStore } from "@/store";
import {
  RiSearchLine,
  RiWallet3Line,
  RiUser5Line,
  RiBankCardLine,
  RiBankLine,
  RiMailLine,
  RiShieldFlashLine,
  RiLogoutCircleLine,
  RiShareBoxLine,
  RiListSettingsLine,
  RiLoginBoxLine
} from "vue-remix-icons";
import { useRoute } from "vue-router";
import { kycAPI, loadPromo } from "@/api/index/promo";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import Platforms from "@/constant/platforms";

import Logo from "@/components/Logo";
import TextSwitch from "@/components/layout/header/TextSwitch.vue";
import UserProfile from "@/components/layout/header/UserProfile.vue";
import GameModal from "@/components/modal/GameModal";
import SpinWheelModal from "@/components/modal/SpinWheelModal";
import AppPromoModal from "@/components/modal/appPromoModal";
import AdsPopupList from "@/components/hotpromo/adsPopupList.vue";
import ClaimModal from "@/components/modal/claimPromoModal";
import DailyLoginCashBonusPromoPopup from "@/components/hotpromo/DAILY-LOGIN-CASH-BONUS/DailyLoginCashBonusPromoPopup.vue";
import NotificationSvg from "@/assets/images/layout/header/notification.svg";
import AccountModal from "@/components/layout/header/AccountModal.vue";
import BetRanking from "@/components/layout/header/BetRanking.vue";
import FeedbackModal from "@/components/layout/header/FeedbackModal.vue";
import LogoutModal from "@/components/layout/header/LogoutModal.vue";

const navigations = [
  // { code: "VIP", name: "VIP", path: "/vip" },
  // { code: "GetApp", name: "Download APP", path: "/getapp" },
  // { code: "Home", name: "Hot", path: "/home" },
  // { code: "Jackpot", name: "Jackpot", path: "/jackpot" },
  ...Platforms
  // { code: "Promotion", name: "Promotion", path: "/promotion" },
  // { code: "Affiliates", name: "Affiliates", path: "/affiliate" },
  // { code: "AppTutorial", name: "App Tutorial", path: "/app-tutorial" }
];

const sortedNavigations = navigations.sort((a, b) => a.tabOrder - b.tabOrder);

const router = useRouter();
const route = useRoute();
const { t } = useI18n();

const isLoadingBal = ref(true);
const casinoGame = ref(null);
const spinWheel = ref(null);
const appPromo = ref(null);
const dailyLoginPromoPopup = ref();
const adsPopupListRef = ref();
const activateTab = ref("casino");
const feedbackModalVisible = ref(false);
const logoutModalVisible = ref(false);

const switches = computed(() => [
  { label: t("layout.header.switch.casino"), value: "casino" },
  { label: t("layout.header.switch.promotion"), value: "promotion" }
]);

const spinWheelOnCloseHandler = () => {
  const isGo = sessionStorage.getItem("IS_GO_PAGE");
  if (!isGo) {
    adsPopupListRef.value.initAdsPopupList();
  }
  sessionStorage.removeItem("IS_GO_PAGE");
};

const getSpinWheel = () => {
  //API
  spinWheel.value.open();
};
const getAppPromo = () => {
  kycAPI().then((res) => {
    if (res.code === 0) {
      if (res.data.hasKYC) {
        appPromo.value.open();
      }
    }
  });
};

const claimPromo = ref(null);

const getClaimPromo = () => {
  claimPromo.value.open();
};

const openFeedback = () => {
  if (store.token) {
    feedbackModalVisible.value = true;
  } else {
    openAccountModal();
  }
};

function playGame(gameName, platformCode, gameCode, status) {
  casinoGame.value.open(gameName, platformCode, gameCode, status);
}

const store = userStore();
const { token, accountModalVisible, unreadInboxMail, accountModalRegVisible } = storeToRefs(store);
const { openAccountModal } = store;
const triggerMenu = ref(null);
const feedbackModalRef = ref(null);
onMounted(() => {
  if (store.token) {
    store.getBalance();
    store.getUnreadNotification();
    isLoadingBal.value = false;
  }
  activateTab.value = route.path === "/promotion" ? "promotion" : "casino";
  getBalance();
  window.addEventListener("scroll", onScroll);
});
const getBalance = () => {
  setInterval(function () {
    if (store.token) {
      store.getBalance();
    }
  }, 20000);
  isLoadingBal.value = false;
};
const refreshBalance = () => {
  isLoadingBal.value = true;
  setTimeout(() => {
    store.getBalance();
    isLoadingBal.value = false;
  }, 100);
};
onUnmounted(() => window.removeEventListener("resize", onScroll));
const balance = computed(() => {
  return store.balance;
});
const vip = computed(() => {
  return store.vip;
});
const nickName = computed(() => {
  return store.nickName;
});

const onLogout = () => {
  store.memberLogout().then(() => {
    router.push("/");
    // location.reload();
  });
};
const trigger = () => {
  triggerMenu.value = !triggerMenu.value;
  // if (triggerMenu.value === true) {
  //   globalStore.isMenuActive = false;
  // }
};
let windowScroll = ref(window.scrollY);
// var $animation_elements = document.getElementsByClassName("mod-slide");
// var $window = window;

const onScroll = () => {
  windowScroll.value = window.scrollY;
};

//   watch(
//     () => route.name,
//     () => {
//       globalStore.isMenuActive = false;
//       triggerMenu.value = false;
//     }
//   );
watch(
  () => store.token,
  () => {
    if (store.token) {
      feedbackModalRef.value.loadFeedBackType();

      loadPromo().then((res) => {
        if (res.code === 0) {
          const promoDetails = res.data;

          promoDetails.forEach((element) => {
            if (
              element.privilegeStatus === "OPEN" ||
              (store.memberType === "TEST" && element.privilegeStatus === "TEST")
            ) {
              if (element.promoCode === "P4W-ROULETTE-TOTO") {
                spinWheel.value
                  .open()
                  ?.then((isShowSpinWheelSuccess) => {
                    if (isShowSpinWheelSuccess) {
                      return;
                    }

                    adsPopupListRef.value.initAdsPopupList();
                  })
                  .catch((err) => {
                    console.log(err);
                    adsPopupListRef.value.initAdsPopupList();
                  });
              }
            }
          });
        }
      });
    }
  }
);
const scroll = computed(() => windowScroll.value);

var showMobileMenu = () => {
  globalStore.isMenuActive = !globalStore.isMenuActive;
  if (globalStore.isMenuActive === true) {
    triggerMenu.value = false;
  }
};
const hoveredMenu = ref("");
const DARK_MODE = "DARKMODE";
const toggleTheme = () => {
  globalStore.isDarkMode = !globalStore.isDarkMode;
  if (globalStore.isDarkMode) {
    localStorage.setItem(DARK_MODE, true);
  } else {
    localStorage.setItem(DARK_MODE, false);
  }
};

const handleSwitchChange = (value) => {
  if (value === "casino") {
    router.push("/home");
  } else {
    router.push("/promotion");
  }
};

const handleLogoutClick = () => (logoutModalVisible.value = true);
</script>
<style scoped lang="scss">
$navigation-height: 80px;
$link-color: #ffffff;

.setting-hamburger {
  overflow: hidden;

  &:before {
    content: "";
    width: 189px;
    height: 200px;
    position: absolute;
    right: 0;
    top: 22px;
  }

  cursor: pointer;

  &:hover {
    overflow: unset;

    .abs-menu.desktop {
      box-shadow: 0 0 30px -10px #000000;
      display: block !important;
    }
  }
}

.viphead {
  margin: 0 20px;
}

.apphead {
  // margin-left: auto;
  img {
    filter: invert(1);
  }
}

.dark-theme {
  .apphead {
    img {
      filter: invert(0);
    }
  }
}

.main-body {
  .top-nav-wrapper {
    transition: all 1s;
    background-size: 100% 400%;
    background-position: 100% 0%;
    position: relative;

    &::before,
    &::after {
      display: block;
      position: absolute;
      content: "";
      right: 20px;
      top: 0;
      bottom: 0;
      transform: skewX(25deg);
    }

    &::before {
      z-index: -2;
      left: calc($menu-width - 20px);
      background: linear-gradient(270.76deg, #171719 85%, #252527 99.76%);
    }

    &::after {
      z-index: -1;
      left: calc($menu-width + 90px);
      background: linear-gradient(270.15deg, #13161b 0%, #171719 45.21%, #292929 99.37%);
    }

    .login-btn {
      transition: all;
      background: linear-gradient(180deg, #1baa99 0%, #8ac542 100%);
      padding: 10px 20px;
      width: 90px;
      border-radius: 6px;
      gap: 10.53px;
      font-size: 12px;
      font-weight: 700;
      line-height: 16.8px;
      letter-spacing: -0.0008em;
      color: #000a01;
    }

    .reg-btn {
      width: unset;
      transition: all;
      background: transparent;
      padding: 10px 20px;
      border-radius: 6px;
      gap: 10.53px;
      position: relative;
      position: relative;
      font-size: 12px;
      font-weight: 700;
      line-height: 16.8px;
      color: #ffffff;

      &::after {
        position: absolute;
        content: "";
        inset: 0;
        padding: 1px;
        background: linear-gradient(180deg, #61ff00 0%, rgba(255, 255, 255, 0) 100%);
        mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        mask-composite: exclude;
        pointer-events: none;
        border-radius: 6px;
      }
    }

    .deposit-btn {
      width: unset;
      transition: all;
      background: var(--primary-linear-background-color);
      padding: 12px 20px;
      border-radius: 26.32px;
      gap: 10.53px;
      position: relative;
      border: 1px solid #cbe3ad;
      font-size: 16px;
      font-weight: 700;
      line-height: 20px;
      color: #ffffff;
    }
  }
}

.dark-theme {
  $link-color: #83a3ca;

  .header-container {
    .login-box .header-balance {
      background: #25313e;
      color: #ffffff;
    }

    .login-box .dropdown-container .abs-menu.desktop {
      background-position: 100% 100%;
      color: #fff;

      li {
        a {
          &:hover {
            color: #ffffff;
            background-image: unset;
            -webkit-text-fill-color: white;

            .icon {
              filter: brightness(100);
            }
          }

          border-bottom: 1px solid #2d3944;

          &.last {
            border-bottom: 0;
          }
        }

        &:last-child {
          a {
            border: 0;
          }
        }
      }
    }

    .header-menu-container {
      .header-menu-list {
        .header-menu-item {
          color: #ffffff;

          .header-nav {
            // color: #ffffff;
            // margin: 0;
            // border-radius: 0;
            // background: none;
            background: #ffffff0f;

            &:hover,
            &.router-link-exact-active {
              // background: linear-gradient(270deg, rgba(57, 129, 255, 0.2) 0%, rgba(20, 29, 38, 0.2) 100%);
              // box-shadow: none;

              &:hover,
              &.router-link-exact-active {
                background: linear-gradient(270deg, #1baa99 0%, #8ac542 100%);
                box-shadow: 0px -4px 4px 0px #02009e inset;
                box-shadow: -1px 2px 4px 0px #ffffffcc inset;
                color: #ffffff;

                &:before {
                  filter: grayscale(0);
                  -webkit-transform: translateZ(0);
                  -webkit-perspective: 1000;
                  -webkit-backface-visibility: hidden;
                }
              }

              &:hover {
                background: linear-gradient(270deg, #1baa99 0%, #8ac542 100%);
              }
            }
          }
        }
      }

      &:before {
        background-position: 100% 100%;
        box-shadow: 0px 4px 4px 0px #04003026;
      }
    }
  }

  .top-nav-wrapper {
    box-shadow: 0px 4px 4px 0px #00000040;
    background-position: 100% 100%;
    color: #fff;

    .login-btn {
      background: linear-gradient(91.02deg, rgba(255, 230, 0, 0.16) 0%, rgba(72, 167, 255, 0.16) 100%),
        linear-gradient(270deg, #e84600 0%, #e8df00 100%);
      color: #ffffff;
    }

    .reg-btn {
      color: #ffffff;
    }
  }
}

.mobile-menu-hide {
  display: none;
}

.hamburger {
  display: inline-block;
  width: 30px;
  vertical-align: middle;
  flex-shrink: 0;
  cursor: pointer;

  svg {
    fill: #83a3ca;
    display: block;
  }

  img {
    width: 20px;
  }
}

.header-container {
  width: 100%;
  position: sticky;
  top: 0;
  z-index: 999;
  background-color: #171719;

  .container {
    position: relative;
  }

  .top-nav-wrapper {
    height: $navigation-height;
    display: flex;

    .top-nav {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      justify-content: space-between;
      width: 100%;
      padding: 0 10px;
    }
  }

  .mobile-menu-overlay {
    // background-color: rgba(0, 0, 0, 0.65);
    // width: 100%;
    // height: calc(100vh - $navigation-height);
    // top: $navigation-height;
    // left: 0;
    // position: fixed;
    // opacity: 0;
    // pointer-events: none;
    // z-index: -1;
    // transition: opacity 0.3s;
    // display: block;
  }

  .left-hamb {
    display: flex;
    flex: 0 0 90px;
    align-items: center;

    .text-switch-wrapper {
      margin-left: 116px;
    }
  }

  // header
  .header-menu-container {
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    transition: all 0.3s;
    isolation: isolate;
    position: absolute;
    left: 0;
    top: $navigation-height;
    width: $menu-width;
    height: calc(100vh - $navigation-height);
    overflow: auto;
    transition: all 0.3s ease-in-out;
    transform: translateX(-100%);
    box-shadow: 6px 0px 8px 0px #0000000d;
    background: var(--nav-background-color);
    padding: 0 10px;

    .desktop-hide {
      display: block;
    }

    &.active {
      transform: translateX(0%);

      + .mobile-menu-overlay {
        opacity: 1;
        pointer-events: all;
      }
    }

    img {
      width: 100%;
    }

    &.active {
      &:before {
        opacity: 1;
      }
    }

    > *:not(:last-child) {
      &::after {
        content: "";
        display: block;
        height: 2px;
        background-color: #ffffff0d;
        margin: 20px 0;
      }
    }

    .without-divider {
      &::after {
        display: none;
      }
    }
  }

  // ul
  .header-menu-list {
    display: flex;
    flex-wrap: nowrap;
    font-size: 1.2rem;
    padding: 0;
    flex-direction: column;
    margin: 0;
    // li
    .header-menu-item {
      flex: 1 1 auto;
      white-space: nowrap;
      flex-grow: 0;
      // a
      .divider {
        width: 100%;
        height: 4px;
        background-color: #2c2842;
      }

      .icons {
        width: 20px;
        margin-right: 10px;
      }

      .header-nav {
        position: relative;
        color: #000;
        transition: all 0.3s ease-out;
        font-size: 16px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding: 0.6em 0.65em;
        margin: 5px 0;
        background: #ffffff0d;
        border-radius: 5px;
        color: #9f9f9f;

        &:before {
          content: "";
          display: inline-block;
          width: 34px;
          height: 34px;
          margin-right: 10px;
          background: url(../../assets/images/common/submenu/menu-icons/home-icon.png) no-repeat center center;
          background-size: contain;
          // background: url(../../assets/images/common/submenu/menu-icons/hot-icon.png) no-repeat center center;
          // background-size: contain;
          filter: grayscale(1);
          -webkit-transform: translateZ(0);
          -webkit-perspective: 1000;
          -webkit-backface-visibility: hidden;
        }

        &.suffix {
          &::after {
            content: "▶";
            display: block;
            flex: 1;
            text-align: right;
          }
        }

        &.vip {
          &:before {
            background: url("../../assets/images/common/vipheadicon.svg") no-repeat center center;
          }
        }

        &.jackpot {
          &:before {
            background: url("../../assets/images/common/jackpot-svg.svg") no-repeat center center;
          }
        }

        &.getapp {
          &:before {
            background: url("../../assets/images/common/appheadicon.svg") no-repeat center center;
          }
        }

        &.home {
          &:before {
            // background-position: 0% 0%;
            background: url(../../assets/images/common/submenu/menu-icons/hot-icon.png) no-repeat center center;
            background-size: contain;
          }
        }

        &.slots {
          &:before {
            // background-position: 0 10%;
            background: url(../../assets/images/common/submenu/menu-icons/slot-icon.png) no-repeat center center;
            background-size: contain;
          }
        }

        &.sports {
          &:before {
            // background-position: 0 20%;
            background: url(../../assets/images/common/submenu/menu-icons/sports-icon.png) no-repeat center center;
            background-size: contain;
          }
        }

        &.casino {
          &:before {
            // background-position: 0 30%;
            background: url(../../assets/images/common/submenu/menu-icons/live-icon.png) no-repeat center center;
            background-size: contain;
          }
        }

        &.bingo {
          &:before {
            // background-position: 0 40%;
            background: url(../../assets/images/common/submenu/menu-icons/bingo-icon.png) no-repeat center center;
            background-size: contain;
          }
        }

        &.minigame {
          &:before {
            // background-position: 0 40%;
            background: url(../../assets/images/common/submenu/menu-icons/minigame-icon.png) no-repeat center center;
            background-size: contain;
          }
        }

        &.cockfight {
          &:before {
            // background-position: 0 50%;
            background: url(../../assets/images/common/submenu/menu-icons/cockfight-icon.png) no-repeat center center;
            background-size: contain;
          }
        }

        &.e-sports {
          &:before {
            // background-position: 0 60%;
            background: url(../../assets/images/common/submenu/menu-icons/esports-icon.png) no-repeat center center;
            background-size: contain;
          }
        }

        &.fishing {
          &:before {
            // background-position: 0 70%;
            background: url(../../assets/images/common/submenu/menu-icons/fishing-icon.png) no-repeat center center;
            background-size: contain;
          }
        }

        &.poker {
          &:before {
            // background-position: 0 80%;
            background: url(../../assets/images/common/submenu/menu-icons/poker-icon.png) no-repeat center center;
            background-size: contain;
          }
        }

        &.promotion {
          &:before {
            // background-position: 0 90%;
            background: url(../../assets/images/common/submenu/menu-icons/promotion-icon.png) no-repeat center center;
            // background-size: contain;
          }
        }

        &.affiliates {
          &:before {
            // background-position: 0 100%;
            background: url(../../assets/images/common/submenu/menu-icons/affiliate-icon.png) no-repeat center center;
            background-size: contain;
          }
        }

        &.apptutorial {
          &:before {
            // background-position: 0 100%;
            background: url(../../assets/images/common/submenu/menu-icons/app-tutorial-icon.png) no-repeat center center;
            background-size: contain;
          }
        }

        &.live-support {
          &:before {
            background: url(../../assets/images/common/submenu/menu-icons/live-support-icon.png) no-repeat center center;
            background-size: contain;
          }
        }

        &.feedback {
          &:before {
            background: url(../../assets/images/common/submenu/menu-icons/feedback-icon.png) no-repeat center center;
            background-size: contain;
          }
        }

        &.telegram {
          &:before {
            background: url(../../assets/images/common/submenu/menu-icons/telegram-icon.png) no-repeat center center;
            background-size: contain;
          }
        }

        &.whatsapp {
          &:before {
            background: url(../../assets/images/common/submenu/menu-icons/whatsapp-icon.png) no-repeat center center;
            background-size: contain;
          }
        }

        &.language {
          &:before {
            content: "🇺🇸";
            background: unset;
            display: flex;
            align-items: center;
            font-size: 30px;
            font-weight: 500;
            line-height: 16.33px;
          }
        }

        &:hover,
        &.router-link-exact-active {
          background: linear-gradient(270deg, #1baa99 0%, #8ac542 100%);
          box-shadow: 0px -4px 4px 0px #02009e inset;
          box-shadow: -1px 2px 4px 0px #ffffffcc inset;
          color: #ffffff;

          &:before {
            filter: grayscale(0);
            -webkit-transform: translateZ(0);
            -webkit-perspective: 1000;
            -webkit-backface-visibility: hidden;
          }
        }

        &:hover {
          background: linear-gradient(270deg, #1baa99 0%, #8ac542 100%);
        }
      }
    }
  }

  .submenu {
    position: absolute;
    background: rgba(190, 223, 255, 0.7);
    //background: rgba(255, 255, 255, 1);
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    color: #000;
    top: 100%;
    left: 0;

    transition: max-height 0.2s ease-out;
    overflow: hidden;
    width: 100%;
    max-height: 0px;
    display: none;

    &.active {
      max-height: 400px;
      transition: max-height 0.5s ease-out;
    }

    .inner-slot-menu {
      max-width: $container-width;
      width: 100%;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 40px 0;
      margin: 10px auto;
      padding: 10px;

      .slots-sub {
        margin: 0 auto;
        padding: 10px;
        border-radius: 10px;
        height: 60px;
        text-align: center;
        cursor: pointer;

        img {
          height: 100%;
        }

        &:hover {
          box-shadow: inset 0px 0px 10px #565696;
        }
      }
    }

    .inner-side-menu {
      display: flex;
      gap: 10px;
      max-width: $container-width;
      margin: 0 auto;
      width: 100%;
      justify-content: space-around;
      align-items: center;
      height: 100%;

      * {
        color: inherit;
      }

      .inner-sub {
        cursor: pointer;
        margin: 0 auto;
        padding: 10px;
        border-radius: 10px;
        height: 200px;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        gap: 10px;

        img {
          transition: all 0.3s;
          transform: scale(1);
        }

        &:hover img {
          transform: scale(1.05);
        }

        img {
          height: 100%;
        }

        .text {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          font-size: 20px;
          gap: 0px;
          font-weight: bold;
        }
      }
    }

    .inner-bottom-menu {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      max-width: $container-width;
      margin: 0 auto;
      width: 100%;
      justify-content: space-around;
      align-items: center;
      height: 100%;

      .inner-sub {
        cursor: pointer;
        margin: 0 auto;
        padding: 10px;
        height: 170px;
        padding: 30px 30px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;

        &:hover {
          color: #000;
          background: $primary-color-light;
          border-radius: 8px;
        }

        img {
          height: 100%;
        }

        .text {
          font-size: 18px;
          display: flex;
          gap: 10px;
          font-weight: bold;
          color: #000;
        }
      }
    }
  }

  .login-box {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;

    .header-balance {
      padding: 10px;
      background: #f1f7ff;
      color: #3528e9;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 5px;
      border-radius: 12px;
      font-size: 18px;

      img {
        cursor: pointer;
      }
    }

    .avatar {
      width: 35px;
      height: 35px;
      background: #d2d2d2;
      border-radius: 50%;
      display: flex;
      justify-content: flex-end;
      align-items: flex-end;

      .anticon {
        display: inline-block;
        vertical-align: middle;
        background: #000000;
        border-radius: 100%;
        font-size: 8px;
        padding: 2px;
      }
    }

    .viewmail {
      display: flex;
      position: relative;
      justify-content: center;
      align-items: center;
      font-size: 20px;
      color: inherit;
      cursor: pointer;

      svg {
        width: 30px;
        fill: currentColor;
        display: block;
      }

      .mailValue {
        position: absolute;
        text-align: center;
        height: 9px;
        display: flex;
        align-items: center;
        font-size: 16px;
        width: 9px;
        right: 8px;
        top: 6px;
        background: #c23442;
        border-radius: 50%;
      }
    }

    .dropdown-container {
      position: relative;

      .abs-menu {
        position: absolute;
        width: 189px;
        right: 0px;
        top: 50px;
        border-radius: 10px;
        padding: 10px 15px;

        &.mobile {
          display: none;
          background: $primary-linear-background;

          background-image: linear-gradient(to bottom, #f8fcff 30%, #88d9ff, #203e5c, #21272c 80%);
          background-size: 100% 400%;
          background-position: 100% 0%;
          transition: all 0.3s;

          ul {
            max-height: 100% !important;
            overflow: auto !important;

            a:hover,
            a.router-link-active {
              background-image: linear-gradient(270deg, #5800e8 0%, #0062e8 100%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
            }
          }
        }

        &.desktop {
          display: none;
          background-image: linear-gradient(to bottom, #f1f7ff 30%, #88d9ff, #203e5c, #21272c 80%);
          background-size: 100% 400%;
          background-position: 100% 0%;
          transition: all 1s;

          &.show {
            display: block;
          }
        }

        ul {
          margin: 0;
          padding: 0;
        }

        li {
          &:last-child {
            a {
              border-bottom: 0;
            }
          }

          a {
            &.last {
              border-bottom: 0;
            }

            font-size: 14px;
            padding: 8px 0;
            display: block;
            display: flex;
            justify-content: flex-start;
            align-items: center;

            transition: all 0.3s;
            color: #83a3ca;
            border-bottom: 1px solid #ecf5ff;

            .icon {
              width: 25px;
              height: 25px;
              background-image: url(../../assets/images/account/accmenuicons.svg);
              margin-right: 10px;
              margin-bottom: 5px;
              background-size: cover;

              &.icon-personal {
                background-position: 0% 50%;
              }

              &.icon-quick {
                background-position: 0% 16.5%;
              }

              &.icon-mail {
                background-position: 0px 83%;
              }
            }

            &:hover {
              // color: #0062e8;
              // background-image: linear-gradient(270deg, #5800e8 0%, #0062e8 100%);
              // -webkit-background-clip: text;
              // -webkit-text-fill-color: transparent;
              color: #2b2b82;

              .icon {
                background-image: url(../../assets/images/account/accmenuicons-hover.svg);
              }

              .remixicon {
                fill: currentColor;
              }
            }

            .remixicon {
              width: 1.25rem;
              margin-right: 10px;
              fill: currentColor;
              opacity: 0.9;
            }

            .logout {
              padding: 8px;
              border: 1px solid #83a3ca;
              border-radius: 4px;
              display: block;
              width: 100%;
              margin-top: 10px;
              text-align: center;

              &:hover {
                border: 1px solid #2b2b82;
              }
            }
          }
        }
      }
    }

    .action-btn {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background-color: #ffffff0d;
      padding: 8px;
      position: relative;

      svg {
        fill: #ffffff;
        width: 24px;
      }

      &.has-unread-notification {
        &::before {
          display: block;
          content: "";
          background-color: #d21010;
          position: absolute;
          top: 0;
          right: 0;
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }
      }
    }
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
