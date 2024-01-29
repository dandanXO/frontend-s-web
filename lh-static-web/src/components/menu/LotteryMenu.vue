<template>
  <PlatformMenu :platforms="lotteryPlatforms" :platformGameType="platformGameType" :platformType="platformType" />
</template>

<script setup>
import { ref } from "vue";
import PlatformMenu from "@/components/menu/PlatformMenu.vue";
import { lotteryPlatforms } from "@/shared/platformArray";

const platformType = ref("lottery");
const platformGameType = ref("LOTTERY");
</script>
