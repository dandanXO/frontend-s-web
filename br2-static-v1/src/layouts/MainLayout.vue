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
        <q-btn v-if="store.hasToken()" class="flex" to="/finance/deposit" no-caps flat>
          <span style="font-size: 10px; margin-left: 5px; display: block">Deposit</span>
        </q-btn>
      </q-card-section>
      <q-card-section
        class="page-title"
        :class="{
          'page-title__empty': pageName === '',
          absolute: route.path === '/account'
        }"
        v-if="hasPage"
      >
        <a @click="goToPrevPage(prevPage)">
          <q-icon class="header-icon" name="chevron_left"></q-icon>
          <!-- <span v-if="route.path === '/deposit' || route.path === '/withdraw'" class="header-back">
            {{ $t("btn.back") }}
          </span> -->
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
    </div>

    <q-drawer side="right" elevated v-model="ui.drawerRight" :width="250" :breakpoint="500" v-if="hasDrawer">
      <div class="q-pa-md bg-brightbtn">游戏平台</div>
      <div class="platforms q-pt-md"></div>
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
          {{ $t("bottomNav.home") }}
          <!-- Home -->
        </q-route-tab>
        <q-route-tab class="cs-web-id" to="/promo" id="cs-web-id" name="live" :ripple="false">
          <img class="inactive" src="../assets/images/index/menu/earn-icon.png" />
          <img class="hover" src="../assets/images/index/menu/earn-icon-hover.png" />
          {{ $t("bottomNav.promo") }}
          <!-- Bonus -->
        </q-route-tab>
        <!-- <q-route-tab :to="`/deposit?from=${route.path}`" name="deposit" class="center-menu" :ripple="false">
          <img src="../assets/images/index/menu/deposit-icon.png" />
        </q-route-tab> -->
        <q-route-tab :to="`/deposit?from=${route.path}`" name="deposit" :ripple="false">
          <img class="inactive" src="../assets/images/index/menu/deposit-icon.png" />
          <img class="hover" src="../assets/images/index/menu/deposit-icon-hover.png" />
          {{ $t("bottomNav.deposit") }}
          <!-- Deposit -->
        </q-route-tab>
        <q-route-tab to="/earn-money" name="earn-money" :ripple="false">
          <img class="inactive" src="../assets/images/index/menu/bonus-icon.png" />
          <img class="hover" src="../assets/images/index/menu/bonus-icon-hover.png" />
          {{ $t("bottomNav.earnMoney") }}
          <!-- Earn Money -->
        </q-route-tab>
        <q-route-tab to="/account" name="account" :ripple="false">
          <img class="inactive" src="../assets/images/index/menu/account-icon.png" />
          <img class="hover" src="../assets/images/index/menu/account-icon-hover.png" />
          {{ $t("bottomNav.me") }}
          <!-- Me -->
        </q-route-tab>
      </q-tabs>
    </q-footer>
  </q-layout>

  <div class="first-screen-loading" v-show="ui.firstScreenLoading">
    <img src="../assets/akb188-logo.png" alt="" />
  </div>

  <LoginModal />
  <RegisterSuccessModal />
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
import { useI18n } from "vue-i18n";
import { i18nStore } from "src/router/language";
import { storeToRefs } from "pinia";

import LoginModal from "src/components/modal/login/LoginModal.vue";
import RegisterSuccessModal from "src/components/modal/login/RegisterSuccessModal.vue";

export default defineComponent({
  name: "MainLayout",

  components: {
    LoginModal,
    RegisterSuccessModal
  },

  setup() {
    const { t } = useI18n();
    const i18nStoreLanguage = i18nStore();
    const { languageVal } = storeToRefs(i18nStoreLanguage);
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
          pageName.value = t("header.slot");
          if (route.query.platform) {
            var platformName = route.query.platform == "BBINDY" ? "BBIN" : translateRecord(route.query.platform);
            pageName.value = `${platformName} ${t("header.gameLobby")}`;
          }
        } else if (route.path === "/account") {
          prevPage.value = "/";
          hasPage.value = true;
          pageName.value = "";
        } else if (route.path === "/account/bank") {
          hasPage.value = true;
          pageName.value = t("header.bank");
          if (route.query.from) {
            prevPage.value = route.query.from;
          } else {
            prevPage.value = "account";
          }
        } else if (route.path === "/account/message") {
          hasPage.value = true;
          pageName.value = t("header.message");
          if (route.query.from) {
            prevPage.value = route.query.from;
          } else {
            prevPage.value = "account";
          }
        } else if (route.path === "/account/message-detail") {
          prevPage.value = "account/message";
          hasPage.value = true;
          pageName.value = t("header.message");
        } else if (route.path === "/account/record") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = t("header.record");
        } else if (route.path === "/account/order") {
          hasPage.value = true;
          pageName.value = t("header.order");
          if (route.query.from) {
            prevPage.value = route.query.from;
          } else {
            prevPage.value = "account";
          }
        } else if (route.path === "/account/discount") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = t("header.discount");
        } else if (route.path === "/earn-money" || route.path === "/agency-policy") {
          prevPage.value = "/";
          hasPage.value = false;
          pageName.value = t("header.earnMoney");
        } else if (route.path === "/language") {
          prevPage.value = "/";
          hasPage.value = true;
          pageName.value = t("header.language");
        } else if (route.path === "/bonus") {
          prevPage.value = "/";
          // hasPage.value = true;
          pageName.value = t("header.dailyActivity");
        } else if (route.path === "/vip") {
          // hasPage.value = true;
          pageName.value = t("header.vipPrivileges");
          if (route.query.redirect) prevPage.value = route.query.redirect;
          else prevPage.value = "/";
        }
        // else if (route.path === "/login") {
        //   prevPage.value = "home";
        //   hasPage.value = true;
        //   pageName.value = t("header.login");
        // } else if (route.path === "/register") {
        //   prevPage.value = "home";
        //   hasPage.value = true;
        //   pageName.value = t("header.register");
        // } else if (route.path === "/forgot-account") {
        //   prevPage.value = "login";
        //   hasPage.value = true;
        //   pageName.value = t("header.forgotAccount");
        // } else if (route.path === "/forgot-password") {
        //   prevPage.value = "login";
        //   hasPage.value = true;
        //   pageName.value = t("header.forgotPassword");
        // }
        else if (route.path === "/live-casino") {
          hasPage.value = true;
          pageName.value = t("header.liveCasino");
        } else if (route.path === "/poker") {
          hasPage.value = true;
          pageName.value = t("header.poker");
        } else if (route.path === "/e-sport") {
          hasPage.value = true;
          pageName.value = t("header.eSports");
        } else if (route.path === "/sport") {
          hasPage.value = true;
          pageName.value = t("header.sports");
        } else if (route.path === "/fish") {
          hasPage.value = true;
          pageName.value = t("header.fishing");
        } else if (route.path === "/promo") {
          hasPage.value = false;
          pageName.value = t("header.promotion");
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
          // debugger;
          hasPage.value = true;
          pageName.value = "Promotion";
          prevPage.value = "";
        } else if (route.path === "/activities-details") {
          prevPage.value = "promo";
          hasPage.value = true;
          pageName.value = t("header.activitiesDetails");
        } else if (route.path === "/finance/deposit") {
          hasPage.value = true;
          pageName.value = t("header.deposit");
          if (route.query.from) {
            prevPage.value = route.query.from;
          } else {
            prevPage.value = "account";
          }
        } else if (route.path === "/finance/withdraw") {
          hasPage.value = true;
          pageName.value = t("header.withdrawal");
          if (route.query.from) {
            prevPage.value = route.query.from;
          } else {
            prevPage.value = "account";
          }
        } else if (route.path === "/account/transfer") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = t("header.transfer");
          if (route.query.redirect) {
            prevPage.value = route.query.redirect;
          }
        } else if (route.path === "/account/profile") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = t("header.personalCenter");
        } else if (route.path === "/account/records") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = t("header.records");
        } else if (route.path === "/account/transit") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = t("header.transit");
        } else if (route.path === "/account/personal") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = t("header.personalInformation");
        } else if (route.path === "/account/verifyTelephone") {
          prevPage.value = "account/personal";
          hasPage.value = true;
          pageName.value = t("header.verifyMobileNumber");
        } else if (route.path === "/account/verifyEmail") {
          prevPage.value = "account/personal";
          hasPage.value = true;
          pageName.value = t("header.email");
        } else if (route.path === "/account/changePwd") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = t("header.changePassword");
        } else if (route.path === "/account/download") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = t("header.download");
        } else if (route.path === "/account/invite") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = t("header.referral");
        } else if (route.path === "/account/announcement") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = t("header.announcement");
        } else if (route.path === "/account/mail") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = t("header.mail");
        } else if (route.path === "/account/mail/inbox") {
          prevPage.value = "account/mail";
          hasPage.value = true;
          pageName.value = t("header.inbox");
        } else if (route.path === "/account/mail/outbox") {
          prevPage.value = "account/mail";
          hasPage.value = true;
          pageName.value = t("header.outbox");
        } else if (route.path === "/account/mail/write") {
          prevPage.value = "account/mail";
          hasPage.value = true;
          pageName.value = "写信";
        } else if (route.path === "/account/withdraw") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = t("header.bankDetail");
        } else if (route.path === "/account/promotion") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = t("header.promotionClaim");
        } else if (route.path === "/affiliate") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = t("header.affiliate");
        } else if (route.path === "/insert-bankinfo") {
          hasPage.value = true;
          pageName.value = t("header.bankInformation");
        } else if (route.path === "/account/records/deposit") {
          prevPage.value = "account/records";
          hasPage.value = true;
          pageName.value = t("header.depositRecord");
        } else if (route.path === "/account/records/withdraw") {
          prevPage.value = "account/records";
          hasPage.value = true;
          pageName.value = t("header.withdrawalRecord");
        } else if (route.path === "/account/records/transfer") {
          prevPage.value = "account/records";
          hasPage.value = true;
          pageName.value = t("header.transferRecord");
        } else if (route.path === "/account/records/moneyChange") {
          prevPage.value = "account/records";
          hasPage.value = true;
          pageName.value = "账变记录";
        } else if (route.path === "/account/records/promo") {
          prevPage.value = "account/records";
          hasPage.value = true;
          pageName.value = t("header.promotionRecord");
        } else if (route.path === "/account/records/bet") {
          prevPage.value = "account/records";
          hasPage.value = true;
          pageName.value = t("header.betRecord");
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
          pageName.value = t("header.betRecord");
        } else if (route.path === "/account/records/recommend") {
          prevPage.value = "account/records";
          hasPage.value = true;
          pageName.value = t("header.referralRecord");
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
          pageName.value = t("header.deposit");
          if (route.query.from) {
            prevPage.value = route.query.from;
          }
        } else if (route.path === "/withdraw") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = t("header.withdraw");
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
      languageVal,
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

.page-title {
  background-color: #242624;

  &.absolute {
    position: absolute;
    background-color: unset;
  }

  a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    background-color: #2e3732;
    border-radius: 6px;
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
      font-weight: 700;
    }

    svg {
      width: 250px;
    }
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
