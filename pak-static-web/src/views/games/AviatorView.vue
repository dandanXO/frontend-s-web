<template>
  <PlatformView
    :platforms="[]"
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

const platformType = ref("fishing");
const platformGameType = ref("FISH");
const platformName = ref("FISHING");
const platformPattern = ref(true);
</script>
