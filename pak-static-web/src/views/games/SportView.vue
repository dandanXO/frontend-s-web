<template>
  <PlatformView
    :platforms="[]"
    :platformGameType="platformGameType"
    :platformType="platformType"
    :platformName="platformName"
    :platformPattern="platformPattern"
  />
</template>

<script setup>
import { ref } from "vue";
import PlatformView from "@/components/PlatformView";

const platformType = ref("sports");
const platformGameType = ref("SPORT");
const platformName = ref("SPORTS");
const platformPattern = ref(true);
</script>
