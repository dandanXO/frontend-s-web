<template>
  <PlatformView
    :platforms="lotteryPlatforms"
    :platformGameType="platformGameType"
    :platformType="platformType"
    :platformName="platformName"
    :platformPattern="platformPattern"
  />
</template>

<script setup>
import { ref } from "vue";
import PlatformView from "@/components/PlatformView";
import { lotteryPlatforms } from "@/shared/platformArray";

import { useI18n } from "vue-i18n";
const { t } = useI18n();

const platformType = ref("lottery");
const platformGameType = ref("LOTTERY");
const platformName = ref(t('menu.lottery'));
const platformPattern = ref(true);
</script>
