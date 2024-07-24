<template>
  <ProfileSummary :homeProfile="true" />

  <div class="earn-money">
    <q-tabs v-model="activeKey" class="earn-money-tabs" color="black" no-caps indicator-color="transparent">
      <q-tab name="about">
        <div>About</div>
      </q-tab>
      <q-tab name="history">
        <div>History</div>
      </q-tab>
      <q-tab name="daily">
        <div>Daily</div>
      </q-tab>
      <q-tab name="earn">
        <div>Earn</div>
      </q-tab>
    </q-tabs>

    <q-tab-panels
      v-model="activeKey"
      class="earn-money-panels"
      v-touch-swipe.left="swipeLeft"
      v-touch-swipe.right="swipeRight"
    >
      <q-tab-panel name="about">
        <AgencyPolicy></AgencyPolicy>
      </q-tab-panel>
      <q-tab-panel name="history">
        <MyMember></MyMember>
      </q-tab-panel>
      <q-tab-panel name="daily">
        <DailyComponent></DailyComponent>
      </q-tab-panel>
      <q-tab-panel name="earn">
        <EarnComponent></EarnComponent>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script setup>
import { ref } from "vue";
import AgencyPolicy from "../components/earn-money/AgencyPolicy.vue";
import MyMember from "../components/earn-money/MyMember.vue";
import DailyComponent from "../components/earn-money/DailyComponent.vue";
import EarnComponent from "../components/earn-money/EarnComponent.vue";
import ProfileSummary from "components/ProfileSummary.vue";

const activeKey = ref("about");

// Define the order of the tabs
const tabsOrder = ["about", "history", "daily", "earn"];

// Function to find the next index with wrapping
const findNextIndex = (currentIndex, arrayLength) => (currentIndex + 1) % arrayLength;

// Function to find the previous index with wrapping
const findPreviousIndex = (currentIndex, arrayLength) => (currentIndex - 1 + arrayLength) % arrayLength;

const swipeLeft = () => {
  const currentIndex = tabsOrder.findIndex((tab) => tab === activeKey.value);
  const nextIndex = findNextIndex(currentIndex, tabsOrder.length);
  activeKey.value = tabsOrder[nextIndex];
};

// Handle swipe right
const swipeRight = () => {
  const currentIndex = tabsOrder.findIndex((tab) => tab === activeKey.value);
  const previousIndex = findPreviousIndex(currentIndex, tabsOrder.length);
  activeKey.value = tabsOrder[previousIndex];
};
</script>

<style scoped lang="scss">
.earn-money {
  padding-top: 50px;
  .earn-money-tabs {
    position: fixed;
    padding-left: 16px;
    padding-right: 16px;
    top: 68px;
    left: 0;
    z-index: 999;
    width: 100%;
    padding-bottom: 6px;
    padding-top: 12px;
    background: rgb(0 0 0 / 20%);
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(5px);

    :deep(.q-tabs__content) {
      background: #ffffff0d;
      border: 1px solid #ffffff0d;
      border-radius: 12px;
      padding: 4px;
    }

    :deep(.q-tab) {
      // margin: 0 15px;
      margin: 0;
      color: #b7c2ba;
      border-radius: 8px;
      min-height: 40px;
      width: 25%;
      // background: #4f26a6;
      font-size: 14px;
      font-weight: 400;
      border: 0px solid #303030;
    }

    :deep(.q-tab__content) {
      gap: 2px;
    }

    :deep(.q-tab--active) {
      color: #a8ef9c;
      background: #ffffff0d;
    }
  }

  .earn-money-panels {
    // background: radial-gradient(25% 50% at 50% 50%, #e01b84 0%, rgba(27, 28, 36, 0) 100%);
    min-height: 80vh;
    // background-image: url("../assets/images/earn-money/earn-money-bg.jpg");
    // background-repeat: no-repeat;
    // background-size: cover;
    // background-position: center center;

    background: transparent;
  }

  svg {
    fill: rgba(255, 255, 255, 0.5);
  }
}
</style>
