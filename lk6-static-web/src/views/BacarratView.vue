<template>
  <PlatformView
    :platforms="pokerPlatforms"
    :platformGameType="platformGameType"
    :platformType="platformType"
    :platformName="platformName"
    :platformPattern="platformPattern"
    :platformExpandable="true"
    :showBanner="props.showBanner"
  />
</template>

<script setup>
import { ref } from "vue";
import PlatformView from "@/components/platformview/index";
import { pokerPlatforms } from "@/shared/platformArray";

const platformType = ref("bacarrat");
const platformGameType = ref("BACARRAT");
const platformName = ref("BACARRAT");
const platformPattern = ref(true);

const props = defineProps(['showBanner']);
</script>
