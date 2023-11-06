<template>
  <SwiperNav :slideList="slideList" :onSlideClick="onSlideClick" :isActiveSlide="isActiveSlide"></SwiperNav>
  <AgencyPolicy></AgencyPolicy>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import SwiperNav from "../components/SwiperNav.vue";
import AgencyPolicy from "../components/earn-money/AgencyPolicy.vue";

const router = useRouter();
let slideList = ref(["Agency Policy", "My Member"]);
let slideListPath = ref(["/agency-policy", "/earn-money"]);
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
