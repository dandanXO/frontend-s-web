<template>
    <DarkHomeHotGame v-if="isDark" />
    <HomeHotGame v-else />
</template>
<script setup>
import { useDark } from "@vueuse/core";
import HomeHotGame from "./HomeHotGame.vue";
import DarkHomeHotGame from "./DarkHomeHotGame.vue";

const isDark = useDark();
</script>