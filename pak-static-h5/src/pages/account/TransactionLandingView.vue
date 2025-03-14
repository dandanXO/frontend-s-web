<template>
  <div class="transaction-landing">
    <q-tabs v-model="activeKey" class="deposit-tabs" color="black" no-caps indicator-color="transparent">
      <q-route-tab class="left" to="/deposit" name="deposit" :label="$t('settings.deposit')"></q-route-tab>
      <q-route-tab class="right" to="/withdraw" name="withdraw" :label="$t('settings.withdraw')"></q-route-tab>
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

    border-radius: 0.5rem;
    margin: 20px 16px 0px;
    // background: #1b2232;

    background: url(../../assets/images/account/deposit-withdraw-tab-bg.png) no-repeat center center;
    background-size: 100% 100%;

    .right {
      padding: 12px 0;
      color: white;
      // background: url(../../assets/images/account/deposit-withdraw-tab-active-bg-right.png) no-repeat center center;
      background-size: 0;
    }

    .left {
      padding: 12px 0;
      color: white;
      // background: url(../../assets/images/account/deposit-withdraw-tab-active-bg-left.png) no-repeat center center;
    }

    :deep(.q-tab) {
      color: #5F6061;
      // background: #101114;
      border-radius: 0.375rem;
      // margin: 2.5px;
    }

    :deep(.q-tab--active) {
      color: white;
      background: linear-gradient(
        180deg,
        rgba(97, 255, 0, 0) 0%,
        rgba(97, 255, 0, 0.25) 50.5%,
        rgba(97, 255, 0, 0) 100%
      );
      box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.05);

      &:before {
        content: "";
        background-color: #70bc62;
        height: 3px;
        border-radius: 4px;
        width: 30%;
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
      }

      .q-tab__label {
        font-weight: bold;
      }
    }
  }

  .deposit-panels {
    background: transparent;
    position: unset;
  }
}
</style>
