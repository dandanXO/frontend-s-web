<template>
    <DarkHomeView v-if="isDark" />
    <HomeView v-else />
</template>
<script setup>
import { useDark } from "@vueuse/core";
import HomeView from "@/views/home/HomeView.vue";
import DarkHomeView from "@/views/home/DarkHomeView.vue";

const isDark = useDark();
</script>