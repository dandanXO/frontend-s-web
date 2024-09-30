<template>
    <DarkRegisterAccount v-if="isDark" />
    <RegisterAccount v-else />
</template>
<script setup>
import { useDark } from "@vueuse/core";
import RegisterAccount from "./RegisterAccount.vue";
import DarkRegisterAccount from "./DarkRegisterAccount.vue";

const isDark = useDark();
</script>