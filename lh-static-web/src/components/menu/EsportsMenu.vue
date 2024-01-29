<template>
  <PlatformMenu :platforms="eSportsPlatforms" :platformGameType="platformGameType" :platformType="platformType" />
</template>

<script setup>
import { ref } from "vue";
import PlatformMenu from "@/components/menu/PlatformMenu.vue";
import { eSportsPlatforms } from "@/shared/platformArray";

const platformType = ref("esports");
const platformGameType = ref("ESPORT");
</script>
