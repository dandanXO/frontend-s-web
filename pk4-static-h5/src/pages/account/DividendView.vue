<template>
    <div class="dividend-container">
      <q-tabs v-model="activeKey" class="dividend-tabs" color="black" no-caps indicator-color="transparent">
        <q-route-tab  to="/account/dividend/my-dividend" name="my-dividend" :label="$t('dividend.myDividend')"></q-route-tab>
        <q-route-tab  to="/account/dividend/contract-management" name="contract-management" :label="$t('dividend.contractManagement')"></q-route-tab>
        <q-route-tab  to="/account/dividend/dividend-record" name="dividend-record" :label="$t('dividend.dividendRecord')"></q-route-tab>
      </q-tabs>
  
      <q-tab-panels v-model="activeKey" class="deposit-panels">
        <q-tab-panel name="my-dividend">
          <MyDividend />
        </q-tab-panel>
        <q-tab-panel name="contract-management">
          <h1>contract-management</h1>
        </q-tab-panel>
        <q-tab-panel name="dividend-record">
          <h1>dividend-record</h1>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from "vue";
  import { useRoute } from "vue-router";
  import MyDividend from "../account/dividend/MyDividend.vue";
  
  const route = useRoute();
  const activeKey = ref("");
  
  watch(
    () => route.path,
    () => {
      if (route.path === "/account/dividend") {
        activeKey.value = "my-dividend";
      } else if (route.path === "/account/dividend/contract-management") {
        activeKey.value = "contract-management";
      } else if (route.path === "/account/dividend/dividend-record") {
        activeKey.value = "dividend-record";
      }
    }
  );
  </script>
  
  <style scoped lang="scss">
  .dividend-container {
    .dividend-tabs {
      font-family: "Manrope", sans-serif;
  
      background: #3237384D;
      background-size: 100% 100%;
      border-radius: 8px;
      margin: 20px 16px 4px;
      padding: 1px;
      font-family: "Microsoft YaHei UI", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
      font-weight: 700;
      font-size: 14px;
      line-height: 100%;
      letter-spacing: 0px;
      text-align: center;
      vertical-align: middle;
  
      :deep(.q-tabs__content) {
        height: 57px;
      }
  
      :deep(.q-tab) {
        color: #ffffff80;
        min-height: unset;

        .q-tab__label {
          font-weight: bold;
          white-space: pre-wrap;
        }
      }
  
      :deep(.q-tab--active) {
        color: white;
        background: linear-gradient(90deg, #0287F2 0%, #0664D2 100%);
        border-radius: 6px;
  
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
  