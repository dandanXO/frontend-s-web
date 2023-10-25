<template>
  <q-card-actions>
    <div class="confirm-btn-container" @click="confirmFunc()">
      <img class="confirm-btn" src="../assets/images/index/confirm-btn.png" alt="" />
      <span class="confirm-btn-text">{{ label }}</span>
    </div>
  </q-card-actions>
</template>

<script setup>
const props = defineProps(["label", "confirmFunc"]);
</script>

<style lang="scss">
.confirm-btn-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1rem 0;

  .confirm-btn {
    width: 100%;
  }

  .confirm-btn-text {
    position: absolute;
    font-size: 1.25rem;
  }
}
</style>
