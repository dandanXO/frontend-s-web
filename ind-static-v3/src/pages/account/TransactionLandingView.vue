<template>
  <div class="transaction-landing">
    <q-tabs v-model="activeKey" class="deposit-tabs" color="black" no-caps indicator-color="transparent">
      <q-route-tab class="left" to="/deposit" name="deposit" label="Deposit"></q-route-tab>
      <q-route-tab class="right" to="/withdraw" name="withdraw" label="Withdraw"></q-route-tab>
    </q-tabs>

    <q-tab-panels v-model="activeKey" class="deposit-panels">
      <q-tab-panel name="deposit">
        <DepositView></DepositView>
      </q-tab-panel>
      <q-tab-panel name="withdraw">
        <WithdrawView ref="withdrawViewRef"></WithdrawView>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import DepositView from "../account/DepositView.vue";
import WithdrawView from "../account/WithdrawView.vue";

const route = useRoute();
const activeKey = ref("");
const withdrawViewRef = ref(null);

watch(
  () => route.path,
  () => {
    if (route.path === "/deposit") activeKey.value = "deposit";
    else if (route.path === "/withdraw") {
      activeKey.value = "withdraw";
      if (withdrawViewRef.value && typeof withdrawViewRef.value.onActivated === "function") {
        withdrawViewRef.value.onActivated();
      }
    }
  }
);
</script>

<style scoped lang="scss">
.transaction-landing {
  // background: #101114;
  .deposit-tabs {
    border-radius: 8px;
    margin-bottom: 4px;
    margin-top: 15px;
    margin-left: 20px;
    padding: 1px;
    width: 100%;
    max-width: 200px;
    background: #141812;

    :deep(.q-tab) {
      color: #b7c2ba;
    }

    :deep(.q-tab--active) {
      color: #284426;
      background: linear-gradient(189.71deg, #a8ef9c 7.08%, #2f961e 92.75%);
      font-weight: 700;
    }

    :deep(.q-tab--active .q-tab__label) {
      font-weight: 700 !important;
    }
  }

  .deposit-panels {
    background: transparent;
  }
}
</style>
