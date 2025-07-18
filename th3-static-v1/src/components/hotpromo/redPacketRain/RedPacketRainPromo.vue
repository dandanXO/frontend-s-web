<template>
  <MoneyRainModal @close-modal="closeDialog" />
</template>

<script setup>
import MoneyRainModal from "components/modal/MoneyRainModal.vue";
import { useRouter } from "vue-router";
const router = useRouter();
const closeDialog = () => {
  router.push("/promo");
}
</script>
