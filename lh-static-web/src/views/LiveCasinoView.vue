<template>
  <PlatformView
    :platforms="liveCasinoPlatforms"
    :platformGameType="platformGameType"
    :platformType="platformType"
    :platformName="platformName"
    :platformPattern="platformPattern"
  />
</template>

<script setup>
import { ref } from "vue";
import PlatformView from "@/components/platformview/index";
import { liveCasinoPlatforms } from "@/shared/platformArray";

const platformType = ref("live");
const platformGameType = ref("LIVE");
const platformName = ref("LIVE CASINO");
const platformPattern = ref(true);
</script>
