<template>
  <button @click="() => $emit('click')" class="finance-button">
    <slot />
  </button>
</template>
<script setup>
defineEmits(["click"]);
</script>
<style scoped lang="scss">
.finance-button {
  padding: 10px;
  border: 0;
  border-radius: 10px;
  color: $white;
  width: 100%;
  background-image: url("../../../assets/images/download/active-tab-bg.png");
  background-size: 100% 100%;
  background-color: $primary;
  font-size: 1rem;
  cursor: pointer;
}

.body--dark {
  .finance-button {
    background: url('../../../assets/images/account/primary-btn.svg') no-repeat center center;
    background-size: cover;
    box-shadow: none;
    border-radius: 4px;
    border: 1px solid #3A93CE;
    color: $white;
  }
}
</style>
