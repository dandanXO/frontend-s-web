<template>
  <div class="no-data-wrapper">
    <RiFileInfoFill />
    <h3>{{ $t("common.noData.title") }}</h3>
    <span>{{ $t("common.noData.description") }}</span>
  </div>
</template>
<script setup>
import { RiFileInfoFill } from "vue-remix-icons";
</script>
<style scoped lang="scss">
.no-data-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  color: #8c968f;
  svg {
    fill: currentColor;
    max-width: 56px;
  }
  h3 {
    margin-bottom: 0;
    font-size: 24px;
    font-weight: 700;
    line-height: 24px;
    color: #8c968f;
  }
}
</style>
