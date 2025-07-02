<template>
  <q-footer v-if="ui.footer" :style="ui.bottomInsetHeight > 0 ? `bottom: ${ui.bottomInsetHeight}px;` : ''" unelevated>
    <q-tabs v-model="tab" no-caps :breakpoint="0" align="justify" indicator-color="white" narrow-indicator>
      <q-route-tab to="/home" name="home" id="home" :ripple="false">
        <div class="footer-img">
          <img class="inactive" src="../assets/images/index/menu/icon-home.png" />
          <img class="hover" src="../assets/images/index/menu/icon-home-hover.png" />
        </div>
        <span class="footer-label">{{ $t("bottomNav.home") }}</span>
      </q-route-tab>
      <q-route-tab class="cs-web-id" to="/promo" id="cs-web-id" name="live" :ripple="false">
        <div class="footer-img">
          <img class="inactive" src="../assets/images/index/menu/icon-promotion.png" />
          <img class="hover" src="../assets/images/index/menu/icon-promotion-hover.png" />
        </div>
        <span class="footer-label">{{ $t("bottomNav.promo") }}</span>
      </q-route-tab>
      <q-route-tab v-if="store.memberType === 'AFFILIATE'" to="/affiliate/agent" name="share-affiliate" :ripple="false">
        <div class="footer-img">
          <img class="inactive" src="../assets/images/index/menu/icon-agent.png" />
          <img class="hover" src="../assets/images/index/menu/icon-agent-hover.png" />
        </div>
        <span class="footer-label">{{ $t("bottomNav.agent") }}</span>
      </q-route-tab>
      <q-route-tab v-else to="/earn-money" name="share-affiliate" :ripple="false">
        <div class="footer-img">
          <img class="inactive" src="../assets/images/index/menu/icon-earn.png" />
          <img class="hover" src="../assets/images/index/menu/icon-earn-hover.png" />
        </div>
        <span class="footer-label">{{ $t("bottomNav.earnMoney") }}</span>
      </q-route-tab>
      <q-route-tab @click="playGame('BetBy', 'BetBy')" name="betby" :ripple="false">
        <div class="footer-img">
          <img class="inactive" src="../assets/images/index/menu/icon-betby.png" />
          <img class="hover" src="../assets/images/index/menu/icon-betby-hover.png" />
        </div>
        <span class="footer-label">BetBy</span>
      </q-route-tab>
      <q-route-tab :to="`/deposit?from=${route.path}`" name="deposit" :ripple="false">
        <div class="footer-img">
          <img class="inactive" src="../assets/images/index/menu/icon-wallet.png" />
          <img class="hover" src="../assets/images/index/menu/icon-wallet-hover.png" />
        </div>
        <span class="footer-label">{{ $t("bottomNav.wallet") }}</span>
      </q-route-tab>
      <!-- <q-route-tab to="/account" name="account" :ripple="false">
        <div class="footer-img">
          <img class="inactive" src="../assets/images/index/menu/icon-account.png" />
          <img class="hover" src="../assets/images/index/menu/icon-account-hover.png" />
        </div>
        <span class="footer-label">{{ $t("bottomNav.account") }}</span>
      </q-route-tab> -->
    </q-tabs>
  </q-footer>

  <GameModal
    v-if="route.path !== '/account/profile'"
    ref="allGames"
    :closeFullGameDialog="closeFullGameDialog"
  ></GameModal>
</template>

<script setup>
import { ref } from "vue";
import { useUI } from "stores/ui";
import { useRoute } from "vue-router";
import { userStore } from "src/stores";
import GameModal from "components/modal/GameModal";

const ui = useUI();
const route = useRoute();
const tab = ref("home");
const store = userStore();

const allGames = ref(null);
const playGame = (gameName, platformCode, gameCode, gameStatus, gameType, gameId, demo) => {
  allGames.value.open(gameName, platformCode, gameCode, gameType, demo);
};

const isGameLoading = ref(true);
const openGame = (gameName, platformCode, gameCode, gameStatus, gameType, gameId) => {
  isShowAllFullGames.value = false;
  isGameLoading.value = true;
  subGameCode.value = platformCode;
  loadGameList(gameType, gameId);
  fullGameDialog.value = true;
  hotGameOn.value = false;
};

const closeFullGameDialog = () => {
  fullGameDialog.value = false;

  if (store.guest && !store.realName) {
    guestKYCDialog.value = true;
  } else if (!store.guest && !store.realName) {
    userKYCDialog.value = true;
  }
};
</script>

<style lang="scss" scoped>
:deep(.q-tab--active) {
  position: relative;

  .q-tab__indicator {
    // display: none;
    background: #0854C3;

    top: -3.5px;
    width: 40px;
    height: 7px;
    border-radius: 5px;
  }

  // &::after {
  //   content: "";
  //   display: block;
  //   position: absolute;
  //   width: 42px;
  //   height: 38px;

  //   top: 6px;
  //   pointer-events: none;
  //   left: 50%;
  //   // margin-top: -10px;
  //   transform: translateX(-50%);
  //   background-size: contain;
  //   background-image: url("../assets/images/index/menu/icon-hover.png");
  //   background-repeat: no-repeat;
  //   // background-image: url("../assets/images/account/shadow2-bg.png");
  // }
}

// .earn-money {
//   animation: blink 1.5s infinite;
// }

@keyframes blink {
  0% {
    filter: brightness(0.8) saturate(0.8) contrast(0.8);
  }

  50% {
    filter: brightness(1.3) saturate(1) contrast(1);
  }

  100% {
    filter: brightness(0.8) saturate(0.8) contrast(0.8);
  }
}
</style>
