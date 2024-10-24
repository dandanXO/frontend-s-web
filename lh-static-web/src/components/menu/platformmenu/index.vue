<template>
  <DarkPlatformMenu v-if="isDark" />
  <PlatformMenu v-else />
</template>
<script setup>
import { useDark } from "@vueuse/core";
import PlatformMenu from "../PlatformMenu.vue";
import DarkPlatformMenu from "./DarkPlatformMenu.vue";

const isDark = useDark();
</script>
