<template>
  <PlatformMenu :platforms="slotPlatforms" :platformGameType="platformGameType" :platformType="platformType" />
</template>

<script setup>
import { ref } from "vue";
import PlatformMenu from "@/components/menu/PlatformMenu.vue";
import { slotPlatforms } from "@/shared/platformArray";

const platformType = ref("slot");
const platformGameType = ref("SLOT");
</script>
