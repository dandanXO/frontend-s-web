<template>
    <DarkLoginView v-if="isDark" />
    <HomeService v-else />
</template>
<script setup>
import { useDark } from "@vueuse/core";
import LoginView from "./LoginView.vue";
import DarkLoginView from "./DarkLoginView.vue";

const isDark = useDark();
</script>