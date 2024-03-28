<template>
  <PlatformView
    :platforms="fishingPlatforms"
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
import { fishingPlatforms } from "@/shared/platformArray";

import { useI18n } from "vue-i18n";
const { t } = useI18n();

const platformType = ref("fishing");
const platformGameType = ref("FISH");
const platformName = ref(t('menu.fishing'));
const platformPattern = ref(true);
</script>
