<template>
  <PlatformMenu :platforms="liveCasinoPlatforms" :platformGameType="platformGameType" :platformType="platformType" />
</template>

<script setup>
import { ref } from "vue";
import PlatformMenu from "@/components/menu/PlatformMenu.vue";
import { liveCasinoPlatforms } from "@/shared/platformArray";

const platformType = ref("live");
const platformGameType = ref("LIVE");
</script>
