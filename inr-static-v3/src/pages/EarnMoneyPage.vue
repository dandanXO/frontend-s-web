<template>
  <ProfileSummary :homeProfile="true" />
  <div class="earn-money-wrapper">
    <div class="earn-money-container">
      <div class="earn-money-title">{{ $t("earnMoney.title") }}</div>
    </div>
    <q-tabs v-model="currentTab" no-caps class="children-tab" indicator-color="transparent" align="justify">
      <q-tab
        v-for="(tab, index) in childrenTabs"
        :key="index"
        :label="tab.label"
        :name="tab.name"
      />
    </q-tabs>
    <q-tab-panels
      v-model="currentTab"
      class="children-tab-panel"
      transition-next="fade"
      transition-prev="fade"
      animated
    >
      <q-tab-panel v-for="(tab, index) in childrenTabs" :key="index" :name="tab.name">
        <component :is="tab.component" />
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";

import ProfileSummary from "components/ProfileSummary.vue";
import RewardTab from "components/earn-money/RewardTab.vue";
import TeamManagementTab from "components/earn-money/TeamManagementTab.vue";
import TeamBettingTab from "components/earn-money/TeamBettingTab.vue";
import ProfitAndLossTab from "components/earn-money/ProfitAndLossTab.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const currentTab = ref("reward");

const childrenTabs = computed(() => [
  { label: t("earnMoney.tabs.reward"), name: "reward", component: RewardTab },
  { label: t("earnMoney.tabs.teamManagement"), name: "team-management", component: TeamManagementTab },
  // { label: t("earnMoney.tabs.teamBetting"), name: "team-betting", component: TeamBettingTab },
  { label: t("earnMoney.tabs.profitAndLoss"), name: "profit-and-loss", component: ProfitAndLossTab }
]);
</script>

<style scoped lang="scss">
.earn-money-wrapper {
  padding: 20px;
  overflow-x: hidden;
  .earn-money-container {
    .earn-money-title {
      color: #ffffff;
      font-size: 16px;
      font-weight: bold;
    }
  }

  .children-tab {
    background: url(../assets/images/account/deposit-withdraw-tab-bg.png) no-repeat center center;
    background-size: 100% 100%;

    border-radius: 8px;
    width: 100%;
    // width: calc(100% - 20px);
    // min-width: 430px;
    overflow-x: auto;
    //margin-bottom: 10px;
    margin: 10px auto;

    :deep(.q-tab__label) {
      font-weight: 700;
      font-size: 12px;
    }

    :deep(.q-tab) {
      min-width: 110px;
      white-space: normal;
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
    }
  }

  .children-tab-panel {
    padding: 0;
    background-color: transparent;

    :deep(.q-tab-panel) {
      padding: 0;
    }
  }
}
</style>
