<template>
  <div class="share-layout-container">
    <div class="menu-title-container">
      <span class="menu-title">{{ $t("rewardView.title") }}</span>
    </div>

    <a-tabs v-model:activeKey="activeTab" class="share-layout-tabs" @change="handleTabChange">
      <a-tab-pane v-for="tab in tabs" :key="tab.key" :tab="tab.label" />
    </a-tabs>
    <router-view #default="{ Component }">
      <Transition :name="animationName">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </Transition>
    </router-view>
  </div>
</template>
<script setup>
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const activeTab = ref("");
const lastActiveTabIndex = ref(0);
const animationName = ref("slide-right");

const tabs = computed(() => [
  { key: "reward", label: t("rewardView.tabs.reward") },
  { key: "team-management", label: t("rewardView.tabs.teamManagement") },
  { key: "team-betting", label: t("rewardView.tabs.teamBetting") },
  { key: "profit-and-loss", label: t("rewardView.tabs.profitAndLoss") }
]);

const handleTabChange = (key) => {
  const currentIndex = tabs.value.findIndex((tab) => tab.key === key);
  animationName.value = lastActiveTabIndex.value > currentIndex ? "slide-left" : "slide-right";
  lastActiveTabIndex.value = currentIndex;

  router.push(`/reward/${key}`);
};

watch(
  () => route.name,
  () => {
    activeTab.value = route.name;
    lastActiveTabIndex.value = tabs.value.findIndex((tab) => tab.key === activeTab.value);
  },
  { immediate: true }
);
</script>
<style scoped lang="scss">
.share-layout-container {
  margin: 29px 0;
  padding: 0 40px;
}

.menu-title-container {
  font-size: 24px;
  line-height: 24px;
  margin-bottom: 20px;
}

.share-layout-tabs {
  margin-bottom: 32px;

  &:deep(.ant-tabs) {
    display: flex;
  }
  :deep(.ant-tabs-bar) {
    border-bottom: 4px solid #ffffff0d;
    margin-bottom: 0;
  }

  :deep(.ant-tabs-nav) {
    .ant-tabs-tab {
      color: #8c968f;
      margin: 0;
      font-size: 16px;
    }

    .ant-tabs-tab-active {
      color: #ffffff;
      background-color: transparent;
    }

    .ant-tabs-ink-bar {
      position: relative;
      &:after {
        position: absolute;
        content: "";
        height: 4px;
        left: 0;
        right: 0;
        margin: auto;
        border-radius: 8px;
        background: #70bc62;
      }
    }
  }

  :deep(.ant-tabs-nav-container) {
    margin-bottom: -4px;
  }

  :deep(.ant-tabs-ink-bar) {
    height: 4px;
    background-color: #2b2b4b;
  }
}
</style>
