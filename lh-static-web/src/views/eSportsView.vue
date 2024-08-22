<template>
  <PlatformView
    :platforms="eSportsPlatforms"
    :platformGameType="platformGameType"
    :platformType="platformType"
    :platformName="platformName"
    :platformPattern="platformPattern"
  />
</template>

<script setup>
import { ref } from "vue";
import PlatformView from "@/components/platformview/index";
import { eSportsPlatforms } from "@/shared/platformArray";

const platformType = ref("esports");
const platformGameType = ref("ESPORT");
const platformName = ref("ESPORTS");
const platformPattern = ref(true);
</script>
