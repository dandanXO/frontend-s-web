<template>
  <ProfileSummary :homeProfile="true" />
  <div class="earn-money-wrapper">
    <div class="earn-money-container">
      <div class="earn-money-title">{{ $t("earnMoney.title") }}</div>
    </div>
    <div ref="targetSection" class="target-section">
      <!-- The section to scroll to -->
    </div>
    <q-tabs v-model="currentTab" no-caps class="children-tab" indicator-color="transparent" align="justify">
      <q-tab v-for="(tab, index) in childrenTabs" :key="index" :label="tab.label" :name="tab.name" />
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

    <AdditionalSteps
      v-if="isAdditionalReferSteps"
      :currentAdditionalStep="currentReferStep"
      :currentType="currentType"
      @updateStep="handleStepUpdate"
      @closeGuide="closePlayerGuide"
    />
  </div>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { computed, ref, watch, nextTick } from "vue";

import ProfileSummary from "components/ProfileSummary.vue";
import RewardTab from "components/earn-money/RewardTab.vue";
import TeamManagementTab from "components/earn-money/TeamManagementTab.vue";
import TeamBettingTab from "components/earn-money/TeamBettingTab.vue";
import ProfitAndLossTab from "components/earn-money/ProfitAndLossTab.vue";
import { useI18n } from "vue-i18n";
import AdditionalSteps from "components/modal/AdditionalSteps.vue";

const { t } = useI18n();

const currentTab = ref("reward");
const route = useRoute();
const router = useRouter();
const childrenTabs = computed(() => [
  { label: t("earnMoney.tabs.reward"), name: "reward", component: RewardTab },
  { label: t("earnMoney.tabs.teamManagement"), name: "team-management", component: TeamManagementTab },
  // { label: t("earnMoney.tabs.teamBetting"), name: "team-betting", component: TeamBettingTab },
  { label: t("earnMoney.tabs.profitAndLoss"), name: "profit-and-loss", component: ProfitAndLossTab }
]);
const isAdditionalReferSteps = ref(false);
const closePlayerGuide = () => {
  isAdditionalReferSteps.value = false;
  if (currentReferStep.value === 3) {
    router.push("/?newPlayerGuide=earn-money");
  }
  enableScroll();
};

const preventBodyScroll = (e) => {
  const container = document.querySelector(".abs-container");
  if (!container.contains(e.target)) {
    e.preventDefault(); // Stop background scrolling
  }
};

const disableScroll = () => {
  document.body.style.overscrollBehavior = 'contain';
  document.body.style.overflow = "hidden"; // Prevent body scrolling
  document.addEventListener("touchmove", preventBodyScroll, { passive: false });
};

const enableScroll = () => {
  document.body.style.overscrollBehavior = "";
  document.body.style.overflow = ""; // Restore body scroll
  document.removeEventListener("touchmove", preventBodyScroll);
};
const currentReferStep = ref(3);
const handleStepUpdate = (newStep) => {
  currentReferStep.value = newStep;
};
const targetSection = ref();
const currentType = ref('refer');
watch(
  () => route.query.isNewPlayer,
  (newVal) => {
    if (newVal === "2" && currentType.value === 'refer') {
      isAdditionalReferSteps.value = true;
      nextTick(() => {
        setTimeout(() => {
          if (targetSection.value && isAdditionalReferSteps.value) {
            const offset = -760;
            const rect = targetSection.value.getBoundingClientRect();
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const finalPosition = rect.top + scrollTop - offset;

            window.scrollTo({
              top: finalPosition,
              behavior: "smooth"
            });
          }
        }, 100);
      });
    }
  },
  { immediate: true }
);
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
