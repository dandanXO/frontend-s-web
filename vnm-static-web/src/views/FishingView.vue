<template>
  <PlatformViewFish
    :platforms="fishingPlatforms"
    :platforms2="cockfightPlatforms"
    :platformGameType="platformGameType"
    :platformType="platformType"
    :platformName="platformName"
    :platformPattern="platformPattern"
    :platformExpandable="true"
  />
</template>

<script setup>
import { ref } from "vue";
import PlatformViewFish from "@/components/PlatformViewFish.vue";
import { fishingPlatforms, cockfightPlatforms } from "@/shared/platformArray";

const platformType = ref("fishing");
const platformGameType = ref("FISH");
const platformName = ref('fishing');
const platformPattern = ref(true);
</script>
