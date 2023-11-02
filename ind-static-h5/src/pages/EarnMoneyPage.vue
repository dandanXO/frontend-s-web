<template>
  <SwiperNav :slideList="slideList" :slideListPath="slideListPath" :isActiveSlide="isActiveSlide"></SwiperNav>
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

</script>
