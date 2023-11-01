<template>
  <SwiperNav :slideList="slideList" :onSlideClick="onSlideClick" :isActiveSlide="isActiveSlide"></SwiperNav>
  <MyMember></MyMember>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import SwiperNav from "../components/SwiperNav.vue";
import MyMember from "../components/earn-money/MyMember.vue";

const router = useRouter();
let slideList = ref(["My Member", "Agency Policy"]);
let slideListPath = ref(["/earn-money", "/agency-policy"]);
let currentSlide = ref(slideList.value[0]);

const isActiveSlide = (e) => {
  if (e === currentSlide.value) return true;
  return false;
};

const onSlideClick = (e, i) => {
  if (e === currentSlide.value) return;
  router.push(slideListPath.value[i]);
  currentSlide.value = e;
};
</script>
