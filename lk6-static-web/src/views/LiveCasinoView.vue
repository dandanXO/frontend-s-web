<template>
    <PlatformView
      :platforms="liveCasinoPlatforms"
      :platformGameType="platformGameType"
      :platformType="platformType"
      :platformName="platformName"
      :platformPattern="platformPattern"
      :showPlayBtn="props.showPlayBtn"
      :fullpage="props.fullpage"
    />
</template>

<script setup>
import { ref } from "vue";
import PlatformView from "@/components/platformview/index";
import { liveCasinoPlatforms } from "@/shared/platformArray";

const platformType = ref("live");
const platformGameType = ref("LIVE");
const platformName = ref("LIVE CASINO");
const platformPattern = ref(true);

const props = defineProps(['showPlayBtn', 'fullpage']);
</script>