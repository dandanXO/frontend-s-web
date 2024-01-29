<template>
  <PlatformMenu :platforms="fishingPlatforms" :platformGameType="platformGameType" :platformType="platformType" />
</template>

<script setup>
import { ref } from "vue";
import PlatformMenu from "@/components/menu/PlatformMenu.vue";
import { fishingPlatforms } from "@/shared/platformArray";

const platformType = ref("fishing");
const platformGameType = ref("FISH");
</script>
