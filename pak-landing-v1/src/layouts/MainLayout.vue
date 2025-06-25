<template>
  <q-layout view="hHh Lpr fFf">
    <q-header>
      <q-toolbar>
        <div
          class="header-container"
          :style="{
            backgroundImage: `url(${require(`../assets/imgs/header-bg.png`)})`,
          }"
        >
          <img class="logo" src="~assets/imgs/b9-logo.png" />
          <q-btn class="register-btn" flat label="Register" @click="openUrl" />
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container v-if="hasInit">
      <q-page>
        <q-tabs
          v-model="mainTabsKey"
          dense
          narrow-indicator
          no-caps
          @click="onTabClick"
        >
          <q-tab name="b9-charity" label="B9 Charity" />
          <q-tab name="b9-style" label="B9 Style" />
          <q-tab name="event-sponsorship" label="Event Sponsorship" />
          <q-tab name="partners" label="Partners" />
        </q-tabs>

        <router-view v-slot="{ Component }">
          <component :is="Component" />
        </router-view>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const mainTabsKey = ref("b9-charity");
const hasInit = ref(false);

onMounted(() => {
  const initialTab = route.path.split("/").pop();
  if (initialTab) {
    mainTabsKey.value = initialTab;
  }
  hasInit.value = true;
});

watch(
  () => route.path,
  (newPath) => {
    const newTab = newPath.split("/").pop();
    if (newTab) {
      mainTabsKey.value = newTab;
    }
  }
);

const onTabClick = () => {
  router.push(`/${mainTabsKey.value}`);
};

const openUrl = () => {
  window.open("https://aqfiqiy7.cc/refer/MDM5ODc5ODcwMDI=", "_blank");
};
</script>

<style scoped lang="scss">
.q-page {
  background-color: #131313;
}
.logo {
  width: 130px;
}
.register-btn {
  background: linear-gradient(251.03deg, #89c543 7.46%, #2aae8b 91.87%);
  height: 34px;
  width: 80px;
  letter-spacing: 0.5px;
  animation: smallbeat 2s infinite;
}
.q-toolbar {
  padding: 0;
}
.header-container {
  width: 100%;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 14px 0px 14px;
}
.q-layout__section--marginal {
  background: linear-gradient(90deg, #17221c 0.11%, #171719 39.57%);
}

.q-tabs {
  background-color: #131313;
  position: sticky;
  top: 81px;
  padding-top: 8px;
  padding-bottom: 8px;
  z-index: 1990;
}
.q-tab {
  color: #fff;
  :deep(.q-tab__label) {
    font-size: 12px;
    font-weight: 400;
  }
  :deep(.q-ripple) {
    display: none;
  }
  :deep(.q-focus-helper) {
    display: none;
  }
}

.q-tab:hover {
  color: #61ff00;
}
:deep(.q-tab--active .q-tab__label) {
  color: #61ff00;
}
:deep(.q-tab--active .q-tab__indicator) {
  background: linear-gradient(180deg, #1baa99 0%, #8ac542 100%);
}

:deep(.q-tabs__content) {
  overflow: auto;
  white-space: nowrap;
}

@keyframes smallbeat {
  0% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
  14% {
    -webkit-transform: scale(1.15);
    transform: scale(1.15);
  }

  28% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
  42% {
    -webkit-transform: scale(1.15);
    transform: scale(1.15);
  }
  70% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
}
</style>
