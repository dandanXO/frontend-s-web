<template>
  <q-layout view="lHh lpr lFf" container style="height: 100vh">
    <q-header>
      <q-toolbar>
        <div
          class="header-container"
          :style="{
            backgroundImage: `url(${require(`../assets/imgs/header-bg.png`)})`,
          }"
        >
          <img class="logo" src="~assets/imgs/b9-logo.png" />
          <q-btn class="register-btn" flat label="Register" />
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
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
          <!-- <KeepAlive :max="8"> -->
          <component :is="Component" />
          <!-- </KeepAlive> -->
        </router-view>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

defineOptions({
  name: "IndexPage",
});

const mainTabsKey = ref("b9-charity");
const router = useRouter();

const onTabClick = () => {
  router.push(`/${mainTabsKey.value}`);
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
  padding: 40px 14px 0px 14px;
}
.q-layout__section--marginal {
  background: linear-gradient(90deg, #17221c 0.11%, #171719 39.57%);
}

.q-tabs {
  background-color: #131313;
  position: sticky;
  top: 101px;
  padding-top: 8px;
  padding-bottom: 8px;
  z-index: 2000;
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
// :deep(.q-tabs__arrow) {
//   display: none;
// }
</style>
