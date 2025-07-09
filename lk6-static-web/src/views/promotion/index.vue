<template>
  <PromotionView />
</template>
<script setup>
import { useDark } from "@vueuse/core";
import PromotionView from "@/views/PromotionView.vue";

const isDark = useDark();
</script>
