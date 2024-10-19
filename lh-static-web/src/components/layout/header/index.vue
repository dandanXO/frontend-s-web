<template>
  <DarkCommonHeader v-if="isDark" />
  <CommonHeader v-else />
</template>
<script setup>
import { useDark } from "@vueuse/core";
import CommonHeader from "@/components/layout/CommonHeader.vue";
import DarkCommonHeader from "@/components/layout/header/DarkCommonHeader.vue";

const isDark = useDark();
</script>
