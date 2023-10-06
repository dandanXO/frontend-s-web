<template>
  <q-layout view="hHh Lpr lFf">
    <q-header elevated>
      <q-card-section
          v-if="!store.hasToken()"
          class="top-section justify-between items-center"
          horizontal
      >
        <q-card-actions v-if="$q.screen.gt.md">
          <q-btn size="md" class="register-btn" to="/register">{{ $t("lang.register") }}</q-btn>
        </q-card-actions>
        <div class="logo">
          <router-link to="/"><img src="../assets/logo.png"/></router-link>
        </div>
        <q-card-actions>
          <q-btn size="md" class="login-btn" to="/login">{{ $t("lang.login") }}</q-btn>
          <q-btn v-if="!$q.screen.gt.md" size="md" class="register-btn" to="/register">{{ $t("lang.register") }}</q-btn>
        </q-card-actions>
      </q-card-section>
      <!--      v-if="hasPage"-->
      <q-card-section
          v-if="store.hasToken()"
          class="top-section flex justify-between items-center"
      >
        <q-btn flat @click="ui.leftDrawerOpen = !ui.leftDrawerOpen" round dense icon="menu"/>

        <div class="point-rebate-div">
          <img src="../assets/images/menu/coin-icon.png"/>

          <span id="point-span">{{ store.balance }}</span>

          <img class="btn-pointer" @click="store.getBalance()" src="../assets/images/menu/refresh-icon.png"/>
        </div>

        <div v-if="$q.screen.gt.md" class="logo">
          <router-link to="/"><img src="../assets/logo.png"/></router-link>
        </div>

        <q-btn
            v-if="store.hasToken()"
            class="flex header-vip-btn"
            to="/vip"
            no-caps
            flat
        >
          <img class="vip-btn btn-pointer" src="../assets/images/menu/vip-icon.png"/>
        </q-btn>
      </q-card-section>
    </q-header>

    <q-drawer
        v-model="ui.leftDrawerOpen"
        bordered
        overlay
        :width="350"
        :breakpoint="1280"
        class="drawer-left"
    >
      <div v-if="store.hasToken()" class="drawer-container">
        <AccountPage/>
      </div>
    </q-drawer>

    <q-page-container>
      <div class="page-header" v-if="hasPage">
        <div class="page-header-inner">
          <div class="page">
            <img v-if="headerIcon" :src="headerIcon"/>
            <span>{{ pageName }}</span>
          </div>

          <div class="lang-select-board"
               v-if="hasLang"
          >
            <q-select
                class="lang-container"
                placeholder=""
                style="min-height: 30px;height:30px;"
                v-model="languageVal"
                :options="langOptions"
                option-label="label"
                option-value="value"
                emit-value
                map-options
            >
            </q-select>
          </div>


          <div class="header-back">
            <div class="close-back-btn btn-pointer"
                 @click="closeWindowOrBack()">
              <RiCloseLine/>
            </div>
          </div>
        </div>

      </div>
      <div class="main-content">
        <router-view/>
      </div>
    </q-page-container>
    <q-footer
        v-if="ui.footer"
        elevated>
      <q-tabs
          v-model="tab"
          no-caps
          class=""
          :breakpoint="0"
          align="justify"
      >
        <q-route-tab to="/" name="home" exact
        >
          <img class="footer-icon"
               :src="(tab === 'home') ? footers['home']['active']  : footers['home']['icon'] "/>
          <span>{{ $t('lang.home_page') }}</span>
        </q-route-tab>
        <q-route-tab to="/finance/deposit" name="deposit">
          <img class="footer-icon"
               :src="(tab === 'deposit') ? footers['deposit']['active']  :   footers['deposit']['icon'] "/>
          <span>{{ $t('lang.deposit_footer') }}</span>
        </q-route-tab>

        <q-route-tab to="/finance/withdraw" name="withdraw">
          <img class="footer-icon"
               :src="(tab === 'withdraw') ? footers['withdraw']['active']  : footers['withdraw']['icon'] "/>
          <span>{{ $t('lang.withdraw_footer') }}</span>
        </q-route-tab>

        <!-- <q-route-tab to="/account/mail" name="notice">
          <img class="footer-icon"
               :src="(tab === 'notice') ? footers['notice']['active']  :  footers['notice']['icon'] "/>
          <span>{{ $t('lang.notice_footer') }}</span>
        </q-route-tab> -->
        <q-route-tab to="/affiliate" name="affiliate">
          <img class="footer-icon"
               :src="(tab === 'affiliate') ? footers['affiliate']['active']  :  footers['affiliate']['icon'] "/>
          <span>{{ $t('lang.affiliate_footer') }}</span>
        </q-route-tab>
        <q-route-tab to="/liveChat" id="cs-web-id" class="cs-web-id" name="cs">
          <img class="footer-icon"
               :class="(tab != 'cs' ? 'breathing-icon' : '')"
               :src="(tab === 'cs') ? footers['cs']['active']  :  footers['cs']['icon'] "/>
          <span>{{ $t('lang.cs_footer') }}</span>
        </q-route-tab>
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script>
import {defineComponent, onMounted, reactive, ref, watch} from "vue";
import {userStore} from "stores/index";
import {useUI} from "stores/ui";
import {useRoute, useRouter} from "vue-router";

import {
  RiCloseLine
} from "vue-remix-icons";
import AccountPage from "pages/AccountPage.vue";
import {storeToRefs} from "pinia";
import {i18nStore} from "src/router/language";
import {useI18n} from "vue-i18n";

export default defineComponent({
  name: "MainLayout",
  components: {
    AccountPage,
    // RiArrowDropLeftLine,
    RiCloseLine
  },

  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = userStore();
    const prevPage = ref(null);
    const ui = useUI();
    // console.log(ui.footer)
    const scrollPageRef = ref(null);

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

    const {t} = useI18n()
    const {languageVal} = storeToRefs(i18nStore());
    const {setLanguage} = i18nStore()
    watch(languageVal, (newVal) => {
      setLanguage(languageVal.value);

      checkRoute();
    })
    const langOptions = [
      {
        label: 'ไทย',
        value: 'th',
      },
      {
        label: 'English',
        value: 'en',
      }
    ]

    const checkRoute = () => {
      if (route) {
        prevPage.value = '';
        hasHeader.value = false;
        hasPage.value = false;
        hasLang.value = false;
        pageName.value = "";
        headerIcon.value = "";
        if (route.path === "/slot") {
          hasPage.value = true;
          pageName.value = t('lang.slot_header');
        } else if (route.path === "/live-casino") {
          hasPage.value = true;
          pageName.value = t('lang.live_header');
        } else if (route.path === "/poker") {
          hasPage.value = true;
          pageName.value = "Poker";
        } else if (route.path === "/e-sport") {
          hasPage.value = true;
          pageName.value = "Esports";
        } else if (route.path === "/sport") {
          hasPage.value = true;
          pageName.value = t('lang.sport_header');
        } else if (route.path === "/aviator") {
          hasPage.value = true;
          pageName.value = t('lang.fish_header');
        } else if (route.path === "/finance/deposit") {
          prevPage.value = '/';
          hasPage.value = true;
          pageName.value = t('lang.deposit_header');
          headerIcon.value = require("../assets/images/menu/header-topup-icon.png");
        } else if (route.path === "/finance/withdraw") {
          prevPage.value = '/';
          hasPage.value = true;
          pageName.value = t('lang.withdraw_header');
          headerIcon.value = require("../assets/images/menu/header-withdraw-icon.png");
        } else if (route.path === "/account/transit") {
          prevPage.value = 'account';
          hasPage.value = true;
          pageName.value = t('lang.transit_header');
        } else if (route.path === "/account") {
          prevPage.value = '/';
          hasPage.value = true;
          pageName.value = t('lang.account_header');
          headerIcon.value = require("../assets/images/menu/personal-header-icon.png");
          hasLang.value = true;
        } else if (route.path === "/display") {
          prevPage.value = 'finance/deposit';
          hasPage.value = true;
          pageName.value = t('lang.display_header');
          outOfApp.value = true;
        } else if (route.path === "/account/personal") {
          prevPage.value = '/';
          hasPage.value = true;
          pageName.value = t('lang.personal_header');
          headerIcon.value = require("../assets/images/menu/personal-header-icon.png");
          hasLang.value = true;
        } else if (route.path === "/account/withdraw") {
          prevPage.value = '/';
          hasPage.value = true;
          pageName.value = t('lang.withdraw_header2');
        } else if (route.path === "/account/mail") {
          prevPage.value = '/';
          hasPage.value = true;
          pageName.value = t('lang.mail_header');
        } else if (route.path === "/affiliate") {
          prevPage.value = '/';
          hasPage.value = true;
          pageName.value = t('lang.affiliate_header');
        } else if (route.path === "/vip") {
          prevPage.value = '/';
          hasPage.value = true;
          pageName.value = "VIP";
        } else if (route.path === "/promo" && !route.query.id) {
          prevPage.value = '/';
          hasPage.value = true;
          pageName.value = t('lang.promo_header');
        } else if (route.path === "/promo" && route.query.id) {
          prevPage.value = '/promo';
          hasPage.value = true;
          pageName.value = t('lang.promo_header');
        } else if (route.path === "/insert-bankinfo") {
          hasPage.value = true;
          pageName.value = t('lang.bankinfo_header');
        } else if (route.path === "/login") {
          prevPage.value = '/'
          hasPage.value = true;
          pageName.value = t('lang.login');
          hasLang.value = true;
        } else if (route.path === "/register") {
          prevPage.value = '/'
          hasPage.value = true;
          pageName.value = t('lang.register');
          hasLang.value = true;
        } else if (route.path === "/forgot-password") {
          prevPage.value = '/'
          hasPage.value = true;
          pageName.value = t('lang.forgot_password');
          hasLang.value = true;
        } else if (route.path === "/share") {
          prevPage.value = '/'
          hasPage.value = true;
          pageName.value = t('lang.share_page');
        } else if (route.path === "/getapp") {
          prevPage.value = '/'
          hasPage.value = true;
          pageName.value = "App";
        }
      }
    };
    const footers = reactive({
      "home": {
        "icon": require("../assets/images/menu/home-icon.png"),
        "active": require("../assets/images/menu/home-icon-active.png")
      },
      "deposit": {
        "icon": require("../assets/images/menu/deposit-icon.png"),
        "active": require("../assets/images/menu/deposit-icon-active.png")
      },
      "withdraw": {
        "icon": require("../assets/images/menu/withdraw-icon.png"),
        "active": require("../assets/images/menu/withdraw-icon-active.png")
      },
      "cs": {
        "icon": require("../assets/images/menu/cs-icon.png"),
        "active": require("../assets/images/menu/cs-icon-active.png")
      },
      "notice": {
        "icon": require("../assets/images/menu/notice-icon.png"),
        "active": require("../assets/images/menu/notice-icon-notice.png")
      },
      "affiliate": {
        "icon": require("../assets/images/menu/affiliate-icon.png"),
        "active": require("../assets/images/menu/affiliate-icon-active.png")
      }
    });

    const closeWindowOrBack = () => {
      if (prevPage.value) {
        router.replace(prevPage.value);
      } else {
        router.go(-1);
      }

      // if (((Platform.is.desktop || Platform.is.webkit) && !Platform.is.capacitor && Platform.is.name !== 'webkit' && !liff.isInClient())) {
      //   window.close();
      // } else {
      //   router.go(-1);
      // }
    }
    const pageName = ref("");
    const hasPage = ref(false);
    const hasLang = ref(false);
    const hasHeader = ref(false);
    const outOfApp = ref(false);
    const headerIcon = ref("");
    const toggleLeftDrawer = () => {
      ui.leftDrawerOpen = !ui.leftDrawerOpen;
    }

    onMounted(() => {
      checkRoute();
      store.getBalance();
    });
    return {
      tab: ref("home"),
      toggleLeftDrawer,
      logout,
      store,
      scrollPageRef,
      pageName,
      hasPage,
      ui,
      prevPage,
      closeWindowOrBack,
      outOfApp,
      footers,
      hasHeader,
      headerIcon,
      languageVal,
      langOptions,
      hasLang
    };
  }
});
</script>

<style lang="scss">
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

.footer-icon {
  width: 22px;
  filter: brightness(1.4);
  margin-bottom: 4px;
}

.logo {
  width: 130px;
  margin-left: 10px;

  img {
    width: 100%;
  }
}

.vip-btn {
  width: 24px;
}

.point-rebate-div {
  min-width: 130px;
  height: 30px;
  background: $third-color;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 15px;
  margin-left: 8px;
  margin-right: auto;

  span {
    color: $white;
    padding: 2px 5px;
  }

  img {
    height: 28px;
    width: 28px;
    padding: 1px;
  }
}

.login-btn {
  width: 5rem;
  height: 1rem;
  border: 1px solid #FFA9AB;
  background: $linear-bg-1;
  color: $white;
  border-radius: 25px;
  font-size: $normal-size;

  line-height: 1rem;
}

.register-btn {
  width: 5rem;
  height: 1rem;
  border: 1px solid $purple-color;
  background: $linear-bg-2;
  color: $white;
  border-radius: 25px;
  font-size: $normal-size;
  line-height: 1rem;
}

.drawer-container {
  padding: 10px 16px;
  width: calc(100%);
}


@media (min-width: 600px) {

  .login-btn {
    width: 120px;
  }
  .register-btn {
    width: 120px;
  }


}

@media (min-width: 769px) {


}

@media (min-width: 991px) {

  .main-section {
    background-repeat: repeat-x;
    background-size: contain;
  }

  .point-rebate-div {
    margin-right: 10px;
  }

  .logo {
    margin-left: auto;
    margin-right: auto;
  }
  .header-vip-btn {
    margin-left: 130px;
  }
}

@media (min-width: 1024px) {

}

</style>
