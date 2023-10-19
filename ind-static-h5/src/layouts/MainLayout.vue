<template>
  <q-layout view="hHh Lpr fFf">
    <q-header v-if="hasPage">
      <q-card-section v-if="!hasPage" class="top-section justify-between items-center" horizontal>
        <div class="logo">
          <router-link to="/"><img src="../assets/logo.png" /></router-link>
        </div>
        <q-card-actions v-if="!store.hasToken()">
          <q-btn glossy color="brand" to="/login">登录</q-btn>
          <q-btn outline color="brand" to="/register">注册</q-btn>
        </q-card-actions>
        <!-- <q-card-actions v-if="store.hasToken()">
          <q-btn glossy color="brand" @click="logout">Logout</q-btn>
        </q-card-actions> -->
        <q-btn v-if="store.hasToken()" class="flex" to="/finance/deposit" no-caps flat>
          <span style="font-size: 10px; margin-left: 5px; display: block">充值</span>
        </q-btn>
      </q-card-section>
      <q-card-section class="page-title" v-if="hasPage">
        <router-link :to="prevPage ? '/' + prevPage : '/'">
          <img class="back-btn" src="../assets/images/index/back-btn.png" />
        </router-link>
        <div class="page-title-wrapper">
          <img src="../assets/images/index/hot-elephant-left.png" alt="" />
          <div class="title-container">
            <span class="title">{{ pageName }}</span>
          </div>
          <img src="../assets/images/index/hot-elephant-right.png" alt="" />
        </div>
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
    <!-- <q-scroll-area
      ref="scrollPageRef"
      class="scrollArea"
    >
      <q-page-container>
        <router-view />
      </q-page-container>
    </q-scroll-area> -->

    <q-page-container>
      <router-view />
    </q-page-container>
    <q-footer v-if="ui.footer" elevated>
      <q-tabs v-model="tab" no-caps class="bg-primary" :breakpoint="0" align="justify">
        <q-route-tab to="/" name="home" exact>
          <img class="inactive" src="../assets/images/index/menu/home-icon.png" />
          <img class="hover" src="../assets/images/index/menu/home-icon-hover.png" />
          HOME
        </q-route-tab>
        <q-route-tab to="/earn-money" name="earn-money">
          <img class="inactive" src="../assets/images/index/menu/earn-icon.png" />
          <img class="hover" src="../assets/images/index/menu/earn-icon-hover.png" />
          EARN MONEY
        </q-route-tab>
        <q-route-tab class="cs-web-id" to="/bonus" id="cs-web-id" name="live">
          <img class="inactive" src="../assets/images/index/menu/bonus-icon.png" />
          <img class="hover" src="../assets/images/index/menu/bonus-icon-hover.png" />
          BONUS
        </q-route-tab>
        <!--        <q-route-tab to="/affiliate" name="affiliate">-->
        <!--          <img class="inactive" src="../assets/images/index/menu/affiliate-icon.png">-->
        <!--          <img class="hover" src="../assets/images/index/menu/affiliate-icon-hover.png">-->
        <!--          加盟-->
        <!--        </q-route-tab>-->
        <q-route-tab to="/account" name="account">
          <img class="inactive" src="../assets/images/index/menu/account-icon.png" />
          <img class="hover" src="../assets/images/index/menu/account-icon-hover.png" />
          MINE
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
            var platformName = route.query.platform == "BBINDY" ? "BBIN" : translateRecord(route.query.platform);
            pageName.value = `${platformName}游戏大厅`;
          }
        } else if (route.path === "/earn-money") {
          prevPage.value = "/";
          hasPage.value = true;
          pageName.value = "Earn Money";
        } else if (route.path === "/bonus") {
          prevPage.value = "/";
          hasPage.value = true;
          pageName.value = "Daily Activity";
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
        } else if (route.path === "/account/mail/inbox") {
          prevPage.value = "account/mail";
          hasPage.value = true;
          pageName.value = "收件箱";
        } else if (route.path === "/account/mail/outbox") {
          prevPage.value = "account/mail";
          hasPage.value = true;
          pageName.value = "发件箱";
        } else if (route.path === "/account/mail/write") {
          prevPage.value = "account/mail";
          hasPage.value = true;
          pageName.value = "写信";
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

    onMounted(() => {
      checkRoute();
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
      changePlatform
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

// .fixed-top {
//   position: relative;
//   top: unset;
//   left: unset;
//   right: unset;
// }

.back-btn {
  width: 2.25rem;
  margin: 0.5rem 0 0 0;
}

.page-title-wrapper {
  display: flex;
  justify-content: center;
  margin: 0 5rem 0 0;
  padding: 1rem;

  img {
    width: 2.25rem;
  }

  .title-container {
    background-image: url(../assets/images/index/hot-games-title.png);
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center center;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 14rem;
    margin: 0 0.5rem;

    .title {
      background-color: #f3ec78;
      background-image: linear-gradient(180deg, #fff0a0 17.41%, #fff8d4 17.41%, #ffdc26 67.56%);
      background-size: 100%;
      -webkit-background-clip: text;
      -moz-background-clip: text;
      -webkit-text-fill-color: transparent;
      -moz-text-fill-color: transparent;
      line-height: 1.25;
      font-size: 1.25rem;
      font-weight: 800;
      -webkit-text-stroke-width: 1px;
      -webkit-text-stroke-color: #a94700;
    }
  }

  svg {
    width: 250px;
  }
}
</style>
