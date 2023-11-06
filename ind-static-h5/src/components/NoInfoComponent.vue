<template>
  <div class="no-info-container">
    <img class="" src="../assets/images/account/no-info.png" alt="" />
    <div class="no-info-text">{{ noInfoTitle }}</div>
  </div>
</template>

<script setup>
const props = defineProps(["noInfoTitle"]);
</script>

<style scoped lang="scss">
.no-info-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  img {
    width: 20rem;
  }

  .no-info-text {
    font-size: 1.25rem;
    font-weight: 700;
    text-align: center;
  }
}
</style>
