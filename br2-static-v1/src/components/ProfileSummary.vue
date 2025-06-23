<template>
  <div style="height: 66px" v-if="topDownload"></div>
  <div style="height: 78px"></div>
  <div class="top-download" v-if="topDownload">
    <div class="download-container">
      <div class="download-btn">
          <img src="../assets/images/index/download/square-logo.png" />
      </div>
      <div class="download-text">
        {{ $t("sideNav.downloadAppText") }}
      </div>

      <div class="download-money-icon">
        <img src="../assets/images/index/download/download-money.png" />
      </div>

      <a :href="topDownloadUrl">
        <div class="download-gobtn" >
          Download
        </div>
      </a>

      <div class="download-close" :style="!topDownloadcloseBtn && 'opacity:0'">
        <q-icon name="close" size="36px" style="color: #fff" @click="closeTopdownload()" />
      </div>
    </div>
  </div>

  <div class="menu-open" :class="{ open: menuOpen }" @click="toggleMenuOpen()">
    <div style="height: 56px" v-if="topDownload && !uiStore.hideDownload"></div>
    <div class="menu-open-inner">
      <SideMenu @closeMenu="toggleMenuOpen()" @gameClick="gameClick" />
    </div>
  </div>

  <div class="infoboard-container" :class="{ 'q-pa-md': !homeProfile, 'with-top-download': topDownload }">
    <div class="infoboard-wrapper" :class="homeProfile && 'home-profile'">
      <div class="profile-menu">
        <q-btn dense flat @click="toggleMenuOpen()">
<!--          <q-icon name="density_medium" />-->
          <img style="width: 32px;height: 32px;" src="../assets/images/index/left-menu-icon.png" />
        </q-btn>
      </div>
      <div class="profile-wrapper-extra">
        <div class="logo-img">
          <img src="../assets/akb-logo.png" @click="onClickLogo" />
        </div>
      </div>
      <div class="profile-wrapper" v-if="store.token">
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
              <div class="balance-front">
                <img src="../assets/images/index/deposit-icon.png" />
              </div>
              <div :class="`profile-balance ${isLoadingBalance ? 'active' : ''}`" @click="refreshBalance()">
                <span class="balance-amount" :style="`${store.balance > 9999999 && 'font-size: 10px'}`">
                  <span v-if="!isLoadingBalance">
                    {{ store.currency.value }}
                  </span>
                  {{ isLoadingBalance ? "Loading..." : convertToCommaAmount(store.balance, false) }}
                </span>
                <span class="balance-txt">{{ $t("sideNav.balance") }}</span>
              </div>
            </div>
          </template>
        </div>

<!--        <q-btn-dropdown no-caps :ripple="false" dropdown-icon="expand_more" class="profile-dropdown">-->
<!--          <template v-slot:label>-->
<!--            <div class="profile-pic">-->
<!--              <div class="unread-total" v-if="store.unreadInboxMail > 0">{{ store.unreadInboxMail }}</div>-->
<!--              <q-avatar size="50px">-->
<!--                <img :src="profileImagePath" />-->
<!--              </q-avatar>-->
<!--              <div class="profile-pic-frame" v-if="!homeProfile"></div>-->

<!--              <div class="vip-details">-->
<!--                <img src="../assets/images/index/vip-row.png" alt="" />-->
<!--                <div class="vip-level">-->
<!--                  {{ store.vip }}-->
<!--                </div>-->
<!--              </div>-->
<!--            </div>-->
<!--          </template>-->
<!--          <q-list dense unelevated flat class="dropdown-list">-->
<!--            <q-item clickable v-close-popup @click="router.push('/account/profile')">-->
<!--              <q-item-section avatar>-->
<!--                <q-avatar icon="phone_iphone" />-->
<!--              </q-item-section>-->
<!--              <q-item-section>-->
<!--                <q-item-label>{{ $t("header.information") }}</q-item-label>-->
<!--              </q-item-section>-->
<!--            </q-item>-->
<!--            <q-item clickable v-close-popup @click="onVipClick">-->
<!--              <q-item-section avatar>-->
<!--                <q-avatar icon="diamond" />-->
<!--              </q-item-section>-->
<!--              <q-item-section>-->
<!--                <q-item-label>{{ $t("header.vip") }}</q-item-label>-->
<!--              </q-item-section>-->
<!--            </q-item>-->
<!--            <q-item clickable v-close-popup @click="router.push('/account/message?from=' + route.path)">-->
<!--              <q-item-section avatar>-->
<!--                <q-avatar icon="mail" />-->
<!--              </q-item-section>-->
<!--              <q-item-section>-->
<!--                <q-item-label>-->
<!--                  <span class="message-amt" v-if="store.unreadInboxMail > 0">{{ store.unreadInboxMail }}</span>-->
<!--                  {{ $t("header.message") }}-->
<!--                </q-item-label>-->
<!--              </q-item-section>-->
<!--            </q-item>-->
<!--            <q-item clickable v-close-popup @click="router.push('/account/order?from=' + route.path)">-->
<!--              <q-item-section avatar>-->
<!--                <q-avatar icon="receipt" />-->
<!--              </q-item-section>-->
<!--              <q-item-section>-->
<!--                <q-item-label>{{ $t("header.order") }}</q-item-label>-->
<!--              </q-item-section>-->
<!--            </q-item>-->
<!--            <hr class="menu-line" />-->
<!--            <q-item clickable v-close-popup @click="router.push('/account/bank?from=' + route.path)">-->
<!--              <q-item-section avatar>-->
<!--                <q-avatar icon="account_balance" />-->
<!--              </q-item-section>-->
<!--              <q-item-section>-->
<!--                <q-item-label>{{ $t("header.bank") }}</q-item-label>-->
<!--              </q-item-section>-->
<!--            </q-item>-->
<!--            <q-item clickable v-close-popup @click="onLogout()">-->
<!--              <q-item-section avatar>-->
<!--                <q-avatar icon="logout" />-->
<!--              </q-item-section>-->
<!--              <q-item-section>-->
<!--                <q-item-label>{{ $t("btn.signOut") }}</q-item-label>-->
<!--              </q-item-section>-->
<!--            </q-item>-->
<!--          </q-list>-->
<!--        </q-btn-dropdown>-->

        <div @click="handleBackBtn" class="deposit-btn">
          {{ $t("settings.deposit") }}
        </div>
      </div>
      <div class="profile-wrapper non-login" v-else>
        <q-btn class="btn-style-butter" no-caps @click="goLogin()">{{ $t("header.login") }}</q-btn>
        <q-btn class="btn-style-pear" no-caps @click="uiStore.loginView = 'register'">
          {{ $t("header.register") }}
        </q-btn>
      </div>


    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useQuasar, Platform } from "quasar";
import { userStore } from "stores/index";
import { useUI } from "stores/ui";
import { useRoute, useRouter } from "vue-router";
import { convertToCommaAmount, isAndroid, isInPwa } from "src/boot/utils";
import { api } from "boot/axios";
import SideMenu from "./SideMenu.vue";

const props = defineProps(["homeProfile"]);
const emits = defineEmits(["closeslot", "gameClick"]);
const route = useRoute();
const router = useRouter();
const store = userStore();
const uiStore = useUI();

const menuOpen = ref(false);

// const balance = ref(19999999);

const profileImg = [
  {
    imgPath: ["profile-pic"]
  }
];

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
  // if (props.homeProfile) {
  //   emits("closeslot");
  // }
  // router.push("/login");
  uiStore.loginView = "login";
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
    window.open(store.h5Url, "_blank");
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

const topDownloadCount = ref(11);

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

  if (!store.token && route.path === "/home") {
    if (
      ("standalone" in window.navigator && window.navigator.standalone) ||
      (Platform.is.capacitor && Platform.is.android) ||
      isInPwa()
    ) {
      topDownload.value = false;
    } else {
      topDownload.value = true;
      // countdown();
      // setTimeout(() => {
      //   topDownload.value = false;
      // }, 11000);
    }
  }
};

const toggleMenuOpen = () => {
  menuOpen.value = !menuOpen.value;
};

const gameClick = (game) => {
  if (route.path === "/home") {
    emits("gameClick", game);
    menuOpen.value = false;
  } else {
    router.push("/home");
  }
};

const topDownloadUrl = ref("");

const getTopDownloadUrl = () => {
  api.get(`/app/download/affiliate/url?siteCode=${process.env.SITE}&affiliateCode=076DB8`).then((res) => {
    if (res.code === 0) {
      topDownloadUrl.value = res.data.url;
    }
  });
};

const handleBackBtn = () => {
  if (props.homeProfile) {
    emits("closeslot");
  }
  router.push("/deposit?from=" + route.path);
};

onMounted(() => {
  if (!sessionStorage.getItem("PROFILE_IMG")) {
    const randomProfile = profileImg[0];
    const randomIndex = Math.floor(Math.random() * randomProfile.imgPath.length);
    const imgPath = randomProfile.imgPath[randomIndex];
    sessionStorage.setItem("PROFILE_IMG", imgPath);
  }

  getTopDownloadUrl();
  //TODO:: HIDE APP DOWNLOAD 1st.
  // checkTopDownloadAppear();
});
</script>

<style scoped lang="scss">
.top-download {
  position: fixed;
  top: 0;
  left: 50%;
  z-index:9999;
  transform: translateX(-50%);
  display: flex;
  max-width: 500px;
  margin: auto;
  width: 100%;
  padding: 6px 10px;
  height: 66px; /* adjust the height as needed */
  background: linear-gradient(90deg, #0A526C 0%, #523E0A 100%);




  .download-container {
    display: flex;
    gap: 5px;
    width: 100%;
    align-items: center;
    transition: 0.3s all;

    .download-text{
      width: 40%;
      margin-right: auto;
      font-size: 12px;
      line-height: 16px;

      @media (max-width: 390px) {
        width: 50%;
      }
    }

    .download-money-icon{
      img{
        width: 40px;
        height: auto;
      }
      @media (max-width: 390px) {
        display:none;
      }
    }

    .download-btn {
      width: 48px;
      min-width: 48px;

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
      color: #fe9a9a;
      font-size: 20px;
    }

    a{
      text-decoration: none;
    }

    .download-gobtn{
      background: linear-gradient(90deg, #4FFFA5 0%, #10D16F 100%);
      border-radius: 8px;
      height: 44px;
      width: 88px;
      display:flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      color: #000;
      font-size: 14px;
      font-weight: 600;

      &:active{
        filter: brightness(0.86);
        transform: translate(0px, 1px)
      }
    }

    .download-close {
      opacity: 1;
      transition: 1s all;

      &:active{
        filter: brightness(0.86);
        transform: translate(0px, 1px)
      }

      i{
        font-size: 36px;
        color: #fff;
        fill: #fff;
      }
    }
  }
}

.menu-open {
  position: fixed;
  top: 0;
  left: 0;
  background: #000000cc;
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
  .menu-open-inner {
    width: 75vw;
    max-width: 375px;
  }
}

.deposit-btn{
  background: linear-gradient(90deg, #4FFFA5 0%, #10D16F 100%);
  border-radius: 8px;
  height: 44px;
  width: 80px;
  display:flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #000;
  font-size: 14px;
  font-weight: 600;
}

.infoboard-container {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  // background: linear-gradient(180deg, #2d0f54 0%, #101114 100%);
  // background: linear-gradient(180deg, #00B9A1 0%, rgba(0, 185, 111, 0) 96.35%);
  // background: linear-gradient(180deg, rgba(0, 185, 161, 0.46) 0%, rgba(0, 185, 111, 0) 96.35%);
  // background: linear-gradient(180deg, #095e54 0%, #0d362d 100%);
  background: #1f241f;
  // box-shadow: 0px -3px 7px 0px rgba(0, 0, 0, 0.1);
  overflow-x: hidden;
  position: fixed;
  top: 0;
  width: 100%;
  // min-height: 82px;
  max-width: 500px;
  z-index: 999;
  transition: 0.3s all;

  &.with-top-download {
    //border-top-right-radius: 25px;
    //border-top-left-radius: 25px;
    top: 66px;
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
      padding: 0 12px;
      // overflow-y: hidden;
      height: 78px;

      .profile-pic {
        margin-top: -20px;
        margin-right: 20px;
      }
    }
  }

  .profile-dropdown {
    margin-top: 15px;
    box-shadow: none;

    &:before {
      box-shadow: none;
    }
  }
  .profile-wrapper {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 12px;
    padding-top: 0px;
    padding-bottom: 0px;
    padding-left: 5px;
    margin-bottom: 4px;
    width: 100%;
    padding-right: 5px;
    position: relative;

    @media(max-width: 390px){
      gap: 6px;

      .q-btn{
        padding:4px 8px;
      }
    }

    &.non-login {
      padding-bottom: 0px;
    }

    .unread-total {
      position: absolute;
      right: 0px;
      top: 0px;
      background: rgba(255, 0, 4, 1);
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

      .balance-front{

        img{
          width: 48px;
          height: 48px;

          @media(max-width: 380px){
            width: 38px;
            height: 38px;
          }
        }
      }
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
      border-radius: 24px;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      flex-direction: column;
      min-width: 80px;
      width: 100%;
      height: 48px;
      padding: 2px 5px;

      font-size: 14px;
      color: rgba(255, 255, 255, 0.7);
      font-weight: bold;

      &:active {
        filter: brightness(0.75);
      }

      .balance-txt{
        color: #10D16F;
      }

      .balance-amount {
        padding-right: 18px;
        padding-left: 0px;
        color:#fff;
        white-space: nowrap;
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

  .profile-wrapper-extra {
    display: flex;
    align-items: center;
    padding-top: 5px;
    padding-left: 6px;
    // margin-bottom: auto;
    width: 100%;
  }

  .logo-img {
    width: 100%;
    // margin: 12px auto;

    img {
      max-width: 120px;
      width: 100%;
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
  margin-top: -10px;

  img {
    display: block;
    width: 100px;
    position: absolute;
    top: -17px;
    left: -45px;
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
    color: #101616;
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
  top: 2px;
  right: 10px;
}

.style-blue-btn {
  // background: linear-gradient(180deg, #8b36f8 0%, #334ad6 100%);
  background: linear-gradient(180deg, #00b9a1 0%, #0097b9 100%);
  border-radius: 5px;
}

.menu-line {
  border-color: rgba(243, 244, 246, 0.1);
}

@media (max-width: 375px) {
  .infoboard-container .profile-wrapper .profile-balance {
    width: 100px;
  }

  .infoboard-container .profile-wrapper {
    gap: 4px;
  }

  .infoboard-container .infoboard-wrapper.home-profile {
    padding: 0px 4px;
  }
}

.message-amt {
  background: rgba(255, 0, 4, 1);
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
  color: rgba(255, 255, 255, 0.6);
  font-weight: 500;
}

.q-avatar {
  i.q-icon {
    color: rgba(255, 255, 255, 0.6);
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
  // border-radius: 18px;
  background: #0f2021;
  // overflow: hidden;
}

.btn-lang {
  display: flex;
  width: 24px;
  img {
    display: block !important;
    width: 24px !important;
    filter: brightness(1.2) invert(20%) sepia(40%) saturate(200%) hue-rotate(280deg) brightness(130%) contrast(80%);
    // filter: brightness(1) sepia(0) hue-rotate(0deg) saturate(1);
    animation: hueBlink 1s infinite;
  }
}
</style>
