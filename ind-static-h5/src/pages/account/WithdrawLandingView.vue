<template>
  <div class="transaction-landing">
    <q-tabs v-model="activeKey" class="deposit-tabs" color="black" no-caps indicator-color="transparent">
      <q-route-tab to="/withdraw?usdt=1" name="crypto" label="Crypto"></q-route-tab>
      <q-route-tab to="/withdraw" name="flat" label="Flat"></q-route-tab>
    </q-tabs>

    <q-tab-panels v-model="activeKey" class="deposit-panels">
      <q-tab-panel name="crypto">
        <WithdrawView type="usdt"></WithdrawView>
      </q-tab-panel>
      <q-tab-panel name="flat">
        <WithdrawView type="flat"></WithdrawView>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script setup>
import { onActivated, ref, watch } from "vue";
import { useRoute } from "vue-router";
import WithdrawView from "../account/WithdrawView.vue";

const route = useRoute();
const activeKey = ref("");
const withdrawViewRef = ref(null);

onActivated(() => {
  const isUsdt = sessionStorage.getItem("WALLET_TYPE");
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
