<template>
  <q-layout view="hHh Lpr lFf">
    <q-header elevated>
      <AppDownload />
      <q-card-section class="top-section items-center" horizontal>
        <div class="items-center" style="display: flex">
          <div class="logo">
            <router-link to="/" style="display:flex;align-items:center;"><img src="../assets/home/logo.png" /></router-link>
          </div>
          <ThemeToggle v-if="!store.hasToken()" />
        </div>
        <q-card-actions v-if="!store.hasToken()" style="width: 100%" class="justify-end">
          <q-btn class="head-btn login-btn" to="/login">Login</q-btn>
          <q-btn class="head-btn register-btn" to="/register">Register</q-btn>
        </q-card-actions>
        <q-card-actions v-if="store.hasToken()" style="width: 100%" class="justify-end">
          <HeaderProfile />
          <!-- <q-btn color="primary" @click="logout">Logout</q-btn> -->
        </q-card-actions>

        <!--        <q-btn-->
        <!--            v-if="store.hasToken()"-->
        <!--            @click="logout"-->
        <!--            class="common-log-btn index-logout">-->
        <!--          Logout-->
        <!--        </q-btn>-->

        <!--        <q-btn-->
        <!--          v-if="store.hasToken()"-->
        <!--          class="flex"-->
        <!--          to="/finance/deposit"-->
        <!--          no-caps-->
        <!--          flat-->
        <!--          ><RiWalletLine />-->
        <!--          <span style="font-size: 10px; margin-left: 5px; display: block"-->
        <!--            >Deposit</span-->
        <!--          >-->
        <!--        </q-btn>-->
        <!-- <div>
          <q-btn
            flat
            dense
            round
            class="menu-btn"
            color="blue-8"
            :icon="rightDrawerOpen ? 'close' : 'menu'"
            aria-label="Menu"
            @click="toggleRightDrawer"
          />
        </div> -->
      </q-card-section>
      <q-card-section class="page-title" v-if="hasPage">
        <div class="page-nav-info">
          <div class="left">
            <router-link :to="prevPage ? '/' + prevPage : '/'">
              <q-icon name="navigate_before" size="md" class="back-btn" />
              <!-- <RiArrowDropLeftLine /> -->
            </router-link>
          </div>
          <div class="center">
            <div>{{ pageName }}</div>
          </div>
          <div class="right">
            <div></div>
          </div>
        </div>
      </q-card-section>
      <!-- <q-card-actions v-if="store.hasToken()" class="bot-section" horizontal>
        <q-card-section class="acct-section">
          <div class="label">Main account:</div>
          <div class="amt">{{ mainWallet }}</div>
        </q-card-section>
        <q-separator vertical />
        <q-btn class="flex" to="/finance/deposit" no-caps flat
          ><RiWalletLine />Top-up center</q-btn
        >
        <q-btn to="/finance/withdraw" no-caps flat
          ><RiBankCardLine />Quick Withdraw</q-btn
        >
      </q-card-actions> -->
    </q-header>

    <!-- <AssistancePopup/> -->

    <!--    <q-scroll-area ref="scrollPageRef" class="scrollArea">-->
    <q-page-container>
      <!-- pass ref for controlling scroll within child component -->
      <router-view v-slot="{ Component }">
        <KeepAlive :max="8">
          <component :is="Component" />
        </KeepAlive>
      </router-view>

      <!-- <q-page-sticky position="bottom-right" :offset="fabPos" v-if="!store.hasToken()">
        <q-btn
          direction="up"
          :disable="draggingFab"
          v-touch-pan.prevent.mouse="moveFab"
          @click="toggleTheme"
          size="sm"
          round
          :style="$q.dark.isActive ? 'background: linear-gradient(to right, rgb(42 51 159 / 75%) 0%, rgb(20 25 27 / 75%) 100%);' : 'background: linear-gradient(to right, rgba(114, 124, 240, 0.75) 0%, rgb(231 234 247 / 75%) 100%);'"
        >
          <q-icon :name="$q.dark.isActive ? 'light_mode' : 'dark_mode'" :color="$q.dark.isActive ? 'amber-7' : 'indigo-7'" />
        </q-btn>
      </q-page-sticky> -->
    </q-page-container>
    <!--    </q-scroll-area>-->

    <q-footer v-if="ui.footer">
      <q-tabs v-model="tab" no-caps class="text-grey shadow-2" :breakpoint="0" align="justify" justify="flex-end">
        <q-route-tab to="/" name="home">
          <img
            v-if="tab === 'home'"
            class="footer-icon"
            src="../assets/home/index/footer/footer-home-icon-active.svg"
          />
          <img v-else class="footer-icon" src="../assets/home/index/footer/footer-home-icon.svg" />
          <!-- <RiHomeLine /> -->
          Home
        </q-route-tab>
        <q-route-tab to="/promo" name="promo">
          <img
            v-if="tab === 'promo'"
            class="footer-icon"
            src="../assets/home/index/footer/footer-promo-icon-active.svg"
          />
          <img v-else class="footer-icon" src="../assets/home/index/footer/footer-promo-icon.svg" />
          <!-- <RiCoinsLine /> -->
          Promotion
        </q-route-tab>

        <q-route-tab to="/finance/deposit" name="deposit">
          <img class="footer-icon deposit-icon" src="../assets/home/index/footer/footer-deposit-icon.svg" />
          <!-- <RiWallet2Line /> -->
          Deposit
        </q-route-tab>

        <q-route-tab to="/liveChat" name="live">
          <img
            v-if="tab === 'live'"
            class="footer-icon"
            src="../assets/home/index/footer/footer-chat-icon-active.svg"
          />
          <img v-else class="footer-icon" src="../assets/home/index/footer/footer-chat-icon.svg" />
          <!-- <RiCustomerService2Fill /> -->
          Live Chat
        </q-route-tab>

        <q-route-tab v-if="store.hasToken()" to="/account" name="account">
          <img
            v-if="tab === 'account'"
            class="footer-icon"
            src="../assets/home/index/footer/footer-mine-icon-active.svg"
          />
          <img v-else class="footer-icon" src="../assets/home/index/footer/footer-mine-icon.svg" />
          <!-- <RiUserSmileLine /> -->
          Account
        </q-route-tab>
        <q-route-tab v-else to="/agent-reg-guide" name="agentRegGuide">
          <img
            v-if="tab === 'agentRegGuide'"
            class="footer-icon"
            src="../assets/home/index/footer/footer-mine-icon-active.svg"
          />
          <img v-else class="footer-icon" src="../assets/home/index/footer/footer-mine-icon.svg" />
          Agent
        </q-route-tab>
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script>
/* eslint-disable */
import { defineComponent, onMounted, ref, watch, onUnmounted } from "vue";
import { userStore } from "stores/index";
import { useUI } from "stores/ui";
import { useRoute, useRouter } from "vue-router";
import { api } from "boot/axios";
import AssistancePopup from "./../components/modal/AssistancePopup.vue";
import ThemeToggle from "src/components/themeToggle.vue";
import { useQuasar } from "quasar";
import {
  RiWalletLine,
  RiCoinsLine,
  RiHomeLine,
  RiUserSmileLine,
  RiCustomerService2Fill,
  RiArrowDropLeftLine,
  RiBilliardsFill,
  RiBasketballLine,
  RiWallet2Line,
  RiEyeOffLine,
  RiEyeLine,
  RiRefreshLine,
  RiTeamLine,
  RiSwordFill
} from "vue-remix-icons";
import AppDownload from "components/AppDownload.vue";
import HeaderProfile from "components/HeaderProfile.vue";

export default defineComponent({
  name: "MainLayout",

  components: {
    RiWalletLine,
    RiCoinsLine,
    RiHomeLine,
    RiUserSmileLine,
    RiCustomerService2Fill,
    RiArrowDropLeftLine,
    RiBilliardsFill,
    RiBasketballLine,
    RiWallet2Line,
    RiEyeOffLine,
    RiEyeLine,
    RiRefreshLine,
    RiTeamLine,
    RiSwordFill,
    AssistancePopup,
    AppDownload,
    HeaderProfile,
    ThemeToggle
  },

  setup() {
    const $q = useQuasar();
    const fabPos = ref([-10, 300]);
    const draggingFab = ref(false);
    const banners = ref([]);
    const isCenterPromoActive = ref(false);
    const route = useRoute();
    const router = useRouter();
    const store = userStore();
    const prevPage = ref(null);
    const ui = useUI();

    const toggleTheme = () => {
      $q.dark.toggle();
      sessionStorage.setItem("ISDARK", $q.dark.isActive);
    };

    const moveFab = (ev) => {
      draggingFab.value = ev.isFirst !== true && ev.isFinal !== true;

      fabPos.value = [fabPos.value[0] - ev.delta.x, fabPos.value[1] - ev.delta.y];
    };

    const scrollPageRef = ref(null);

    const logout = () => store.memberLogout().then(() => router.push("/"));

    const checkRoute = () => {
      if (route) {
        hasPage.value = false;
        pageName.value = "";
        if (route.path === "/slot") {
          hasPage.value = true;
          pageName.value = "Slot";
        } else if (route.path === "/live-casino") {
          hasPage.value = true;
          pageName.value = "Live Casino";
        } else if (route.path === "/poker") {
          hasPage.value = true;
          pageName.value = "Poker";
        } else if (route.path === "/e-sport") {
          hasPage.value = true;
          pageName.value = "Esports";
        } else if (route.path === "/sport") {
          hasPage.value = true;
          pageName.value = "Sport";
        } else if (route.path === "/aviator") {
          hasPage.value = true;
          pageName.value = "Fishing";
        } else if (route.path === "/display") {
          prevPage.value = "finance/deposit";
          hasPage.value = true;
          pageName.value = "Bank Information";
        } else if (route.path === "/finance/deposit") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = "Deposit";
        } else if (route.path === "/finance/withdraw") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = "Withdraw";
        } else if (route.path.indexOf("/account/transit") > -1) {
          prevPage.value = "account/records";
          hasPage.value = true;
          pageName.value = "";
          if (route.path === "/account/transit/deposit") {
            prevPage.value = "account/records";
            hasPage.value = true;
            pageName.value = "Deposit";
          } else if (route.path === "/account/transit/withdraw") {
            prevPage.value = "account/records";
            hasPage.value = true;
            pageName.value = "Withdraw";
          } else if (route.path === "/account/transit/turnover") {
            prevPage.value = "account/records";
            hasPage.value = true;
            pageName.value = "Turnover";
          } else if (route.path === "/account/transit/rebates") {
            prevPage.value = "account/records";
            hasPage.value = true;
            pageName.value = "Rebates";
          } else if (route.path === "/account/transit/gameBetRecord") {
            prevPage.value = "account/records";
            hasPage.value = true;
            pageName.value = "Game Bet Record";
          } else if (route.path === "/account/transit/reminderRecord") {
            prevPage.value = "account/records";
            hasPage.value = true;
            pageName.value = "Reminder Record";
          }
        } else if (route.path === "/account/records") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = "Transaction Records";
        } else if (route.path === "/account/personal") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = "Personal";
        } else if (route.path === "/account/withdraw") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = "Withdraw";
        } else if (route.path === "/account/security-verification") {
          prevPage.value = "account/personal";
          hasPage.value = true;
          pageName.value = "Security Verification";
        } else if (route.path === "/account/mail") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = "Mailbox";
        } else if (route.path === "/share") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = "Share";
        } else if (route.path === "/affiliate") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = "Affiliate";
        } else if (route.path === "/vip") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = "VIP";
        } else if (route.path === "/promo" && route.query.code) {
          prevPage.value = "promo";
          hasPage.value = true;
          pageName.value = "Promotion";
        } else if (route.path === "/promo") {
          hasPage.value = true;
          pageName.value = "Promotion";
        } else if (route.path === "/liveChat") {
          hasPage.value = true;
          pageName.value = "Live Chat";
        } else if (route.path === "/insert-bankinfo") {
          hasPage.value = true;
          pageName.value = "Bank Information";
        } else if (route.path === "/agent-reg-guide") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = "Agent Account Creation";
        }
      }
    };

    function loadData() {
      api
        .get("/promo/banner?category=HOME")
        .then((res) => {
          if (res.data.code === 0) {
            banners.value = res.data.data.slice(0, 2);
          }
        })
        .catch(() => {});
    }

    const isShowBalance = ref(false);
    const toggleShowBalance = () => {
      isShowBalance.value = !isShowBalance.value;
    };

    const isLoadBalance = ref(false);
    const loadBalance = () => {
      isLoadBalance.value = true;
      store.getBalance();
      setTimeout(() => {
        isLoadBalance.value = false;
      }, 150);
    };

    const gotoPromo = (banner) => {
      const redirectU = "/promo" + banner.redirectUrl;
      router.push(`${redirectU}`);
    };
    const pageName = ref("");
    const hasPage = ref(false);
    const rightDrawerOpen = ref(false);
    onMounted(() => {
      checkRoute();
      loadData();
    });

    watch(route, checkRoute);

    return {
      tab: ref("home"),
      rightDrawerOpen,
      toggleRightDrawer() {
        rightDrawerOpen.value = !rightDrawerOpen.value;
        if (rightDrawerOpen.value) {
          isCenterPromoActive.value = false;
        }
      },
      logout,
      store,
      scrollPageRef,
      pageName,
      hasPage,
      ui,
      prevPage,
      isCenterPromoActive,
      imgURL: process.env.IMAGE_CDN + "/",
      banners,
      gotoPromo,
      isShowBalance,
      loadBalance,
      isLoadBalance,
      toggleShowBalance,
      fabPos,
      draggingFab,
      moveFab,
      toggleTheme
    };
  }
});
</script>
<style lang="scss" scoped>
$link-color: #ff6600;
.q-list {
  display: flex;
  flex-direction: column;
  gap: 8px;

  .q-item {
    border-radius: 10px;
    border: 1px solid transparent;

    &:hover,
    &.q-router-link--active {
      //border: 1px solid #3c4285;
      color: $primary;
    }
  }
}

.commonlabelmain-icons {
  .loadmore {
    margin: 10px auto 30px;
    border: 1px solid #fb5e43;
    border-radius: 5px;
  }

  .q-item-type {
    &:active {
      background: $primary-light;
    }
  }

  .hvr-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 35px;
    margin-right: 8px;
    color: #0078ea;

    svg {
      fill: #0078ea;
    }

    .q-icon {
      width: 1.4em;
      height: unset;
    }
  }

  &.hvr-icon-circle {
    position: relative;

    &:before,
    &:after {
      content: "";
      background: linear-gradient(#000000, transparent);
      position: absolute;
      width: 0;
      height: 10px;
      left: 10px;
      border-radius: 100%;
    }

    &:after {
      transform: rotateZ(44deg);
    }
  }

  @keyframes rotate {
    0% {
      border: 10px solid #23263c;
      border-left: 10px solid transparent;
    }
    30% {
      transform: rotateZ(360deg);
    }
    60% {
      border: 10px solid #23263c;
      border-left: 10px solid transparent;
    }
    70% {
      border-top: 10px solid transparent;
    }
    80% {
      border-right: 10px solid transparent;
    }
    90% {
      border: 10px solid transparent;
    }
    100% {
      transform: rotateZ(720deg);
    }
  }

  .vip-icon {
    &.hov {
      display: none;
    }
  }

  .livecasino-icon {
    transition: all 0.5s ease-in;
    border: 1px solid #0078ea;
    border-radius: 50%;
    width: 18px;
    height: 18px;
    border: 3px dotted #0078ea;
    font-size: 10px;
    text-align: center;
    // margin-right: 6px;
    line-height: 13px;
  }

  .fish-icon {
    transition: all 0.5s ease-in;

    // margin-right: 10px;
    display: flex;
    align-items: center;

    &:before {
      content: "";
      border-top: 5px solid transparent;
      border-bottom: 5px solid transparent;
      border-left: 5px solid #0078ea;
      display: inline-block;
    }

    &:after {
      content: "";
      display: inline-block;
      border-radius: 50%;
      width: 15px;
      height: 10px;
      background: #0078ea;
    }
  }

  .slot-icon {
    transition: all 0.2s ease-in;
    font-size: 8px;
    line-height: 10px;
    font-weight: bold;
    // margin-right: 8px;
    position: relative;
    border: 0.5px solid #0078ea;
    padding: 2px;

    span {
      border: 0.2px solid #0078ea;
      width: 8px;
      text-align: center;
      display: inline-block;

      &:before {
        content: "7";
      }

      &:first-child {
        border-right: 0;
      }

      &:last-child {
        border-left: 0;
      }
    }
  }

  @keyframes offset {
    to {
      stroke-dashoffset: 0;
    }
  }
  @keyframes fill-green {
    to {
      fill: #78be20;
      stroke: transparent;
    }
  }

  svg.poker-icon {
    width: 100%;
    fill: #0078ea;
  }

  svg.home-icon {
    width: 22px;
    height: 22px;
  }

  path {
    stroke-width: 0.5;
    stroke-dasharray: 3212;
    stroke-dashoffset: 3212;
    fill: transparent;
  }

  svg path {
    fill: none;
    stroke: #ffffff;
    stroke-width: 2;
    stroke-dasharray: 1000;
    stroke-dashoffset: 1000;
    -webkit-animation: dash 10s linear forwards;
    animation: dash 10s linear forwards;
  }

  @-webkit-keyframes dash {
    to {
      stroke-dashoffset: 0;
    }
  }
  @keyframes dash {
    to {
      stroke-dashoffset: 0;
    }
  }

  @-webkit-keyframes spin {
    1% {
      content: "1";
    }
    2% {
      content: "2";
    }
    3% {
      content: "3";
    }
    4% {
      content: "4";
    }
    5% {
      content: "5";
    }
    6% {
      content: "6";
    }
    7% {
      content: "7";
    }
  }

  @-webkit-keyframes animateFish {
    0% {
      transform: translateY(-5px) scale(0.4);
    }
    20% {
      transform: translateX(10px) translateY(-6px) scale(0.4);
    }
    30% {
      transform: translateX(10px) translateY(-5px) scale(0.4);
    }
    50% {
      transform: translateX(10px) translateY(-6px) rotateY(180deg) scale(0.6);
    }
    80% {
      transform: translateX(-5px) translateY(-5px) rotateY(180deg) scale(0.4);
    }
    90% {
      transform: translateX(-10px) translateY(0px) scale(1);
    }

    100% {
      transform: translateX(0) rotateY(0deg) scale(1);
    }
  }
  @keyframes shine {
    100% {
      background: #434343;
    }
  }

  &.router-link-active {
    color: $link-color;

    svg {
      fill: $link-color;
    }

    svg path {
      stroke: #ff6600;
    }

    .livecasino-icon {
      transform: rotateY(360deg);
      border-color: $link-color;
    }

    .slot-icon {
      border-color: $link-color;

      span {
        border-color: $link-color;
      }
    }

    .fish-icon {
      &:before,
      &:after {
        border-left-color: $link-color;
      }

      &:after {
        background: $link-color;
      }
    }
  }
}

.scrollArea {
  // height: calc(100vh - 70px);
  height: 100vh;
  max-width: 500px;
  margin: 0 auto;
}
</style>
<style scoped lang="scss">
path {
  stroke-width: 0.5;
  stroke-dasharray: 3212;
  stroke-dashoffset: 3212;
  fill: transparent;
}

svg path {
  fill: none;
  stroke: #ffffff;
  stroke-width: 2;
  stroke-dasharray: 1000;
  stroke-dashoffset: 0;
}

.logo {
  width: 86px;
  margin-left: 5px;

  img {
    width: 100%;
  }
}

.head-btn {
  padding: 0 12px;
  font-weight: 700;
  font-size: 12px;
  font-family: "Poppins Bold";
  text-transform: capitalize;
}

.head-btn {
  &.login-btn {
    background: linear-gradient(270deg, #76b5fa 0%, #fff 44.79%, #76b5fa 100%);
    box-shadow: 0px -4px 4px 0px #2b74b0 inset, -1px 2px 4px 0px rgba(255, 255, 255, 0.8) inset;
    border-radius: 20px;
    color: #15599a;
  }

  &.register-btn {
    background: linear-gradient(270deg, #152df4 0%, #af0be8 100%);
    box-shadow: 0px -4px 4px 0px #02009e inset, -1px 2px 4px 0px rgba(255, 255, 255, 0.8) inset;
    border-radius: 20px;
    color: #fff;
  }
}

.top-section {
  height: 100%;
  max-height: 50px;
}

.index-login-status {
  .vip-btn {
    margin-top: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.2rem;
    background: linear-gradient(90deg, #4776e6 0%, #8e54e9 100%);
    border-radius: 100px;
    height: 3.2em;
    line-height: 2em;
    flex: 1;
    font-weight: 700;
    text-transform: uppercase;
    white-space: nowrap;
    padding: 0.2rem 0.2rem;
    text-align: center;
    color: $text-color-reverse;
  }
}

.index-logout-status {
  .small {
    display: flex;
    gap: 10px;
    justify-content: flex-start;
    align-items: flex-start;
    margin-top: -0.6rem;

    > a {
      position: relative;
      color: #fff;
      margin-right: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 10px;
    }
  }

  .bottombtns {
    display: flex;
    gap: 1rem;
    justify-content: flex-start;

    a {
      flex: 1 1 auto;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }

  .avatar {
    border: 1px solid #0071ed;
    border-radius: 50%;
    width: 60px;
    height: 60px;
    overflow: hidden;

    img {
      width: 100%;
    }
  }

  .large {
    width: 100%;
    padding: 0 0 0.2rem;
    margin: 5px 0;

    #eyeicon {
      svg {
        fill: #000;
      }
    }

    #refreshBalance {
      svg {
        fill: #000;
      }
    }
  }

  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #000;
    font-size: 18px;
  }

  .bot {
    color: #000;
    border-radius: 10px;
    display: flex;
    gap: 0.2rem;
    align-items: center;
    width: 100%;
    background: #dbdbdb;
    padding: 0px 10px;
    justify-content: space-between;
    margin: 10px 0;
  }

  .welcomeuser {
    flex: 1;
    font-size: 14px;
    line-height: 14px;
    color: #000;

    .user {
      font-weight: bold;
      font-size: 16px;
      line-height: 16px;
      margin-top: 8px;
    }
  }

  .personal-vip-badge-div {
    display: flex;
    align-items: flex-start;
    justify-content: flex-end;
    position: relative;
    width: 55px;
    margin-top: 6px;

    .vip-badge-diamond {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      margin: auto;
      background: #f67600;
      padding: 12px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .vip-badge-span {
      font-size: 10px;
      line-height: 16px;
      background: #5777ff;
      color: #fff;
      border-radius: 100px;
      padding: 0 0.2rem 0 0.8rem;
      font-weight: 700;
      white-space: nowrap;
    }
  }
}

.icons {
}
</style>
