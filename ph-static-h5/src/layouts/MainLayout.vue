<template>
  <q-layout view="hHh Lpr fFf">
    <q-header>
      <q-card-section
        v-if="!hasPage"
        class="top-section justify-between items-center"
        horizontal
      >
        <div class="logo"><router-link to="/"><img src="../assets/home/logo.png" /></router-link></div>
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
          ><RiWalletLine />
          <span style="font-size: 10px; margin-left: 5px; display: block"
            >Deposit</span
          >
        </q-btn>
      </q-card-section>
      <q-card-section class="page-title" v-if="hasPage">
        <router-link :to="prevPage ? '/' + prevPage : '/'">
          <RiArrowDropLeftLine />
        </router-link>
        {{ pageName }}
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
        <q-route-tab to="/" name="home" exact
          ><RiHomeLine />
          Home
        </q-route-tab>
        <q-route-tab to="/promo" name="promo">
          <RiCoinsLine />
          Promotion
        </q-route-tab>
        <q-route-tab to="/liveChat" name="live">
          <RiCustomerService2Fill />
          Live Chat
        </q-route-tab>
        <q-route-tab to="/account" name="account">
          <RiUserSmileLine />
          Account
        </q-route-tab>
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script>
import { defineComponent, onMounted, ref, watch } from "vue";
import { userStore } from "stores/index";
import { useUI } from "stores/ui";
import { useRoute, useRouter } from "vue-router";
// import EssentialLink from "components/EssentialLink.vue";

import {
  RiWalletLine,
  RiCoinsLine,
  RiHomeLine,
  RiUserSmileLine,
  RiCustomerService2Fill,
  RiArrowDropLeftLine
} from "vue-remix-icons";

export default defineComponent({
  name: "MainLayout",

  components: {
    RiWalletLine,
    RiCoinsLine,
    RiHomeLine,
    RiUserSmileLine,
    RiCustomerService2Fill,
    RiArrowDropLeftLine
  },

  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = userStore();
    const prevPage = ref(null);
    const ui = useUI();
    console.log(ui.footer)
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
    const checkRoute = () => {
      if (route) {
        hasPage.value = false;
        pageName.value = "";
        if (route.path === "/slot") {
          hasPage.value = true;
          pageName.value = "Slot";
        } else if (route.path === "/live-casino") {
          hasPage.value = true;
          pageName.value = "Live Casino";
        } else if (route.path === "/poker") {
          hasPage.value = true;
          pageName.value = "Poker";
        } else if (route.path === "/e-sport") {
          hasPage.value = true;
          pageName.value = "Esports";
        } else if (route.path === "/sport") {
          hasPage.value = true;
          pageName.value = "Sport";
        } else if (route.path === "/aviator") {
          hasPage.value = true;
          pageName.value = "Aviator";
        } else if (route.path === "/display") {
          prevPage.value = 'finance/deposit';
          hasPage.value = true;
          pageName.value = "Bank Information";
        }  else if (route.path === "/finance/deposit") {
          prevPage.value = 'account';
          hasPage.value = true;
          pageName.value = "Deposit";
        }  else if (route.path === "/finance/withdraw") {
          prevPage.value = 'account';
          hasPage.value = true;
          pageName.value = "Withdraw";
        } else if (route.path === "/account/transit") {
          prevPage.value = 'account';
          hasPage.value = true;
          pageName.value = "Transit";
        } else if (route.path === "/account/personal") {
          prevPage.value = 'account';
          hasPage.value = true;
          pageName.value = "Personal";
        } else if (route.path === "/account/withdraw") {
          prevPage.value = 'account';
          hasPage.value = true;
          pageName.value = "Withdraw";
        } else if (route.path === "/account/mail") {
          prevPage.value = 'account';
          hasPage.value = true;
          pageName.value = "Mail";
        } else if (route.path === "/affiliate") {
          prevPage.value = 'account';
          hasPage.value = true;
          pageName.value = "Affiliate";
        } else if (route.path === "/vip") {
          prevPage.value = 'account';
          hasPage.value = true;
          pageName.value = "VIP";
        } else if (route.path === "/promo" && route.query.id) {
          prevPage.value = 'promo';
          hasPage.value = true;
          pageName.value = "Promotion";
        } else if (route.path === "/insert-bankinfo") {
          hasPage.value = true;
          pageName.value = "Bank Information";
        }
        
      }
    };
    const pageName = ref("");
    const hasPage = ref(false);
    const leftDrawerOpen = ref(false);
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
      prevPage
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

.logo {
  width: 130px;
  margin-left: 10px;
  img {
    width: 100%;
  }
}
</style>
