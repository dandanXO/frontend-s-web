<template>
    <DarkHomeDownload v-if="isDark" />
    <HomeDownload v-else />
</template>
<script setup>
import { useDark } from "@vueuse/core";
import HomeDownload from "./HomeDownload.vue";
import DarkHomeDownload from "./DarkHomeDownload.vue";

const isDark = useDark();
</script>