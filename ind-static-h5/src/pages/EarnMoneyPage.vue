<template>
  <TitleNavigation :title="title"></TitleNavigation>

  <TabNavigation :tabList="tabList" :onTabClick="onTabClick" :isActiveTab="isActiveTab"></TabNavigation>

  <template v-if="currentTab === tabList[0]">
    <MyMember></MyMember>
  </template>

  <template v-if="currentTab === tabList[1]">
    <AgencyPolicy></AgencyPolicy>
  </template>
</template>

<script setup>
import { ref } from "vue";
import TitleNavigation from "../components/TitleNavigation.vue";
import TabNavigation from "../components/TabNavigation.vue";
import MyMember from "../components/earn-money/MyMember.vue";
import AgencyPolicy from "../components/earn-money/AgencyPolicy.vue";

const title = "Earn Money";

let tabList = ref(["My Member", "Agency Policy"]);
let currentTab = ref(tabList.value[0]);

const isActiveTab = (e) => {
  if (e === currentTab.value) return true;
  return false;
};

const onTabClick = (e) => {
  if (e === currentTab.value) return;

  //   for (let i = 0, l = tabList.value.length; i < l; i++) {
  //     const _currentTab = tabList.value[i];
  //     if (_currentTab === e) {
  //       tabList.value.splice(i, 1);
  //       tabList.value.unshift(e);
  //     }
  //   }
  currentTab.value = e;
};
</script>

<style lang="scss"></style>
