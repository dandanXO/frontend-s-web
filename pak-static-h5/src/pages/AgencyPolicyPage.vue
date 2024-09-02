<template>
  <SwiperNav :slideList="slideList" :slideListPath="slideListPath" :isActiveSlide="isActiveSlide"></SwiperNav>
  <AgencyPolicy></AgencyPolicy>
</template>

<script setup>
import { ref } from "vue";
import SwiperNav from "../components/SwiperNav.vue";
import AgencyPolicy from "../components/earn-money/AgencyPolicy.vue";

let slideList = ref(["Agency Policy", "My Member"]);
let slideListPath = ref(["/agency-policy", "/earn-money"]);
let currentSlide = ref(slideList.value[0]);

const isActiveSlide = (e) => {
  if (e === currentSlide.value) return true;
  return false;
};
</script>
