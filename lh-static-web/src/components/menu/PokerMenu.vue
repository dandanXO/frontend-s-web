<template>
  <PlatformMenu :platforms="pokerPlatforms" :platformGameType="platformGameType" :platformType="platformType" />
</template>

<script setup>
import { ref } from "vue";
import PlatformMenu from "@/components/menu/PlatformMenu.vue";
import { pokerPlatforms } from "@/shared/platformArray";

const platformType = ref("poker");
const platformGameType = ref("POKER");
</script>
