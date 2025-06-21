<template>
  <q-card-section class="row items-center q-pb-none dialog-header">
    <div class="text-h5 dialog-title">{{ title }}</div>
    <q-space></q-space>
    <q-btn v-close-popup class="close-btn" flat round unelevated>
      <q-icon name="close"></q-icon>
    </q-btn>
  </q-card-section>
</template>

<script setup>
const props = defineProps(["title"]);
</script>

<style lang="scss" scoped>
.dialog-header {
  position: relative;
  text-align: center;
  margin: 0 0 1rem 0;

  .dialog-title {
    width: 100%;
    text-align: center;
  }

  .close-btn {
    position: absolute;
    right: 0;
    top: 0;
    width: 2rem;
    height: 2rem;
  }
}
</style>
