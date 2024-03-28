<template>
  <PlatformView
    :platforms="cockfightPlatforms"
    :platformGameType="platformGameType"
    :platformType="platformType"
    :platformName="platformName"
    :platformPattern="platformPattern"
    :platformExpandable="false"
  />
</template>

<script setup>
import { ref } from "vue";
import PlatformView from "@/components/PlatformView";
import { cockfightPlatforms } from "@/shared/platformArray";

import { useI18n } from "vue-i18n";
const { t } = useI18n();

const platformType = ref("cockfight");
const platformGameType = ref("COCKFIGHT");
const platformName = ref(t('menu.cockfight'));
const platformPattern = ref(true);
</script>
