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

const platformType = ref("poker");
const platformGameType = ref("POKER");
const platformName = ref("POKER");
const platformPattern = ref(true);
</script>
