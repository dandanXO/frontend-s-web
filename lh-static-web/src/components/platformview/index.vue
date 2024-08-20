<template>
    <DarkPlatformView v-if="isDark" />
    <PlatformView v-else />
</template>
<script setup>
import { useDark } from "@vueuse/core";
import PlatformView from "./PlatformView.vue";
import DarkPlatformView from "./DarkPlatformView.vue";

const isDark = useDark();
</script>