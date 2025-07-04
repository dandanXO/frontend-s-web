<template>
  <DarkLoginDialog v-if="isDark" />
  <LoginDialog v-else />
</template>
<script setup>
import { useDark } from "@vueuse/core";
import LoginDialog from "../LoginDialog.vue";
import DarkLoginDialog from "./DarkLoginDialog.vue";

const isDark = useDark();
</script>
