<template>
  <div style="height: 56px" v-if="topDownload && !ui.hideDownload"></div>
  <div style="height: 70px"></div>

  <div class="top-download" v-if="topDownload && !ui.hideDownload">
    <div class="download-container">
      <div class="download-close" :style="!topDownloadcloseBtn && 'opacity:0'">
        <q-icon name="close" size="24px" style="color: #81889a" @click="closeTopdownload()" />
      </div>
      <div class="download-logo"><img src="../assets/images/index/download/download-app-logo.png" /></div>
      <!-- <div class="download-btn">
        <a :href="topDownloadUrl">
          <img src="../assets/images/index/download/top-download-btn.png" />
        </a>
      </div> -->

      <div class="download-text">{{ $t("header.getFreeSpins") }}</div>
      <div class="download-btn-yel">
        <a :href="ui.downloadAppUrl">{{ $t("header.download") }}</a>
      </div>
      <!-- <div class="download-count">({{ topDownloadCount }}s)</div> -->
    </div>
  </div>
  <div class="menu-open" :class="{ open: menuOpen }">
    <div style="height: 56px" v-if="topDownload && !ui.hideDownload"></div>
    <SideMenu @closeMenu="toggleMenuOpen()" />
  </div>
  <div
    class="infoboard-container"
    :class="{
      'q-pa-md': !homeProfile,
      'with-top-download': topDownload && !ui.hideDownload,
      'with-background': isScrolled
    }"
  >
    <!-- <img src="../assets/images/earn-money/infoboard.png" v-if="!homeProfile" /> -->
    <div class="infoboard-wrapper" :class="homeProfile && 'home-profile'">
      <div class="profile-menu">
        <img src="../assets/images/auth/icon-more.png" @click="toggleMenuOpen()" />
      </div>
      <div class="profile-wrapper-extra">
        <div class="logo-img" style="cursor: pointer" @click="onClickLogo">
          <img src="../assets/images/auth/bg-logo-only.png" />
          <span v-if="!ui.loggedIn && !store.hasToken()">B9.GAME</span>
        </div>
      </div>
      <div class="profile-wrapper" v-if="ui.loggedIn || store.hasToken()">
        <div class="profile-details-container">
          <template v-if="!homeProfile">
            <div class="profile-rating">
              <img src="../assets/images/index/profile-rating-off.png" alt="" />
              <img src="../assets/images/index/profile-rating-off.png" alt="" />
              <img src="../assets/images/index/profile-rating-off.png" alt="" />
            </div>
            <div class="profile-agency">
              <div class="profile-agency-lbl">Agency Level:</div>
              <div class="profile-agency-val">1</div>
            </div>
          </template>

          <template v-else>
            <div class="flex-c-start">
              <div :class="`profile-balance ${isLoadingBalance ? 'active' : ''}`" @click="refreshBalance()">
                <span class="currency-amount">
                  {{ store.currency.value }}
                </span>
                <span class="balance-amount" :style="`${store.balance > 9999999 && 'font-size: 10px'}`">
                  {{ isLoadingBalance ? `${$t("btn.loading")}...` : convertToCommaAmount(store.balance, false) }}
                </span>

                <q-btn square class="style-blue-btn" icon="wallet" dense @click="handleBackBtn()" />
                <!-- <div class="btn-refresh">
                  <q-icon name="sync" size="16px" color="white-7"></q-icon>
                </div> -->
              </div>
            </div>
          </template>
        </div>
        <div class="gift-notifications">
          <q-btn class="notification-wrapper" flat @click="router.push('/account/message?from=' + route.path)">
            <img src="../assets/images/auth/bell-icon.png" />
            <q-badge v-if="store.unreadInboxMail > 0" class="bell-badge" floating rounded>
              {{ store.unreadInboxMail }}
            </q-badge>
          </q-btn>
          <q-btn class="gift-wrapper" flat @click="showBonusModal">
            <img src="../assets/images/auth/gift-icon.png" />
            <q-badge v-if="fastAccessPromo.length > 0" class="gift-badge" floating rounded>
              {{ fastAccessPromo.length }}
            </q-badge>
          </q-btn>
        </div>

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
              <q-avatar size="40px">
                <img :src="profileImagePath" />
              </q-avatar>
              <div class="profile-pic-frame" v-if="!homeProfile"></div>

              <div class="vip-details">
                <img
                  class="bg"
                  :src="require(`../assets/images/index/vip-badge/vip-${store.vip ? store.vip.replace('VIP', '') : '0'}.png`)"
                  alt=""
                />
              </div>
            </div>
          </template>

          <q-list style="background: #323738; padding: 5px 0px;" dense unelevated flat class="dropdown-list">
            <q-item clickable v-close-popup @click="onVipClick">
              <q-item-section avatar>
                <img src="../assets/images/account/vip-svg.svg" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ $t("settings.vip") }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup @click="router.push('/account/message?from=' + route.path)">
              <q-item-section avatar>
                <img src="../assets/images/account/message-svg.svg" />
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
                <img src="../assets/images/account/order-svg.svg" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ $t("settings.order") }}</q-item-label>
              </q-item-section>
            </q-item>

            <hr class="menu-line" />

            <q-item clickable v-close-popup @click="router.push('/account/bank?from=' + route.path)">
              <q-item-section avatar>
                <img src="../assets/images/account/bank-svg.svg" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ $t("settings.bank") }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup @click="onLogout()">
              <q-item-section avatar>
                <img src="../assets/images/account/logout-icon.svg" />
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
        <q-btn no-caps unelevated class="btn-register" @click="router.push('/register')">
          {{ $t("header.register") }}
        </q-btn>
        <div class="btn-lang" @click="router.push('/language')"><img src="../assets/images/auth/icon-globe.svg" /></div>
      </div>
    </div>

    <q-dialog v-model="isBonusModal" position="top" style="z-index: 2002">
      <BonusModal
        :has-top-download="topDownload && !ui.hideDownload"
        :promo-list="fastAccessPromo"
        @openNewPlayer="showNewPlayer"
      />
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from "vue";
import { useQuasar, Platform } from "quasar";
import { userStore } from "stores/index";
import { useRoute, useRouter } from "vue-router";
import { convertToCommaAmount, isAndroid, isInPwa } from "src/boot/utils";
import { api } from "boot/axios";
import { useUI } from "stores/ui";
import { cached, TIME_EXPIRED } from "boot/cache";
import { useI18n } from "vue-i18n";
import LangOptions from "components/LangOptions";
import BonusModal from "./modal/BonusModal.vue";
import SideMenu from "components/SideMenu.vue";

import { defineEmits } from "vue";
import { useCustomerTrigger } from "src/hooks/trigger";

const props = defineProps(["homeProfile"]);
const emits = defineEmits(["closeslot", "activateSlide", "showNewPlayer"]);
const route = useRoute();
const router = useRouter();
const store = userStore();
const ui = useUI();

const isScrolled = ref(false);

const handleScroll = () => {
  isScrolled.value = window.scrollY > 0;
};

const isBonusModal = ref(false);
const fastAccessPromo = ref([]);

const getFastAccessPromo = () => {
  api.get("/opt-session/promo/page?showFastAccess=1").then((res) => {
    if (res.code === 0) {
      if (store.memberType === "TEST" || store.memberType === "PROMO_TEST") {
        fastAccessPromo.value = res.data;
      } else {
        fastAccessPromo.value = res.data.filter((item) => item.privilegeStatus !== "TEST");
      }
    }
  });
};

const showBonusModal = () => {
  isBonusModal.value = !isBonusModal.value;
};
const showNewPlayer = () => {
  isBonusModal.value = false;
  emits("showNewPlayer");
};

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
    const randomIndex = Math.floor(Math.random() * 24) + 1;
    const imgPath = `image-${randomIndex}`;
    sessionStorage.setItem("PROFILE_IMG", imgPath);
    return imgPath;
  }
});

const profileImagePath = computed(() => {
  return require(`../assets/images/account/profile/${randomProfileImg.value}.png`);
});

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
  if (props.homeProfile) {
    activateSlide("Lobby");
    return;
  }
  if (route.fullPath === "/home") {
    // toggleMenuOpen();

    return;
  }
  if (isAndroid()) {
    window.open("http://m.b9mega1.com/", "_blank");
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

const afterMounted = useCustomerTrigger(loadCustomerAddress);

onMounted(() => {
  checkTopDownloadAppear();
  ui.shouldFetchDownloadAppUrl = true;

  sideLang.value = store.memberType === "TEST";
  if (isAndroid() || isInPwa()) {
    isSideDownload.value = false;
  } else {
    isSideDownload.value = true;
  }
  afterMounted();
  window.addEventListener("scroll", handleScroll);
  getFastAccessPromo();
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<style scoped lang="scss">
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
  background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7));
  backdrop-filter: blur(6px);
  z-index: 2003;

  .download-container {
    display: flex;
    // gap: 16px;
    :not(:last-child) {
      margin-right: 16px;
    }
    width: 100%;
    align-items: center;
    transition: 0.3s all;

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

    .download-text {
      font-size: 12px;
      margin-right: auto;
    }

    .download-btn-yel {
      margin-left: auto;
      // display: none;

      a {
        text-decoration: none;
        background: linear-gradient(163.93deg, #bdff00 11.18%, #ff9900 112.24%);
        color: #131313;
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
    .download-logo {
      width: 35px;
      img{
        width: 100%;
      }
    }
  }
}

.menu-open {
  position: fixed;
  top: 0;
  left: 0;
  background: rgb(35, 38, 38);
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
    // background-color: #131313;
    // width: 202px;
    // height: 100%;
    height: calc(100vh - 50px);
    display: flex;
    flex-direction: column;
    padding-left: 16px;
    padding-right: 16px;
    gap: 12px;
    transition: 0.3s all;

    overflow-y: auto;

    .side-menu-divider {
      background: rgba(255, 255, 255, 0.05);
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
  // background-image: url("../assets/images/auth/auth-bg.png");
  background-size: 100% 100%;
  box-shadow: 0px -3px 7px 0px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: fixed;
  top: 0;
  width: 100%;
  max-width: 500px;
  z-index: 2003;
  transition: 0.3s all;
  height: 60px;

  &.with-background {
    background: #150a08;
  }

  &.with-top-download {
    // border-top-right-radius: 25px;
    // border-top-left-radius: 25px;
    top: 56px;
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
      gap: 5px;
      justify-content: space-between;
      align-items: center;
      padding: 0 12px;
      // overflow-y: hidden;

      .profile-pic {
        margin-top: -20px;
        // margin-right: 20px;
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

    > :not(:last-child) {
      margin-right: 10px;
    }
    padding-top: 8px;
    padding-bottom: 5px;
    margin-bottom: 4px;
    width: 100%;
    position: relative;

    .q-btn {
      white-space: nowrap;
    }

    .btn-lang {
      img {
        display: block;
        width: 24px;
        filter: brightness(0) invert(50%) sepia(11%) saturate(3258%) hue-rotate(77deg) brightness(122%) contrast(75%);
        // filter: brightness(1) sepia(0) hue-rotate(0deg) saturate(1);
        animation: hueBlink 1s infinite;
      }
    }

    .unread-total {
      position: absolute;
      right: 0px;
      top: 0px;
      background: #00ae00;
      border-radius: 100px;
      padding: 0px 3px;
      z-index: 1;
      font-size: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
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
      width: 100%;
    }
    .gift-notifications {
      background: #ffffff0f;
      display: flex;
      border-radius: 10px;
      padding: 5px;

      .notification-wrapper {
        height: 20px;
        width: 20px;
        // padding-right: 20px;
        border-right: 1px solid #ffffff33;
        img {
          height: 20px;
          width: 20px;
        }
        :deep(.q-badge--floating) {
          top: 2px;
          right: 2px;
        }
        .bell-badge {
          background: #e30000;
          color: #fff;
        }
      }
      .gift-wrapper {
        height: 20px;
        width: 20px;
        // padding-left: 20px;

        img {
          height: 20px;
          width: 20px;
        }
        :deep(.q-badge--floating) {
          top: 2px;
          right: -4px;
        }
        .gift-badge {
          background: #e30000;
          color: #fff;
        }
      }
    }
    // .gift-wrapper {
    //   background: rgba(0, 10, 1, 0.6);
    //   // box-shadow: 0px 0px 5px 0px #ffffff4a inset;
    //   border-radius: 8px;
    //   position: relative;
    //   border: none;
    //   padding: 10px;
    //   height: 40px;
    //   width: 40px;

    //   &:hover {
    //     filter: brightness(1.2);
    //   }

    //   img {
    //     max-width: 100%;
    //   }

    //   .gift-badge {
    //     background: linear-gradient(90deg, #24ee89 0%, #9fe871 100%);
    //     color: #fff;
    //   }
    // }

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
      // background: rgba(255, 255, 255, 0.24);
      // background: #192633;
      // background: rgba(0, 10, 1, 0.6);
      background: #ffffff0f;

      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 6px;
      min-width: 100px;
      width: 100%;
      min-height: 35px;
      border: 1px solid #ffffff14;

      font-size: 14px;
      color: #fff;
      font-weight: bold;
      // border: 1px solid #2c323b;

      &:active {
        filter: brightness(0.75);
      }

      .currency-amount {
        color: #000000;
        background: linear-gradient(90deg, #2ced88 0%, #9ee871 100%);
        font-size: 12px;
        font-weight: 700;
        margin-right: 3px;
        border-radius: 50%;
        padding: 3px 5px;
        font-family: "Microsoft YaHei UI", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
        font-weight: 700;
        font-size: 12px;
        line-height: 100%;
        letter-spacing: 0px;
    display: flex;
    justify-content: center;
    align-items: center;
    line-height: 16px;
        vertical-align: middle;
      }

      .balance-amount {
        padding-right: 5px;
        white-space: nowrap;
        width: 100%;
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
    // padding: 5px;
    img {
      display: block;
      // width: 35px;
      width: 30px;
      height: 30px;
    }
  }
  .profile-menu:not(:last-child) {
    margin-right: 3px;
  }

  .profile-wrapper-extra {
    display: flex;
    align-items: center;
    // width: 100%;
    // max-width: 45px;
    // margin-left: 12px;
  }

  .logo-img {
    width: 100%;
    margin: 0 auto;
    display: flex;
    justify-content: flex-start;
    align-items: flex-end;
    font-family: "Microsoft YaHei UI", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-weight: 700;
    font-size: 22px;
    line-height: 30px;
    letter-spacing: -4%;
    text-align: center;

    img {
      width: 32px;
      text-align: center;
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

  img.bg {
    display: block;
    width: 45px;
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
  // background: linear-gradient(180deg, #8b36f8 0%, #334ad6 100%);
  // background: linear-gradient(356.25deg, #00430b -0.21%, #00ae00 93.65%);
  background: linear-gradient(251.03deg, #89c543 7.46%, #2aae8b 91.87%);
  border-radius: 5px;
  animation: blink 1.5s infinite;
  box-shadow: 0px 1.13px 0px 0px #1cca6a;
}

.menu-line {
  border-color: rgba(243, 244, 246, 0.1);
}

@media (max-width: 375px) {
  // .infoboard-container .profile-wrapper .profile-balance {
  // width: 100px;
  // }

  .infoboard-container .profile-wrapper {

  }

  .infoboard-container .infoboard-wrapper.home-profile {
    padding: 0px 4px;
  }
}

.message-amt {
  color: #323738;
  background-color: #24ee89;
  border-radius: 30px;
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 1;
  font-size: 10px;
  position: absolute;
  bottom: 13px;
  left: 5px;
  font-weight: bold;
}
</style>

<style lang="scss">
.q-btn-dropdown--simple * + .q-btn-dropdown__arrow {
  margin-left: -12px !important;
  display: none;
}

.q-btn-dropdown--simple {
  width: 50px !important;
}

.q-item__label {
  // color: #c5c7ff;
  font-weight: 500;
}

.q-avatar {
  i.q-icon {
    color: #b3bec1;
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
  0% {
    filter: brightness(0) invert(100%) sepia(0%) saturate(3258%) hue-rotate(77deg) brightness(100%) contrast(100%);
  }
  100% {
    filter: brightness(0) invert(50%) sepia(11%) saturate(3258%) hue-rotate(77deg) brightness(122%) contrast(75%);
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
