
<template>
  <PlatformView
    :platforms="minigamePlatforms"
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
import { minigamePlatforms } from "@/shared/platformArray";

const platformType = ref("casual");
const platformGameType = ref("CASUAL");
const platformName = ('casual');
const platformPattern = ref(true);
</script>
