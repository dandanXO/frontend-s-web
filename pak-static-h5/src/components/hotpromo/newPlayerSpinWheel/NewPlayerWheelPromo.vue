<template>
  <img src="./img/prizewheel-title.png">
  <NewPlayerWheel :hasUnusedCoupon="props.hasUnusedCoupon" />
</template>

<script setup>
import NewPlayerWheel from "./NewPlayerWheel.vue";
const props = defineProps([
  "hasUnusedCoupon"
])
</script>
<style lang="scss" scoped>
.container {
  padding-top: 80px;
}
</style>
