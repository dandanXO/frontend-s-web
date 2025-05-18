<template>
  <q-layout view="hHh Lpr fFf">
    <div v-if="hasPage">
      <q-card-section v-if="!hasPage" class="top-section justify-between items-center" horizontal>
        <div class="logo">
          <router-link to="/"><img src="../assets/logo.png" /></router-link>
        </div>
        <q-card-actions v-if="!store.hasToken()">
          <q-btn glossy color="brand" to="/login">Login</q-btn>
          <q-btn outline color="brand" to="/register">Register</q-btn>
        </q-card-actions>
        <!-- <q-card-actions v-if="store.hasToken()">
          <q-btn glossy color="brand" @click="logout">Logout</q-btn>
        </q-card-actions> -->
        <q-btn v-if="store.hasToken()" class="flex" to="/finance/deposit" no-caps flat>
          <span style="font-size: 10px; margin-left: 5px; display: block">Deposit</span>
        </q-btn>
      </q-card-section>
      <q-card-section class="page-title" v-if="hasPage">
        <a @click="goToPrevPage(prevPage)" class="q-mt-sm">
          <q-icon class="header-icon" name="arrow_back_ios"></q-icon>
          <span v-if="route.path === '/deposit' || route.path === '/withdraw'" class="header-back">Back</span>
        </a>
        <div class="page-title-wrapper">
          <!--          <img src="../assets/images/index/hot-elephant-left.png" alt="" />-->
          <div class="title-container">
            <span class="title">{{ pageName }}</span>
          </div>
          <!--          <img src="../assets/images/index/hot-elephant-right.png" alt="" />-->
        </div>

        <div
          class="header-right"
          :class="route.path === '/deposit' || route.path === '/withdraw' ? 'header-right-long' : ''"
        >
          <q-btn v-if="hasDrawer" flat @click="ui.drawerRight = !ui.drawerRight" round dense icon="menu" />
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
    </div>

    <q-drawer side="right" elevated v-model="ui.drawerRight" :width="250" :breakpoint="500" v-if="hasDrawer">
      <div class="q-pa-md bg-brightbtn">游戏平台</div>
      <div class="platforms q-pt-md">
        <!--        <div class="text-bright q-px-sm q-pt-md">-->
        <!--          -->
        <!--        </div>-->
      </div>
      <q-scroll-area class="fit">
        <div class="q-pa-sm platform-list">
          <q-btn
            @click="changePlatform(plat)"
            size="md"
            color="brightbtn"
            v-for="(plat, n) in platformsList"
            :key="n"
            :label="plat.icon"
          />
        </div>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view v-slot="{ Component }">
        <KeepAlive :max="8">
          <component :is="Component" />
        </KeepAlive>
      </router-view>
    </q-page-container>

    <q-footer v-if="ui.footer" :style="ui.bottomInsetHeight > 0 ? `bottom: ${ui.bottomInsetHeight}px;` : ''" elevated>
      <q-tabs v-model="tab" no-caps :breakpoint="0" align="justify">
        <q-route-tab to="/home" name="home" exact :ripple="false">
          <img class="inactive" src="../assets/images/index/menu/home-icon.png" />
          <img class="hover" src="../assets/images/index/menu/home-icon-hover.png" />
          Home
        </q-route-tab>
        <q-route-tab class="cs-web-id" to="/promo" id="cs-web-id" name="live" :ripple="false">
          <img class="inactive" src="../assets/images/index/menu/bonus-icon.png" />
          <img class="hover" src="../assets/images/index/menu/bonus-icon-hover.png" />
          Promo
        </q-route-tab>
        <q-route-tab :to="`/deposit?from=${route.path}`" name="deposit" class="center-menu" :ripple="false">
          <img src="../assets/images/index/menu/deposit-icon.png" />
        </q-route-tab>
        <q-route-tab to="/earn-money" name="earn-money" :ripple="false">
          <img class="inactive" src="../assets/images/index/menu/earn-icon.png" />
          <img class="hover" src="../assets/images/index/menu/earn-icon-hover.png" />
          Earn Money
        </q-route-tab>
        <q-route-tab to="/account" name="account" :ripple="false">
          <img class="inactive" src="../assets/images/index/menu/account-icon.png" />
          <img class="hover" src="../assets/images/index/menu/account-icon-hover.png" />
          Me
        </q-route-tab>
      </q-tabs>
    </q-footer>
  </q-layout>

  <div class="first-screen-loading" v-show="ui.firstScreenLoading">
    <img src="../assets/55-ace-logo.png" alt="" />
  </div>
</template>

<script>
import { SplashScreen } from "@capacitor/splash-screen";
import { isAndroid } from "boot/utils";
import { computed, defineComponent, onMounted, ref, watch } from "vue";
import { userStore } from "stores/index";
import { useUI } from "stores/ui";
import { useRoute, useRouter } from "vue-router";
// import EssentialLink from "components/EssentialLink.vue";

import { translateRecord } from "src/directives/translate";

export default defineComponent({
  name: "MainLayout",

  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = userStore();
    const prevPage = ref(null);
    const ui = useUI();
    const scrollPageRef = ref(null);
    // ui.$onAction(({ name, args }) => {
    //   switch (name) {
    //     case "setScrollPosition":
    //       scrollPageRef.value.setScrollPosition(args[0], args[1], args[2]);
    //   }
    // });
    const logout = () => {
      store.memberLogout().then(() => {
        // location.reload();
        router.push("/home");
      });
    };

    const checkFirstScreen = () => {
      if (ui.firstScreenLoading) {
        setTimeout(() => {
          ui.firstScreenLoading = false;
        }, 500);
      }
    };

    watch(
      () => route.path,
      async () => {
        checkRoute();
      }
    );

    watch(
      () => route.query,
      async () => {
        checkRoute();
      }
    );
    const changePlatform = (plat) => {
      router.replace(`slot?platform=${plat.code}`);
      ui.drawerRight = false;
    };
    const checkRoute = () => {
      if (route) {
        hasDrawer.value = false;
        hasPage.value = false;
        pageName.value = "";
        if (route.path === "/slot") {
          prevPage.value = "/";
          hasPage.value = true;
          hasDrawer.value = true;
          pageName.value = "Slot";
          if (route.query.platform) {
            var platformName = route.query.platform == "BBINDY" ? "BBIN" : translateRecord(route.query.platform);
            pageName.value = `${platformName} Game Lobby`;
          }
        } else if (route.path === "/account") {
          prevPage.value = "/";
          hasPage.value = false;
          pageName.value = "";
        } else if (route.path === "/account/bank") {
          hasPage.value = true;
          pageName.value = "Bank";
          if (route.query.from) {
            prevPage.value = route.query.from;
          } else {
            prevPage.value = "account";
          }
        } else if (route.path === "/account/message") {
          hasPage.value = true;
          pageName.value = "Message";
          if (route.query.from) {
            prevPage.value = route.query.from;
          } else {
            prevPage.value = "account";
          }
        } else if (route.path === "/account/message-detail") {
          prevPage.value = "account/message";
          hasPage.value = true;
          pageName.value = "Message";
        } else if (route.path === "/account/record") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = "Record";
        } else if (route.path === "/account/order") {
          hasPage.value = true;
          pageName.value = "Order";
          if (route.query.from) {
            prevPage.value = route.query.from;
          } else {
            prevPage.value = "account";
          }
        } else if (route.path === "/account/discount") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = "Discount";
        } else if (route.path === "/earn-money" || route.path === "/agency-policy") {
          prevPage.value = "/";
          hasPage.value = false;
          pageName.value = "Earn Money";
        } else if (route.path === "/bonus") {
          prevPage.value = "/";
          // hasPage.value = true;
          pageName.value = "Daily Activity";
        } else if (route.path === "/vip") {
          // hasPage.value = true;
          pageName.value = "VIP Privileges";
          if (route.query.redirect) prevPage.value = route.query.redirect;
          else prevPage.value = "/";
        } else if (route.path === "/login") {
          prevPage.value = "home";
          hasPage.value = true;
          pageName.value = "Login";
        } else if (route.path === "/register") {
          prevPage.value = "home";
          hasPage.value = true;
          pageName.value = "Register";
        } else if (route.path === "/forgot-account") {
          prevPage.value = "login";
          hasPage.value = true;
          pageName.value = "Forgot Account";
        } else if (route.path === "/forgot-password") {
          prevPage.value = "login";
          hasPage.value = true;
          pageName.value = "Forgot Password";
        } else if (route.path === "/live-casino") {
          hasPage.value = true;
          pageName.value = "Live Casino";
        } else if (route.path === "/poker") {
          hasPage.value = true;
          pageName.value = "Poker";
        } else if (route.path === "/e-sport") {
          hasPage.value = true;
          pageName.value = "E-Sports";
        } else if (route.path === "/sport") {
          hasPage.value = true;
          pageName.value = "Sports";
        } else if (route.path === "/fish") {
          hasPage.value = true;
          pageName.value = "Fishing";
        } else if (route.path === "/promo") {
          hasPage.value = false;
          pageName.value = "Promotion";
          prevPage.value = "/";
          if (route.query.name) {
            if (route.query.fromAccount) {
              prevPage.value = "account/promotion";
            } else {
              hasPage.value = false;
              prevPage.value = "promo";
            }
          }
        } else if (route.path === "/promotion") {
          hasPage.value = true;
          pageName.value = "Promotion";
          prevPage.value = "";
        }else if (route.path === "/activities-details") {
          prevPage.value = "promo";
          hasPage.value = true;
          pageName.value = "Activities Details";
        } else if (route.path === "/finance/deposit") {
          hasPage.value = true;
          pageName.value = "Deposit";
          if (route.query.from) {
            prevPage.value = route.query.from;
          } else {
            prevPage.value = "account";
          }
        } else if (route.path === "/finance/withdraw") {
          hasPage.value = true;
          pageName.value = "Withdrawal";
          if (route.query.from) {
            prevPage.value = route.query.from;
          } else {
            prevPage.value = "account";
          }
        } else if (route.path === "/account/transfer") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = "Transfer";
          if (route.query.redirect) {
            prevPage.value = route.query.redirect;
          }
        } else if (route.path === "/account/profile") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = "Personal Center";
        } else if (route.path === "/account/records") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = "Records";
        } else if (route.path === "/account/transit") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = "Transit";
        } else if (route.path === "/account/personal") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = "Personal Information";
        } else if (route.path === "/account/verifyTelephone") {
          prevPage.value = "account/personal";
          hasPage.value = true;
          pageName.value = "Verify Mobile Number";
        } else if (route.path === "/account/verifyEmail") {
          prevPage.value = "account/personal";
          hasPage.value = true;
          pageName.value = "E-mail";
        } else if (route.path === "/account/changePwd") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = "Change Password";
        } else if (route.path === "/account/download") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = "Download";
        } else if (route.path === "/account/invite") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = "Referral";
        } else if (route.path === "/account/announcement") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = "Announcement";
        } else if (route.path === "/account/mail") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = "Mail";
        } else if (route.path === "/account/mail/inbox") {
          prevPage.value = "account/mail";
          hasPage.value = true;
          pageName.value = "Inbox";
        } else if (route.path === "/account/mail/outbox") {
          prevPage.value = "account/mail";
          hasPage.value = true;
          pageName.value = "Outbox";
        } else if (route.path === "/account/mail/write") {
          prevPage.value = "account/mail";
          hasPage.value = true;
          pageName.value = "写信";
        } else if (route.path === "/account/withdraw") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = "Bank Detail";
        } else if (route.path === "/account/promotion") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = "Promotion Claim";
        } else if (route.path === "/affiliate") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = "Affiliate";
        } else if (route.path === "/insert-bankinfo") {
          hasPage.value = true;
          pageName.value = "Bank Information";
        } else if (route.path === "/account/records/deposit") {
          prevPage.value = "account/records";
          hasPage.value = true;
          pageName.value = "Deposit Record";
        } else if (route.path === "/account/records/withdraw") {
          prevPage.value = "account/records";
          hasPage.value = true;
          pageName.value = "Withdrawal Record";
        } else if (route.path === "/account/records/transfer") {
          prevPage.value = "account/records";
          hasPage.value = true;
          pageName.value = "Transfer Record";
        } else if (route.path === "/account/records/moneyChange") {
          prevPage.value = "account/records";
          hasPage.value = true;
          pageName.value = "账变记录";
        } else if (route.path === "/account/records/promo") {
          prevPage.value = "account/records";
          hasPage.value = true;
          pageName.value = "Promotion Record";
        } else if (route.path === "/account/records/bet") {
          prevPage.value = "account/records";
          hasPage.value = true;
          pageName.value = "Bet Record";
        } else if (route.path === "/account/records/financeFeedback") {
          prevPage.value = "account/records";
          hasPage.value = true;
          pageName.value = "催单记录";
        } else if (route.path === "/account/records/change") {
          prevPage.value = "account/records";
          hasPage.value = true;
          pageName.value = "账变记录";
        } else if (route.path === "/account/records/betRecord") {
          prevPage.value = "account/records";
          hasPage.value = true;
          pageName.value = "Bet Record";
        } else if (route.path === "/account/records/recommend") {
          prevPage.value = "account/records";
          hasPage.value = true;
          pageName.value = "Referral Record";
        } else if (route.path === "/account/records/help") {
          prevPage.value = "account/records";
          hasPage.value = true;
          pageName.value = "救援金记录";
        } else if (route.path === "/account/records/bill") {
          prevPage.value = "account/records";
          hasPage.value = true;
          pageName.value = "催单记录";
        } else if (route.path === "/deposit") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = "";
          if (route.query.from) {
            prevPage.value = route.query.from;
          }
        } else if (route.path === "/withdraw") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = "";
        }
      }
    };
    const pageName = ref("");
    const hasPage = ref(false);
    const hasDrawer = ref(false);
    const leftDrawerOpen = ref(false);
    const platformsFixed = ref([
      {
        id: "81",
        code: "BBINDY",
        icon: "bbin"
      },
      {
        id: "21",
        code: "PG",
        icon: "PG"
      },
      {
        id: "73",
        code: "MGP",
        icon: "MG"
      },
      {
        id: "55",
        code: "TTG",
        icon: "ttg"
      },
      {
        id: "72",
        code: "SG",
        icon: "sg"
      },
      {
        id: "22",
        code: "PP",
        icon: "pp"
      },
      {
        id: "31",
        code: "JDB",
        icon: "jdb"
      },
      {
        id: "70",
        code: "AMEBA",
        icon: "AMEBA"
      },
      {
        id: "54",
        code: "PT",
        icon: "pt"
      },
      {
        id: "65",
        code: "SW",
        icon: "SW"
      },
      {
        id: "33",
        code: "CQ9",
        icon: "CQ9"
      }
    ]);

    const platformsList = computed(() => {
      if (ui.slotLists.length === 0) {
        return platformsFixed.value;
      }
      return ui.slotLists;
    });
    // console.log(platformsList.value);

    const goToPrevPage = (prePage) => {
      if (prePage === "/") {
        router.push("/");
      } else if (window.location.pathname === "/promotion") {
        window.location.href = "xfapp:/promo";
      } else {
        router.push("/" + prePage);
      }
    };

    onMounted(() => {
      checkRoute();
      checkFirstScreen();

      if (isAndroid()) {
        setTimeout(() => {
          SplashScreen.hide();
        }, 500);
      }
    });
    return {
      tab: ref("home"),
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      logout,
      store,
      router,
      route,
      scrollPageRef,
      pageName,
      hasPage,
      ui,
      prevPage,
      hasDrawer,
      platformsList,
      changePlatform,
      goToPrevPage
    };
  }
});
</script>

<style scoped lang="scss">
.q-drawer .platform-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

  .q-btn {
    width: 40%;
  }
}

.scrollArea {
  // height: calc(100vh - 70px);
  height: 100%;
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
  width: 130px;
  margin-left: 10px;

  img {
    width: 100%;
  }
}

.back-btn {
  width: 2.25rem;
  margin: 0.5rem 0 0 0;
}

.page-title-wrapper {
  display: flex;
  justify-content: space-between;
  margin: 0;
  padding: 1rem 0px;
  height: 60px;

  img {
    width: 2.25rem;
  }

  .title-container {
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center center;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 14rem;
    margin: 0 0.5rem;
    font-size: 16px;
  }

  svg {
    width: 250px;
  }
}

.first-screen-loading {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 500px;
  max-width: 100%;
  background: #11131e;
  background-size: cover;
  background-position: center center;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    display: block;
    width: 100%;
    max-width: 200px;
  }
}
</style>
