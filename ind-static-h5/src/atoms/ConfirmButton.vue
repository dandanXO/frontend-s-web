<template>
  <q-card-actions>
    <div :class="`confirm-btn-container ${isDisabled ? 'disabled' : ''}`" @click="confirmFunc()">
      <img class="confirm-btn" src="../assets/images/index/confirm-btn.png" alt="" />
      <span class="confirm-btn-text">{{ label }}</span>
    </div>
  </q-card-actions>
</template>

<script setup>
const props = defineProps(["label", "confirmFunc", "isDisabled"]);
</script>

<style lang="scss">
.confirm-btn-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1rem 0;

  &.disabled {
    opacity: 0.5;
  }

  .confirm-btn {
    width: 100%;
  }

  .confirm-btn-text {
    position: absolute;
    font-size: 1.25rem;
  }
}
</style>
