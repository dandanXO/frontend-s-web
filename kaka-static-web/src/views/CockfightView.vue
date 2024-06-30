<template>
  <PlatformView
    :platforms="cockfightPlatforms"
    :platformGameType="platformGameType"
    :platformType="platformType"
    :platformName="platformName"
    :platformPattern="platformPattern"
    :platformExpandable="false"
  />
</template>

<script setup>
import { ref } from "vue";
import PlatformView from "@/components/PlatformView";
import { cockfightPlatforms } from "@/shared/platformArray";

const platformType = ref("cockfight");
const platformGameType = ref("COCKFIGHT");
const platformName = ('cockfight');
const platformPattern = ref(true);
</script>
