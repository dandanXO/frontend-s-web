<template>
  <q-layout view="hHh Lpr fFf">
    <q-header v-if="hasPage">
      <q-card-section
          v-if="!hasPage"
          class="top-section justify-between items-center"
          horizontal
      >
        <div class="logo">
          <router-link to="/"><img src="../assets/home/logo.png"/></router-link>
        </div>
        <q-card-actions v-if="!store.hasToken()">
          <q-btn glossy color="brand" to="/login">Login</q-btn>
          <q-btn outline color="brand" to="/register">Register</q-btn>
        </q-card-actions>
        <!-- <q-card-actions v-if="store.hasToken()">
          <q-btn glossy color="brand" @click="logout">Logout</q-btn>
        </q-card-actions> -->
        <q-btn
            v-if="store.hasToken()"
            class="flex"
            to="/finance/deposit"
            no-caps
            flat
        >
          <span style="font-size: 10px; margin-left: 5px; display: block"
          >Deposit</span
          >
        </q-btn>
      </q-card-section>
      <q-card-section class="page-title" v-if="hasPage">
        <router-link :to="prevPage ? '/' + prevPage : '/'">
          <RiArrowDropLeftLine/>
        </router-link>
        {{ pageName }}
        <q-btn v-if="hasDrawer" style="position:absolute; right: 10px;" flat @click="ui.drawerRight = !ui.drawerRight"
               round dense icon="menu"/>
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

    <q-drawer
        side="right"
        elevated
        v-model="ui.drawerRight"
        :width="200"
        :breakpoint="500"
        v-if="hasDrawer"
    >
      <div class="q-pa-md bg-brightbtn">
        老虎机大厅
      </div>
      <div class="platforms">
        <div class="text-red q-px-sm q-pt-md">
          游戏平台
        </div>
      </div>
      <q-scroll-area class="fit">
        <div class="q-pa-sm platform-list">
          <q-btn @click="changePlatform(plat)" size="xs" color="brightbtn" v-for="(plat, n) in platformsList" :key="n"
                 :label="plat.icon"/>
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
      <router-view/>
    </q-page-container>
    <q-footer
        v-if="ui.footer"
        elevated>
      <q-tabs
          v-model="tab"
          no-caps
          class="bg-primary text-white shadow-2"
          :breakpoint="0"
          align="justify"
      >
        <q-route-tab to="/" name="home" exact>
          <img class="inactive" src="../assets/images/index/menu/home-icon.png">
          <img class="hover" src="../assets/images/index/menu/home-icon-hover.png">
          首页
        </q-route-tab>
        <q-route-tab to="/promo" name="promo">
          <img class="inactive" src="../assets/images/index/menu/promo-icon.png">
          <img class="hover" src="../assets/images/index/menu/promo-icon-hover.png">
          优惠
        </q-route-tab>
        <q-route-tab to="/liveChat" name="live">
          <img class="inactive" src="../assets/images/index/menu/livechat-icon.png">
          <img class="hover" src="../assets/images/index/menu/livechat-icon-hover.png">
          客服
        </q-route-tab>
        <q-route-tab to="/affiliate" name="affiliate">
          <img class="inactive" src="../assets/images/index/menu/affiliate-icon.png">
          <img class="hover" src="../assets/images/index/menu/affiliate-icon-hover.png">
          加盟
        </q-route-tab>
        <q-route-tab to="/account" name="account">
          <img class="inactive" src="../assets/images/index/menu/account-icon.png">
          <img class="hover" src="../assets/images/index/menu/account-icon-hover.png">
          我的
        </q-route-tab>
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script>
import {defineComponent, onMounted, ref, watch} from "vue";
import {userStore} from "stores/index";
import {useUI} from "stores/ui";
import {useRoute, useRouter} from "vue-router";
// import EssentialLink from "components/EssentialLink.vue";

import {
  RiArrowDropLeftLine
} from "vue-remix-icons";

export default defineComponent({
  name: "MainLayout",

  components: {
    RiArrowDropLeftLine
  },

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
        router.push('/')
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
      ui.drawerRight = true
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
            pageName.value = `${route.query.platform}游戏大厅`;
          }
        } else if (route.path === "/forgot-account") {
          prevPage.value = "login";
          hasPage.value = true;
          pageName.value = "找回账号";
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
        } else if (route.path === "/finance/deposit") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = "存款";
        } else if (route.path === "/promo") {
          hasPage.value = true;
          pageName.value = "优惠活动";
          prevPage.value = "";
          if (route.query.name) {
            if (route.query.fromAccount) {
              prevPage.value = "account/promotion";
            } else {
              prevPage.value = "promo";
            }
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
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = "手机号码";
        } else if (route.path === "/account/verifyEmail") {
          prevPage.value = "account";
          hasPage.value = true;
          pageName.value = "邮箱";
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
    const platformsList = ref([
      {
        id: '20',
        code: 'PT',
        icon: 'pt',
      },
      {
        id: '37',
        code: 'SW',
        icon: 'sw',
      },
      {
        id: '46',
        code: 'PP',
        icon: 'pp',
      },
      {
        id: '38',
        code: 'PG',
        icon: 'pg',
      },
      {
        id: '54',
        code: 'MG_PLUS',
        icon: 'mg',
      },
      {
        id: '42',
        code: 'CQ',
        icon: 'cq',
      },
      {
        id: '28',
        code: 'SG',
        icon: 'sg',
      },
      {
        id: '27',
        code: 'TTG',
        icon: 'ttg',
      },
      {
        id: '39',
        code: 'PNG',
        icon: 'png',
      },
      {
        id: '45',
        code: 'AE',
        icon: 'ae',
      },
      {
        id: '52',
        code: 'BBIN',
        icon: 'bbin',
      },
      {
        id: '64',
        code: 'JDB',
        icon: 'jdb',
      },
    ]);

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
</style>
