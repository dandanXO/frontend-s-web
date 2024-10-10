<template>
  <DarkPersonalView v-if="isDark" />
  <PersonalView v-else />
</template>
<script setup>
import { useDark } from "@vueuse/core";
import PersonalView from "../PersonalView.vue";
import DarkPersonalView from "./DarkPersonalView.vue";

const isDark = useDark();
</script>
