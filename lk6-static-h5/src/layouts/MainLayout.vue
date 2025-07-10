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
    <!--
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label
          header
        >
          Essential Links
        </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer> -->

    <q-drawer side="right" elevated overlay v-model="ui.drawerRight" :width="250" :breakpoint="500" v-if="hasDrawer">
      <div class="q-pa-md bg-brightbtn">老虎机大厅</div>
      <div class="platforms">
        <div class="text-red q-px-sm q-pt-md">游戏平台</div>
      </div>
      <q-scroll-area class="fit">
        <div class="q-pa-sm platform-list">
          <q-btn
            @click="changePlatform(plat)"
            size="md"
            color="dyblue"
            v-for="(plat, n) in platformsList"
            :key="n"
            :label="plat.icon"
          />
        </div>
      </q-scroll-area>
    </q-drawer>
    <!-- <q-scroll-area
      ref="scrollPageRef"
      class="scrollArea"
    >
      <q-page-container>
        <router-view />
      </q-page-container>
    </q-scroll-area> -->

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
          首页
        </q-route-tab>
        <!--        <q-route-tab to="/sport" name="sport">-->
        <!--          <img-->
        <!--              class="inactive"-->
        <!--              src="../assets/images/index/menu/ft-sport.svg"-->
        <!--          />-->
        <!--          <img-->
        <!--              class="hover"-->
        <!--              src="../assets/images/index/menu/ft-sport-active.svg"-->
        <!--          />-->
        <!--          体育-->
        <!--        </q-route-tab>-->

        <!--        <q-route-tab to="/poker" name="poker">-->
        <!--          <img-->
        <!--              class="inactive"-->
        <!--              src="../assets/images/index/menu/ft-poker.png"-->
        <!--          />-->
        <!--          <img-->
        <!--              class="hover"-->
        <!--              src="../assets/images/index/menu/ft-poker-active.png"-->
        <!--          />-->
        <!--          棋牌-->
        <!--        </q-route-tab>-->
        <q-route-tab to="/promo" name="promo">
          <img class="inactive" src="../assets/images/index/menu/ft-promo.svg" />
          <img class="hover" src="../assets/images/index/menu/ft-promo-active.svg" />
          优惠
        </q-route-tab>

        <q-route-tab :to="chatPage" name="chat">
          <img class="inactive" src="../assets/images/index/menu/ft-livechat.svg" />
          <img class="hover filtericon" src="../assets/images/index/menu/ft-livechat.svg" />
          客服
        </q-route-tab>

        <q-route-tab to="/account" name="account">
          <img class="inactive" src="../assets/images/index/menu/ft-me.svg" />
          <img class="hover" src="../assets/images/index/menu/ft-me-active.svg" />
          我的
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

export default defineComponent({
  name: "MainLayout",

  setup() {
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
            pageName.value = `${platformName}游戏大厅`;
          }
        } else if (route.path === "/baccarat") {
          prevPage.value = "";
          hasPage.value = true;
          pageName.value = "百家乐";
        } else if (route.path === "/forgot-account") {
          prevPage.value = "login";
          hasPage.value = true;
          pageName.value = "忘记密码";
        } else if (route.path === "/live-casino") {
          hasPage.value = true;
          pageName.value = "Live Casino";
        } else if (route.path === "/e-sport") {
          hasPage.value = true;
          pageName.value = "电子竞技";
        } else if (route.path === "/sport") {
          hasPage.value = true;
          pageName.value = "体育";
          ui.hiddenFooter();
        } else if (route.path === "/poker") {
          hasPage.value = true;
          pageName.value = "棋牌";
          ui.hiddenFooter();
        } else if (route.path === "/fish") {
          hasPage.value = true;
          pageName.value = "捕鱼达人";
        } else if (route.path === "/finance/deposit") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = "存款";
          if (route.query.redirect) {
            var redirectPage = route.query.redirect;
            prevPage.value = redirectPage;
          }
        } else if (route.path === "/deposit") {
          hasPage.value = false;
          pageName.value = "存款";
          prevPage.value = "";
        } else if (route.path === "/promotion") {
          hasPage.value = false;
          pageName.value = "优惠";
          prevPage.value = "";
        } else if (route.path === "/promo") {
          hasPage.value = true;
          pageName.value = "优惠";
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
          pageName.value = "提款";
          if (route.query.redirect) {
            var redirectPage = route.query.redirect;
            prevPage.value = redirectPage;
          }
        } else if (route.path === "/account/transfer") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = "转账";
          if (route.query.redirect) {
            var redirectPage = route.query.redirect;
            prevPage.value = redirectPage;
          }
        } else if (route.path === "/account/records") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = "交易记录";
        } else if (route.path === "/account/transit") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = "Transit";
        } else if (route.path === "/account/personal") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = "帐户信息";
        } else if (route.path === "/account/verifyTelephone") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = "手机号码绑定";
        } else if (route.path === "/account/verifyEmail") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = "邮箱绑定";
        } else if (route.path === "/account/changePwd") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = "修改密码";
        } else if (route.path === "/account/download") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = "东赢下载";
        } else if (route.path === "/account/invite") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = "呼朋唤友";
        } else if (route.path === "/privilege/invite") {
          prevPage.value = "promo";
          hasPage.value = true;
          pageName.value = "邀请好友";
        } else if (route.path === "/privilege/hongbaoyu") {
          prevPage.value = "promo";
          hasPage.value = true;
          pageName.value = "红包雨";
        } else if (route.path === "/account/announcement") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = "系统公告";
        } else if (route.path === "/account/mail") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = "会员建议";
        } else if (route.path === "/account/inbox") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = "消息提醒 ";
          if (route.query.redirect) {
            var redirectPage = route.query.redirect;
            prevPage.value = redirectPage;
          }
        } else if (route.path === "/account/mail/outbox") {
          prevPage.value = "account/mail";
          hasPage.value = true;
          pageName.value = "我的反馈";
        } else if (route.path === "/account/mail/write") {
          prevPage.value = "account/mail";
          hasPage.value = true;
          pageName.value = "意见反馈";
        } else if (route.path === "/account/withdraw") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = "银行信息";
        } else if (route.path === "/account/promotion") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = "优惠领取区";
        } else if (route.path === "/affiliate") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = "加盟";
        } else if (route.path === "/insert-bankinfo") {
          hasPage.value = true;
          pageName.value = "Bank Information";
        } else if (route.path === "/account/records/deposit") {
          prevPage.value = "account/records";
          hasPage.value = true;
          pageName.value = "存款记录";
        } else if (route.path === "/account/records/withdraw") {
          prevPage.value = "account/records";
          hasPage.value = true;
          pageName.value = "提款记录";
        } else if (route.path === "/account/records/transfer") {
          prevPage.value = "account/records";
          hasPage.value = true;
          pageName.value = "转账记录";
        } else if (route.path === "/account/records/moneyChange") {
          prevPage.value = "account/records";
          hasPage.value = true;
          pageName.value = "账变记录";
        } else if (route.path === "/account/records/promo") {
          prevPage.value = "account/records";
          hasPage.value = true;
          pageName.value = "优惠记录";
        } else if (route.path === "/account/records/bet") {
          prevPage.value = "account/records";
          hasPage.value = true;
          pageName.value = "投注记录";
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
          pageName.value = "投注记录";
        } else if (route.path === "/account/records/recommend") {
          prevPage.value = "account/records";
          hasPage.value = true;
          pageName.value = "推荐好友记录";
        } else if (route.path === "/account/records/help") {
          prevPage.value = "account/records";
          hasPage.value = true;
          pageName.value = "救援金记录";
        } else if (route.path === "/account/records/bill") {
          prevPage.value = "account/records";
          hasPage.value = true;
          pageName.value = "催单记录";
        } else if (route.path === "/account/vip") {
          prevPage.value = "";
          hasPage.value = true;
          pageName.value = "VIP 优惠";
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
