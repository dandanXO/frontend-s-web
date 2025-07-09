<template>
  <PlatformView
    :platforms="sportsPlatforms"
    :platformGameType="platformGameType"
    :platformType="platformType"
    :platformName="platformName"
    :platformPattern="platformPattern"
    :showPlayBtn="props.showPlayBtn"
  />
</template>

<script setup>
import { ref } from "vue";
import PlatformView from "@/components/platformview/index";
import { sportsPlatforms } from "@/shared/platformArray";

const platformType = ref("sports");
const platformGameType = ref("SPORT");
const platformName = ref("SPORTS");
const platformPattern = ref(true);

const props = defineProps(['showPlayBtn']);
</script>
