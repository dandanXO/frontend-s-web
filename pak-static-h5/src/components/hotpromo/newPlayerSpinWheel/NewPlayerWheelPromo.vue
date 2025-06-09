<template>
  <NewPlayerWheel :hasUnusedCoupons="props.hasUnusedCoupons" />
</template>

<script setup>
import NewPlayerWheel from "./NewPlayerWheel.vue";
const props = defineProps([
  "hasUnusedCoupons"
])
</script>
