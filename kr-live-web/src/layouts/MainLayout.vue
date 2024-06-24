<template>
  <q-layout view="hHh Lpr lFf">
    <q-page-container>
      <div class="home-banner-wrapper">
        <img class="top-logo" alt="logo" src="../assets/images/index/kr-logo.png" />

        <LoginBar />
      </div>

      <div class="main">
        <div class="main-content">
          <router-view v-slot="{ Component }">
            <KeepAlive :max="8">
              <component :is="Component" />
            </KeepAlive>
          </router-view>
        </div>
      </div>
    </q-page-container>

    <footer>
      <div class="footer-box">
        <div class="box" v-for="(items, index) in footerBoxImgUrl" :key="index">
          <img :src="items.imgUrl" alt="" />
        </div>
      </div>

      <q-separator style="width:60%;background:#3F3F3F;" />

      <div class="copyright-text">ⓒ 2024 City 8 All right reserved</div>
    </footer>
  </q-layout>
</template>

<script>
import { computed, defineComponent, onMounted, onUnmounted, reactive, ref, watch } from "vue";
import { userStore } from "stores/index";
import { useUI } from "stores/ui";
import { useRoute, useRouter } from "vue-router";

import { storeToRefs } from "pinia";
import { i18nStore } from "src/router/language";
import { openLiveChat } from "src/boot/utils";
import LoginBar from "../components/LoginAndRegister/LoginBar";
import { useQuasar } from "quasar";

export default defineComponent({
  name: "MainLayout",
  components: {
    LoginBar
  },

  setup() {
    const footerBoxImgUrl = reactive([
      { imgUrl: require("assets/images/footer/logo-pp.png") },
      { imgUrl: require("assets/images/footer/logo-cq9.png") },
      { imgUrl: require("assets/images/footer/logo-habanero.png") },
      { imgUrl: require("assets/images/footer/logo-ag.png") },
      { imgUrl: require("../assets/images/footer/logo-bcongo.png") },
      { imgUrl: require("../assets/images/footer/logo-stargames.png") },
      { imgUrl: require("../assets/images/footer/logo-rtg-slots.png") },
      { imgUrl: require("../assets/images/footer/logo-dreamtech.png") },
      { imgUrl: require("../assets/images/footer/logo-playngo.png") },
      { imgUrl: require("assets/images/footer/logo-dg.png") },
      { imgUrl: require("assets/images/footer/logo-ps.png") },
      { imgUrl: require("../assets/images/footer/logo-gameart.png") },
      { imgUrl: require("../assets/images/footer/logo-evo.png") },
      { imgUrl: require("../assets/images/footer/logo-ae.png") },
      { imgUrl: require("../assets/images/footer/logo-tfgaming.png") },
      { imgUrl: require("../assets/images/footer/logo-evoplay.png") },
      { imgUrl: require("../assets/images/footer/logo-wm.png") },
      { imgUrl: require("../assets/images/footer/logo-nlc.png") },
      { imgUrl: require("../assets/images/footer/logo-pg.png") },
      { imgUrl: require("../assets/images/footer/logo-bti.png") },
      { imgUrl: require("../assets/images/footer/logo-spribe.png") }
    ]);

    const route = useRoute();
    const router = useRouter();
    const store = userStore();
    const prevPage = ref(null);
    const ui = useUI();
    const $q = useQuasar();
    // console.log(ui.footer)
    const scrollPageRef = ref(null);
    const checkBalanceInterval = ref();
    const checkUnreadMessagesInterval = ref();

    const logout = () => {
      store.memberLogout().then(() => {
        // location.reload();
        router.push("/");
      });
    };

    watch(() => $q.appVisible, val => {
      if (val) {
        store.isOffline = false;
      } else {
        store.isOffline = true;
      }
    })

    const { languageVal } = storeToRefs(i18nStore());

    const isHomePage = computed(() => {
      if (route.path === "/" || route.path === "/home") {
        return true;
      }
      return false;
    });

    const pageName = ref("");
    const hasPage = ref(false);
    const hasLang = ref(false);
    const hasHeader = ref(false);
    const outOfApp = ref(false);
    const headerIcon = ref("");

    const openAffiliatePage = () => {
      router.push("/affiliate");
    };

    const startAllIntervals = () => {
      checkBalanceInterval.value = setInterval(function () {
        if (store.hasToken()) {
          store.getBalance();
        }
      }, 20000);

      checkUnreadMessagesInterval.value = setInterval(function () {
        if (store.hasToken()) {
          store.getUnreadTotal();
        }
      }, 30000);
    }

    const clearAllIntervals = () => {
      clearInterval(checkBalanceInterval);
      clearInterval(checkUnreadMessagesInterval);
    }

    onUnmounted(() => {
      clearAllIntervals();
    })

    onMounted(() => {
      if (store.hasToken()) {
        store.getBalance();
        store.getUnreadTotal();

        startAllIntervals();
      }

      window.addEventListener('offline', () => {
        store.isOffline = true;
        clearAllIntervals();
      });

      window.addEventListener('online', () => {
        store.isOffline = false;
        startAllIntervals();
      });
    });

    return {
      tab: ref("home"),
      logout,
      store,
      isHomePage,
      scrollPageRef,
      pageName,
      hasPage,
      ui,
      prevPage,
      outOfApp,
      hasHeader,
      headerIcon,
      languageVal,
      hasLang,
      openAffiliatePage,
      openLiveChat,
      router,
      footerBoxImgUrl
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
.footer-nav {
  .footer-label {
    font-weight: normal;
  }

  .footer-label {
    color: #c9c9c9;
  }

  .q-tab--active {
    .footer-label {
      color: #ffffff;
      -webkit-text-fill-color: #ffffff;
    }
  }
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

.footer-nav {
  margin-top: -30px;

  :deep(.q-tab__content) {
    margin-top: auto;
  }

  :deep(.q-tabs__content) {
    margin-top: -30px;
  }

  :deep(.q-hoverable:hover > .q-focus-helper) {
    opacity: 0;
  }

  :deep(.q-hoverable:hover) {
    filter: brightness(1.3);
  }
}

.footer-icon {
  //width: 22px;
  width: 30px;
  // filter: brightness(1.4);
  margin-bottom: 4px;
}

.middle-menu {
  // background: salmon;

  // .footer-icon{
  //   background: salmon;
  // }
  // position: absolute;
  // margin-top: -30px;
  z-index: 9;
  opacity: 1;

  .footer-icon {
    // margin-bottom: -10px;
    width: 58px;
    height: 58px;
    aspect-ratio: 58 / 58;
  }

}

// .q-footer .q-tabs {
//     margin-top: -30px;
// }

.logo {
  width: 130px;
  margin-left: 10px;

  img {
    width: 100%;
  }
}

.vip-btn {
  width: 24px;
  order: -1;
}

.point-rebate-div {
  position: relative;
  min-width: 130px;
  height: 30px;
  background: $third-color;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 15px;
  margin-left: 8px;
  margin-right: auto;
  z-index: 2;

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
  border: 1px solid #ffa9ab;
  background: $linear-bg-1;
  color: $white;
  border-radius: 25px;
  font-size: $normal-size;

  line-height: 1rem;
}

.header-back {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;
}

.affiliate-btn {
  background: #793737;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
  padding: 1px 16px;
  height: 30px;
  color: #fff;
  font-size: 16px;
  line-height: 30px;

  img {
    height: 18px;
    filter: brightness(0) invert(1);
    width: auto;
  }
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

.btn-deco-wrapper {
  position: relative;
}

.drawer-container {
  padding: 10px 16px;
  width: calc(100%);
}

.top-logo {
  position: absolute;
  top: 50%;
  margin-top: -42px;
  left: 50%;
  width: 300px;
  transform: translate(-50%, -50%);

  @media (max-width: 1200px) {
    width: 250px;
  }

  @media (max-width: 768px) {
    width: 200px;
    margin-top: 0px;
    top: calc(50% + 30px);
    display: none; // temp
  }

  @media (max-width: 500px) {
    width: 200px;
    margin-top: 0px;
    display: none; // temp
  }
}

.home-banner-wrapper {
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  flex-direction: column;
  position: relative;
  width: 100%;
  background: url("../assets/home/home-banner-sm.jpg") no-repeat top center;
  background-size: cover;
  height: 228px;
  margin-top: 60px;

  @media (min-width: 620px) {
    background: url("../assets/home/home-banner-md.jpg") no-repeat top center;
    background-size: cover;
    height: 228px;
  }

  @media (min-width: 769px) {
    background: url("../assets/home/home-banner-lg.jpg") no-repeat top center;
    background-size: cover;
    margin-top: 0px;
    height: 345px;
  }

  @media (min-width: 1200px) {
    background: url("../assets/home/home-banner-xl.jpg") no-repeat top center;
    background-size: cover;
    height: 400px;
  }


}

footer {
  width: 100%;
  height: 186px;
  background-color: #0d0e0f;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  @media (min-width: 1200px) {
    height: 300px;
  }
}

.footer-box {
  margin: 15px 0px;
  max-width: 1400px;
  gap: 10px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;

  @media (min-width: 1200px) {
    margin-top: 20px;
  }

  .box {
    width: 75px;
    height: 32px;
    // background-color: #272a30;

    // background: linear-gradient(275deg, hsl(0deg 0% 11.17%) 0%, hsl(223deg 12.03% 13.49%) 100%);


    display: flex;
    justify-content: center;
    align-items: center;

    img {
      max-width: 100%;
      max-height: 100%;
    }

    @media (min-width: 1200px) {
      width: 140px;
      height: 60px;
    }
  }
}

.copyright-text {
  font-size: 12px;
  line-height: 16.8px;
  padding: 20px;

  @media (min-width: 1200px) {
    font-size: 17px;
    line-height: 28px;
  }
}

@media (min-width: 600px) {
  .login-btn {
    width: 120px;
  }

  .register-btn {
    width: 120px;
  }
}

@media (min-width: 1200px) {
  .home-sticky {
    display: block;
  }
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
</style>
