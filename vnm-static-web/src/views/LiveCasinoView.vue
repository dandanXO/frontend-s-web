<template>
  <PlatformView
    :platforms="liveCasinoPlatforms"
    :platformGameType="platformGameType"
    :platformType="platformType"
    :platformName="platformName"
    :platformPattern="platformPattern"
  />
</template>

<script setup>
import { ref } from "vue";
import PlatformView from "@/components/PlatformView";
import { liveCasinoPlatforms } from "@/shared/platformArray";

import { useI18n } from "vue-i18n";
const { t } = useI18n();

const platformType = ref("live");
const platformGameType = ref("LIVE");
const platformName = ref(t('menu.liveCasino'));
const platformPattern = ref(true);
</script>
