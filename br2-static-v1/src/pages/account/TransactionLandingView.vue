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
        <WithdrawMethodView ref="withdrawViewRef"></WithdrawMethodView>
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

    width: 90%;
    margin: 0 auto;
    border-radius: 0.5rem;
    background-color: #2b474a;

    :deep(.q-tab) {
      color: #01a1b2;
      background-color: #2b474a;
      border-radius: 0.375rem;
      margin: 2.5px;
    }

    :deep(.q-tab--active) {
      color: #fff;
      background: linear-gradient(180deg, #00b9a1 0%, #0097b9 100%);
      box-shadow: 0px 1px 2px 0px #0000000d;

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
