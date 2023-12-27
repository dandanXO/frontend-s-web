<template>
  <div class="no-info-container">
    <img class="" src="../assets/images/account/nodata-folder.png" alt="" />
    <div class="no-info-text">{{ noInfoTitle }}</div>
    <p>Haven’t found any discount record</p>
  </div>
</template>

<script setup>
const props = defineProps(["noInfoTitle"]);
</script>

<style scoped lang="scss">
.no-info-container {
  width: 100%;
  min-height: calc(100vh - 280px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;

  img {
    width: 80px;
  }

  p {
    color: #b3b0b8;
    font-size: 1rem;
  }

  .no-info-text {
    font-size: 1.25rem;
    font-weight: 700;
    text-align: center;
  }
}
</style>
