<template>
  <DarkAccountLogin v-if="isDark" />
  <AccountLogin v-else />
</template>
<script setup>
import { useDark } from "@vueuse/core";
import AccountLogin from "../AccountLogin.vue";
import DarkAccountLogin from "./DarkAccountLogin.vue";

const isDark = useDark();
</script>
