<template>
  <PlatformView
    :platforms="lotteryPlatforms"
    :platformGameType="platformGameType"
    :platformType="platformType"
    :platformName="platformName"
    :platformPattern="platformPattern"
  />
</template>

<script setup>
import { ref } from "vue";
import PlatformView from "@/components/platformview/index";
import { lotteryPlatforms } from "@/shared/platformArray";

const platformType = ref("lottery");
const platformGameType = ref("LOTTERY");
const platformName = ref("LOTTERY");
const platformPattern = ref(true);
</script>
