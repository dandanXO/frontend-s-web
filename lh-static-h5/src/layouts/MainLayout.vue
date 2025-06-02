<template>
  <q-layout view="hHh Lpr fFf">
    <NewMemberGuide v-if="store.regSuccessGuideVisible" />
    <q-header v-if="hasPage" :class="hasShadow ? 'with-shadow' : ''">
      <q-card-section v-if="!hasPage" class="top-section justify-between items-center" horizontal>
        <div class="logo">
          <router-link to="/"><img src="../assets/logo-1.png" alt="logo" /></router-link>
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
        <router-link v-if="prevPage" :to="prevPage ? '/' + prevPage : '/'">
          <img
            class="back-icon"
            :src="
              $q.dark.isActive
                ? require('../assets/images/common/left-back-icon-dark.svg')
                : require('../assets/images/common/left-back-icon.svg')
            "
          />
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

    <q-page-container :class="isLowSafari ? 'is-low-safari' : ''">
      <router-view v-slot="{ Component }">
        <KeepAlive :max="8" :exclude="excludeAliveComponents">
          <component :is="Component" />
        </KeepAlive>
      </router-view>
    </q-page-container>
    <q-footer v-if="ui.footer" elevated>
      <q-tabs
        v-model="tab"
        no-caps
        class="footer-tabs text-primary"
        :breakpoint="0"
        :class="$q.dark.isActive ? '' : 'bg-white'"
        align="justify"
      >
        <q-route-tab to="/" name="home" exact>
          <div class="inactive footer-icon home" v-if="$q.dark.isActive" />
          <div class="inactive footer-icon home" v-else />
          <div class="hover footer-icon home" v-if="$q.dark.isActive" />
          <div class="hover footer-icon home" v-else />
          <span>首页</span>
        </q-route-tab>

        <q-route-tab v-if="$q.dark.isActive"  to="/livestream" name="livestream">
          <div class="inactive footer-icon livestream" />
          <div class="hover footer-icon livestream" />
          <span>直播</span>
        </q-route-tab>
        <q-route-tab v-else  to="/livestream" name="livestream">
          <div class="inactive footer-icon livestream-w" />
          <div class="hover footer-icon livestream-w" />
          <span>直播</span>
        </q-route-tab>
        <!-- <q-route-tab v-else to="/account/transfer" name="transfer">
          <img class="inactive" v-if="$q.dark.isActive" src="../assets/images/footer/withdraw-icon-dark.png" />
          <div class="inactive footer-icon wallet" v-else />
          <img class="hover" v-if="$q.dark.isActive" src="../assets/images/footer/withdraw-icon-active-dark.png" />
          <div class="hover footer-icon wallet" v-else />
          <span>账户</span>
        </q-route-tab> -->

        <q-route-tab to="/promo" name="promo">
          <template v-if="!$q.dark.isActive">
            <div class="inactive footer-icon promo" />
            <div class="hover footer-icon promo" />
          </template>
          <template v-else>
            <div
              class="inactive"
              style="
                padding: 0.8rem 1rem;
                border-radius: 100px;
                background: radial-gradient(#213057 0%, #213057 50%, #0f182e 50%, #0f182f 100%);
              "
            >
              <img style="width: 1.8rem" class="inactive" src="../assets/images/footer/promo-icon-dark.svg" />
            </div>
            <div
              v-if="tab === 'promo'"
              class="hover"
              style="
                padding: 0.8rem 1rem;
                border-radius: 100px;
                background: radial-gradient(#213057 0%, #213057 50%, #0f182e 50%, #0f182f 100%);
              "
            >
              <img style="width: 1.8rem" class="hover" src="../assets/images/footer/promo-icon-active-dark.svg" />
            </div>
          </template>

          <span class="footer-icon-promotion">优惠</span>
        </q-route-tab>

        <q-route-tab class="cs-web-id" :to="chatPage" id="cs-web-id" name="live">
          <div class="inactive footer-icon headphone" v-if="$q.dark.isActive" />
          <div class="inactive footer-icon headphone" v-else />
          <div class="hover footer-icon headphone" v-if="$q.dark.isActive" />
          <div class="hover footer-icon headphone" v-else />
          <span>客服</span>
        </q-route-tab>

        <q-route-tab to="/account" name="account">
          <div class="inactive footer-icon user" v-if="$q.dark.isActive" />
          <div class="inactive footer-icon user" v-else />
          <div class="hover footer-icon user" v-if="$q.dark.isActive" />
          <div class="hover footer-icon user" v-else />
          <span class="footer-icon-personal">我的</span>
        </q-route-tab>
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script>
import { computed, defineComponent, onMounted, ref, watch, defineAsyncComponent, onBeforeMount } from "vue";
import { userStore } from "src/stores";
import { useUserStore } from "src/cs-client-web/stores/user";
import { useUI } from "stores/ui";
import { useRoute, useRouter } from "vue-router";

import { translateRecord } from "src/directives/translate";
import { MAILBOX_TYPES } from "src/constant/mailbox";

const NewMemberGuide = defineAsyncComponent(() => import("components/home/NewMemberGuide.vue"));

export default defineComponent({
  name: "MainLayout",

  components: {
    // RiArrowDropLeftLine
    NewMemberGuide
  },

  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = userStore();
    const csUserStore = useUserStore();
    const prevPage = ref(null);
    const ui = useUI();
    const scrollPageRef = ref(null);

    const pageName = ref("");
    const hasPage = ref(false);
    const hasDrawer = ref(false);
    const hasShadow = ref(false);
    const leftDrawerOpen = ref(false);

    const isLowSafari = ref(false);

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
          pageName.value = "游戏大厅";
          if (route.query.platform) {
            var platformName =
              route.query.platform == "BBINDY" ? "BBIN" : translateRecord(route.query.platform, "slot");
            pageName.value = `${platformName}游戏大厅`;
          }

          if (route.query.platform == "PPFP") {
            pageName.value = "FP 电子";
          }
        } else if (route.path === "/fishing") {
          prevPage.value = "";
          hasPage.value = true;
          hasDrawer.value = true;
          pageName.value = "游戏大厅";
          if (route.query.platform) {
            var platformName = translateRecord(route.query.platform);
            pageName.value = `${platformName}游戏大厅`;
          }
        } else if (route.path === "/account/vip") {
          hasPage.value = true;
          pageName.value = "VIP";
          if (route.query.from) {
            prevPage.value = route.query.from;
          } else {
            prevPage.value = "";
          }
        } else if (route.path === "/forgot-account") {
          prevPage.value = "login";
          hasPage.value = true;
          pageName.value = "找回账号";
        } else if (route.path === "/forgot-password") {
          prevPage.value = "login";
          hasPage.value = true;
          pageName.value = "找回密码";
        } else if (route.path === "/live-casino") {
          hasPage.value = true;
          pageName.value = "Live Casino";
        } else if (route.path === "/poker") {
          hasPage.value = true;
          pageName.value = "Poker";
        } else if (route.path === "/e-sport") {
          hasPage.value = true;
          pageName.value = "电子竞技";
        } else if (route.path === "/sport") {
          hasPage.value = true;
          pageName.value = "体育";
        } else if (route.path === "/fish") {
          hasPage.value = true;
          pageName.value = "捕鱼达人";
        } else if (route.path === "/promo") {
          hasPage.value = true;
          pageName.value = "优惠";
          hasShadow.value = false;
          prevPage.value = false;

          if (route.query.name) {
            hasPage.value = true;
            prevPage.value = "promo";
          }
        } else if (route.path === "/finance/deposit") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = "存款";
          if (route.query.from === "vip") {
            prevPage.value = "account/vip";
          }
        } else if (route.path === "/finance/withdraw") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = "提款";
        } else if (route.path === "/account/transfer") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = "转账";
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
          pageName.value = "账户信息";
        } else if (route.path === "/account/verifyTelephone") {
          prevPage.value = "account/personal";
          hasPage.value = true;
          pageName.value = "手机号码";
        } else if (route.path === "/hotmatch") {
          prevPage.value = false;
          hasPage.value = true;
          pageName.value = "赛程";
        } else if (route.path === "/account/verifyEmail") {
          prevPage.value = "account/personal";
          hasPage.value = true;
          pageName.value = "邮箱";
        } else if (route.path === "/account/changePwd") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = "修改密码";
        } else if (route.path === "/account/download") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = "雷火下载";
        } else if (route.path === "/account/invite") {
          hasPage.value = true;
          pageName.value = "呼朋唤友";
          if (route.query.from) {
            prevPage.value = route.query.from;
          } else {
            prevPage.value = "account";
          }
        } else if (route.path === "/account/announcement") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = "系统公告";
        } else if (route.path === "/account/letters") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = "意见反馈";
        } else if (route.path === "/account/inbox") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = "消息中心";

          if (route.query.type && route.query.id) {
            const currentTab = MAILBOX_TYPES.find((type) => type.type === route.query.type);
            prevPage.value = "account/inbox";
            if (currentTab) pageName.value = `${currentTab.name}详情`;
          }
        } else if (route.path === "/account/outbox") {
          prevPage.value = "account/letters";
          hasPage.value = true;
          pageName.value = "我的反馈";
        } else if (route.path === "/account/write") {
          prevPage.value = "account/letters";
          hasPage.value = true;
          pageName.value = "意见反馈";
        } else if (route.path === "/account/feedback") {
          prevPage.value = "account/letters";
          hasPage.value = true;
          pageName.value = "有奖问答";
        } else if (route.path === "/account/withdraw") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = "银行信息";
        } else if (route.path === "/account/withdraw/bank-card") {
          prevPage.value = "account/withdraw";
          hasPage.value = true;
          pageName.value = "绑定银行卡";
        } else if (route.path === "/account/withdraw/crypto") {
          prevPage.value = "account/withdraw";
          hasPage.value = true;
          pageName.value = "绑定虚拟提款账户";
        } else if (route.path === "/account/withdraw/ewallet") {
          prevPage.value = "account/withdraw";
          hasPage.value = true;
          pageName.value = "绑定电子钱包";
        } else if (route.path === "/account/withdraw/alipay") {
          prevPage.value = "account/withdraw";
          hasPage.value = true;
          pageName.value = "绑定支付宝";
        } else if (route.path === "/account/promotion") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = "优惠领取区";
        } else if (route.path === "/account/assets") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = "财富中心";
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
          pageName.value = "优惠";
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
        } else if (route.path === "/register") {
          prevPage.value = "login";
          hasPage.value = true;
          pageName.value = "注册";
        } else if (route.path === "/app-tutorial") {
          prevPage.value = "account/invite";
          hasPage.value = true;
          pageName.value = "APP 安装教程";
        }

        if (route.query.redirect) {
          prevPage.value = route.query.redirect;
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

    const platformsFixed = ref([
      {
        id: 21,
        code: "PG",
        icon: "PG"
      },
      {
        id: 65,
        code: "SW",
        icon: "SW"
      },
      {
        id: 54,
        code: "PT",
        icon: "PT"
      },
      {
        id: 26,
        code: "AG",
        icon: "AG"
      }
    ]);

    const platformsList = computed(() => {
      if (ui.slotLists.length === 0) {
        return platformsFixed.value;
      }
      // console.log( ui.slotLists);
      return ui.slotLists;
    });

    function checkLocalStorage() {
      // console.log("Check Storage Status");
      let isLocalStorageEnabled = true;
      try {
        window.localStorage.setItem("lstest", "test");
        var testitem = window.localStorage.getItem("lstest");
        window.localStorage.removeItem("lstest");
        // console.log("Can Use");
        // alert(testitem);

        if (!testitem) {
          isLocalStorageEnabled = false;
        }
      } catch (e) {
        // console.log("CANNOT USE STORAGE");
        isLocalStorageEnabled = false;
      }

      // For Testing.
      // isLocalStorageEnabled= false;

      if (!isLocalStorageEnabled) {
        // LocalStorage is disabled
        // Handle the error or provide an alternative storage mechanism
        csUserStore.is_storage_enabled = false;
      }
    }

    onBeforeMount(() => {
      checkLocalStorage();
    });

    onMounted(() => {
      checkRoute();

      if (isSafari12OrLower()) {
        isLowSafari.value = true;
      } else {
        isLowSafari.value = false;
      }
    });

    function isSafari12OrLower() {
      var safariVersion = getSafariVersion();
      return safariVersion > 0 && safariVersion <= 12;
    }

    function getSafariVersion() {
      var ua = navigator.userAgent.toLowerCase();
      if (ua.indexOf("safari") !== -1) {
        if (ua.indexOf("version") !== -1) {
          return parseInt(ua.split("version/")[1].split(" ")[0]);
        } else {
          return parseInt(ua.split("safari/")[1].split(" ")[0]);
        }
      }
      return -1; // 非 Safari 浏览器
    }

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
      isLowSafari,
      chatPage
    };
  }
});
</script>

<style scoped lang="scss">
:deep(body.desktop .q-hoverable:hover > .q-focus-helper) {
  opacity: 0;
}

:deep(.q-ripple) {
  display: none;
}

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

.footer-icon {
  width: 30px;
  height: 28px;

  &.home {
    background: url("../assets/images/footer/footer-icons.svg") no-repeat center center;
    background-size: auto;
    background-position: 0.5% 2px;

    &.inactive {
      background-position: 0.5% 100%;
    }
  }
  &.flag-w {
    width: 20px;
    background: url("../assets/images/footer/flag-white-active.svg") no-repeat center center;
    background-size: 100% 100%;

      &.inactive {
        background: url("../assets/images/footer/flag-white.svg") no-repeat center center;
        background-size: 100% 100%;
      }
    }

  &.livestream-w  {
      width: 28px;
      background: url("../assets/images/footer/livestream-white-active.svg") no-repeat center center;
      background-size: 100% 100%;

      &.inactive {
        background: url("../assets/images/footer/livestream-white.svg") no-repeat center center;
        background-size: 100% 100%;
      }
    }

  &.wallet {
    background: url("../assets/images/footer/footer-icons.svg") no-repeat center center;
    background-size: auto;
    background-position: 98.5% 2px;

    &.inactive {
      background-position: 98.5% 100%;
    }
  }

  &.promo {
    background: url("../assets/images/footer/footer-icons.svg") no-repeat center center;
    background-size: auto;
    background-position: 41% 2px;

    &.inactive {
      background-position: 41% 100%;
    }
  }

  &.headphone {
    width: 28px;
    height: 28px;
    background: url("../assets/images/footer/footer-icons.svg") no-repeat center center;
    background-size: auto;
    background-position: 60% 2px;

    &.inactive {
      background-position: 60% 100%;
    }
  }

  &.user {
    width: 28px;
    background: url("../assets/images/footer/footer-icons.svg") no-repeat center center;
    background-size: auto;
    background-position: 78% 2px;

    &.inactive {
      background-position: 78% 100%;
    }
  }
}

.body--dark {
  .footer-icon {
    width: 30px;
    height: 29px;

    &.home {
      background: url("../assets/images/footer/footer-icons-dark.svg") no-repeat center center;
      background-size: auto;
      background-position: 0% 0%;

      &.inactive {
        height: 28px;
        background-position: 0% 93%;
      }
    }

    &.flag {
      width: 20px;
      background: url("../assets/images/footer/footer-icons-dark.svg") no-repeat center center;
      background-size: auto;
      background-position: 25.5% 0px;

      &.inactive {
        background-position: 25.5% 95%;
      }
    }

    &.livestream {
      width: 28px;
      background: url("../assets/images/footer/livestream-dark-active.svg") no-repeat center center;
      background-size: 100% 100%;

      &.inactive {
        background: url("../assets/images/footer/livestream-dark.svg") no-repeat center center;
        background-size: 100% 100%;
      }
    }

    &.promo {
      background: url("../assets/images/footer/footer-icons-dark.svg") no-repeat center center;
      background-size: auto;
      background-position: 47% 0;

      &.inactive {
        background-position: 47% 93%;
      }
    }

    &.headphone {
      width: 28px;
      height: 28px;
      background: url("../assets/images/footer/footer-icons-dark.svg") no-repeat center center;
      background-size: auto;
      background-position: 73% 0;

      &.inactive {
        background-position: 73% 99%;
      }
    }

    &.user {
      height: 30px;
      width: 28px;
      background: url("../assets/images/footer/footer-icons-dark.svg") no-repeat center center;
      background-size: auto;
      background-position: 100% 1px;

      &.inactive {
        background-position: 100% 100%;
      }
    }
  }
}
</style>
