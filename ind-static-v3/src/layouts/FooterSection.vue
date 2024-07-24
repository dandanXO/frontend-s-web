<template>
    <q-footer v-if="ui.footer" :style="ui.bottomInsetHeight > 0 ? `bottom: ${ui.bottomInsetHeight}px;` : ''" elevated>
      <q-tabs v-model="tab" no-caps :breakpoint="0" align="justify" indicator-color="green" narrow-indicator>
        <q-route-tab to="/home" name="home" exact :ripple="false">
          <img class="inactive" src="../assets/images/index/menu/home-icon.png" />
          <img class="hover" src="../assets/images/index/menu/home-icon-hover.png" />
          <span class="footer-label">Home</span>
        </q-route-tab>
        <q-route-tab class="cs-web-id" to="/promo" id="cs-web-id" name="live" :ripple="false">
          <img class="inactive" src="../assets/images/index/menu/bonus-icon.png" />
          <img class="hover" src="../assets/images/index/menu/bonus-icon-hover.png" />
          <span class="footer-label">Promo</span>
        </q-route-tab>
        <q-route-tab class="center-menu" :to="`/deposit?from=${route.path}`" name="deposit" :ripple="false">
          <img  src="../assets/images/index/menu/deposit-icon.png" />
          <span class="footer-label">Deposit</span>
        </q-route-tab>
        <q-route-tab to="/earn-money" name="earn-money" :ripple="false">
          <img class="inactive" src="../assets/images/index/menu/earn-icon.png" />
          <img class="hover" src="../assets/images/index/menu/earn-icon-hover.png" />
          <span class="footer-label">Earn Money</span>
        </q-route-tab>
        <q-route-tab to="/account" name="account" :ripple="false">
          <img class="inactive" src="../assets/images/index/menu/account-icon.png" />
          <img class="hover" src="../assets/images/index/menu/account-icon-hover.png" />
          <span class="footer-label">Me</span>
        </q-route-tab>
      </q-tabs>
    </q-footer>
</template>

<script setup>
import { ref } from 'vue';
import { useUI } from "stores/ui";
import { useRoute } from "vue-router";

const ui = useUI();
const route = useRoute();
const tab = ref("home");

</script>

<style lang="scss" scoped>

:deep(.q-tab--active) {
  position: relative;

  &::after {
    content: "";
    display: block;
    position: absolute;
    width: 92px;
    height: 92px;
    top: 50%;
    pointer-events: none;
    left: 50%;
    margin-top: -10px;
    transform: translate(-50%, -50%);
    background-size: contain;
    background-image: url("../assets/images/account/shadow2-bg.png");
  }
}
</style>
