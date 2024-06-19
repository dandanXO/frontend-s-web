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
    font-family: "Manrope", sans-serif;
    width: 90%;
    margin: 0 auto;
    border-radius: 0.5rem;
    margin: 20px auto 0px;
    // background: #1b2232;

    background: url(../../assets/images/account/deposit-withdraw-tab-bg.png) no-repeat center center;
    background-size: 100% 100%;

    .right {
      color: white;
      background: url(../../assets/images/account/deposit-withdraw-tab-active-bg-right.png) no-repeat center center;
      background-size: 0;
    }

    .left {
      color: white;
      background: url(../../assets/images/account/deposit-withdraw-tab-active-bg-left.png) no-repeat center center;
      background-size: 0;
    }

    :deep(.q-tab) {
      color: #5c6c86;
      // background: #101114;
      border-radius: 0.375rem;
      // margin: 2.5px;
    }

    :deep(.q-tab--active) {
      color: white;
      background-size: 100% 100%;
      box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.05);

      .q-tab__label {
        font-weight: bold;
      }
    }
  }

  .deposit-panels {
    background: transparent;
  }
}
</style>
