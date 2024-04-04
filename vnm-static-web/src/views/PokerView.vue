<template>
  <PlatformView
    :platforms="pokerPlatforms"
    :platformGameType="platformGameType"
    :platformType="platformType"
    :platformName="platformName"
    :platformPattern="platformPattern"
  />
</template>

<script setup>
import { ref } from "vue";
import PlatformView from "@/components/PlatformView";
import { pokerPlatforms } from "@/shared/platformArray";

const platformType = ref("poker");
const platformGameType = ref("POKER");
const platformName = ref('poker');
const platformPattern = ref(true);
</script>
