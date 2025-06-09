<template>
  <img src="./img/prizewheel-title.png">
  <NewPlayerWheel :hasUnusedCoupons="props.hasUnusedCoupons" />
</template>

<script setup>
import NewPlayerWheel from "./NewPlayerWheel.vue";
const props = defineProps([
  "hasUnusedCoupons"
])
</script>
<style lang="scss" scoped>
.container {
  padding-top: 80px;
}
</style>
