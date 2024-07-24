<template>
  <div class="loading-container">
    <q-spinner-hourglass size="4em" class="loading" />
  </div>
</template>

<script setup></script>

<style scoped lang="scss">
.loading-container {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  .loading {
    color: #00AE00;
  }
}
</style>
