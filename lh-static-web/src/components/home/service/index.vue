<template>
    <DarkHomeService v-if="isDark" />
    <HomeService v-else />
</template>
<script setup>
import { useDark } from "@vueuse/core";
import HomeService from "./HomeService.vue";
import DarkHomeService from "./DarkHomeService.vue";

const isDark = useDark();
</script>