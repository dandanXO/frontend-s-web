<template>
  <q-layout view="hHh Lpr fFf" :class="{ sanfrancisco: languageVal === 'vi', poppins: languageVal === 'en' }">
    <q-header v-if="hasPage" :class="hasShadow ? 'with-shadow' : ''">
      <q-card-section v-if="!hasPage" class="top-section justify-between items-center" horizontal>
        <div class="logo">
          <router-link to="/"><img src="../assets/logo-web.svg" alt="logo" /></router-link>
        </div>
        <q-card-actions v-if="!store.hasToken()">
          <q-btn glossy color="brand" to="/login">登录</q-btn>
          <q-btn outline color="brand" to="/register">注册</q-btn>
        </q-card-actions>

        <q-btn v-if="store.hasToken()" class="flex" to="/finance/deposit" no-caps flat>
          <span style="font-size: 10px; margin-left: 5px; display: block">充值</span>
        </q-btn>
      </q-card-section>
      <q-card-section class="page-title" v-if="hasPage">
        <a @click="goToPrevPage(prevPage)" class="back-btn-top">
          <img class="back-icon" src="../assets/images/common/left-back-icon.svg" alt="back to previous page" />
        </a>
        {{ pageName }}
        <q-btn
          v-if="hasDrawer"
          style="position: absolute; right: 10px"
          flat
          @click="ui.drawerRight = !ui.drawerRight"
          round
          dense
          icon="menu"
        />

        <div class="header-lang">
          <LangOptions />
        </div>
      </q-card-section>
    </q-header>

    <q-drawer side="right" bordered elevated v-model="ui.drawerRight" :width="250" :breakpoint="500" v-if="hasDrawer">
      <q-scroll-area class="fit">
        <div class="q-pa-sm platform-list">
          <q-btn
            @click="changePlatform(plat)"
            size="md"
            color="brightbtn"
            v-for="(plat, n) in platformsList"
            :key="n"
            :label="plat.title"
          />
        </div>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view v-slot="{ Component }">
        <KeepAlive :max="8" :exclude="excludeAliveComponents">
          <component :is="Component" />
        </KeepAlive>
      </router-view>
    </q-page-container>
    <q-footer v-if="ui.footer" elevated>
      <q-tabs v-model="tab" no-caps class="bg-white text-primary" :breakpoint="0" align="justify">
        <q-route-tab to="/" name="home" exact class="sm-screen-txt">
          <img class="inactive" src="../assets/images/footer/home-icon.svg" alt="home" />
          <img class="hover" src="../assets/images/footer/home-icon-active.svg" alt="home" />
          {{ $t("lang.home") }}
        </q-route-tab>
        <q-route-tab to="/promo" name="promo" class="sm-screen-txt">
          <img class="inactive" src="../assets/images/footer/promo-icon.svg" alt="promotion" />
          <img class="hover" src="../assets/images/footer/promo-icon-active.svg" alt="promotion" />
          {{ $t("lang.promo") }}
        </q-route-tab>
        <q-route-tab to="/finance/deposit" name="deposit" class="sm-screen-txt">
          <img class="inactive" src="../assets/images/footer/withdraw-icon.svg" alt="deposit and withdraw" />
          <img class="hover" src="../assets/images/footer/withdraw-icon-active.svg" alt="deposit and withdraw" />
          {{ $t("lang.deposit_btm") }}
        </q-route-tab>
        <q-route-tab to="/account/vip?redirect=home" id="cs-web-id" name="vip" class="cs-web-id sm-screen-txt">
          <img class="inactive" src="../assets/images/footer/vip-icon.svg" alt="customer service" />
          <img class="hover" src="../assets/images/footer/vip-icon-active.svg" alt="customer service" />
          {{ $t("lang.vip") }}
        </q-route-tab>
        <q-route-tab to="/account" name="account" class="sm-screen-txt has-badge">
          <img class="inactive" src="../assets/images/footer/account-icon.svg" alt="account" />
          <img class="hover" src="../assets/images/footer/account-icon-active.svg" alt="account" />
          {{ $t("lang.mine") }}
          <q-badge v-if="store.unreadInboxMail" color="red" class="unread-count" rounded>
            {{ store.unreadInboxMail }}
          </q-badge>
        </q-route-tab>
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script>
import { computed, defineComponent, onMounted, ref, watch } from "vue";
import { userStore } from "stores/index";
import { useUI } from "stores/ui";
import { useRoute, useRouter } from "vue-router";
import { translateRecord } from "src/directives/translate";
import { useI18n } from "vue-i18n";
import LangOptions from "components/LangOptions";

import { i18nStore } from "src/router/language";
import { storeToRefs } from "pinia";

export default defineComponent({
  name: "MainLayout",

  components: {
    LangOptions
  },

  setup() {
    const { t } = useI18n();
    const route = useRoute();
    const router = useRouter();
    const store = userStore();
    const prevPage = ref(null);
    const ui = useUI();
    const scrollPageRef = ref(null);

    const pageName = ref("");
    const hasPage = ref(false);
    const hasDrawer = ref(false);
    const hasShadow = ref(false);
    const leftDrawerOpen = ref(false);

    const i18nStoreLanguage = i18nStore();
    const { languageVal } = storeToRefs(i18nStoreLanguage);

    const goToPrevPage = (prePage) => {
      if (prePage === "/") {
        router.push("/");
      } else if (window.location.pathname === "/promoapp") {
        window.location.href = "vnmapp:/promo";
      } else {
        router.push("/" + prePage);
      }
    };

    const logout = () => {
      store.memberLogout().then(() => {
        // location.reload();
        router.push("/");
      });
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
        hasShadow.value = true;
        hasDrawer.value = false;
        hasPage.value = false;
        pageName.value = "";
        if (route.path === "/slot") {
          prevPage.value = "";
          hasPage.value = true;
          hasDrawer.value = true;
          pageName.value = t("lang.page_game");
          if (route.query.platform) {
            var platformName =
              route.query.platform == "BBINDY" ? "BBIN" : translateRecord(route.query.platform, "slot");
            pageName.value = `${platformName} ${t("lang.page_lobby")}`;
          }
        } else if (route.path === "/fishing") {
          prevPage.value = "";
          hasPage.value = true;
          hasDrawer.value = true;
          pageName.value = t("lang.page_game");
          if (route.query.platform) {
            var platformName = translateRecord(route.query.platform);
            pageName.value = `${platformName} ${t("lang.page_lobby")}`;
          }
        } else if (route.path === "/minigame") {
          prevPage.value = "";
          hasPage.value = true;
          hasDrawer.value = true;
          pageName.value = t("lang.page_game");
          if (route.query.platform) {
            var platformName = translateRecord(route.query.platform + "minigame");
            pageName.value = `${platformName}`;
          }
        } else if (route.path === "/account/vip") {
          hasPage.value = true;
          pageName.value = t("lang.page_vip");
          if (route.query.from) {
            prevPage.value = route.query.from;
          } else {
            prevPage.value = "";
          }
        } else if (route.path === "/forgot-account") {
          prevPage.value = "login";
          hasPage.value = true;
          pageName.value = t("lang.page_retrieveaccount");
        } else if (route.path === "/forgot-password") {
          prevPage.value = "login";
          hasPage.value = true;
          pageName.value = t("lang.page_retrievepassword");
        } else if (route.path === "/live-casino") {
          hasPage.value = true;
          pageName.value = t("lang.page_livecasino");
        } else if (route.path === "/poker") {
          hasPage.value = true;
          pageName.value = t("lang.page_poker");
        } else if (route.path === "/e-sport") {
          hasPage.value = true;
          pageName.value = t("lang.page_esports");
        } else if (route.path === "/sport") {
          hasPage.value = true;
          pageName.value = t("lang.page_sports");
        } else if (route.path === "/fish") {
          hasPage.value = true;
          pageName.value = t("lang.page_fishing");
        } else if (route.path === "/promo") {
          hasPage.value = true;
          pageName.value = t("lang.page_promotions");
          // hasShadow.value = false;

          if (route.query.name) {
            hasPage.value = true;
            prevPage.value = "promo";
          } else {
            prevPage.value = "/";
          }
        } else if (route.path === "/promoapp") {
          hasPage.value = true;
          pageName.value = t("lang.page_promotions");
          prevPage.value = "";
        } else if (route.path === "/finance/deposit") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = t("lang.page_deposit");
          if (route.query.from === "vip") {
            prevPage.value = "account/vip";
          }
        } else if (route.path === "/finance/withdraw") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = t("lang.page_withdrawal");
        } else if (route.path === "/account/transfer") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = t("lang.page_transfer");
        } else if (route.path === "/account/records") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = t("lang.page_transactionrecords");
        } else if (route.path === "/account/transit") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = t("lang.page_transit");
        } else if (route.path === "/account/personal") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = t("lang.page_accountinformation");
        } else if (route.path === "/account/verifyTelephone") {
          prevPage.value = "account/personal";
          hasPage.value = true;
          pageName.value = t("lang.page_phonenumber");
        } else if (route.path === "/account/verifyEmail") {
          prevPage.value = "account/personal";
          hasPage.value = true;
          pageName.value = t("lang.page_email");
        } else if (route.path === "/account/changePwd") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = t("lang.page_changepassword");
        } else if (route.path === "/account/download") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = t("lang.page_downloadapp");
        } else if (route.path === "/account/invite") {
          hasPage.value = true;
          pageName.value = t("lang.page_invitefriends");
          if (route.query.from) {
            prevPage.value = route.query.from;
          } else {
            prevPage.value = "account";
          }
        } else if (route.path === "/account/announcement") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = t("lang.page_systemannouncement");
        } else if (route.path === "/account/letters") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = t("lang.page_messagenotification");
        } else if (route.path === "/account/inbox") {
          prevPage.value = "account/letters";
          hasPage.value = true;
          pageName.value = t("lang.page_messagenotification");
        } else if (route.path === "/account/outbox") {
          prevPage.value = "account/letters";
          hasPage.value = true;
          pageName.value = t("lang.page_messagenotification");
        } else if (route.path === "/account/write") {
          prevPage.value = "account/letters";
          hasPage.value = true;
          pageName.value = t("lang.page_messagenotification");
        } else if (route.path === "/account/feedback") {
          prevPage.value = "account/letters";
          hasPage.value = true;
          pageName.value = t("lang.page_questionnaire");
        } else if (route.path === "/account/withdraw") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = t("lang.page_bankinformation");
        } else if (route.path === "/account/withdraw/bank-card") {
          prevPage.value = "account/withdraw";
          hasPage.value = true;
          pageName.value = t("lang.page_bindbankcard");
        } else if (route.path === "/account/withdraw/crypto") {
          prevPage.value = "account/withdraw";
          hasPage.value = true;
          pageName.value = t("lang.page_bindvirtualwithdrawalaccount");
        } else if (route.path === "/account/withdraw/ewallet") {
          prevPage.value = "account/withdraw";
          hasPage.value = true;
          pageName.value = t("lang.page_bindewallet");
        } else if (route.path === "/account/withdraw/alipay") {
          prevPage.value = "account/withdraw";
          hasPage.value = true;
          pageName.value = t("lang.page_bindalipay");
        } else if (route.path === "/account/promotion") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = t("lang.page_promotionarea");
        } else if (route.path === "/account/assets") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = t("lang.page_wealthcenter");
        } else if (route.path === "/affiliate") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = t("lang.page_joinus");
        } else if (route.path === "/insert-bankinfo") {
          hasPage.value = true;
          pageName.value = t("lang.page_bankinformation");
        } else if (route.path === "/account/records/deposit") {
          prevPage.value = "account/records";
          hasPage.value = true;
          pageName.value = t("lang.page_depositrecords");
        } else if (route.path === "/account/records/withdraw") {
          prevPage.value = "account/records";
          hasPage.value = true;
          pageName.value = t("lang.page_withdrawalrecords");
        } else if (route.path === "/account/records/transfer") {
          prevPage.value = "account/records";
          hasPage.value = true;
          pageName.value = t("lang.page_transferrecords");
        } else if (route.path === "/account/records/moneyChange") {
          prevPage.value = "account/records";
          hasPage.value = true;
          pageName.value = t("lang.page_accountchangerecords");
        } else if (route.path === "/account/records/promo") {
          prevPage.value = "account/records";
          hasPage.value = true;
          pageName.value = t("lang.page_promotions");
        } else if (route.path === "/account/records/bet") {
          prevPage.value = "account/records";
          hasPage.value = true;
          pageName.value = t("lang.page_betrecords");
        } else if (route.path === "/account/records/financeFeedback") {
          prevPage.value = "account/records";
          hasPage.value = true;
          pageName.value = t("lang.page_reminderrecords");
        } else if (route.path === "/account/records/change") {
          prevPage.value = "account/records";
          hasPage.value = true;
          pageName.value = t("lang.page_accountchangerecords");
        } else if (route.path === "/account/records/betRecord") {
          prevPage.value = "account/records";
          hasPage.value = true;
          pageName.value = t("lang.page_betrecords");
        } else if (route.path === "/account/records/recommend") {
          prevPage.value = "account/records";
          hasPage.value = true;
          pageName.value = t("lang.page_referfriendsrecords");
        } else if (route.path === "/account/records/help") {
          prevPage.value = "account/records";
          hasPage.value = true;
          pageName.value = t("lang.page_rescuefundrecords");
        } else if (route.path === "/account/records/bill") {
          prevPage.value = "account/records";
          hasPage.value = true;
          pageName.value = t("lang.page_reminderrecords");
        } else if (route.path === "/register") {
          prevPage.value = "/";
          hasPage.value = true;
          pageName.value = t("lang.page_register");
        } else if (route.path === "/about") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = t("lang.page_about");
        }

        if (route.query.redirect) {
          prevPage.value = route.query.redirect;
        }
      }
    };

    const platformsFixed = ref([
      // {
      //   id: 21,
      //   code: "PG",
      //   icon: "PG"
      // },
      // {
      //   id: 65,
      //   code: "SW",
      //   icon: "SW"
      // },
      // {
      //   id: 54,
      //   code: "PT",
      //   icon: "PT"
      // },
      // {
      //   id: 26,
      //   code: "AG",
      //   icon: "AG"
      // }
    ]);

    const platformsList = computed(() => {
      if (ui.slotLists.length === 0) {
        return platformsFixed.value;
      }
      // console.log( ui.slotLists);
      return ui.slotLists;
    });

    const isH5 = ref(false);
    const checkPlatform = () => {
      isH5.value = store.getDeviceType() === "H5";
    };

    const loadTrackingScript = () => {
      const currentDomain = window.location.hostname;

      // Determine the tracking script URL based on the current domain
      // let trackingScriptUrl = "https://s4.cnzz.com/z.js?id=1281348355";
      let trackingScriptUrl = "";
      switch (currentDomain) {
        case "m.t366888.com":
        case "www.t366888.com":
        case "t366888.com":
          trackingScriptUrl = "https://s9.cnzz.com/z.js?id=1281390066";
        break;
        case "m.t136388.com":
        case "www.t136388.com":
        case "t136388.com":
          trackingScriptUrl = "https://s4.cnzz.com/z.js?id=1281389648";
          break;
        case "m.tslotf88.com":
        case "www.tslotf88.com":
        case "tslotf88.com":
          trackingScriptUrl = "https://v1.cnzz.com/z.js?id=1281386211";
          break;
        default:
          trackingScriptUrl = "https://s4.cnzz.com/z.js?id=1281348355";
          break;
      }

      if (isH5.value === true) {
        const script = document.createElement("script");
        script.src = trackingScriptUrl;
        script.type = "text/javascript";
        document.body.appendChild(script);
      }
    };

    onMounted(() => {
      checkRoute();
      checkPlatform();
      loadTrackingScript();
    });
    return {
      languageVal,
      tab: ref("home"),
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      logout,
      store,
      goToPrevPage,
      scrollPageRef,
      pageName,
      hasPage,
      hasShadow,
      ui,
      prevPage,
      hasDrawer,
      platformsList,
      changePlatform,
      excludeAliveComponents: [
        "DepositRecordView",
        "WithdrawRecordView",
        "TransferRecordView",
        "FeedbackRecordView",
        "PromoRecordView",
        "BetHistoryRecordView",
        "MoneyChangeRecordView",
        "WithdrawView",
        "DepositView",
        "OutboxView",
        "BindBankCard",
        "BindCryptoView",
        "BindEWalletView"
      ],
      LangOptions,
      isH5,
      checkPlatform,
      loadTrackingScript
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

.header-lang {
  position: absolute;
  top: 4px;
  right: 12px;
}

.has-badge {
  position: relative;
  .unread-count {
    position: absolute;
    right: -0.5rem;
    top: 0;
  }
}
</style>
