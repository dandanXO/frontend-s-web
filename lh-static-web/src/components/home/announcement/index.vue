<template>
    <DarkHomeAnnouncement v-if="isDark" />
    <HomeAnnouncement v-else />
</template>
<script setup>
import { useDark } from "@vueuse/core";
import HomeAnnouncement from "./HomeAnnouncement.vue";
import DarkHomeAnnouncement from "./DarkHomeAnnouncement.vue";

const isDark = useDark();
</script>