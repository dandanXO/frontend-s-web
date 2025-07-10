<template>
  <q-layout view="hHh Lpr fFf">
    <q-header v-if="hasPage" class="page-wrapper">
      <q-card-section v-if="!hasPage" class="top-section justify-between items-center" horizontal>
        <div class="logo">
          <router-link to="/">
            <img src="../assets/index/logo.png" />
          </router-link>
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
        <router-link :to="prevPage ? '/' + prevPage : '/'">
          <img class="svg" src="~assets/images/index/arrow-left-line.svg" />
        </router-link>
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
      </q-card-section>
    </q-header>

    <q-page-container
      :class="{
        'with-bg': withBgPage
      }"
    >
      <router-view v-slot="{ Component }">
        <KeepAlive :max="8" :exclude="excludeAliveComponents">
          <component :is="Component" />
        </KeepAlive>
      </router-view>
    </q-page-container>
    <q-footer v-if="ui.footer" elevated>
      <q-tabs v-model="tab" no-caps class="bg-primary text-white" :breakpoint="0" align="justify">
        <q-route-tab to="/" name="home" exact>
          <img class="inactive" src="../assets/images/index/menu/ft-home.svg" />
          <img class="hover" src="../assets/images/index/menu/ft-home-active.svg" />
          {{ $t("layout.footer.home") }}
        </q-route-tab>

        <q-route-tab to="/promo" name="promo">
          <img class="inactive" src="../assets/images/index/menu/ft-promo.svg" />
          <img class="hover" src="../assets/images/index/menu/ft-promo-active.svg" />
          {{ $t("layout.footer.promo") }}
        </q-route-tab>

        <q-route-tab :to="chatPage" name="chat">
          <img class="inactive" src="../assets/images/index/menu/ft-livechat.svg" />
          <img class="hover filtericon" src="../assets/images/index/menu/ft-livechat.svg" />
          {{ $t("layout.footer.liveChat") }}
        </q-route-tab>

        <q-route-tab to="/account" name="account">
          <img class="inactive" src="../assets/images/index/menu/ft-me.svg" />
          <img class="hover" src="../assets/images/index/menu/ft-me-active.svg" />
          {{ $t("layout.footer.me") }}
        </q-route-tab>
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script>
import { defineComponent, onMounted, ref, watch, computed } from "vue";
import { userStore } from "stores/index";
import { Platform } from "quasar";
import { useUI } from "stores/ui";
import { useRoute, useRouter } from "vue-router";
import { translateRecord } from "src/directives/translate";
import { useI18n } from "vue-i18n";

export default defineComponent({
  name: "MainLayout",

  setup() {
    const { t } = useI18n();
    const route = useRoute();
    const router = useRouter();
    const store = userStore();
    const prevPage = ref(null);
    const ui = useUI();
    const scrollPageRef = ref(null);

    const isH5 = ref(false);
    const checkPlatform = () => {
      //Is iOS Webclip App || Is Android Apk
      if (
        (Platform.is.ios && "standalone" in window.navigator && window.navigator.standalone) ||
        (Platform.is.android && Platform.is.capacitor)
      ) {
        isH5.value = false;
      } else {
        isH5.value = true;
      }
    };

    const loadTrackingScript = () => {
      const currentDomain = window.location.hostname;
      // const currentPort = window.location.port;
      // const currentDomainWithPort = `${currentDomain}:${currentPort}`;

      // Determine the tracking script URL based on the current domain
      let trackingScriptUrl = "";

      if (isH5.value === true) {
        const script = document.createElement("script");
        script.src = trackingScriptUrl;
        script.type = "text/javascript";
        document.body.appendChild(script);
      }
    };

    // ui.$onAction(({ name, args }) => {
    //   switch (name) {
    //     case "setScrollPosition":
    //       scrollPageRef.value.setScrollPosition(args[0], args[1], args[2]);
    //   }
    // });
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
        hasDrawer.value = false;
        hasPage.value = false;
        pageName.value = "";
        if (route.path === "/slot") {
          prevPage.value = "";
          hasPage.value = true;
          hasDrawer.value = true;
          pageName.value = "Slot";
          if (route.query.platform) {
            var platformName =
              route.query.platform == "BBINDY" ? "BBIN" : translateRecord(route.query.platform, "SLOT");
            pageName.value = t("layout.header.lobby", { name: platformName });
          }
        } else if (route.path === "/baccarat") {
          prevPage.value = "";
          hasPage.value = true;
          pageName.value = t("layout.header.baccarat");
        } else if (route.path === "/forgot-account") {
          prevPage.value = "login";
          hasPage.value = true;
          pageName.value = t("layout.header.forgotPassword");
        } else if (route.path === "/live-casino") {
          hasPage.value = true;
          pageName.value = t("layout.header.live");
        } else if (route.path === "/e-sport") {
          hasPage.value = true;
          pageName.value = t("layout.header.esport");
        } else if (route.path === "/sport") {
          hasPage.value = true;
          pageName.value = t("layout.header.sport");
          ui.hiddenFooter();
        } else if (route.path === "/poker") {
          hasPage.value = true;
          pageName.value = t("layout.header.poker");
          ui.hiddenFooter();
        } else if (route.path === "/fish") {
          hasPage.value = true;
          pageName.value = t("layout.header.fish");
        } else if (route.path === "/finance/deposit") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = t("layout.header.deposit");
          if (route.query.redirect) {
            var redirectPage = route.query.redirect;
            prevPage.value = redirectPage;
          }
        } else if (route.path === "/deposit") {
          hasPage.value = false;
          pageName.value = t("layout.header.deposit");
          prevPage.value = "";
        } else if (route.path === "/promotion") {
          hasPage.value = false;
          pageName.value = t("layout.header.promo");
          prevPage.value = "";
        } else if (route.path === "/promo") {
          hasPage.value = true;
          pageName.value = t("layout.header.promo");
          prevPage.value = "";
          if (route.query.name) {
            if (route.query.fromAccount) {
              prevPage.value = "account/promotion";
            } else {
              prevPage.value = "promo";
            }
          } else if (route.query.redirect) {
            var redirectPage = route.query.redirect;
            prevPage.value = redirectPage;
          }
        } else if (route.path === "/finance/withdraw") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = t("layout.header.withdraw");
          if (route.query.redirect) {
            var redirectPage = route.query.redirect;
            prevPage.value = redirectPage;
          }
        } else if (route.path === "/account/transfer") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = t("layout.header.transfer");
          if (route.query.redirect) {
            var redirectPage = route.query.redirect;
            prevPage.value = redirectPage;
          }
        } else if (route.path === "/account/records") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = t("layout.header.records");
        } else if (route.path === "/account/transit") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = t("layout.header.transit");
        } else if (route.path === "/account/personal") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = t("layout.header.personal");
        } else if (route.path === "/account/verifyTelephone") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = t("layout.header.verifyTelephone");
        } else if (route.path === "/account/verifyEmail") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = t("layout.header.verifyEmail");
        } else if (route.path === "/account/changePwd") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = t("layout.header.changePassword");
        } else if (route.path === "/account/download") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = t("layout.header.download");
        } else if (route.path === "/account/invite") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = t("layout.header.invite");
        } else if (route.path === "/privilege/invite") {
          prevPage.value = "promo";
          hasPage.value = true;
          pageName.value = t("layout.header.invite2");
        } else if (route.path === "/privilege/hongbaoyu") {
          prevPage.value = "promo";
          hasPage.value = true;
          pageName.value = t("layout.header.hongbaoyu");
        } else if (route.path === "/account/announcement") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = t("layout.header.announcement");
        } else if (route.path === "/account/mail") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = t("layout.header.mail");
        } else if (route.path === "/account/inbox") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = t("layout.header.inbox");
          if (route.query.redirect) {
            var redirectPage = route.query.redirect;
            prevPage.value = redirectPage;
          }
        } else if (route.path === "/account/mail/outbox") {
          prevPage.value = "account/mail";
          hasPage.value = true;
          pageName.value = t("layout.header.outbox");
        } else if (route.path === "/account/mail/write") {
          prevPage.value = "account/mail";
          hasPage.value = true;
          pageName.value = t("layout.header.mailWrite");
        } else if (route.path === "/account/withdraw") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = t("layout.header.withdrawBank");
        } else if (route.path === "/account/promotion") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = t("layout.header.promotion");
        } else if (route.path === "/affiliate") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = t("layout.header.affiliate");
        } else if (route.path === "/insert-bankinfo") {
          hasPage.value = true;
          pageName.value = t("layout.header.bankInfo");
        } else if (route.path === "/account/records/deposit") {
          prevPage.value = "account/records";
          hasPage.value = true;
          pageName.value = t("layout.header.depositRecord");
        } else if (route.path === "/account/records/withdraw") {
          prevPage.value = "account/records";
          hasPage.value = true;
          pageName.value = t("layout.header.withdrawRecord");
        } else if (route.path === "/account/records/transfer") {
          prevPage.value = "account/records";
          hasPage.value = true;
          pageName.value = t("layout.header.transferRecord");
        } else if (route.path === "/account/records/moneyChange") {
          prevPage.value = "account/records";
          hasPage.value = true;
          pageName.value = t("layout.header.transferRecord");
        } else if (route.path === "/account/records/promo") {
          prevPage.value = "account/records";
          hasPage.value = true;
          pageName.value = t("layout.header.promoRecord");
        } else if (route.path === "/account/records/bet") {
          prevPage.value = "account/records";
          hasPage.value = true;
          pageName.value = t("layout.header.betRecord");
        } else if (route.path === "/account/records/financeFeedback") {
          prevPage.value = "account/records";
          hasPage.value = true;
          pageName.value = t("layout.header.remindRecord");
        } else if (route.path === "/account/records/change") {
          prevPage.value = "account/records";
          hasPage.value = true;
          pageName.value = t("layout.header.transferRecord");
        } else if (route.path === "/account/records/betRecord") {
          prevPage.value = "account/records";
          hasPage.value = true;
          pageName.value = t("layout.header.betRecord");
        } else if (route.path === "/account/records/recommend") {
          prevPage.value = "account/records";
          hasPage.value = true;
          pageName.value = t("layout.header.inviteRecord");
        } else if (route.path === "/account/records/help") {
          prevPage.value = "account/records";
          hasPage.value = true;
          pageName.value = t("layout.header.help");
        } else if (route.path === "/account/records/bill") {
          prevPage.value = "account/records";
          hasPage.value = true;
          pageName.value = t("layout.header.remindRecord");
        } else if (route.path === "/account/withdraw/crypto") {
          prevPage.value = "account/withdraw";
          hasPage.value = true;
          pageName.value = t("layout.header.bindCrypto");
        } else if (route.path === "/account/vip") {
          prevPage.value = "";
          hasPage.value = true;
          pageName.value = t("layout.header.vip");
          if (route.query.redirect) {
            var redirectPage = route.query.redirect;
            prevPage.value = redirectPage;
          }
        }
      }
    };

    const chatPage = computed(() => {
      if (store.chatGuid) {
        let url = `/liveChat/chat?uid=${store.chatGuid}`;
        if (store.token) {
          url += `&token=${store.token}`;
        }
        return url;
      }
      return "/liveChat";
    });

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
        id: "79",
        code: "PG",
        icon: "PG"
      },
      {
        id: "73",
        code: "MGP",
        icon: "MG"
      },
      {
        id: "26",
        code: "AG",
        icon: "ag"
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
        id: "78",
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
    const withBgPage = computed(() => !["/login", "/register", "/forgot-account", "/"].includes(route.path));
    // console.log(platformsList.value);
    onMounted(() => {
      checkPlatform();
      checkRoute();
      // loadTrackingScript();
    });
    return {
      tab: ref("home"),
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      logout,
      store,
      scrollPageRef,
      pageName,
      hasPage,
      ui,
      prevPage,
      hasDrawer,
      platformsList,
      changePlatform,
      checkPlatform,
      isH5,
      chatPage,
      excludeAliveComponents: [
        "DepositRecordView",
        "WithdrawRecordView",
        "TransferRecordView",
        "FeedbackRecordView",
        "PromoRecordView",
        "BetHistoryRecordView",
        "MoneyChangeRecordView",
        "WithdrawView",
        "ForgotPwdPage"
      ],
      withBgPage
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
  width: 130px;
  margin-left: 10px;

  img {
    width: 100%;
  }
}

.page-wrapper {
  background: transparent;
  padding-top: 0px;
  background-size: cover;
}

.page-title {
  color: #424f72;
  display: flex;
  padding: 8px;
  letter-spacing: 1px;
}
</style>
