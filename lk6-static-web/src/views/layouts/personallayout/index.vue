<template>
    <DarkPersonalLayoutView v-if="isDark" />
    <PersonalLayoutView v-else />
</template>
<script setup>
import { useDark } from "@vueuse/core";
import PersonalLayoutView from "./PersonalLayoutView.vue";
import DarkPersonalLayoutView from "./DarkPersonalLayoutView.vue";

const isDark = useDark();
</script>