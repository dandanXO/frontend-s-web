<template>
  <PlatformView
    :platforms="pokerPlatforms"
    :platformGameType="platformGameType"
    :platformType="platformType"
    :platformName="platformName"
    :platformPattern="platformPattern"
    :platformExpandable="true"
  />
</template>

<script setup>
import { ref } from "vue";
import PlatformView from "@/components/platformview/index";
import { pokerPlatforms } from "@/shared/platformArray";

const platformType = ref("poker");
const platformGameType = ref("LIVE");
const platformName = ref("POKER");
const platformPattern = ref(true);
</script>
