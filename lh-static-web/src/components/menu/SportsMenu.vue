<template>
  <PlatformMenu :platforms="sportsPlatforms" :platformGameType="platformGameType" :platformType="platformType" />
</template>

<script setup>
import { ref } from "vue";
import PlatformMenu from "@/components/menu/PlatformMenu.vue";
import { sportsPlatforms } from "@/shared/platformArray";

const platformType = ref("sports");
const platformGameType = ref("SPORT");
</script>
