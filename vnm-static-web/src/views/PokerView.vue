<template>
  <PlatformView
    :platforms="pokerPlatforms"
    :platformGameType="platformGameType"
    :platformType="platformType"
    :platformName="platformName"
    :platformPattern="platformPattern"
  />
</template>

<script setup>
import { ref } from "vue";
import PlatformView from "@/components/PlatformView";
import { pokerPlatforms } from "@/shared/platformArray";

import { useI18n } from "vue-i18n";
const { t } = useI18n();

const platformType = ref("poker");
const platformGameType = ref("POKER");
const platformName = ref(t('menu.poker'));
const platformPattern = ref(true);
</script>
