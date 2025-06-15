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
      <q-route-tab to="/account/dividend" name="dividend" :ripple="false" v-if="showDividendPage">
        <div class="footer-img">
          <img class="inactive" src="../assets/images/index/menu/icon-dividend.svg" />
          <img class="hover" src="../assets/images/index/menu/icon-dividend-hover.svg" />
        </div>
        <span class="footer-label">{{ $t("bottomNav.dividend") }}</span>
      </q-route-tab>
      <q-route-tab to="/account/announcement" name="announcement" :ripple="false">
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
import { ref, onMounted } from "vue";
import { useUI } from "stores/ui";
import { useAffiliateStore } from "src/stores/affiliate";

const ui = useUI();
const tab = ref("home");
const showDividendPage = ref();
const affiliateStore = useAffiliateStore();

onMounted(async () => {
  showDividendPage.value = await affiliateStore.checkIsCanShowDividendPage();
})
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
}
</style>
