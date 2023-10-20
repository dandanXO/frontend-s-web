<template>
  <SwiperNav :slideList="slideList" :onSlideClick="onSlideClick" :isActiveSlide="isActiveSlide"></SwiperNav>

  <template v-if="currentSlide === slideList[0]">
    <PersonalRecord></PersonalRecord>
  </template>

  <template v-if="currentSlide === slideList[1]">
    <AgencyPolicy></AgencyPolicy>
  </template>
</template>

<script setup>
import { ref } from "vue";
import SwiperNav from "../components/SwiperNav.vue";
import PersonalRecord from "../components/personal/PersonalRecord.vue";
import AgencyPolicy from "../components/earn-money/AgencyPolicy.vue";

let slideList = ref(["My Member", "Agency Policy"]);
let currentSlide = ref(slideList.value[0]);

const isActiveSlide = (e) => {
  if (e === currentSlide.value) return true;
  return false;
};

const onSlideClick = (e) => {
  if (e === currentSlide.value) return;

  //   for (let i = 0, l = tabList.value.length; i < l; i++) {
  //     const _currentTab = tabList.value[i];
  //     if (_currentTab === e) {
  //       tabList.value.splice(i, 1);
  //       tabList.value.unshift(e);
  //     }
  //   }
  currentSlide.value = e;
};
</script>
