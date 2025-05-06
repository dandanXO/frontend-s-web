<template>
  <q-footer v-if="ui.footer" :style="ui.bottomInsetHeight > 0 ? `bottom: ${ui.bottomInsetHeight}px;` : ''" unelevated>
    <q-tabs v-model="tab" no-caps :breakpoint="0" align="justify" indicator-color="white" narrow-indicator>
      <q-route-tab to="/agent" name="home" id="home" :ripple="false">
        <div class="footer-img">
          <img class="inactive" src="../assets/images/index/menu/icon-affiliatehome.png" />
          <img class="hover" src="../assets/images/index/menu/icon-affiliatehome-hover.png" />
        </div>
        <span class="footer-label">{{ $t("bottomNav.home") }}</span>
      </q-route-tab>
      <q-route-tab to="/account/agent" name="link-register" :ripple="false">
        <div class="footer-img">
          <img class="inactive" src="../assets/images/index/menu/icon-affiliateaccount.png" />
          <img class="hover" src="../assets/images/index/menu/icon-affiliateaccount-hover.png" />
        </div>
        <span class="footer-label">{{ $t("bottomNav.account") }}</span>
      </q-route-tab>
      <q-route-tab to="/account/dividend" name="dividend" :ripple="false">
        <div class="footer-img">
          <img class="inactive" src="../assets/images/index/menu/icon-dividend.svg" />
          <img class="hover" src="../assets/images/index/menu/icon-dividend-hover.svg" />
        </div>
        <span class="footer-label">{{ $t("bottomNav.dividend") }}</span>
      </q-route-tab>
      <q-route-tab  to="/account/announcement" name="announcement" :ripple="false">
        <div class="footer-img">
          <img class="inactive" src="../assets/images/index/menu/icon-announcement.png" />
          <img class="hover" src="../assets/images/index/menu/icon-announcement-hover.png" />
        </div>
        <span class="footer-label">{{ $t("bottomNav.announcement") }}</span>
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
