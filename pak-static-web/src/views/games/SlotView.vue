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
// import { slotPlatforms } from "@/shared/platformArray";

const platformType = ref("slot");
const platformGameType = ref("SLOT");
const platformName = ref("SLOTS");
const platformPattern = ref(true);
</script>
