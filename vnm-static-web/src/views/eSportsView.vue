<template>
  <PlatformView
    :platforms="eSportsPlatforms"
    :platformGameType="platformGameType"
    :platformType="platformType"
    :platformName="platformName"
    :platformPattern="platformPattern"
  />
</template>

<script setup>
import { ref } from "vue";
import PlatformView from "@/components/PlatformView";
import { eSportsPlatforms } from "@/shared/platformArray";

import { useI18n } from "vue-i18n";
const { t } = useI18n();

const platformType = ref("esports");
const platformGameType = ref("ESPORT");
const platformName = ref(t('menu.esports'));
const platformPattern = ref(true);
</script>
