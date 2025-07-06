<template>
  <!-- <DarkAgentView v-if="isDark" /> -->
  <AgentView :class="isDark ? 'dark': 'light'" />
</template>
<script setup>
import { useDark } from "@vueuse/core";
import AgentView from "../AgentView.vue";
// import DarkAgentView from "./DarkAgentView.vue";

const isDark = useDark();
</script>
