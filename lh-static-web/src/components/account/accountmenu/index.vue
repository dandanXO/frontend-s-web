<template>
    <DarkAccountMenu v-if="isDark" />
    <AccountMenu v-else />
</template>
<script setup>
import { useDark } from "@vueuse/core";
import AccountMenu from "./AccountMenu.vue";
import DarkAccountMenu from "./DarkAccountMenu.vue";

const isDark = useDark();
</script>