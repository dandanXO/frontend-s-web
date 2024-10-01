<template>
  <DarkPromotionView v-if="isDark" />
  <PromotionView v-else />
</template>
<script setup>
import { useDark } from "@vueuse/core";
import PromotionView from "@/views/PromotionView.vue";
import DarkPromotionView from "./DarkPromotionView.vue";

const isDark = useDark();
</script>
