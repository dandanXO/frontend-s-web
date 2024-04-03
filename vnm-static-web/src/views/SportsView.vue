<template>
  <PlatformView
    :platforms="sportsPlatforms"
    :platformGameType="platformGameType"
    :platformType="platformType"
    :platformName="platformName"
    :platformPattern="platformPattern"
  />
</template>

<script setup>
import { ref } from "vue";
import PlatformView from "@/components/PlatformView";
import { sportsPlatforms } from "@/shared/platformArray";

import { useI18n } from "vue-i18n";
const { t } = useI18n();

const platformType = ref("sports");
const platformGameType = ref("SPORT");
const platformName = ref(t('menu.sports'));
const platformPattern = ref(true);
</script>
