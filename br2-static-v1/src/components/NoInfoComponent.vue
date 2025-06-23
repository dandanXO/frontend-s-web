<template>
  <div class="no-info-container" :class="shortenContainer && 'shorten-container'">
    <img class="" src="../assets/images/account/nodata.png" alt="" />
    <div class="no-info-text">{{ noInfoTitle }}</div>
    <p>{{ $t("notify.haventFoundAnyRecord") }}</p>
  </div>
</template>

<script setup>
const props = defineProps(["noInfoTitle", "shortenContainer"]);
</script>

<style scoped lang="scss">
.no-info-container {
  width: 100%;
  min-height: calc(100vh - 130px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;

  &.shorten-container {
    min-height: calc(50vh - 130px);
  }

  img {
    width: 80px;
  }

  p {
    color: #b3b0b8;
    font-size: 14px;
  }

  .no-info-text {
    font-size: 20px;
    font-weight: 700;
    text-align: center;
  }
}
</style>
