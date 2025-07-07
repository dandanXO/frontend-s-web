<template>
  <q-btn class="redirect-button" flat>
    <slot />
  </q-btn>
</template>
<script setup>
defineEmits(["click"]);
</script>
<style lang="scss" scoped>
.redirect-button {
  background: url(../assets/index/play-btn-bg.png) no-repeat center;
  background-size: 100% 100%;
  aspect-ratio: 86 / 24;
  width: 22vw;
  max-width: 110px;
  min-width: 86px;
  min-height: unset;
  border: none;
  border-top-right-radius: 8px;
  border-bottom-left-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  color: #fff;
}
</style>
