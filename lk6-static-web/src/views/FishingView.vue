<template>
  <PlatformView
    :platforms="fishingPlatforms"
    :platformGameType="platformGameType"
    :platformType="platformType"
    :platformName="platformName"
    :platformPattern="platformPattern"
    :platformExpandable="false"
  />
</template>

<script setup>
import { ref } from "vue";
import PlatformView from "@/components/platformview/index";
import { fishingPlatforms } from "@/shared/platformArray";

const platformType = ref("fishing");
const platformGameType = ref("FISH");
const platformName = ref("FISHING");
const platformPattern = ref(true);
</script>
