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
      <q-route-tab to="/earn-money" name="earn-money" :ripple="false">
        <div class="footer-big-img earn-money">
          <img
            style="width: 100%"
            :src="ui.footerIcon ? ui.footerIcon : require(`../assets/images/index/menu/icon-earnmoneynew.gif`)"
          />
        </div>
        <!-- <div class="footer-img">
          <img class="inactive" src="../assets/images/index/menu/icon-earnmoney.png" />
          <img class="hover" src="../assets/images/index/menu/icon-earnmoney-hover.png" />
        </div> -->
        <!-- <span class="footer-label" style="padding-top: 0">{{ $t("bottomNav.earnMoney") }}</span> -->
      </q-route-tab>
      <q-route-tab :to="`/deposit?from=${route.path}&noPreSelectPrivilege=1`" name="deposit" :ripple="false">
        <div class="footer-img">
          <img class="inactive" src="../assets/images/index/menu/icon-wallet.png" />
          <img class="hover" src="../assets/images/index/menu/icon-wallet-hover.png" />
        </div>
        <span class="footer-label">{{ $t("bottomNav.wallet") }}</span>
      </q-route-tab>
      <q-route-tab to="/account" name="account" :ripple="false">
        <div class="footer-img">
          <img class="inactive" src="../assets/images/index/menu/icon-account.png" />
          <img class="hover" src="../assets/images/index/menu/icon-account-hover.png" />
        </div>
        <span class="footer-label">{{ $t("bottomNav.account") }}</span>
      </q-route-tab>
    </q-tabs>
  </q-footer>
</template>

<script setup>
import { ref } from "vue";
import { useUI } from "stores/ui";
import { useRoute } from "vue-router";

const ui = useUI();
const route = useRoute();
const tab = ref("home");
</script>

<style lang="scss" scoped>
:deep(.q-tab--active) {
  position: relative;

  .q-tab__indicator {
    display: none;
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
