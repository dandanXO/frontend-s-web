<template>
  <q-layout view="hHh Lpr fFf">
    <NewMemberGuide v-if="store.regSuccessGuideVisible" />
    <q-header v-if="hasPage">
      <q-card-section v-if="!hasPage" class="top-section justify-between items-center" horizontal>
        <div class="logo">
          <router-link to="/"><img src="../assets/logo.png" /></router-link>
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
        <a @click="goToPrevPage(prevPage)">
          <RiArrowDropLeftLine />
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
      </q-card-section>
    </q-header>

    <q-drawer side="right" elevated v-model="ui.drawerRight" :width="250" :breakpoint="500" v-if="hasDrawer">
      <div class="text-center q-pa-md">游戏平台</div>
      <q-scroll-area class="fit">
        <div class="q-pa-md platform-list">
          <q-btn
            @click="changePlatform(plat)"
            size="md"
            :color="isPlatformActive(plat.code) ? 'brightbtn' : ''"
            v-for="(plat, n) in platformsList"
            :key="n"
            :label="plat.icon"
            rounded
          />
        </div>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
    <q-footer v-if="ui.footer" elevated>
      <div class="bottom-nav">
        <q-tabs v-model="tab" no-caps :breakpoint="0" align="justify">
          <q-route-tab to="/" name="home" exact :ripple="false">
            <div class="menu-icon inactive"><img src="../assets/images/index/menu/menu-home.png" /></div>
            <div class="menu-icon hover"><img src="../assets/images/index/menu/menu-home-hover.png" /></div>
            首页
          </q-route-tab>
          <q-route-tab to="/promo" name="promo" :ripple="false">
            <div class="menu-icon inactive"><img src="../assets/images/index/menu/menu-promo.png" /></div>
            <div class="menu-icon hover"><img src="../assets/images/index/menu/menu-promo-hover.png" /></div>
            优惠
          </q-route-tab>
          <q-route-tab to="/account" name="account" :ripple="false">
            <div class="menu-icon account"><img src="../assets/images/index/menu/menu-account-hover.png" /></div>
          </q-route-tab>
          <q-route-tab to="/affiliate" name="affiliate" :ripple="false">
            <div class="menu-icon inactive"><img src="../assets/images/index/menu/menu-affiliate.png" /></div>
            <div class="menu-icon hover"><img src="../assets/images/index/menu/menu-affiliate-hover.png" /></div>
            加盟
          </q-route-tab>
          <q-route-tab class="cs-web-id" to="/liveChat" id="cs-web-id" name="live" :ripple="false">
            <div class="menu-icon inactive"><img src="../assets/images/index/menu/menu-livechat.png" /></div>
            <div class="menu-icon hover"><img src="../assets/images/index/menu/menu-livechat-hover.png" /></div>
            客服
          </q-route-tab>
        </q-tabs>
      </div>
    </q-footer>
  </q-layout>
</template>

<script>
import { computed, defineComponent, onMounted, ref, watch, defineAsyncComponent, watchEffect } from "vue";
import { userStore } from "stores/index";
import { useUI } from "stores/ui";
import { useRoute, useRouter } from "vue-router";
// import EssentialLink from "components/EssentialLink.vue";

import { RiArrowDropLeftLine } from "vue-remix-icons";
import { translateRecord } from "src/directives/translate";

const NewMemberGuide = defineAsyncComponent(() => import("components/home/NewMemberGuide.vue"));

export default defineComponent({
  name: "MainLayout",

  components: {
    RiArrowDropLeftLine,
    NewMemberGuide
  },

  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = userStore();
    const prevPage = ref(null);
    const ui = useUI();
    const scrollPageRef = ref(null);

    const goToPrevPage = (prePage) => {
      if (prePage === "/") {
        router.push("/");
      } else if (window.location.pathname === "/promotion") {
        window.location.href = "xfapp:/promo";
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

    watchEffect(() => {
      document.body.style.overflow = store.regSuccessGuideVisible ? "hidden" : "auto";
    });

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

            if (route.query.platform == "PPFP") {
              pageName.value = "FP 电子";
            }
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
          hasPage.value = false;
          pageName.value = "优惠活动";
          prevPage.value = "";
          if (route.query.name) {
            if (route.query.fromAccount) {
              prevPage.value = "account/promotion";
            } else {
              hasPage.value = true;
              prevPage.value = "promo";
            }
          }
        } else if (route.path === "/promotion") {
          if (route.query.noheader) {
            hasPage.value = false;
          } else {
            hasPage.value = true;
          }
          pageName.value = "优惠详情";
          prevPage.value = "";
        } else if (route.path === "/finance/deposit") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = "存款";
          if (route.query.redirect) {
            prevPage.value = route.query.name;
          }
        } else if (route.path === "/finance/withdraw") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = "提款";
          if (route.query.redirect) {
            prevPage.value = route.query.name;
          }
        } else if (route.path === "/account/transfer") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = "转账";
          if (route.query.redirect) {
            prevPage.value = route.query.name;
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
          pageName.value = "账户信息";
        } else if (route.path === "/account/verifyTelephone") {
          prevPage.value = "account/personal";
          hasPage.value = true;
          pageName.value = "手机号码";
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
          pageName.value = "兴發下载";
        } else if (route.path === "/account/invite") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = "呼朋唤友";
        } else if (route.path === "/account/announcement") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = "系统公告";
        } else if (route.path === "/account/mail") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = "站内信";
        } else if (route.path === "/account/message") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = "消息中心";
          if (route.query.id) {
            prevPage.value = "account/message";
          }
        } else if (route.path === "/account/mail/inbox") {
          prevPage.value = "account/mail";
          hasPage.value = true;
          pageName.value = "我的反馈";
        } else if (route.path === "/account/mail/outbox") {
          prevPage.value = "account/mail";
          hasPage.value = true;
          pageName.value = "发件箱";
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
          prevPage.value = "";
          hasPage.value = false;
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
        }
      }
    };
    const pageName = ref("");
    const hasPage = ref(false);
    const hasDrawer = ref(false);

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
        id: "26",
        code: "AG",
        icon: "XIN"
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
      },
      {
        id: "162",
        code: "PPFP",
        icon: "PPFP"
      }
    ]);

    const platformsList = computed(() => {
      if (ui.slotLists.length === 0) {
        return platformsFixed.value;
      }
      return ui.slotLists;
    });

    const isPlatformActive = (platformCode) => {
      return route.query.platform === platformCode;
    };

    onMounted(() => {
      checkRoute();
    });
    return {
      tab: ref("home"),
      logout,
      store,
      scrollPageRef,
      pageName,
      hasPage,
      ui,
      prevPage,
      goToPrevPage,
      hasDrawer,
      platformsList,
      changePlatform,
      isPlatformActive
    };
  }
});
</script>

<style scoped lang="scss">
.q-drawer .platform-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 16px;

  .q-btn {
    width: 100%;
    box-shadow: 0px 0px 2.78px 0px #a9c9ea inset;
  }
}

.scrollArea {
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

.bottom-nav {
  font-size: 10px;
  position: relative;
  background-image: url("../assets/images/index/menu/menu-bg.png");
  background-size: auto 100%;
  background-position: center center;
  background-repeat: repeat-x;
  margin: 0 -6px;
  background-color: transparent;
  padding-top: 4px;

  :deep(.q-tabs__content) {
    padding-bottom: 4px;
  }
}
</style>
