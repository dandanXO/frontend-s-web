<template>
  <div class="container">
    <q-tabs v-model="activeKey" class="tabs" color="black" no-caps indicator-color="transparent">
      <q-tab name="my-dividend" :label="$t('dividend.myDividend')"></q-tab>
      <q-tab name="contract-management" :label="$t('dividend.contractManagement')"></q-tab>
    </q-tabs>

    <q-tab-panels v-model="activeKey" class="panels">
      <q-tab-panel name="my-dividend">
        <MyDividend />
      </q-tab-panel>
      <q-tab-panel name="contract-management">
        <ContractManagement />
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import MyDividend from "../account/dividend/MyDividend.vue";
import ContractManagement from "../account/dividend/ContractManagement.vue";

const route = useRoute();
const activeKey = ref("my-dividend");
</script>

<style scoped lang="scss">
.container {
  .tabs {
    font-family: "Manrope", sans-serif;
    background: #3237384D;
    background-size: 100% 100%;
    border-radius: 8px;
    margin: 20px 16px 4px;
    padding: 1px;
    font-weight: 700;
    font-size: 14px;
    line-height: 100%;
    letter-spacing: 0px;
    text-align: center;
    vertical-align: middle;

    :deep(.q-tabs__content) {
      height: 45px;
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

  .panels {
    background: transparent;
    position: unset;
  }
}
</style>