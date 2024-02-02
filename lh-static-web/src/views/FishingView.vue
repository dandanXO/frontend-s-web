<template>
  <PlatformView
    :platforms="fishingPlatforms"
    :platformGameType="platformGameType"
    :platformType="platformType"
    :platformName="platformName"
    :platformPattern="platformPattern"
    :platformExpandable="true"
  />
</template>

<script setup>
import { ref } from "vue";
import PlatformView from "@/components/PlatformView";
import { fishingPlatforms } from "@/shared/platformArray";

const platformType = ref("fishing");
const platformGameType = ref("FISH");
const platformName = ref("FISHING");
const platformPattern = ref(false);
</script>
