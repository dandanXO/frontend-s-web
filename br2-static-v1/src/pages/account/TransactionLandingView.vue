<template>
  <div class="transaction-landing">
    <q-tabs v-model="activeKey" class="deposit-tabs" color="black" no-caps indicator-color="transparent">
      <q-route-tab to="/deposit" name="deposit" :label="$t('header.deposit')"></q-route-tab>
      <q-route-tab to="/withdraw" name="withdraw" :label="$t('header.withdraw')"></q-route-tab>
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
import WithdrawMethodView from "../account/WithdrawMethodView.vue";

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
  // background-color: #2b474a;
  .deposit-tabs {
    font-family: "Manrope", sans-serif;
    margin: 30px 16px;

    :deep(.q-tabs__content) {
      gap: 16px;
    }

    :deep(.q-tab) {
      background-color: transparent;
      border-radius: 4px;
      border: 1px solid #4b4943;
      flex: 1;
      .q-tab__label {
        font-size: 14px;
        font-weight: 700;
        color: #4b4943;
      }
    }

    :deep(.q-tab--active) {
      color: #fff;
      background: linear-gradient(90deg, #4fffa5 0%, #10d16f 100%);
      border: none;

      .q-tab__label {
        color: #2d2d2d;
      }
    }
  }

  .deposit-panels {
    background: #101114;
  }
}
</style>
