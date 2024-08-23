<template>
  <div class="transaction-landing">
    <!--    {{ activeKey }}-->
    <q-tabs v-model="activeKey" class="deposit-tabs" color="black" no-caps indicator-color="transparent">
      <q-tab name="crypto" label="Crypto"></q-tab>
      <q-tab name="flat" label="Flat"></q-tab>
      <!--      <q-route-tab to="/withdraw" name="withdraw" label="Withdraw"></q-route-tab>-->
    </q-tabs>

    <q-tab-panels v-model="activeKey" class="deposit-panels">
      <q-tab-panel name="crypto">
        <DepositView type="usdt"></DepositView>
      </q-tab-panel>
      <q-tab-panel name="flat">
        <DepositView type="flat"></DepositView>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script setup>
import { onActivated, ref } from "vue";
import { useRoute } from "vue-router";
import DepositView from "../account/DepositView.vue";
import { userStore } from "src/stores";

const route = useRoute();
const store = userStore();

const activeKey = ref("");

onActivated(() => {
  const isUsdt = store.walletCurrency;
  if (isUsdt === "USDT") {
    activeKey.value = "crypto";
  } else {
    activeKey.value = "flat";
  }
});

// watch(
//   () => route.path,
//   () => {
//     if (route.path === "/deposit") activeKey.value = "deposit";
//     else if (route.path === "/withdraw") {
//       activeKey.value = "withdraw";
//       if (withdrawViewRef.value && typeof withdrawViewRef.value.onActivated === "function") {
//         withdrawViewRef.value.onActivated();
//       }
//     }
//   }
// );
</script>

<style scoped lang="scss">
.transaction-landing {
  background: #101114;
  .deposit-tabs {
    font-family: "Manrope", sans-serif;
    width: 90%;
    margin: 0 auto;
    border-radius: 0.5rem;
    background: #1b2232;

    &:before {
      content: "";
      background-image: url("../../assets/images/account/hot-ribbon.png");
      height: 40px;
      width: 41px;
      position: absolute;
      z-index: 2;
      top: 0;
      left: 0;
      display: block;
      background-size: 100%;
      background-repeat: no-repeat;
    }

    :deep(.q-tab) {
      color: #5c6c86;
      background: #101114;
      border-radius: 0.375rem;
      margin: 2.5px;
    }

    :deep(.q-tab--active) {
      color: white;
      background: #5c46e7;

      box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.05);

      .q-tab__label {
        font-weight: bold;
      }
    }
  }

  .deposit-panels {
    background: #101114;
  }
}
</style>
