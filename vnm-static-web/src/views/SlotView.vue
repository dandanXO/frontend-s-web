<template>
  <PlatformView
    :platforms="slotPlatforms"
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
import { slotPlatforms } from "@/shared/platformArray";

import { useI18n } from "vue-i18n";
const { t } = useI18n();

const platformType = ref("slot");
const platformGameType = ref("SLOT");
const platformName = ref(t('menu.slot'));
const platformPattern = ref(true);
</script>
